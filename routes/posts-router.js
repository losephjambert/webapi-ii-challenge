const postsRouter = require('express').Router();
const db = require('../data/db.js');

postsRouter.get('/', (req, res) => {
  res.send('/api/posts is working');
});

postsRouter.post('/', (req, res) => {
  const { title, contents } = req.body;
  if (!title || !contents) {
    res.send({
      errorMessage: 'Please provide title and contents for the post.'
    });
  }
});

module.exports = postsRouter;
