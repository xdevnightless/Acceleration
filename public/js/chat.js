const axios = require('axios');

async function makeRequest() {
  const url = 'https://api.shuttleai.app/v1/chat/completions';
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer $SHUTTLEAI_API_KEY'
  };
  const data = {
    model: 'gpt-4',
    messages: [{ role: 'user', content: 'Say this is a test!' }],
    temperature: 0.7,
    max_tokens: 5
  };

  try {
    const response = await axios.post(url, data, { headers });
    console.log(response.data.choices[0].message.content);
  } catch (error) {
    console.error(error);
  }
}

makeRequest();

