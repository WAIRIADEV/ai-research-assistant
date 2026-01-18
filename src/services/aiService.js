import { generateSystemPrompt } from '../utils/prompts';

const GROQ_API_KEY = process.env.REACT_APP_GROQ_API_KEY;

export const sendMessage = async (messages, gradeLevel, citationStyle) => {
  try {
    const systemPrompt = generateSystemPrompt(gradeLevel, citationStyle);

    const formattedMessages = [
      { role: 'system', content: systemPrompt },
      ...messages
        .filter(msg => !msg.image)
        .map(msg => ({
          role: msg.role === 'assistant' ? 'assistant' : 'user',
          content: msg.content
        }))
    ];

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: formattedMessages,
        max_tokens: 2000,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`API error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    return {
      success: true,
      content: data.choices[0].message.content
    };
  } catch (error) {
    console.error('AI Service Error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

export const sendMessageWithImage = async (messages, gradeLevel, citationStyle, imageBase64) => {
  try {
    const systemPrompt = generateSystemPrompt(gradeLevel, citationStyle) + 
      "\n\nYou are analyzing an image to help a student. Provide detailed, educational explanations.";
    
    const latestMessage = messages[messages.length - 1];

    console.log('🖼️ Sending image to backend for analysis...');

    // Call our serverless function (no CORS issues!)
    const apiUrl = window.location.hostname === 'localhost'
      ? 'http://localhost:3000/api/analyze-image'  // Local development
      : '/api/analyze-image';  // Production

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        imageBase64,
        question: latestMessage.content,
        systemPrompt
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Backend error:', data);
      throw new Error(data.error || 'Backend error');
    }

    console.log('✅ Image analysis complete!');

    return {
      success: true,
      content: `**📸 Image Analysis Results**\n\n${data.content}\n\n---\n\n*Powered by Replicate LLaVA (~$0.001 per image)*`
    };

  } catch (error) {
    console.error('❌ Image analysis error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};