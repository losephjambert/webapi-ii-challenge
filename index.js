const express = require('express');

const app = express();
app.use(express.json());

app.get('/', (request, response) => {
  const rootResponse = `
  <h1>Web API II Challenge</h1>
  <h2>Available Routes</h2>
  <ul>
    <li>/</li>
  </ul>
`;
  res.send(rootResponse);
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`app running on port ${PORT}`);
});
