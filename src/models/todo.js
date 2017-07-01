const mongoose = require('mongoose');

import Todo from '../models/todo';

const todoSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'This is required']
  }
});

export default mongoose.model('Todo', todoSchema);
