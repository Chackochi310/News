const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 8000;
const GNEWS_API_KEY = process.env.GNEWS_API_KEY;

app.get('/news', async (req, res) => {
  const { query, language = 'en', page = 1 } = req.query;
  try {
    const response = await axios.get(`https://gnews.io/api/v4/search`, {
      params: {
        q: query || 'latest',
        lang: language,
        token: GNEWS_API_KEY,
        page
      }
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching news', error });
  }
});

app.listen(PORT, () => {
  console.log(`App is running on port ${PORT}`);
});
