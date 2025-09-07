# Executive Meeting Summary Generator

A professional application that transforms meeting transcripts into concise, executive-ready summaries using OpenAI integration. Built for C-level leadership and strategic decision-making.

## 🎯 Features

### Core Functionality
- **Multi-format Support**: Upload `.txt`, `.docx`, and `.pdf` transcripts (up to 50MB)
- **AI-Powered Analysis**: Advanced OpenAI GPT-4 integration for intelligent summarization
- **Structured Output**: Executive-friendly format with 7 key sections
- **In-App Editing**: Edit summaries directly within the application
- **Export Options**: Download as PDF or DOCX, copy to clipboard
- **Regeneration**: Customize summaries with additional instructions

### Technical Features
- **Large File Handling**: Automatic text chunking for files up to 100 pages
- **Error Handling**: Comprehensive retry logic and user-friendly error messages
- **Security**: Secure file processing without permanent storage
- **Performance**: Sub-60 second processing for most transcripts

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- Node.js 16+
- OpenAI API Key

### Installation

1. **Clone and setup**
   ```bash
   cd executive-meeting-summary-generator
   npm run install-all
   ```

2. **Environment Setup**
   ```bash
   cp .env.example .env
   # Edit .env and add your OpenAI API key
   ```

3. **Start the application**
   ```bash
   npm run dev
   ```

## 📁 Project Structure

```
executive-meeting-summary-generator/
├── backend/                 # Flask API server
│   ├── app.py              # Main application file
│   └── uploads/            # Temporary file storage
├── frontend/               # React application
│   ├── src/components/    # React components
│   ├── src/services/      # API service layer
│   └── package.json       # Frontend dependencies
├── requirements.txt        # Python dependencies
└── package.json           # Project scripts
```

## 🔧 API Endpoints

- `GET /api/health` - Health check
- `POST /api/upload` - Upload transcript and generate summary
- `POST /api/regenerate` - Regenerate summary with custom instructions
- `POST /api/export/pdf` - Export summary as PDF
- `POST /api/export/docx` - Export summary as DOCX

## 🎨 UI Components

- **FileUpload**: Drag & drop interface with validation
- **SummaryDisplay**: Structured display with editing and export features

## 🚀 Deployment

### Development
```bash
npm run dev
```

### Production
```bash
cd frontend && npm run build
cd ../backend && python app.py
```

## 📊 Summary Structure

1. **Executive Summary** - High-level overview
2. **Key Insights** - Major themes and takeaways
3. **Decisions Made** - Agreements and strategic choices
4. **Action Items** - Next steps with responsibilities
5. **Risks & Concerns** - Issues and challenges
6. **Opportunities & Ideas** - Growth suggestions
7. **Analysis/Recommendations** - Strategic insights

---

**Built for Executive Excellence • v1.0.0**