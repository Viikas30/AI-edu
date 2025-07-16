import os
import json
from pathlib import Path
from PyPDF2 import PdfReader
import re # Import re for robust splitting

def extract_chunks_from_pdf(pdf_path, current_global_page_number):
    reader = PdfReader(pdf_path)
    chunks = []
    filename = Path(pdf_path).stem.lower()

    # Initialize defaults (these will be updated by parsing the filename)
    class_part_parsed = "Class 11"
    subject_parsed = "Physics"
    chapter_num_parsed = "1"

    # Split the filename into parts for easier searching
    parts = re.split(r'[-_ ]+', filename)

    # --- Smarter Parsing Logic (from previous solution) ---

    # 1. Parse Class (look for 'class' followed by a number)
    for i, p in enumerate(parts):
        if "class" in p:
            if i + 1 < len(parts) and parts[i+1].isdigit():
                class_part_parsed = f"Class {parts[i+1]}"
                break
            elif p.replace('class', '').isdigit(): # Handles "class11"
                class_part_parsed = f"Class {p.replace('class', '')}"
                break

    # 2. Parse Chapter Number (look for 'chapter' followed by a number)
    for i, p in enumerate(parts):
        if "chapter" in p:
            if i + 1 < len(parts) and parts[i+1].isdigit():
                chapter_num_parsed = parts[i+1]
                break
            elif p.replace('chapter', '').isdigit(): # Handles "chapter1"
                chapter_num_parsed = p.replace('chapter', '')
                break

    # 3. Parse Subject
    # You might want to define a list of common subjects for more robust parsing
    subject_keywords = ["physics", "chemistry", "math", "biology", "history", "geography"]
    for p in parts:
        if p not in ["class", "chapter", class_part_parsed.lower().replace('class ', ''), chapter_num_parsed]:
            if not p.isdigit():
                # Check if it's a known subject keyword
                if p in subject_keywords:
                    subject_parsed = p.title()
                    break
                # Optionally, take the first non-numeric/non-keyword string as subject
                # else:
                #     subject_parsed = p.title()
                #     break

    # Fallback/refinement for subject if 'phy' was found and default "Physics" is still there
    if subject_parsed == "Physics" and "phy" in parts:
        subject_parsed = "Physics" # Keep it as "Physics" if "phy" exists

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
                    "chapter": f"Chapter {chapter_num_parsed}",
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