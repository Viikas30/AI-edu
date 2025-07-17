# 📚 AI-Edu: NCERT Concept Mapper for YouTube Videos

This is a **React Native** project that allows students to explore **YouTube videos** and automatically link them to **relevant NCERT concepts** from the **Class 11 Physics Part-1 textbook**, using **RAG (Retrieval-Augmented Generation)**.

---

## ✨ Features

- 🎥 Browse YouTube videos by channel(3Blue1Brown,veritasium,Kurzgesagt).
- 🔍 Auto-fetch YouTube video transcripts (via Python backend).
- 🧠 Extract embeddings from transcripts using an embedding model(via Node Backend).
- 🔎 Search relevant textbook content using **Qdrant Cloud** vector database.
- 📘 Show AI-generated NCERT explanation for each video based on retrieved chapter.
- 🔁 Recommended videos from the same channel.

---

## 🧩 Tech Stack

| Layer        | Tech                                      |
| ------------ | ----------------------------------------- |
| Frontend     | React Native (Expo SDK `53.0.17`)        |
| Transcripts  | [`youtube-transcript-api`](https://pypi.org/project/youtube-transcript-api/) (Python) |
| Vector DB    | [Qdrant Cloud](https://qdrant.tech/)      |
| LLM          | OpenRouter (model: `openrouter/r1`)       |
| Embeddings   | Node.js backend (for transcript embedding and LLM) |
| AI Inference | Retrieval-Augmented Generation (RAG)      |

---


---

## 🧪 Backends (Work in Progress)

| Backend        | Status     | Description                                                              |
| -------------- | ---------- | ------------------------------------------------------------------------ |
| Python Backend | ⚠️ Blocked | Uses `youtube-transcript-api` to fetch transcripts, but blocked on Render/other cloud providers |
| Node.js Backend| 🔧 In Progress | Handles LLM calls + transcript embedding |

> ✅ Local Python backend works well due to fewer YouTube API restrictions. Currently searching for a cloud host where YouTube access is not blocked.

---

## 🚀 Deployment

- **Frontend (React Native)**: Build via `expo build:android` or `eas build` for APK.
- **Backends**: Will be deployed separately (Node.js and Python services).

---
## 📦 Steps to Run the App

You can build and run the app using either **EAS CLI** or **Gradle**:

---

### ✅ Option 1: Using EAS CLI (Recommended for Expo Projects)

1. **Install EAS CLI**  
   ```bash
   npm install -g eas-cli
   ```

2. **Configure `eas.json`**  
   In the root of your project, create a file called `eas.json` with the following content:
   ```json
   {
     "build": {
       "preview": {
         "developmentClient": true,
         "distribution": "internal"
       },
       "production": {
         "developmentClient": false,
         "distribution": "store"
       }
     }
   }
   ```

3. **Build the APK**  
   Run the following command to start the build:
   ```bash
   eas build -p android --profile production
   ```

   This will generate an installable `.apk` file via EAS.

---

### ✅ Option 2: Manual Build Using Gradle

1. **Clone this repository**

2. **Navigate to the android directory**  
   ```bash
   cd android
   ```

3. **Build the release APK**  
   ```bash
   ./gradlew assembleRelease
   ```

4. **Locate the output APK**  
   You will find the APK at:  
   ```
   android/app/build/outputs/apk/release/app-release.apk


⚠️ Important Note
If you wish to run the application locally, please make sure to also run the backend servers, as the app depends on them for fetching YouTube transcripts and retrieving relevant NCERT concepts using RAG. Without these services running, key features will not function properly.

The servers are not yet deployed due to restrictions from services like YouTube blocking cloud-based transcript extraction. I am currently exploring alternatives, and the APK will be provided once the backend is fully deployed.

In the meantime, the source code for the backend (both Python and Node.js services) can be found in my other repositories.


<img src="https://github.com/user-attachments/assets/58205193-61f8-4e6a-b6fb-1cde416db7dc" alt="WhatsApp Image" width="285" height="480"/>

<img src="https://github.com/user-attachments/assets/bdea067b-37b5-4d1e-9151-9c44f58c1b44" alt="WhatsApp Image" width="285" height="480"/>




