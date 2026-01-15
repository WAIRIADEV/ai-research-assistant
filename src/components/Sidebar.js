import React from 'react';
import { BookOpen, Download, AlertCircle, FileText, Copy } from 'lucide-react';
import { GRADE_LEVELS, CITATION_STYLES } from '../utils/constants';
import { exportToText, exportToMarkdown, copyToClipboard } from '../services/exportService';
import SettingsPanel from './SettingsPanel';

const Sidebar = ({ gradeLevel, setGradeLevel, citationStyle, setCitationStyle, messages }) => {
  const handleExport = (format) => {
    if (messages.length === 0) {
      alert('No content to export yet!');
      return;
    }

    if (format === 'txt') {
      exportToText(messages);
    } else if (format === 'md') {
      exportToMarkdown(messages);
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

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-2 mb-4">
          <BookOpen className="w-6 h-6 text-blue-600" />
          <h1 className="text-xl font-bold text-gray-800">Research Assistant</h1>
        </div>
        <p className="text-sm text-gray-600">Your AI-powered study companion</p>
      </div>

      <SettingsPanel
        gradeLevel={gradeLevel}
        setGradeLevel={setGradeLevel}
        citationStyle={citationStyle}
        setCitationStyle={setCitationStyle}
      />

      <div className="p-4 space-y-2">
        <h3 className="text-sm font-semibold text-gray-700 mb-2">Export Options</h3>
        
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

      <div className="mt-auto p-4 bg-amber-50 border-t border-amber-200">
        <div className="flex items-start gap-2">
          <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-medium text-amber-800 mb-1">
              Academic Integrity
            </p>
            <p className="text-xs text-amber-700">
              Use this tool to learn and understand. Always write in your own words.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;