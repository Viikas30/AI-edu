import os
import json
from pathlib import Path
from PyPDF2 import PdfReader
import re # Import re for robust splitting

def extract_chunks_from_pdf(pdf_path, current_global_page_number):
    reader = PdfReader(pdf_path)
    chunks = []
    filename = Path(pdf_path).stem.lower()
    subject_keywords = ["physics", "chemistry", "math", "biology", "history", "geography"]
    # Initialize defaults (these will be updated by parsing the filename)
    class_part_parsed = "Class 11"
    subject_parsed = "Physics"
    chapter_num_parsed = "1"
    chapter_name_parsed = "Unknown Chapter" # Initialize chapter name

    # Split the filename into parts for easier searching
    parts = re.split(r'[-_ ]+', filename)

    # --- Smarter Parsing Logic ---

    # 1. Parse Class (look for 'class' followed by a number)
    for i, p in enumerate(parts):
        if "class" in p:
            if i + 1 < len(parts) and parts[i+1].isdigit():
                class_part_parsed = f"Class {parts[i+1]}"
                break
            elif p.replace('class', '').isdigit(): # Handles "class11"
                class_part_parsed = f"Class {p.replace('class', '')}"
                break

    # 2. Parse Chapter Number AND Chapter Name
    # Look for 'chapter' followed by a number, and then extract subsequent words as chapter name
    chapter_found_index = -1
    for i, p in enumerate(parts):
        if "chapter" in p:
            if i + 1 < len(parts) and parts[i+1].isdigit():
                chapter_num_parsed = parts[i+1]
                chapter_found_index = i + 1
                break
            elif p.replace('chapter', '').isdigit(): # Handles "chapter1"
                chapter_num_parsed = p.replace('chapter', '')
                chapter_found_index = i
                break
    
    # Extract chapter name if a chapter number was found
    if chapter_found_index != -1:
        # Collect all parts after the chapter number until the end of the filename
        chapter_name_parts = []
        # If the chapter keyword was "chapter", we start after the number (i+1 + 1)
        # If it was "chapter1", we start after the part itself (i+1)
        start_index_for_name = chapter_found_index + 1
        
        if "chapter" in parts[chapter_found_index-1] and parts[chapter_found_index].isdigit():
             start_index_for_name = chapter_found_index + 1
        elif parts[chapter_found_index].startswith("chapter") and parts[chapter_found_index][len("chapter"):].isdigit():
             start_index_for_name = chapter_found_index + 1 # Start from the next part

        # Collect parts for the chapter name, ensuring not to include class/subject
        temp_name_parts = []
        for i in range(start_index_for_name, len(parts)):
            part = parts[i]
            # Avoid including class or subject keywords in the chapter name if they appear late
            if part.startswith("class") or part in subject_keywords: # Use subject_keywords here
                break
            if part.isdigit(): # Stop if we encounter another number that might signify something else
                break
            temp_name_parts.append(part)
        
        if temp_name_parts:
            chapter_name_parsed = " ".join(temp_name_parts).replace('-', ' ').title()
        else:
            chapter_name_parsed = f"Chapter {chapter_num_parsed}" # Fallback if no specific name found


    # 3. Parse Subject
    # You might want to define a list of common subjects for more robust parsing
    
    for p in parts:
        if p not in ["class", "chapter", class_part_parsed.lower().replace('class ', ''), chapter_num_parsed]:
            if not p.isdigit():
                # Check if it's a known subject keyword
                if p in subject_keywords:
                    subject_parsed = p.title()
                    break
                # If no known subject, take the first non-numeric/non-keyword string as subject
                # This could be more refined based on naming conventions
                # For "class-11-phy-chapter-1-Physical-World", 'phy' should be detected.
                # Let's add a specific check for 'phy' if 'physics' isn't explicitly there
                if p == "phy":
                    subject_parsed = "Physics"
                    break

    # Fallback/refinement for subject if 'phy' was found and default "Physics" is still there
    # This block might be redundant if the above subject parsing is robust enough, but keeping for safety.
    if subject_parsed == "Physics" and "phy" in parts and "physics" not in parts:
        subject_parsed = "Physics"


    # --- Page Numbering Logic ---
    start_page_for_this_pdf = current_global_page_number

    for i, page in enumerate(reader.pages):
        text = page.extract_text()
        if text and len(text.strip()) > 20:
            chunks.append({
                "content": text.strip(),
                "metadata": {
                    "class": class_part_parsed,
                    "subject": subject_parsed,
                    "chapter_number": chapter_num_parsed, # Added chapter_number
                    "chapter_name": chapter_name_parsed,   # Added chapter_name
                    "page": f"Page {start_page_for_this_pdf + i}" # Use the global counter
                }
            })
    
    # Return the updated global page number for the next PDF
    return chunks, current_global_page_number + len(reader.pages)


def process_all_pdfs(pdf_folder, output_json="ncert_chunks.json"):
    all_chunks = []
    global_page_counter = 1 # Initialize a global page counter

    # Get all PDF files and sort them to ensure consistent page numbering order
    pdf_files = sorted([f for f in os.listdir(pdf_folder) if f.lower().endswith(".pdf")])

    for filename in pdf_files:
        full_path = os.path.join(pdf_folder, filename)
        print(f"Processing: {filename}")
        
        # Pass the current global page counter and receive the chunks and updated counter
        chunks_from_pdf, global_page_counter = extract_chunks_from_pdf(full_path, global_page_counter)
        all_chunks.extend(chunks_from_pdf)

    with open(output_json, "w", encoding="utf-8") as f:
        json.dump(all_chunks, f, indent=2)
    print(f"\n✅ Done. Extracted {len(all_chunks)} chunks.")
    print(f"📦 Output saved to: {output_json}")

if __name__ == "__main__":
    pdf_folder = "C:\\Users\\Srujana\\Documents\\edu-companion\\class -11-phy"
    output_json = "ncert_chunks.json"
    process_all_pdfs(pdf_folder, output_json)