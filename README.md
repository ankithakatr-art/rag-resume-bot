# AI Resume Chatbot
https://rag-resume-bot-u0c3.onrender.com/

An AI-powered chatbot where you can ask natural language questions about my professional experience. Built using RAG (Retrieval Augmented Generation) to provide accurate, context-aware answers.

## About This Project

I built this as my first AI/ML project to learn:
- How RAG systems work in production
- Vector embeddings and semantic search
- Integrating LLMs into full-stack applications
- Building AI features with modern web technologies

This project demonstrates my ability to bridge traditional software engineering with cutting-edge AI capabilities.

## Screenshots


### Chat Interface
![alt text](<Screenshot 2026-02-19 at 6.41.47 AM.png>) ![alt text](<Screenshot 2026-02-19 at 6.41.37 AM.png>) ![alt text](<Screenshot 2026-02-19 at 6.41.14 AM.png>)

## Features

- Natural language Q&A about resume content
- RAG-powered accurate information retrieval
- Full chat history with auto-scroll
- Real-time responses with loading indicators
- Graceful error handling
- Clean, modern UI with TypeScript

## Tech Stack

**Frontend:**
- React 18
- TypeScript
- Vite
- CSS3
- FontAwesome Icons

**Backend:**
- Node.js
- Express
- OpenAI API (GPT-3.5-turbo, text-embedding-3-small)
- Pinecone Vector Database

**Tools:**
- pnpm (package manager)
- Git

## How It Works

1. **Indexing Phase:**
   - Resume content is split into semantic chunks
   - Each chunk is converted to vector embeddings using OpenAI
   - Embeddings are stored in Pinecone vector database

2. **Query Phase:**
   - User question is embedded into the same vector space
   - Pinecone performs similarity search to find relevant chunks
   - Top matching chunks are retrieved as context

3. **Generation Phase:**
   - Retrieved chunks are sent to GPT-3.5 along with the question
   - LLM generates accurate answer based on actual resume content
   - Response appears in chat interface

4. **User Experience:**
   - Full chat history maintained
   - Auto-scroll to latest message
   - Loading states and error handling

## Getting Started

### Prerequisites

- Node.js v24.11.1 or higher
- pnpm package manager
- OpenAI API account ([Get free credits](https://platform.openai.com))
- Pinecone account ([Free tier available](https://www.pinecone.io))

### Installation

1. Clone the repository:
```bash
git clone https://github.com/ankithakatr-art/rag-resume-bot.git
cd rag-resume-bot
```

2. Install dependencies:
```bash
pnpm install
```

3. Install frontend dependencies:
```bash
cd frontend
pnpm install
cd ..
```

### Environment Setup

1. Create `.env` file in the root directory:
```env
OPENAI_API_KEY=your_openai_api_key_here
PINECONE_API_KEY=your_pinecone_api_key_here
PORT=3003
```

2. Create Pinecone index:
   - Go to [Pinecone Console](https://app.pinecone.io)
   - Create new index with:
     - Name: `resume-index`
     - Dimensions: `1536`
     - Metric: `cosine`
     - Type: `Dense`

3. Add your resume:
   - Create `resume.txt` in the root directory
   - Paste your resume content (plain text format)

### Usage

1. **Index your resume (first time only):**
```bash
node resumeRAG.js index
```
This processes your resume and stores embeddings in Pinecone.

2. **Start the backend server:**
```bash
node server.js
```
Server runs on `http://localhost:3003`

3. **In a new terminal, start the frontend:**
```bash
cd frontend
pnpm run dev
```
Frontend runs on `http://localhost:5173`

4. **Open your browser:**
   - Navigate to `http://localhost:5173`
   - Start asking questions about the resume!

## Project Structure
```
rag-resume-bot/
├── frontend/                # React + TypeScript frontend
│   ├── src/
│   │   ├── App.tsx
│   │   ├── ParentContainer.tsx   # Layout + typewriter effect
│   │   └── TextContainer.tsx     # Chat logic + UI
│   ├── package.json
│   └── vite.config.ts
├── server.js               # Express API server
├── resumeRAG.js           # RAG implementation (indexing + querying)
├── resume.txt             # Resume content (gitignored)
├── .env                   # API keys (gitignored)
├── package.json
└── README.md
```

## What I Learned

Building this project taught me:

- **RAG Architecture:** Understanding the full pipeline from document chunking to semantic retrieval to LLM generation
- **Vector Embeddings:** How text is converted to high-dimensional vectors and why similarity search works
- **Chunking Strategies:** The critical importance of how you split documents - bad chunking = bad retrieval = wrong answers
- **Production Concerns:** Error handling, loading states, user experience, cost optimization
- **API Integration:** Working with OpenAI and Pinecone APIs, handling rate limits and errors
- **Full-Stack AI:** Connecting modern frontend (React + TypeScript) with AI-powered backend
- **Debugging AI Systems:** How to troubleshoot when retrieval returns wrong chunks or LLM generates incorrect answers

## Future Improvements

- [ ] Deploy to production (Render/Vercel)
- [ ] Add conversation memory for follow-up questions
- [ ] Implement response streaming for better UX
- [ ] Add caching layer to reduce API costs
- [ ] Support multiple documents/resumes
- [ ] Add analytics to track common questions
- [ ] Implement RAG evaluation metrics

## Performance & Costs

- **Average response time:** 2-4 seconds
- **Cost per query:** ~$0.002 (embeddings + GPT-3.5)
- **Monthly cost (100 queries):** ~$0.20

## Contact

**Ankitha Katravulapalli**
- GitHub: [@ankithakatr-art](https://github.com/ankithakatr-art)
- LinkedIn: [linkedin.com/in/ankithakat](https://www.linkedin.com/in/ankithakat/)
- Email: ankitha.katr@gmail.com

---
