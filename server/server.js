const express = require('express');
const OpenAI = require('openai');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(express.json());
const openai = new OpenAI({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY,
});

const apiRoutes = require('./routes/apiRoutes');
app.use('/api', apiRoutes);

console.log(
  'OpenAI API Key:',
  process.env.REACT_APP_OPENAI_API_KEY ? 'Set' : 'Not set'
);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
