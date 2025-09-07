# 🚀 Executive Meeting Summary Generator - Setup Guide for Non-Developers

This guide will help you get your Executive Meeting Summary Generator up and running in simple steps. No coding experience required!

## 📋 What You'll Need

Before we start, make sure you have:
1. A computer with internet connection
2. An OpenAI account with API access
3. About 30 minutes of time

## 🎯 Step 1: Get Your OpenAI API Key

### 1.1 Create OpenAI Account
1. Go to [https://platform.openai.com](https://platform.openai.com)
2. Click "Sign Up" if you don't have an account
3. Follow the registration process
4. Verify your email address

### 1.2 Get Your API Key
1. Once logged in, go to [https://platform.openai.com/api-keys](https://platform.openai.com/api-keys)
2. Click "Create new secret key"
3. Give it a name like "Executive Summary Generator"
4. **IMPORTANT**: Copy the key that appears (it looks like `sk-...`) and save it somewhere safe
5. You won't be able to see this key again, so make sure to copy it now!

### 1.3 Add Billing Information
1. Go to [https://platform.openai.com/account/billing](https://platform.openai.com/account/billing)
2. Add a payment method
3. Consider setting a usage limit (e.g., $20/month) to control costs
4. Each summary typically costs $0.10-$0.50 depending on transcript length

## 💻 Step 2: Install Required Software

### 2.1 Install Python
1. Go to [https://www.python.org/downloads/](https://www.python.org/downloads/)
2. Download Python 3.8 or newer (the website will suggest the right version)
3. **IMPORTANT**: During installation, check the box "Add Python to PATH"
4. Complete the installation

### 2.2 Install Node.js
1. Go to [https://nodejs.org](https://nodejs.org)
2. Download the "LTS" version (recommended for most users)
3. Run the installer and follow the default options
4. Complete the installation

### 2.3 Verify Installations
1. Press `Windows Key + R`, type `cmd`, and press Enter (Windows)
   - Or press `Cmd + Space`, type `terminal`, and press Enter (Mac)
2. Type these commands one by one and press Enter after each:
   ```
   python --version
   ```
   Should show something like "Python 3.x.x"
   
   ```
   node --version
   ```
   Should show something like "v18.x.x"

If either command doesn't work, restart your computer and try again.

## 📁 Step 3: Download and Setup the Application

### 3.1 Download the Application
1. Download all the files from your workspace to a folder on your computer
2. Create a folder called `ExecutiveSummaryApp` on your Desktop
3. Extract/copy all files into this folder

### 3.2 Setup Your API Key
1. In your `ExecutiveSummaryApp` folder, find the file called `.env.example`
2. Make a copy of this file and rename the copy to `.env` (remove the .example part)
3. Open the `.env` file with Notepad (Windows) or TextEdit (Mac)
4. Replace `your_openai_api_key_here` with your actual OpenAI API key
5. Save the file

Your `.env` file should look like:
```
OPENAI_API_KEY=sk-your-actual-key-here
FLASK_ENV=development
FLASK_DEBUG=True
```

## 🔧 Step 4: Install Application Dependencies

### 4.1 Open Command Prompt/Terminal
1. Press `Windows Key + R`, type `cmd`, press Enter (Windows)
   - Or press `Cmd + Space`, type `terminal`, press Enter (Mac)

### 4.2 Navigate to Your App Folder
1. Type this command (replace with your actual path):
   ```
   cd Desktop/ExecutiveSummaryApp
   ```
   - If you put the folder somewhere else, adjust the path accordingly

### 4.3 Install Everything
1. Type this command and press Enter:
   ```
   npm run install-all
   ```
2. This will take 5-10 minutes to download and install everything
3. You'll see lots of text scrolling - this is normal!
4. Wait until it says "Done" or returns to the command prompt

## 🚀 Step 5: Start Your Application

### 5.1 Start the Application
1. In the same command prompt/terminal, type:
   ```
   npm run dev
   ```
2. Wait for it to start (you'll see messages about servers starting)
3. You should see something like:
   ```
   Backend server running on http://localhost:5000
   Frontend server running on http://localhost:3000
   ```

### 5.2 Open the Application
1. Open your web browser (Chrome, Firefox, Safari, etc.)
2. Go to: `http://localhost:3000`
3. You should see your Executive Meeting Summary Generator!

## 📝 Step 6: Using Your Application

### 6.1 Upload a Transcript
1. You should see a drag-and-drop area on the page
2. Either:
   - Drag a transcript file (.txt, .docx, or .pdf) into the area, OR
   - Click the area and select a file from your computer

### 6.2 Wait for Processing
1. The app will upload and process your file
2. This takes 30-60 seconds depending on file size
3. You'll see a progress bar and spinning indicator

### 6.3 View Your Summary
1. Once complete, you'll see a structured executive summary
2. The summary has sections like:
   - Executive Summary
   - Key Insights
   - Decisions Made
   - Action Items
   - Risks & Concerns
   - Opportunities & Ideas
   - Analysis/Recommendations

### 6.4 Use the Summary
You can:
- **Copy to Clipboard**: Click "Copy to Clipboard" to copy the text
- **Edit**: Click "Edit" to modify the summary directly
- **Export PDF**: Click "Export PDF" to download a PDF file
- **Export DOCX**: Click "Export DOCX" to download a Word document
- **Regenerate**: Click "Regenerate" to create a new version with custom instructions

## 🔄 Daily Usage

### Starting the App
Every time you want to use the app:
1. Open command prompt/terminal
2. Navigate to your app folder: `cd Desktop/ExecutiveSummaryApp`
3. Start the app: `npm run dev`
4. Open browser to: `http://localhost:3000`

### Stopping the App
When you're done:
1. Go back to the command prompt/terminal
2. Press `Ctrl + C` (Windows) or `Cmd + C` (Mac)
3. This will stop the application

## 🆘 Troubleshooting

### Problem: "API Disconnected" Error
**Solution**: 
- Check your internet connection
- Verify your OpenAI API key is correct in the `.env` file
- Make sure you have credits in your OpenAI account

### Problem: File Upload Fails
**Solution**:
- Make sure your file is under 50MB
- Only use .txt, .docx, or .pdf files
- Try a smaller file first to test

### Problem: Command Not Found
**Solution**:
- Restart your computer
- Make sure Python and Node.js are installed correctly
- Try opening a new command prompt/terminal

### Problem: Port Already in Use
**Solution**:
- Close any other applications that might be using the same ports
- Restart your computer
- Try again

## 💡 Tips for Best Results

### For Better Summaries:
1. **Use clear transcripts**: The cleaner your transcript, the better the summary
2. **Include speaker names**: If possible, include who said what
3. **Add context**: Brief meeting context at the top helps
4. **Optimal length**: 5-50 pages work best

### Cost Management:
1. **Set OpenAI limits**: Use the billing dashboard to set monthly limits
2. **Monitor usage**: Check your OpenAI usage regularly
3. **Typical costs**: Most summaries cost $0.10-$0.50 each

## 📞 Getting Help

If you run into issues:
1. Try restarting the application
2. Check that all steps were followed correctly
3. Verify your OpenAI API key is working
4. Make sure you have internet connection

## 🎉 You're Ready!

Congratulations! Your Executive Meeting Summary Generator is now ready to transform your meeting transcripts into professional, executive-ready summaries. 

Simply drag and drop your transcript files and get instant, AI-powered summaries structured for leadership decision-making!

---

**Remember**: Keep your `.env` file safe and never share your OpenAI API key with others!