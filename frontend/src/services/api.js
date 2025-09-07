import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 120000, // 2 minutes timeout for large file processing
});

// Request interceptor for loading states
api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      // Server responded with error status
      const errorMessage = error.response.data?.error || 'An error occurred';
      throw new Error(errorMessage);
    } else if (error.request) {
      // Network error
      throw new Error('Network error. Please check your connection.');
    } else {
      // Other error
      throw new Error('An unexpected error occurred');
    }
  }
);

export const apiService = {
  // Health check
  healthCheck: async () => {
    const response = await api.get('/health');
    return response.data;
  },

  // Upload transcript and generate summary
  uploadTranscript: async (file, onProgress = null) => {
    const formData = new FormData();
    formData.append('file', file);

    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    };

    if (onProgress) {
      config.onUploadProgress = (progressEvent) => {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        onProgress(percentCompleted);
      };
    }

    const response = await api.post('/upload', formData, config);
    return response.data;
  },

  // Regenerate summary with custom instructions
  regenerateSummary: async (text, instructions = '') => {
    const response = await api.post('/regenerate', {
      text,
      instructions,
    });
    return response.data;
  },

  // Export summary as PDF
  exportPDF: async (summary, filename = 'executive_summary.pdf') => {
    const response = await api.post('/export/pdf', {
      summary,
      filename,
    }, {
      responseType: 'blob',
    });

    // Create download link
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);

    return { success: true, message: 'PDF downloaded successfully' };
  },

  // Export summary as DOCX
  exportDOCX: async (summary, filename = 'executive_summary.docx') => {
    const response = await api.post('/export/docx', {
      summary,
      filename,
    }, {
      responseType: 'blob',
    });

    // Create download link
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);

    return { success: true, message: 'DOCX downloaded successfully' };
  },
};

export default apiService;