// Vercel Serverless Function for Image Analysis with Replicate
// This bypasses CORS by acting as a proxy

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle preflight
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { imageBase64, question, systemPrompt } = req.body;

    if (!imageBase64 || !question) {
      return res.status(400).json({ error: 'Missing imageBase64 or question' });
    }

    console.log('🖼️ Backend: Analyzing image with Replicate...');

    // Get Replicate API key from environment
    const REPLICATE_API_KEY = process.env.REPLICATE_API_KEY;

    if (!REPLICATE_API_KEY) {
      return res.status(500).json({ 
        error: 'Replicate API key not configured on server',
        hint: 'Add REPLICATE_API_KEY to Vercel environment variables'
      });
    }

    console.log('🔑 API key found');
    console.log('📤 Creating prediction...');

    // Create prediction with LLaVA model
    const prediction = await fetch('https://api.replicate.com/v1/predictions', {
      method: 'POST',
      headers: {
        'Authorization': `Token ${REPLICATE_API_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'wait'
      },
      body: JSON.stringify({
        version: '2facb4a474a0462c15041b78b1ad70952ea46b5ec6ad29583c0b29dbd4249591',
        input: {
          image: imageBase64,
          prompt: `${systemPrompt}\n\nQuestion: ${question}\n\nProvide a detailed, educational answer.`,
          max_tokens: 1024
        }
      })
    });

    if (!prediction.ok) {
      const errorData = await prediction.json();
      console.error('❌ Replicate API Error:', errorData);
      return res.status(prediction.status).json({ 
        error: `Replicate API error: ${prediction.status}`,
        details: errorData 
      });
    }

    let predictionData = await prediction.json();
    console.log('⏳ Prediction created, waiting for result...');

    // Poll for results (max 60 seconds)
    let attempts = 0;
    const maxAttempts = 60;

    while (
      predictionData.status !== 'succeeded' && 
      predictionData.status !== 'failed' && 
      attempts < maxAttempts
    ) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const statusResponse = await fetch(
        `https://api.replicate.com/v1/predictions/${predictionData.id}`,
        {
          headers: {
            'Authorization': `Token ${REPLICATE_API_KEY}`,
          }
        }
      );

      predictionData = await statusResponse.json();
      attempts++;
      
      if (attempts % 5 === 0) {
        console.log(`⏳ Still processing... (${attempts}s)`);
      }
    }

    if (predictionData.status === 'failed') {
      console.error('❌ Prediction failed:', predictionData.error);
      return res.status(500).json({ 
        error: 'Image analysis failed',
        details: predictionData.error 
      });
    }

    if (predictionData.status !== 'succeeded') {
      console.error('❌ Timeout');
      return res.status(504).json({ error: 'Image analysis timeout' });
    }

    console.log('✅ Analysis complete!');

    const analysisResult = Array.isArray(predictionData.output) 
      ? predictionData.output.join('') 
      : predictionData.output;

    return res.status(200).json({
      success: true,
      content: analysisResult
    });

  } catch (error) {
    console.error('❌ Server error:', error);
    return res.status(500).json({ 
      error: 'Server error', 
      message: error.message 
    });
  }
}