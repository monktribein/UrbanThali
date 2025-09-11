const express = require('express');
const app = express();
const PORT = process.env.PORT || 9000;

app.get('/', (req, res) => {
  res.send('Test server is running!');
});

app.listen(PORT, () => {
  console.log(`Test server running on port ${PORT}`);
});
