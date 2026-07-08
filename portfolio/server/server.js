const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

const messages = [];

app.post('/api/contact', (req, res) => {
  const { name, email, subject, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ success: false, message: 'Name, email, and message are required.' });
  }
  messages.push({
    id: messages.length + 1,
    name, email, subject: subject || '',
    message,
    date: new Date().toISOString(),
  });
  console.log(`New contact form submission from ${name} (${email})`);
  res.json({ success: true, message: 'Message received successfully!' });
});

app.get('/api/messages', (req, res) => {
  res.json({ success: true, messages });
});

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Portfolio server running on http://localhost:${PORT}`);
});
