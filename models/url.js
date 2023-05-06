const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema

const urlSchema = new mongoose.Schema(
    {
        urlCode: String,
        originalUrl: String,
        shortUrl: String,
        date: { 
            type: String,
            default: Date.now
        },
        user: {
            type: ObjectId,
            ref: 'User'
        },
        analytics: [{
            type: Object,
        }],
        qr:String
        
    }
)

module.exports = mongoose.model('URL', urlSchema)
