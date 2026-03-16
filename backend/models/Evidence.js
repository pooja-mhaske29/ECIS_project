const mongoose = require('mongoose');

const evidenceSchema = new mongoose.Schema({
  // Reference to violation
  violationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Violation',
    required: true
  },
  
  // File information
  fileName: {
    type: String,
    required: true
  },
  fileType: {
    type: String,
    enum: ['image', 'video', 'document', 'audio'],
    required: true
  },
  mimeType: String,
  fileSize: Number,
  
  // Storage information (for AWS S3)
  s3Key: String, // Path in S3 bucket
  s3Bucket: String,
  s3Url: {
    type: String,
    required: true
  },
  
  // Evidence metadata
  description: String,
  capturedAt: {
    type: Date,
    default: Date.now
  },
  uploadedAt: {
    type: Date,
    default: Date.now
  },
  
  // Who uploaded
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  
  // For AI-processed evidence
  aiProcessed: {
    type: Boolean,
    default: false
  },
  aiResults: {
    detectionConfidence: Number,
    processedAt: Date
  },
  
  // Thumbnail for images
  thumbnailUrl: String,
  
  // Evidence status
  isDeleted: {
    type: Boolean,
    default: false
  }
});

// Add indexes
evidenceSchema.index({ violationId: 1 });
evidenceSchema.index({ uploadedAt: -1 });
evidenceSchema.index({ fileType: 1 });

module.exports = mongoose.model('Evidence', evidenceSchema);