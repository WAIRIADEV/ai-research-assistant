import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, VolumeX } from 'lucide-react';

const VoiceControls = ({ onVoiceInput, latestMessage, disabled }) => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const [isSupported, setIsSupported] = useState(true);
  const utteranceRef = useRef(null);

  useEffect(() => {
    // Check if speech recognition is supported
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      console.warn('Speech recognition not supported in this browser');
      setIsSupported(false);
      return;
    }

    const recognitionInstance = new SpeechRecognition();
    recognitionInstance.continuous = false;
    recognitionInstance.interimResults = false;
    recognitionInstance.lang = 'en-US';

    recognitionInstance.onstart = () => {
      console.log('Voice recognition started');
      setIsListening(true);
    };

    recognitionInstance.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      console.log('Voice input received:', transcript);
      onVoiceInput(transcript);
      setIsListening(false);
    };

    recognitionInstance.onerror = (event) => {
      console.error('Voice recognition error:', event.error);
      if (event.error === 'not-allowed') {
        alert('Microphone access denied. Please allow microphone access in your browser settings.');
      } else if (event.error === 'no-speech') {
        alert('No speech detected. Please try again.');
      } else {
        alert(`Voice recognition error: ${event.error}`);
      }
      setIsListening(false);
    };

    recognitionInstance.onend = () => {
      console.log('Voice recognition ended');
      setIsListening(false);
    };

    setRecognition(recognitionInstance);

    // Cleanup
    return () => {
      if (recognitionInstance) {
        recognitionInstance.stop();
      }
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, [onVoiceInput]);

  const toggleListening = () => {
    if (!isSupported) {
      alert('Speech recognition is not supported in your browser. Please use Chrome, Edge, or Safari.');
      return;
    }

    if (!recognition) {
      alert('Voice recognition is not initialized yet. Please refresh the page.');
      return;
    }

    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      try {
        recognition.start();
        console.log('Starting voice recognition...');
      } catch (error) {
        console.error('Error starting recognition:', error);
        alert('Could not start voice recognition. Please try again.');
        setIsListening(false);
      }
    }
  };

  const speakMessage = () => {
    if (!latestMessage) {
      alert('No message to read aloud');
      return;
    }

    if (!window.speechSynthesis) {
      alert('Text-to-speech is not supported in your browser');
      return;
    }

    if (isSpeaking) {
      // Stop speaking
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      utteranceRef.current = null;
      return;
    }

    // Clean markdown formatting from message
    const cleanText = latestMessage
      .replace(/#{1,6}\s/g, '') // Remove headers
      .replace(/\*\*/g, '') // Remove bold
      .replace(/\*/g, '') // Remove italics
      .replace(/`{1,3}[^`]*`{1,3}/g, 'code') // Replace code blocks
      .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1') // Remove links
      .replace(/^\s*[-*+]\s/gm, '') // Remove bullet points
      .replace(/^\s*\d+\.\s/gm, ''); // Remove numbered lists

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 1;

    utterance.onstart = () => {
      console.log('Started speaking');
      setIsSpeaking(true);
    };

    utterance.onend = () => {
      console.log('Finished speaking');
      setIsSpeaking(false);
      utteranceRef.current = null;
    };

    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event);
      setIsSpeaking(false);
      utteranceRef.current = null;
      alert('Error reading text aloud. Please try again.');
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  // Stop speaking when component unmounts
  useEffect(() => {
    return () => {
      if (window.speechSynthesis && isSpeaking) {
        window.speechSynthesis.cancel();
      }
    };
  }, [isSpeaking]);

  return (
    <div className="flex gap-2">
      {/* Voice Input Button */}
      <button
        onClick={toggleListening}
        disabled={disabled || !isSupported}
        className={`p-2 rounded-lg transition-colors ${
          isListening
            ? 'bg-red-600 text-white hover:bg-red-700 animate-pulse'
            : 'bg-blue-600 text-white hover:bg-blue-700'
        } disabled:bg-gray-300 disabled:cursor-not-allowed`}
        title={
          !isSupported 
            ? 'Voice input not supported in this browser' 
            : isListening 
            ? 'Stop listening' 
            : 'Start voice input'
        }
      >
        {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
      </button>

      {/* Voice Output Button */}
      <button
        onClick={speakMessage}
        disabled={!latestMessage}
        className={`p-2 rounded-lg transition-colors ${
          isSpeaking
            ? 'bg-red-600 text-white hover:bg-red-700 animate-pulse'
            : 'bg-green-600 text-white hover:bg-green-700'
        } disabled:bg-gray-300 disabled:cursor-not-allowed`}
        title={
          !latestMessage
            ? 'No message to read'
            : isSpeaking 
            ? 'Stop speaking' 
            : 'Read answer aloud'
        }
      >
        {isSpeaking ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
      </button>
    </div>
  );
};

export default VoiceControls;