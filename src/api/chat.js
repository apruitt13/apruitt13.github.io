export default async function handler(req, res) {
  // Allow requests from GitHub Pages and localhost
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle browser OPTIONS preflight checks
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userPrompt, currentCode } = req.body;

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'GEMINI_API_KEY environment variable is not set.' });
    }

    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [
                {
                  text: `You are a Python Pygame Zero pair programmer. Current code:\n\`\`\`python\n${currentCode}\n\`\`\`\n\nUser request: ${userPrompt}`
                }
              ]
            }
          ]
        })
      }
    );

    const data = await geminiResponse.json();

    // THE FIX: If Google rejects the request, pass the real error to the frontend
    if (!geminiResponse.ok) {
      const errorMessage = data.error?.message || 'Unknown Google API Error';
      return res.status(geminiResponse.status).json({ error: errorMessage });
    }

    // Success! Return the data
    return res.status(200).json(data);

  } catch (error) {
    return res.status(500).json({ error: error.message || 'Server error' });
  }
}