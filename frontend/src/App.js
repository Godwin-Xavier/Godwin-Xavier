import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Brain, Zap, Shield, Clock } from 'lucide-react';

import FileUpload from './components/FileUpload';
import SummaryDisplay from './components/SummaryDisplay';
import apiService from './services/api';

function App() {
  const [summary, setSummary] = useState(null);
  const [filename, setFilename] = useState('');
  const [wordCount, setWordCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [apiStatus, setApiStatus] = useState('checking');

  useEffect(() => {
    checkApiHealth();
  }, []);

  const checkApiHealth = async () => {
    try {
      await apiService.healthCheck();
      setApiStatus('healthy');
    } catch (error) {
      setApiStatus('error');
      toast.error('API connection failed. Please check if the backend server is running.', {
        position: "top-right",
        autoClose: 5000,
      });
    }
  };

  const handleFileUpload = async (file) => {
    setIsLoading(true);
    setUploadProgress(0);
    setSummary(null);

    try {
      const result = await apiService.uploadTranscript(file, (progress) => {
        setUploadProgress(progress);
      });

      setSummary(result.summary);
      setFilename(result.filename);
      setWordCount(result.word_count);

      toast.success('Summary generated successfully!', {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (error) {
      toast.error(error.message || 'Failed to process transcript', {
        position: "top-right",
        autoClose: 5000,
      });
    } finally {
      setIsLoading(false);
      setUploadProgress(0);
    }
  };

  const handleExportPDF = async (summaryText) => {
    try {
      await apiService.exportPDF(summaryText);
      toast.success('PDF exported successfully!', {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (error) {
      toast.error('Failed to export PDF', {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const handleExportDOCX = async (summaryText) => {
    try {
      await apiService.exportDOCX(summaryText);
      toast.success('DOCX exported successfully!', {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (error) {
      toast.error('Failed to export DOCX', {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const handleRegenerate = async (originalSummary, instructions) => {
    setIsRegenerating(true);

    try {
      const result = await apiService.regenerateSummary(originalSummary, instructions);
      setSummary(result.summary);
      
      toast.success('Summary regenerated successfully!', {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (error) {
      toast.error(error.message || 'Failed to regenerate summary', {
        position: "top-right",
        autoClose: 5000,
      });
    } finally {
      setIsRegenerating(false);
    }
  };

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Analysis",
      description: "Advanced OpenAI integration extracts key insights and strategic decisions"
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Generate executive summaries in under 60 seconds"
    },
    {
      icon: Shield,
      title: "Secure Processing",
      description: "Your transcripts are processed securely and not stored permanently"
    },
    {
      icon: Clock,
      title: "Time-Saving",
      description: "Transform hours of meetings into scan-friendly executive briefings"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-executive-50 to-primary-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Brain className="w-10 h-10 text-primary-600" />
            <h1 className="text-4xl font-bold text-executive-900">
              Executive Meeting Summary Generator
            </h1>
          </div>
          <p className="text-xl text-executive-600 max-w-3xl mx-auto">
            Transform lengthy meeting transcripts into concise, strategic summaries 
            tailored for C-level leadership
          </p>
          
          {/* API Status Indicator */}
          <div className="mt-4 flex items-center justify-center gap-2">
            <div className={`w-3 h-3 rounded-full ${
              apiStatus === 'healthy' ? 'bg-green-500' : 
              apiStatus === 'error' ? 'bg-red-500' : 'bg-yellow-500'
            }`}></div>
            <span className="text-sm text-executive-500">
              {apiStatus === 'healthy' ? 'API Connected' : 
               apiStatus === 'error' ? 'API Disconnected' : 'Checking API...'}
            </span>
          </div>
        </header>

        {/* Features */}
        {!summary && (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {features.map((feature, index) => (
              <div key={index} className="card text-center">
                <feature.icon className="w-12 h-12 text-primary-600 mx-auto mb-4" />
                <h3 className="font-semibold text-executive-800 mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-executive-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          {!summary ? (
            <FileUpload 
              onFileUpload={handleFileUpload}
              isLoading={isLoading}
              uploadProgress={uploadProgress}
            />
          ) : (
            <SummaryDisplay
              summary={summary}
              filename={filename}
              wordCount={wordCount}
              onExportPDF={handleExportPDF}
              onExportDOCX={handleExportDOCX}
              onRegenerate={handleRegenerate}
              isRegenerating={isRegenerating}
            />
          )}
        </div>

        {/* New Upload Button */}
        {summary && (
          <div className="text-center mt-8">
            <button
              onClick={() => {
                setSummary(null);
                setFilename('');
                setWordCount(0);
              }}
              className="btn-secondary"
            >
              Process Another Transcript
            </button>
          </div>
        )}

        {/* Footer */}
        <footer className="text-center mt-16 py-8 border-t border-executive-200">
          <p className="text-executive-500">
            Executive Meeting Summary Generator v1.0 • Built for Emergent Platform
          </p>
          <p className="text-sm text-executive-400 mt-2">
            Powered by OpenAI • Designed for Executive Excellence
          </p>
        </footer>
      </div>

      {/* Toast Notifications */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
}

export default App;