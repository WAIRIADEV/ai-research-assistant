import React, { useRef, useEffect } from 'react';
import { Lightbulb } from 'lucide-react';
import { SUGGESTED_PROMPTS } from '../utils/constants';
import MarkdownMessage from './MarkdownMessage';

const MessageList = ({ messages, loading }) => {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  if (messages.length === 0) {
    return (
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-3xl mx-auto text-center py-12">
          <Lightbulb className="w-16 h-16 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
            Ready to help with your research!
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-8">
            Ask questions, upload images, or use voice input for help with any topic.
          </p>
          
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Try asking:</p>
            {SUGGESTED_PROMPTS.slice(0, 4).map((prompt, idx) => (
              <div
                key={idx}
                className="text-left px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg"
              >
                <p className="text-sm text-gray-700 dark:text-gray-300">{prompt}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-4">
      {messages.map((msg, idx) => (
        <div
          key={idx}
          className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
        >
          {msg.image && (
            <div className="max-w-3xl">
              <img
                src={msg.image}
                alt="Uploaded"
                className="max-w-sm rounded-lg border-2 border-blue-500 mb-2"
              />
              <MarkdownMessage content={msg.content} isUser={msg.role === 'user'} />
            </div>
          )}
          {!msg.image && (
            <MarkdownMessage content={msg.content} isUser={msg.role === 'user'} />
          )}
        </div>
      ))}

      {loading && (
        <div className="flex justify-start">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-3">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
            </div>
          </div>
        </div>
      )}
      
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;