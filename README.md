# Renaissance: The Masterclass Platform

**Renaissance** is a modern, premium learning platform designed to decouple curriculum delivery from video. It provides dense, high-impact masterclasses (e.g., *Comedy Masterclass*, *The Kata Series*, *Stage Academy*) via an interactive, glassmorphic UI. 

Crucially, Renaissance features an **autonomous multi-agent AI pipeline** that can generate expert-level masterclasses dynamically from uploaded PDFs, YouTube videos, and website URLs.

## ✨ Core Features

*   **Premium Interactive UI**: Built with React and Tailwind CSS, featuring rich typography, dark mode glassmorphism, and micro-animations via Framer Motion.
*   **Static & Dynamic Paths**: Ships with hand-crafted static curriculums (like *Understanding Comedy*) and seamlessly integrates dynamically generated ones.
*   **Progress Tracking**: Full local state management to track completed lessons, phases, and practical exercises.
*   **Spotlight Search (Explore)**: A dedicated, real-time search interface to filter through the curriculum database.
*   **AI Curriculum Orchestration**: A sophisticated Python backend that processes raw text into a highly structured learning framework.

---

## 🧠 The AI Pipeline (Multi-Step Orchestration)

Instead of relying on a single "magic prompt" that produces shallow summaries, Renaissance uses a robust **4-Phase Orchestration Pipeline** backed by the `llama-3.3-70b-versatile` model (via Groq).

### 1. Concept Extraction (Phase 1)
Source material (PDFs, YouTube transcripts, websites) is divided into 15,000-character chunks. The AI extracts key frameworks, specific examples, expert quotes, mental models, and terminology into a unified knowledge base.

### 2. Syllabus Architecture (Phase 2)
The raw knowledge base is transformed into a highly structured syllabus skeleton (Phases → Lessons). Lesson titles are forced to be named frameworks (e.g., *"The Anatomy of Laughter"*) rather than generic labels.

### 3. Deep Content Writing (Phase 3)
To bypass LLM generation limits and JSON truncation, the pipeline iterates **lesson-by-lesson**. It writes dense content blocks enforced by strict schema constraints:
*   Bold, opinionated `intro` blocks
*   Specific `heading` blocks
*   Formatted `list` items with explanatory labels
*   Actionable `callout` warnings and information
*   Attributed `quote` blocks

### 4. Application Engineering (Phase 4)
The AI generates high-friction, creative application exercises and capstone projects for each phase to ensure actual student comprehension instead of multiple-choice quizzes.

---

## 🛠️ Tech Stack

### Frontend
*   **React** (Vite)
*   **Tailwind CSS** (Styling)
*   **Framer Motion** (Animations)
*   **React Router** (Navigation)

### Backend (AWS Amplify)
*   **AWS API Gateway**: REST API layer.
*   **AWS Lambda (Python 3.11)**: Core logic, chunking, and orchestration. Integrates with `youtube-transcript-api`, `BeautifulSoup4`, and Groq's API.
*   **Amazon DynamoDB**: Stores the dynamically generated curriculum schemas.
*   **Amazon S3**: Handles temporary PDF storage.
*   **Amazon Textract**: Extracts raw text from uploaded PDFs.

---

## 🚀 Local Development

### Prerequisites
*   Node.js (v18+)
*   Python (3.9+)
*   AWS Amplify CLI (`npm install -g @aws-amplify/cli`)

### Setup Instructions

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/yourusername/renaissance.git
    cd renaissance
    ```

2.  **Install Frontend Dependencies:**
    ```bash
    npm install
    ```

3.  **Initialize AWS Amplify:**
    ```bash
    amplify init
    amplify pull
    ```

4.  **Configure Environment Variables:**
    Ensure you add your Groq API keys to your Lambda's environment variables in the AWS console or within your local `env.txt` / config files:
    *   `GROQ_API_KEY_1`
    *   `GROQ_API_KEY_2`
    *   `GROQ_API_KEY_3`
    *   `GROQ_API_KEY_4`

5.  **Run Locally:**
    ```bash
    npm run dev
    ```

## 🏗️ Architecture Nuances

*   **API Gateway Timeout Handling**: AWS REST API Gateways have a hardcoded 29-second timeout. Because the AI orchestration pipeline takes 2-4 minutes, the React frontend generates a UUID locally, attaches it to the generation payload, gracefully catches the inevitable `504 Timeout`, and transitions into an asynchronous polling routine against DynamoDB until the background Lambda successfully writes the curriculum.
*   **Key Rotation**: The backend uses an array of Groq API keys and rotates through them sequentially to maximize tokens-per-minute (TPM) thresholds and avoid rate limiting during the intensive Phase 3 generation loop.

---
*Built for mastery.*
