import { API_CONFIG } from '../utils/constants';
import { generateSystemPrompt } from '../utils/prompts';

export const sendMessage = async (messages, gradeLevel, citationStyle) => {
  try {
    const systemPrompt = generateSystemPrompt(gradeLevel, citationStyle);

    const formattedMessages = [
      { role: 'system', content: systemPrompt },
      ...messages.map(msg => ({
        role: msg.role === 'assistant' ? 'assistant' : 'user',
        content: msg.content
      }))
    ];

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.REACT_APP_GROQ_API_KEY || ''}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: formattedMessages,
        max_tokens: 1500,
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