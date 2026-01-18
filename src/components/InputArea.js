import React, { useState } from 'react';
import { Send, Image as ImageIcon } from 'lucide-react';
import ImageUpload from './ImageUpload';
import VoiceControls from './VoiceControls';

const InputArea = ({ onSend, loading, latestMessage }) => {
  const [input, setInput] = useState('');
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);

  const handleSend = () => {
    if (input.trim() && !loading) {
      onSend(input, uploadedImage);
      setInput('');
      setUploadedImage(null);
      setShowImageUpload(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleVoiceInput = (transcript) => {
    setInput(transcript);
  };

  const handleImageUpload = (base64, fileName) => {
    setUploadedImage(base64);
    if (!input.trim()) {
      setInput(`Please analyze this image: ${fileName}`);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Image Upload Area */}
        {showImageUpload && (
          <div className="mb-4">
            <ImageUpload onImageUpload={handleImageUpload} />
          </div>
        )}

        {/* Input Controls */}
        <div className="flex items-end gap-2">
          <div className="flex-1 relative">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask a question, upload an image, or use voice input..."
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows="3"
              disabled={loading}
            />
          </div>

          {/* Voice Controls */}
          <VoiceControls
            onVoiceInput={handleVoiceInput}
            latestMessage={latestMessage}
            disabled={loading}
          />

          {/* Image Upload Toggle */}
          <button
            onClick={() => setShowImageUpload(!showImageUpload)}
            className={`px-4 py-3 rounded-lg transition-colors ${
              showImageUpload
                ? 'bg-purple-600 text-white hover:bg-purple-700'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
            title="Upload image"
          >
            <ImageIcon className="w-5 h-5" />
          </button>

          {/* Send Button */}
          <button
            onClick={handleSend}
            disabled={!input.trim() || loading}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center justify-between mt-2">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Press Enter to send, Shift+Enter for new line
          </p>
          {uploadedImage && (
            <button
              onClick={() => setUploadedImage(null)}
              className="text-xs text-red-600 hover:text-red-700"
            >
              Remove image
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default InputArea;