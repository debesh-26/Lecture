const mongoose = require("mongoose")

const videoSchema = new mongoose.Schema({
    title: { type: String },
    duration: { type: Number },
    uploadedAt: { type: Date, default: Date.now },
    videoFilePath: { type: String, required: true }, 
    uploader: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true } 
})

module.exports = mongoose.model("Video", videoSchema);
