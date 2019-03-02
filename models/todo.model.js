const mongoose = require('mongoose');

const TodoSchema = new mongoose.Schema({
    title: {type: String, required: [true, 'Title must not be empty']},
    description: {type: String, required: true},
    completed: {type: Boolean, required: true}
}, {timestamps: true});


const Todo = mongoose.model('Todo', TodoSchema);
module.exports = Todo;