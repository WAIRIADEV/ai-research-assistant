import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, VolumeX, AlertCircle } from 'lucide-react';

const VoiceControls = ({ onVoiceInput, latestMessage, disabled }) => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const [isSupported, setIsSupported] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const utteranceRef = useRef(null);

  useEffect(() => {
    // Check if speech recognition is supported
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      console.warn('❌ Speech recognition not supported');
      setIsSupported(false);
      setErrorMessage('Speech recognition not supported in this browser. Use Chrome, Edge, or Safari.');
      return;
    }

    console.log('✅ Speech recognition supported');

    const recognitionInstance = new SpeechRecognition();
    recognitionInstance.continuous = false;
    recognitionInstance.interimResults = false;
    recognitionInstance.lang = 'en-US';

    recognitionInstance.onstart = () => {
      console.log('🎤 Voice recognition started');
      setIsListening(true);
      setErrorMessage('');
    };

    recognitionInstance.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      console.log('✅ Voice input received:', transcript);
      onVoiceInput(transcript);
      setIsListening(false);
      setErrorMessage('');
    };

    recognitionInstance.onerror = (event) => {
      console.error('❌ Voice recognition error:', event.error);
      setIsListening(false);
      
      if (event.error === 'not-allowed') {
        setErrorMessage('Microphone access denied. Click the lock icon in the address bar to allow access.');
      } else if (event.error === 'no-speech') {
        setErrorMessage('No speech detected. Please try again and speak clearly.');
      } else if (event.error === 'network') {
        setErrorMessage('Network error. Check your internet connection.');
      } else if (event.error === 'aborted') {
        setErrorMessage('Voice input cancelled.');
      } else {
        setErrorMessage(`Voice error: ${event.error}`);
      }
    };

    recognitionInstance.onend = () => {
      console.log('🎤 Voice recognition ended');
      setIsListening(false);
    };

    setRecognition(recognitionInstance);

    // Cleanup
    return () => {
      if (recognitionInstance) {
        try {
          recognitionInstance.stop();
        } catch (e) {
          console.log('Cleanup: recognition already stopped');
        }
      }
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, [onVoiceInput]);

  const toggleListening = () => {
    if (!isSupported) {
      setErrorMessage('Speech recognition not supported. Use Chrome, Edge, or Safari.');
      return;
    }

    if (!recognition) {
      setErrorMessage('Voice recognition not initialized. Please refresh the page.');
      return;
    }

    if (isListening) {
      try {
        recognition.stop();
        console.log('🛑 Stopping voice recognition...');
      } catch (error) {
        console.error('Error stopping recognition:', error);
      }
      setIsListening(false);
    } else {
      try {
        console.log('▶️ Starting voice recognition...');
        recognition.start();
      } catch (error) {
        console.error('❌ Error starting recognition:', error);
        if (error.message.includes('already started')) {
          setErrorMessage('Already listening. Please speak now.');
        } else {
          setErrorMessage('Could not start voice recognition. Please try again.');
        }
      }
    }
  };

  const speakMessage = () => {
    if (!latestMessage) {
      setErrorMessage('No message to read aloud');
      return;
    }

    if (!window.speechSynthesis) {
      setErrorMessage('Text-to-speech not supported in this browser');
      return;
    }

    if (isSpeaking) {
      // Stop speaking
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      utteranceRef.current = null;
      console.log('🛑 Stopped speaking');
      return;
    }

    console.log('🔊 Starting text-to-speech...');

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
      console.log('🔊 Started speaking');
      setIsSpeaking(true);
      setErrorMessage('');
    };

    utterance.onend = () => {
      console.log('✅ Finished speaking');
      setIsSpeaking(false);
      utteranceRef.current = null;
    };

    utterance.onerror = (event) => {
      console.error('❌ Speech synthesis error:', event);
      setIsSpeaking(false);
      utteranceRef.current = null;
      setErrorMessage('Error reading text aloud');
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
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        {/* Voice Input Button */}
        <button
          onClick={toggleListening}
          disabled={disabled || !isSupported}
          className={`p-2 rounded-lg transition-colors relative ${
            isListening
              ? 'bg-red-600 text-white hover:bg-red-700 animate-pulse'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          } disabled:bg-gray-300 disabled:cursor-not-allowed`}
          title={
            !isSupported 
              ? 'Voice input not supported' 
              : isListening 
              ? 'Click to stop listening' 
              : 'Click and speak'
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
              ? 'Click to stop' 
              : 'Read answer aloud'
          }
        >
          {isSpeaking ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
        </button>
      </div>

      {/* Error Message */}
      {errorMessage && (
        <div className="flex items-start gap-1 p-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded text-xs text-red-700 dark:text-red-300">
          <AlertCircle className="w-3 h-3 flex-shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Status Indicator */}
      {isListening && !errorMessage && (
        <div className="text-xs text-blue-600 dark:text-blue-400 font-medium animate-pulse">
          🎤 Listening... Speak now!
        </div>
      )}
      
      {isSpeaking && !errorMessage && (
        <div className="text-xs text-green-600 dark:text-green-400 font-medium animate-pulse">
          🔊 Reading aloud...
        </div>
      )}
    </div>
  );
};

export default VoiceControls;