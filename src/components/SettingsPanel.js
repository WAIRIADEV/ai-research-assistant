import React from 'react';
import { GRADE_LEVELS, CITATION_STYLES } from '../utils/constants';

const SettingsPanel = ({ gradeLevel, setGradeLevel, citationStyle, setCitationStyle }) => {
  return (
    <div className="p-4 space-y-4 border-b border-gray-200">
      <h3 className="text-sm font-semibold text-gray-700">Settings</h3>
      
      <div>
        <label className="text-sm font-medium text-gray-700 mb-2 block">
          Grade Level
        </label>
        <select
          value={gradeLevel}
          onChange={(e) => setGradeLevel(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
        >
          {Object.entries(GRADE_LEVELS).map(([key, label]) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </select>
        <p className="text-xs text-gray-500 mt-1">
          Adjusts response complexity
        </p>
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700 mb-2 block">
          Citation Style
        </label>
        <select
          value={citationStyle}
          onChange={(e) => setCitationStyle(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
        >
          {CITATION_STYLES.map((style) => (
            <option key={style} value={style}>{style}</option>
          ))}
        </select>
        <p className="text-xs text-gray-500 mt-1">
          Format for references
        </p>
      </div>
    </div>
  );
};

export default SettingsPanel;