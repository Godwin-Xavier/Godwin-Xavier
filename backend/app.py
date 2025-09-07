import os
import json
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from werkzeug.utils import secure_filename
import openai
from dotenv import load_dotenv
import docx
import PyPDF2
from io import BytesIO
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
import tempfile
import time

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# Configuration
app.config['MAX_CONTENT_LENGTH'] = 50 * 1024 * 1024  # 50MB max file size
app.config['UPLOAD_FOLDER'] = 'uploads'
ALLOWED_EXTENSIONS = {'txt', 'pdf', 'docx'}

# Ensure upload directory exists
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

# OpenAI Configuration
openai.api_key = os.getenv('OPENAI_API_KEY')

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def extract_text_from_file(file_path, filename):
    """Extract text from uploaded file based on file type"""
    try:
        if filename.endswith('.txt'):
            with open(file_path, 'r', encoding='utf-8') as file:
                return file.read()
        
        elif filename.endswith('.docx'):
            doc = docx.Document(file_path)
            text = []
            for paragraph in doc.paragraphs:
                text.append(paragraph.text)
            return '\n'.join(text)
        
        elif filename.endswith('.pdf'):
            with open(file_path, 'rb') as file:
                pdf_reader = PyPDF2.PdfReader(file)
                text = []
                for page in pdf_reader.pages:
                    text.append(page.extract_text())
                return '\n'.join(text)
    
    except Exception as e:
        raise Exception(f"Error extracting text from {filename}: {str(e)}")

def chunk_text(text, max_tokens=3000):
    """Split text into chunks to handle OpenAI token limits"""
    words = text.split()
    chunks = []
    current_chunk = []
    current_length = 0
    
    for word in words:
        # Rough estimate: 1 token ≈ 0.75 words
        if current_length + len(word) > max_tokens * 0.75:
            if current_chunk:
                chunks.append(' '.join(current_chunk))
                current_chunk = [word]
                current_length = len(word)
            else:
                # Single word is too long, include it anyway
                chunks.append(word)
        else:
            current_chunk.append(word)
            current_length += len(word)
    
    if current_chunk:
        chunks.append(' '.join(current_chunk))
    
    return chunks

def generate_summary_with_openai(text, retries=2):
    """Generate executive summary using OpenAI API with retry logic"""
    
    system_prompt = """You are an executive assistant specialized in creating concise, strategic summaries for C-level executives. 

Generate a structured executive summary with the following sections:
1. Executive Summary (3-5 sentences high-level overview)
2. Key Insights (major themes and takeaways)
3. Decisions Made (agreements, approvals, strategic choices)
4. Action Items (clear next steps, responsibilities, deadlines)
5. Risks & Concerns (issues, blockers, challenges)
6. Opportunities & Ideas (innovation points, growth suggestions)
7. Analysis/Recommendations (patterns, insights, strategic recommendations)

Format requirements:
- Use bullet points for clarity
- Keep sentences short and impactful
- Focus on executive-level strategic insights
- Avoid verbose details
- Make it scan-friendly for busy leaders"""

    user_prompt = f"Please analyze this meeting transcript and create an executive summary:\n\n{text}"
    
    for attempt in range(retries + 1):
        try:
            response = openai.ChatCompletion.create(
                model="gpt-4",
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                max_tokens=1500,
                temperature=0.3
            )
            
            return response.choices[0].message.content.strip()
            
        except Exception as e:
            if attempt < retries:
                time.sleep(2 ** attempt)  # Exponential backoff
                continue
            else:
                raise Exception(f"OpenAI API error after {retries + 1} attempts: {str(e)}")

def process_large_transcript(text):
    """Process large transcripts by chunking and combining summaries"""
    chunks = chunk_text(text)
    
    if len(chunks) == 1:
        return generate_summary_with_openai(chunks[0])
    
    # Process chunks individually
    chunk_summaries = []
    for i, chunk in enumerate(chunks):
        try:
            summary = generate_summary_with_openai(chunk)
            chunk_summaries.append(f"Chunk {i+1} Summary:\n{summary}")
        except Exception as e:
            chunk_summaries.append(f"Chunk {i+1} Error: {str(e)}")
    
    # Combine chunk summaries
    combined_text = "\n\n".join(chunk_summaries)
    
    # Generate final executive summary
    final_prompt = f"""Based on these chunk summaries from a large meeting transcript, create a unified executive summary:

{combined_text}

Please consolidate these into a single, coherent executive summary with the standard format."""
    
    return generate_summary_with_openai(final_prompt)

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy", "message": "Executive Meeting Summary Generator API is running"})

@app.route('/api/upload', methods=['POST'])
def upload_transcript():
    try:
        if 'file' not in request.files:
            return jsonify({"error": "No file provided"}), 400
        
        file = request.files['file']
        if file.filename == '':
            return jsonify({"error": "No file selected"}), 400
        
        if not allowed_file(file.filename):
            return jsonify({"error": "File type not supported. Please upload .txt, .docx, or .pdf files"}), 400
        
        filename = secure_filename(file.filename)
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(file_path)
        
        # Extract text from file
        text = extract_text_from_file(file_path, filename)
        
        if not text.strip():
            os.remove(file_path)
            return jsonify({"error": "No text content found in the uploaded file"}), 400
        
        # Generate summary using OpenAI
        summary = process_large_transcript(text)
        
        # Clean up uploaded file
        os.remove(file_path)
        
        return jsonify({
            "success": True,
            "filename": filename,
            "summary": summary,
            "word_count": len(text.split()),
            "message": "Summary generated successfully"
        })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/regenerate', methods=['POST'])
def regenerate_summary():
    try:
        data = request.get_json()
        if not data or 'text' not in data:
            return jsonify({"error": "No text provided for regeneration"}), 400
        
        text = data['text']
        custom_instructions = data.get('instructions', '')
        
        # Add custom instructions to the prompt if provided
        if custom_instructions:
            text = f"Additional Instructions: {custom_instructions}\n\nOriginal Text: {text}"
        
        summary = process_large_transcript(text)
        
        return jsonify({
            "success": True,
            "summary": summary,
            "message": "Summary regenerated successfully"
        })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/export/pdf', methods=['POST'])
def export_pdf():
    try:
        data = request.get_json()
        if not data or 'summary' not in data:
            return jsonify({"error": "No summary provided"}), 400
        
        summary = data['summary']
        filename = data.get('filename', 'executive_summary.pdf')
        
        # Create PDF
        buffer = BytesIO()
        doc = SimpleDocTemplate(buffer, pagesize=letter, topMargin=1*inch)
        
        styles = getSampleStyleSheet()
        title_style = ParagraphStyle(
            'CustomTitle',
            parent=styles['Heading1'],
            fontSize=16,
            spaceAfter=30,
            textColor='#2c3e50'
        )
        
        story = []
        story.append(Paragraph("Executive Meeting Summary", title_style))
        story.append(Spacer(1, 20))
        
        # Split summary into paragraphs and format
        paragraphs = summary.split('\n')
        for para in paragraphs:
            if para.strip():
                story.append(Paragraph(para, styles['Normal']))
                story.append(Spacer(1, 10))
        
        doc.build(story)
        buffer.seek(0)
        
        # Create temporary file
        temp_file = tempfile.NamedTemporaryFile(delete=False, suffix='.pdf')
        temp_file.write(buffer.getvalue())
        temp_file.close()
        
        return send_file(
            temp_file.name,
            as_attachment=True,
            download_name=filename,
            mimetype='application/pdf'
        )
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/export/docx', methods=['POST'])
def export_docx():
    try:
        data = request.get_json()
        if not data or 'summary' not in data:
            return jsonify({"error": "No summary provided"}), 400
        
        summary = data['summary']
        filename = data.get('filename', 'executive_summary.docx')
        
        # Create DOCX
        doc = docx.Document()
        doc.add_heading('Executive Meeting Summary', 0)
        
        paragraphs = summary.split('\n')
        for para in paragraphs:
            if para.strip():
                doc.add_paragraph(para)
        
        # Save to temporary file
        temp_file = tempfile.NamedTemporaryFile(delete=False, suffix='.docx')
        doc.save(temp_file.name)
        temp_file.close()
        
        return send_file(
            temp_file.name,
            as_attachment=True,
            download_name=filename,
            mimetype='application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        )
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)