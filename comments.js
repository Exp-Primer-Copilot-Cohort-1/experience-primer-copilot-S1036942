// Create web server

// Import modules
const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

// Import data
const dataPath = path.join(__dirname, '../data/comments.json');
const comments = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

// GET /comments
router.get('/', (req, res) => {
  res.status(200).json(comments);
});

// POST /comments
router.post('/', (req, res) => {
  const { body } = req;
  const newComment = {
    id: uuidv4(),
    ...body,
  };
  comments.push(newComment);
  fs.writeFile(dataPath, JSON.stringify(comments), (err) => {
    if (err) {
      console.log(err);
      res.status(500).send('Error adding comment');
    } else {
      res.status(200).send('Comment added');
    }
  });
});

// PUT /comments/:id
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { body } = req;
  const comment = comments.find((comment) => comment.id === id);
  if (comment) {
    const index = comments.indexOf(comment);
    const keys = Object.keys(body);
    keys.forEach((key) => (comments[index][key] = body[key]));
    fs.writeFile(dataPath, JSON.stringify(comments), (err) => {
      if (err) {
        console.log(err);
        res.status(500).send('Error updating comment');
      } else {
        res.status(200).send('Comment updated');
      }
    });
  } else {
    res.status(404).send('Comment not found');
  }
});

// DELETE /comments/:id
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const comment = comments.find((comment) => comment.id === id);
  if (comment) {
    const index = comments.indexOf(comment);
    comments.splice(index, 1);
    fs.writeFile(dataPath, JSON.stringify(comments), (err) => {
      if (err) {
        console.log(err);
        res.status(500).send('Error deleting comment');
      } else {
        res.status(200).send('Comment deleted');
      } 
    }   
    );  
    }
    else {
      res.status(404).send('Comment not found');
    }           
}
);
