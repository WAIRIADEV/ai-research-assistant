import React, { useState } from 'react';
import { BookOpen, Download, AlertCircle, FileText, Copy, Moon, Sun, Menu, X, FileUp } from 'lucide-react';
import { exportToText, exportToMarkdown, copyToClipboard } from '../services/exportService';
import { exportToPDF } from '../services/pdfExportService';
import { useTheme } from '../contexts/ThemeContext';
import SettingsPanel from './SettingsPanel';
import PDFViewer from './PDFViewer';

const Sidebar = ({ gradeLevel, setGradeLevel, citationStyle, setCitationStyle, messages, onPDFExtract }) => {
  const { darkMode, toggleDarkMode } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showPDFViewer, setShowPDFViewer] = useState(false);

  const handleExport = (format) => {
    if (messages.length === 0) {
      alert('No content to export yet!');
      return;
    }

    if (format === 'txt') {
      exportToText(messages);
    } else if (format === 'md') {
      exportToMarkdown(messages);
    } else if (format === 'pdf') {
      exportToPDF(messages);
    }
  };

  const handleCopy = async () => {
    if (messages.length === 0) {
      alert('No content to copy yet!');
      return;
    }

    const result = await copyToClipboard(messages);
    if (result.success) {
      alert('Content copied to clipboard!');
    } else {
      alert('Failed to copy content');
    }
  };

  const handlePDFExtract = (text) => {
    setShowPDFViewer(false);
    onPDFExtract(text);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg"
      >
        {mobileOpen ? <X className="w-6 h-6 dark:text-white" /> : <Menu className="w-6 h-6 dark:text-white" />}
      </button>

      {/* Sidebar */}
      <div className={`
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
        fixed lg:static
        inset-y-0 left-0
        w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700
        flex flex-col
        transition-transform duration-300 ease-in-out
        z-40
      `}>
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              <h1 className="text-xl font-bold text-gray-800 dark:text-white">Research Assistant</h1>
            </div>
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              {darkMode ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-gray-600" />}
            </button>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300">Your AI-powered study companion</p>
        </div>

        <SettingsPanel
          gradeLevel={gradeLevel}
          setGradeLevel={setGradeLevel}
          citationStyle={citationStyle}
          setCitationStyle={setCitationStyle}
        />

        {/* PDF Upload Button */}
        <div className="p-4 border-b dark:border-gray-700">
          <button
            onClick={() => setShowPDFViewer(true)}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
          >
            <FileUp className="w-4 h-4" />
            Upload & Analyze PDF
          </button>
        </div>

        {/* Export Options */}
        <div className="p-4 space-y-2">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Export Options</h3>
          
          <button
            onClick={() => handleExport('pdf')}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
          >
            <FileText className="w-4 h-4" />
            Export as PDF
          </button>

          <button
            onClick={() => handleExport('txt')}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
          >
            <FileText className="w-4 h-4" />
            Export as Text
          </button>

          <button
            onClick={() => handleExport('md')}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
          >
            <Download className="w-4 h-4" />
            Export as Markdown
          </button>

          <button
            onClick={handleCopy}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
          >
            <Copy className="w-4 h-4" />
            Copy to Clipboard
          </button>
        </div>

        {/* Academic Integrity */}
        <div className="mt-auto p-4 bg-amber-50 dark:bg-amber-900/20 border-t border-amber-200 dark:border-amber-800">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-medium text-amber-800 dark:text-amber-300 mb-1">
                Academic Integrity
              </p>
              <p className="text-xs text-amber-700 dark:text-amber-400">
                Use this tool to learn and understand. Always write in your own words.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
        />
      )}

      {/* PDF Viewer Modal */}
      {showPDFViewer && (
        <PDFViewer
          onClose={() => setShowPDFViewer(false)}
          onExtractText={handlePDFExtract}
        />
      )}
    </>
  );
};

export default Sidebar;