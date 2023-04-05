const mongoose = require('mongoose')

const TemplateSchema = new mongoose.Schema({
    templateId: {
        type: String,
        required: true,
    },
    templateFields: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
})

module.exports = mongoose.model('Template', TemplateSchema)