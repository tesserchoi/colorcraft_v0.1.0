const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

app.post('/api/generate', async (req, res) => {
  try {
    const {
      brandName,
      brandOverview,
      industry,
      targetAudience,
      mission,
      personality,
      stylePreferences,
    } = req.body;

    const prompt = `
You are an expert brand identity designer tasked with suggesting an ideal brand color palette for a client.

Here are the client’s brand details:

- Brand Name: ${brandName}
- Brand Overview: ${brandOverview}
- Industry or Business Type: ${industry}
- Target Audience: ${targetAudience}
- Brand Mission or Core Values: ${mission}
- Brand Personality/Tone: ${personality}
- Style Preferences (optional): ${stylePreferences || 'None'}

Based on the information above, suggest an ideal and effective brand color palette clearly structured as follows:

Primary Brand Color:
- Hex Code:
- Practical Instructions on Use:

Secondary Brand Color:
- Hex Code:
- Practical Instructions on Use:

Accent Brand Color:
- Hex Code:
- Practical Instructions on Use:
    `;

    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4',
        messages: [
          { role: 'system', content: 'You are a helpful assistant.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 500,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        },
      }
    );

    const generatedText = response.data.choices[0].message.content;
    res.json({ result: generatedText });
  } catch (error) {
    console.error(error.response ? error.response.data : error.message);
    res.status(500).json({ error: 'Error generating brand color palette' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
