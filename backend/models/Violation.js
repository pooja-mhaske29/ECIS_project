const mongoose = require('mongoose');

const violationSchema = new mongoose.Schema({
  // Basic violation information
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  
  // AI Detection Results
  crimeType: {
    type: String,
    required: true,
    enum: ['theft', 'assault', 'vandalism', 'fraud', 'traffic', 'other']
  },
  riskScore: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  confidence: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  
  // Location data with GeoJSON (for map visualization)
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true,
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true,
      index: '2dsphere' // Creates geospatial index
    },
    address: {
      type: String,
      required: true
    }
  },
  
  // Evidence references
  evidence: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Evidence'
  }],
  
  // Status and metadata
  status: {
    type: String,
    enum: ['detected', 'investigating', 'resolved', 'false_alarm'],
    default: 'detected'
  },
  
  // Timestamps
  detectedAt: {
    type: Date,
    default: Date.now,
    required: true
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  
  // Who detected/reported it
  detectedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  
  // Additional metadata
  source: {
    type: String,
    enum: ['ai_detection', 'manual_report', 'integration'],
    default: 'ai_detection'
  },
  
  // For satellite/street view images
  imageUrl: String,
  thumbnailUrl: String
}, {
  timestamps: true // Automatically adds createdAt and updatedAt
});

// Create geospatial index for location queries
violationSchema.index({ location: '2dsphere' });

// Add indexes for common queries
violationSchema.index({ crimeType: 1, detectedAt: -1 });
violationSchema.index({ riskScore: 1 });
violationSchema.index({ status: 1 });

// Method to get risk level as string
violationSchema.methods.getRiskLevel = function() {
  if (this.riskScore >= 70) return 'High';
  if (this.riskScore >= 40) return 'Medium';
  return 'Low';
};

// Static method to find violations near coordinates
violationSchema.statics.findNearby = function(longitude, latitude, maxDistance = 5000) {
  return this.find({
    location: {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: [longitude, latitude]
        },
        $maxDistance: maxDistance // in meters
      }
    }
  });
};

module.exports = mongoose.model('Violation', violationSchema);