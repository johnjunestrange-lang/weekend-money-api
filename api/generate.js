export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { skills, time, goal } = req.body;

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'mistralai/mistral-7b-instruct:free',
      messages: [
        {
          role: 'system',
          content: "You are a no-BS money coach. Give 3 specific, realistic ways to make money this weekend based on the person's skills, time, and goal. Be direct and actionable. Plain text only, no markdown. Number each method clearly with action steps."
        },
        {
          role: 'user',
          content: `My skills: ${skills}\nTime available: ${time}\nIncome goal: ${goal}\n\nGive me my top 3 specific money-making methods for this weekend with brief action steps for each.`
        }
      ]
    })
  });

  const data = await response.json();
  const text = data.choices?.[0]?.message?.content || 'Could not generate plan. Please try again.';
  return res.status(200).json({ result: text });
}
