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
    res.status(400).send({
      errorMessage: 'Please provide title and contents for the post.'
    });
  }

  db.insert({ title, contents })
    .then(postResponse => {
      console.log(postResponse);
      db.findById(postResponse.id)
        .then(post => {
          res.status(201).send(post);
        })
        .catch(error => {
          res.status(500).send({
            error: 'There was an error while saving the post to the database'
          });
        });
    })
    .catch(postError => {
      console.log(postError);
    });
});

// delete post by id
postsRouter.delete('/:id', (req, res) => {
  const { id } = req.params;
  db.findById(id)
    .then(post => {
      if (post.length === 0) {
        res.sendStatus(404);
      } else {
        db.remove(id)
          .then(removedPost => {
            if (removedPost) {
              res.send(post);
            } else {
              res.sendStatus(404);
            }
          })
          .catch(error => {
            res.sendStatus(500);
          });
      }
    })
    .catch(error => {
      res.sendStatus(500);
    });
});

// update post by id
postsRouter.put('/:id', (req, res) => {
  const { id } = req.params;

  db.update(id, req.body)
    .then(updatedPost => {
      if (updatedPost) {
        db.findById(id)
          .then(post => res.send(post))
          .catch(error => res.sendStatus(500));
      } else {
        res.sendStatus(404);
      }
    })
    .catch(error => {
      res.sendStatus(500);
    });
});

// add a new comment to a post
postsRouter.post('/:id/comments', (req, res) => {
  const { text } = req.body;
  const { id } = req.params;
  if (!text) {
    res
      .status(400)
      .send({ message: 'The post with the specified ID does not exist.' });
  } else {
    db.findById(id)
      .then(post => {
        if (post.length === 0) {
          res.status(404).send({
            message: 'The post with the specified ID does not exist.'
          });
        } else {
          db.insertComment({ text, post_id: id })
            .then(commentResponse => {
              db.findCommentById(commentResponse.id)
                .then(comment => {
                  res.status(201).json(comment);
                })
                .catch(error => {
                  res.status(500).send({
                    error:
                      'There was an error while retrieving the comment to the database'
                  });
                });
            })
            .catch(postError => {
              res.status(500).send({
                error:
                  'There was an error while saving the comment to the database'
              });
            });
        }
      })
      .catch(error => {
        res
          .status(500)
          .send({ message: 'error retrieving post from the database' });
      });
  }
});

// get comments by post id
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
