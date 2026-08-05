// api/chat.js
export default async function handler(req, res) {
  // Allow requests from your GitHub Pages domain
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Respond immediately to browser preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'API key is not configured on the server.' });
  }

  const { userPrompt, currentCode } = req.body;

  // Updated model identifier for v1beta endpoint:
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

  const systemInstruction = `You are a game development assistant for high school students.
You take existing Python code and update it based on the user request.
CRITICAL RULE: Return ONLY valid Python code inside triple backticks \`\`\`python ... \`\`\`. Do not add conversational text inside the code block. Use these helper functions for drawing:
- screen_fill(r, g, b)
- draw_rect(x, y, w, h, r, g, b)
- draw_text(text, x, y)
- on_mouse_move(x, y) callback for mouse tracking`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: `${systemInstruction}\n\nCURRENT CODE:\n${currentCode}\n\nREQUEST: ${userPrompt}` }]
        }]
      })
    });

    if (!response.ok) {
      const errData = await response.json();
      return res.status(response.status).json({ error: errData.error?.message || 'Gemini API Error' });
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}