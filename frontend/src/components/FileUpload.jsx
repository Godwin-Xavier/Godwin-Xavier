import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, File, AlertCircle, CheckCircle } from 'lucide-react';

const FileUpload = ({ onFileUpload, isLoading, uploadProgress }) => {
  const [dragActive, setDragActive] = useState(false);

  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    setDragActive(false);
    
    if (rejectedFiles.length > 0) {
      const error = rejectedFiles[0].errors[0];
      alert(`File rejected: ${error.message}`);
      return;
    }

    if (acceptedFiles.length > 0) {
      onFileUpload(acceptedFiles[0]);
    }
  }, [onFileUpload]);

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject
  } = useDropzone({
    onDrop,
    accept: {
      'text/plain': ['.txt'],
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    maxFiles: 1,
    maxSize: 50 * 1024 * 1024, // 50MB
    onDragEnter: () => setDragActive(true),
    onDragLeave: () => setDragActive(false)
  });

  const getDropzoneStyles = () => {
    let baseStyles = "border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 cursor-pointer";
    
    if (isLoading) {
      return `${baseStyles} border-primary-300 bg-primary-50 cursor-not-allowed`;
    }
    
    if (isDragReject) {
      return `${baseStyles} border-red-400 bg-red-50 text-red-600`;
    }
    
    if (isDragAccept || dragActive) {
      return `${baseStyles} border-primary-500 bg-primary-50 text-primary-700`;
    }
    
    return `${baseStyles} border-executive-300 bg-executive-50 hover:border-primary-400 hover:bg-primary-50`;
  };

  const getIconColor = () => {
    if (isDragReject) return "text-red-500";
    if (isDragAccept || dragActive) return "text-primary-500";
    return "text-executive-400";
  };

  return (
    <div className="card animate-fade-in">
      <h2 className="section-heading mb-6">
        <Upload className="w-5 h-5" />
        Upload Meeting Transcript
      </h2>
      
      <div {...getRootProps()} className={getDropzoneStyles()}>
        <input {...getInputProps()} disabled={isLoading} />
        
        {isLoading ? (
          <div className="space-y-4">
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
            <div className="space-y-2">
              <p className="text-primary-700 font-medium">Processing your transcript...</p>
              {uploadProgress > 0 && (
                <div className="w-full bg-primary-200 rounded-full h-2">
                  <div 
                    className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              )}
              <p className="text-sm text-primary-600">
                This may take up to 60 seconds for large files
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <File className={`mx-auto h-16 w-16 ${getIconColor()}`} />
            
            <div className="space-y-2">
              <p className="text-lg font-medium text-executive-700">
                {isDragActive ? 'Drop your transcript here' : 'Upload your meeting transcript'}
              </p>
              <p className="text-sm text-executive-500">
                Drag and drop or click to browse
              </p>
            </div>
            
            <div className="flex items-center justify-center space-x-4 text-sm text-executive-400">
              <span className="flex items-center gap-1">
                <CheckCircle className="w-4 h-4" />
                .txt
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle className="w-4 h-4" />
                .docx
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle className="w-4 h-4" />
                .pdf
              </span>
            </div>
            
            <div className="flex items-center justify-center text-xs text-executive-400">
              <AlertCircle className="w-3 h-3 mr-1" />
              Maximum file size: 50MB
            </div>
          </div>
        )}
      </div>
      
      {isDragReject && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600 flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            Please upload a valid .txt, .docx, or .pdf file under 50MB
          </p>
        </div>
      )}
    </div>
  );
};

export default FileUpload;