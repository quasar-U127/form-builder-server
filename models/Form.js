const mongoose = require('mongoose')

const FormSchema = new mongoose.Schema({
    formType: {
        type: String,
        required: true,
    },
    formData: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
})

module.exports = mongoose.model('Form', FormSchema)