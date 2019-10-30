const postsRouter = require('express').Router();
const db = require('../data/db.js');

postsRouter.get('/', (req, res) => {
  db.find()
    .then(posts => {
      res.send(posts);
    })
    .catch(error => {
      res
        .send(500)
        .json({
          errorMessage: 'Could not retrieve posts from the database :('
        });
    });
});

// create a new post
postsRouter.post('/', (req, res) => {
  const { title, contents } = req.body;
  if (!title || !contents) {
    res.send({
      errorMessage: 'Please provide title and contents for the post.'
    });
  }

  db.insert({ title, contents })
    .then(postResponse => {
      console.log(postResponse);
      res.status(200).json({ postResponse });
    })
    .catch(postError => {
      console.log(postError);
    });
});

// add a new comment to a post
postsRouter.post('/:id/comments', (req, res) => {
  const { text } = req.body;
  const { id } = req.params;
  if (!text) {
    res.send({
      errorMessage: 'Please provide text for the comment.'
    });
  }

  db.insertComment({ text, post_id: id })
    .then(commentResponse => {
      console.log(commentResponse);
      res.status(200).json({ commentResponse });
    })
    .catch(postError => {
      console.log(postError);
    });
});

module.exports = postsRouter;
