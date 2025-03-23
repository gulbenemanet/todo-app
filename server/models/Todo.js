const mongoose = require('mongoose');
const schema = mongoose.Schema;

const TodoSchema = new schema({
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    recommendation: {
        type: String,
        default: ""
    },
    status: {
        type: String,
        enum: ["in progress", "completed"],
        default: "in progress"
    },
    user_id: {
        type: String,
        required: true
    },
    file: {
        type: String,
        default: ""
    }
})

const Todo = mongoose.model('Todo', TodoSchema)

module.exports = Todo;