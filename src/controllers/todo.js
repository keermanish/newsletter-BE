import express from 'express';

import Todo from '../models/todo';

/* controller to creat todo */
export const createTodo = (req, res) => {
  const todo = new Todo({
    name: req.body.name
  });

  todo.save()
    .then(todo => {
      res.status(200).send(todo);
    })
    .catch(err => {
      res.send(err);
    });
};

export const name = 'manish';
