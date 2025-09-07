# Deployment Guide

## Environment Setup

### 1. OpenAI API Key
1. Get your API key from [OpenAI Platform](https://platform.openai.com/api-keys)
2. Copy `.env.example` to `.env`
3. Add your API key:
   ```
   OPENAI_API_KEY=your_openai_api_key_here
   ```

### 2. Install Dependencies
```bash
# Install all dependencies
npm run install-all

# Or install separately:
# Backend
pip install -r requirements.txt

# Frontend
cd frontend && npm install
```

## Running the Application

### Development Mode
```bash
# Start both backend and frontend
npm run dev

# Or start separately:
# Backend (Terminal 1)
cd backend && python app.py

# Frontend (Terminal 2)
cd frontend && npm start
```

### Production Mode
```bash
# Build frontend
cd frontend && npm run build

# Start backend in production
cd backend && python app.py
```

## Server Configuration

### Backend Server (Flask)
- **Port**: 5000
- **Host**: 0.0.0.0 (accepts connections from any IP)
- **File Upload**: Max 50MB
- **Timeout**: 120 seconds for API requests

### Frontend Server (React)
- **Port**: 3000 (development)
- **Proxy**: Configured to proxy API requests to backend

## File Structure Requirements

Ensure these directories exist:
```
backend/uploads/     # Temporary file storage (auto-created)
frontend/build/      # Production build (created by npm run build)
```

## Environment Variables

### Backend (.env)
```
OPENAI_API_KEY=your_key_here
FLASK_ENV=development
FLASK_DEBUG=True
```

### Frontend (optional)
```
REACT_APP_API_URL=http://localhost:5000/api
```

## Troubleshooting

### Common Issues

1. **"API Disconnected" error**
   - Check if backend server is running
   - Verify OpenAI API key is set correctly
   - Check network connectivity

2. **File upload fails**
   - Ensure file is under 50MB
   - Check file format (.txt, .docx, .pdf only)
   - Verify backend uploads directory exists

3. **Summary generation fails**
   - Check OpenAI API key validity
   - Ensure sufficient API credits
   - Check file content is readable

### Port Conflicts
If ports 3000 or 5000 are in use:
```bash
# Frontend - set custom port
PORT=3001 npm start

# Backend - modify app.py
app.run(debug=True, host='0.0.0.0', port=5001)
```

## Security Considerations

1. **API Key Protection**
   - Never commit `.env` file to version control
   - Use environment variables in production
   - Rotate API keys regularly

2. **File Security**
   - Files are automatically deleted after processing
   - No permanent storage of sensitive content
   - File type validation prevents malicious uploads

3. **Network Security**
   - Use HTTPS in production
   - Configure CORS appropriately
   - Implement rate limiting if needed

## Performance Optimization

1. **Large Files**
   - Files are automatically chunked for processing
   - Progress tracking for user feedback
   - Timeout handling for long processes

2. **API Limits**
   - Built-in retry logic with exponential backoff
   - Error handling for rate limits
   - Efficient token usage

## Monitoring

### Health Checks
- API health endpoint: `GET /api/health`
- Frontend displays connection status
- Automatic reconnection attempts

### Logging
Add logging to backend for production:
```python
import logging
logging.basicConfig(level=logging.INFO)
```

## Production Deployment

### Using PM2 (Node.js Process Manager)
```bash
# Install PM2
npm install -g pm2

# Create ecosystem file
# ecosystem.config.js
module.exports = {
  apps: [{
    name: 'executive-summary-backend',
    script: 'backend/app.py',
    interpreter: 'python3',
    env: {
      FLASK_ENV: 'production'
    }
  }]
};

# Start with PM2
pm2 start ecosystem.config.js
```

### Using Docker
```dockerfile
# Create Dockerfile
FROM node:16 as frontend
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ .
RUN npm run build

FROM python:3.9
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY backend/ ./backend/
COPY --from=frontend /app/frontend/build ./frontend/build
EXPOSE 5000
CMD ["python", "backend/app.py"]
```

### Nginx Configuration
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## Backup and Recovery

### Important Files to Backup
- `.env` file (securely)
- Custom configurations
- Any custom prompts or templates

### No Data Loss Risk
- No persistent data storage
- Transcripts are processed and deleted
- Summaries exist only in user session