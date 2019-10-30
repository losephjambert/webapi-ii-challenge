const postsRouter = require('express').Router();
const db = require('../data/db.js');

// get all posts
postsRouter.get('/', (req, res) => {
  db.find()
    .then(posts => {
      res.send(posts);
    })
    .catch(error => {
      res.send(500).json({
        errorMessage: 'Could not retrieve posts from the database :('
      });
    });
});

// get post by id
postsRouter.get('/:id', (req, res) => {
  const { id } = req.params;
  db.findById(id)
    .then(post => {
      if (post.length === 0) {
        res.sendStatus(404);
      } else {
        res.send(post);
      }
    })
    .catch(error => {
      res.sendStatus(500);
      console.log(error);
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

postsRouter.get('/:id/comments', (req, res) => {
  const { id } = req.params;
  db.findPostComments(id)
    .then(comments => {
      res.send(comments);
    })
    .catch(error => {
      res.sendStatus(500);
    });
});

module.exports = postsRouter;
