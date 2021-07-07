const express = require('express');
const postsRouter = require('./routes/posts-router.js');

const app = express();
app.use(express.json());

app.get('/', (request, response) => {
  const rootResponse = `
  <h1>Web API II Challenge</h1>
  <h2>Available Routes</h2>
  <ul>
    <li>/ <code>GET</code></li>
  </ul>
`;
  response.send(rootResponse);
});

app.use('/api/posts', postsRouter);

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`app running on port ${PORT}`);
});
