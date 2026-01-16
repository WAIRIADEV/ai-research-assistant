import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import ChatArea from './components/ChatArea';

function App() {
  const [messages, setMessages] = useState([]);
  const [gradeLevel, setGradeLevel] = useState('high-school');
  const [citationStyle, setCitationStyle] = useState('APA');

  const handlePDFExtract = (text) => {
    const pdfMessage = {
      role: 'user',
      content: `I've uploaded a PDF document. Here's the extracted text:\n\n${text.substring(0, 3000)}...\n\nPlease help me understand this document and answer any questions I have about it.`
    };
    setMessages([...messages, pdfMessage]);
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar
        gradeLevel={gradeLevel}
        setGradeLevel={setGradeLevel}
        citationStyle={citationStyle}
        setCitationStyle={setCitationStyle}
        messages={messages}
        onPDFExtract={handlePDFExtract}
      />
      <ChatArea
        messages={messages}
        setMessages={setMessages}
        gradeLevel={gradeLevel}
        citationStyle={citationStyle}
      />
    </div>
  );
}

export default App;