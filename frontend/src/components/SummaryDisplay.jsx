import React, { useState, useRef } from 'react';
import { 
  FileText, 
  Download, 
  Copy, 
  Edit3, 
  Save, 
  X, 
  RefreshCw,
  ChevronDown,
  ChevronRight,
  Target,
  Lightbulb,
  CheckSquare,
  AlertTriangle,
  TrendingUp,
  Brain
} from 'lucide-react';
import { toast } from 'react-toastify';

const SummaryDisplay = ({ 
  summary, 
  filename, 
  wordCount, 
  onExportPDF, 
  onExportDOCX, 
  onRegenerate,
  isRegenerating 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedSummary, setEditedSummary] = useState(summary);
  const [expandedSections, setExpandedSections] = useState({});
  const [customInstructions, setCustomInstructions] = useState('');
  const [showRegenerateModal, setShowRegenerateModal] = useState(false);
  const textareaRef = useRef(null);

  const sectionIcons = {
    'Executive Summary': Target,
    'Key Insights': Lightbulb,
    'Decisions Made': CheckSquare,
    'Action Items': CheckSquare,
    'Risks & Concerns': AlertTriangle,
    'Opportunities & Ideas': TrendingUp,
    'Analysis/Recommendations': Brain
  };

  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(isEditing ? editedSummary : summary);
      toast.success('Summary copied to clipboard!', {
        position: "top-right",
        autoClose: 2000,
      });
    } catch (err) {
      toast.error('Failed to copy to clipboard', {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditedSummary(summary);
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
    }, 100);
  };

  const handleSave = () => {
    setIsEditing(false);
    // You could add an API call here to save the edited summary
    toast.success('Summary saved!', {
      position: "top-right",
      autoClose: 2000,
    });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedSummary(summary);
  };

  const handleRegenerate = async () => {
    setShowRegenerateModal(false);
    await onRegenerate(summary, customInstructions);
    setCustomInstructions('');
  };

  const toggleSection = (sectionName) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionName]: !prev[sectionName]
    }));
  };

  const parseSummaryIntoSections = (summaryText) => {
    const sections = [];
    const lines = summaryText.split('\n');
    let currentSection = null;
    let currentContent = [];

    for (const line of lines) {
      const trimmedLine = line.trim();
      
      // Check if this line is a section header
      const isHeader = Object.keys(sectionIcons).some(sectionName => 
        trimmedLine.toLowerCase().includes(sectionName.toLowerCase()) && 
        (trimmedLine.includes(':') || trimmedLine.includes('##') || trimmedLine.includes('#'))
      );

      if (isHeader) {
        // Save previous section if it exists
        if (currentSection) {
          sections.push({
            name: currentSection,
            content: currentContent.join('\n').trim()
          });
        }

        // Start new section
        const sectionName = Object.keys(sectionIcons).find(name => 
          trimmedLine.toLowerCase().includes(name.toLowerCase())
        );
        currentSection = sectionName || trimmedLine.replace(/[:#]/g, '').trim();
        currentContent = [];
      } else if (trimmedLine) {
        currentContent.push(line);
      }
    }

    // Don't forget the last section
    if (currentSection) {
      sections.push({
        name: currentSection,
        content: currentContent.join('\n').trim()
      });
    }

    return sections;
  };

  const sections = parseSummaryIntoSections(isEditing ? editedSummary : summary);

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Header */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <FileText className="w-6 h-6 text-primary-600" />
            <div>
              <h2 className="text-xl font-semibold text-executive-800">
                Executive Summary Generated
              </h2>
              <p className="text-sm text-executive-500">
                From: {filename} • {wordCount?.toLocaleString()} words processed
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowRegenerateModal(true)}
              disabled={isRegenerating}
              className="btn-secondary flex items-center gap-2"
            >
              {isRegenerating ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4" />
              )}
              Regenerate
            </button>
            
            {!isEditing ? (
              <button onClick={handleEdit} className="btn-secondary flex items-center gap-2">
                <Edit3 className="w-4 h-4" />
                Edit
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button onClick={handleSave} className="btn-primary flex items-center gap-2">
                  <Save className="w-4 h-4" />
                  Save
                </button>
                <button onClick={handleCancel} className="btn-secondary flex items-center gap-2">
                  <X className="w-4 h-4" />
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 pt-4 border-t border-executive-200">
          <button
            onClick={handleCopyToClipboard}
            className="btn-secondary flex items-center gap-2"
          >
            <Copy className="w-4 h-4" />
            Copy to Clipboard
          </button>
          
          <button
            onClick={() => onExportPDF(isEditing ? editedSummary : summary)}
            className="btn-primary flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export PDF
          </button>
          
          <button
            onClick={() => onExportDOCX(isEditing ? editedSummary : summary)}
            className="btn-primary flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export DOCX
          </button>
        </div>
      </div>

      {/* Summary Content */}
      <div className="card">
        {isEditing ? (
          <div className="space-y-4">
            <h3 className="section-heading">
              <Edit3 className="w-5 h-5" />
              Edit Summary
            </h3>
            <textarea
              ref={textareaRef}
              value={editedSummary}
              onChange={(e) => setEditedSummary(e.target.value)}
              className="w-full h-96 p-4 border border-executive-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none font-mono text-sm"
              placeholder="Edit your summary here..."
            />
          </div>
        ) : (
          <div className="space-y-6">
            <h3 className="section-heading">
              <FileText className="w-5 h-5" />
              Executive Summary
            </h3>
            
            {sections.length > 0 ? (
              <div className="space-y-4">
                {sections.map((section, index) => {
                  const IconComponent = sectionIcons[section.name] || FileText;
                  const isExpanded = expandedSections[section.name] !== false; // Default to expanded
                  
                  return (
                    <div key={index} className="summary-section">
                      <button
                        onClick={() => toggleSection(section.name)}
                        className="flex items-center justify-between w-full text-left mb-3 focus:outline-none"
                      >
                        <div className="flex items-center gap-2">
                          <IconComponent className="w-5 h-5 text-primary-600" />
                          <h4 className="font-semibold text-executive-800">
                            {section.name}
                          </h4>
                        </div>
                        {isExpanded ? (
                          <ChevronDown className="w-5 h-5 text-executive-500" />
                        ) : (
                          <ChevronRight className="w-5 h-5 text-executive-500" />
                        )}
                      </button>
                      
                      {isExpanded && (
                        <div className="prose prose-sm max-w-none">
                          <div 
                            className="text-executive-700 whitespace-pre-wrap"
                            dangerouslySetInnerHTML={{ 
                              __html: section.content
                                .split('\n')
                                .map(line => line.trim())
                                .filter(line => line)
                                .map(line => {
                                  if (line.startsWith('•') || line.startsWith('-')) {
                                    return `<div class="ml-4 mb-1">${line}</div>`;
                                  }
                                  return `<div class="mb-2">${line}</div>`;
                                })
                                .join('')
                            }}
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="prose prose-sm max-w-none">
                <div className="text-executive-700 whitespace-pre-wrap">
                  {summary}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Regenerate Modal */}
      {showRegenerateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-executive-800 mb-4">
              Regenerate Summary
            </h3>
            <p className="text-sm text-executive-600 mb-4">
              Provide additional instructions to customize the regenerated summary:
            </p>
            <textarea
              value={customInstructions}
              onChange={(e) => setCustomInstructions(e.target.value)}
              placeholder="e.g., Focus more on financial implications, make it more concise, emphasize action items..."
              className="w-full h-24 p-3 border border-executive-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none text-sm"
            />
            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setShowRegenerateModal(false)}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={handleRegenerate}
                disabled={isRegenerating}
                className="btn-primary flex items-center gap-2"
              >
                {isRegenerating ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <RefreshCw className="w-4 h-4" />
                )}
                Regenerate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SummaryDisplay;