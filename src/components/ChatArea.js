import React, { useState } from 'react';
import { GRADE_LEVELS } from '../utils/constants';
import MessageList from './MessageList';
import InputArea from './InputArea';
import { sendMessage, sendMessageWithImage } from '../services/aiService';

const ChatArea = ({ messages, setMessages, gradeLevel, citationStyle }) => {
  const [loading, setLoading] = useState(false);

  const handleSendMessage = async (input, imageBase64 = null) => {
    if (!input.trim() || loading) return;

    const userMessage = { 
      role: 'user', 
      content: input,
      image: imageBase64 
    };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setLoading(true);

    let result;
    if (imageBase64) {
      result = await sendMessageWithImage(updatedMessages, gradeLevel, citationStyle, imageBase64);
    } else {
      result = await sendMessage(updatedMessages, gradeLevel, citationStyle);
    }

    if (result.success) {
      setMessages([...updatedMessages, {
        role: 'assistant',
        content: result.content
      }]);
    } else {
      setMessages([...updatedMessages, {
        role: 'assistant',
        content: `I encountered an error: ${result.error}. Please try again.`
      }]);
    }

    setLoading(false);
  };

  const latestAssistantMessage = messages
    .slice()
    .reverse()
    .find(msg => msg.role === 'assistant')?.content || '';

  return (
    <div className="flex-1 flex flex-col">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Research Chat</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Ask questions, upload images, use voice input
            </p>
          </div>
          <div className="flex gap-2">
            <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs font-medium rounded-full">
              {GRADE_LEVELS[gradeLevel]}
            </span>
            <span className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 text-xs font-medium rounded-full">
              {citationStyle}
            </span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <MessageList messages={messages} loading={loading} />

      {/* Input */}
      <InputArea 
        onSend={handleSendMessage} 
        loading={loading}
        latestMessage={latestAssistantMessage}
      />
    </div>
  );
};

export default ChatArea;