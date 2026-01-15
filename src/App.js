import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import ChatArea from './components/ChatArea';

function App() {
  const [messages, setMessages] = useState([]);
  const [gradeLevel, setGradeLevel] = useState('high-school');
  const [citationStyle, setCitationStyle] = useState('APA');

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar
        gradeLevel={gradeLevel}
        setGradeLevel={setGradeLevel}
        citationStyle={citationStyle}
        setCitationStyle={setCitationStyle}
        messages={messages}
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