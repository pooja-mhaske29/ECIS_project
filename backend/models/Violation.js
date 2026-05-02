const mongoose = require('mongoose');

const violationSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please provide a description']
  },
  crimeType: {
    type: String,
    required: [true, 'Please provide crime type'],
    enum: [
      'illegal_logging',
      'illegal_mining',
      'water_pollution',
      'land_degradation',
      'ecosystem_damage',
      'none',
      'theft',
      'assault',
      'vandalism',
      'fraud',
      'traffic',
      'other'
    ]
  },
  riskScore: {
    type: Number,
    required: [true, 'Please provide risk score'],
    min: 0,
    max: 100
  },
  confidence: {
    type: Number,
    required: [true, 'Please provide confidence score'],
    min: 0,
    max: 100
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      required: [true, 'Please provide coordinates'],
      validate: {
        validator: function(v) {
          return v.length === 2 && 
                 v[0] >= -180 && v[0] <= 180 && 
                 v[1] >= -90 && v[1] <= 90;
        },
        message: 'Invalid coordinates'
      }
    },
    address: {
      type: String,
      required: [true, 'Please provide address']
    }
  },
  status: {
    type: String,
    enum: ['detected', 'investigating', 'resolved', 'false_alarm'],
    default: 'detected'
  },
  detectedAt: {
    type: Date,
    default: Date.now
  },
  detectedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  source: {
    type: String,
    enum: ['ai_detection', 'satellite_analysis', 'manual_report', 'integration'],
    default: 'ai_detection'
  },
  // AI Service specific fields
  spectralIndices: {
    ndvi: Number,  // Normalized Difference Vegetation Index
    ndwi: Number,  // Normalized Difference Water Index
    ndbi: Number   // Normalized Difference Built-up Index
  },
  affectedAreaHectares: {
    type: Number,
    default: 0
  },
  requiredAction: {
    type: String,
    default: ''
  },
  aiReportId: {
    type: String,
    default: null
  },
  satelliteAnalysis: {
    processingTimeMs: Number,
    imageFilename: String,
    spectralIndices: {
      ndvi: Number,
      ndwi: Number,
      ndbi: Number
    }
  }
}, {
  timestamps: true
});

// Create geospatial index
violationSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Violation', violationSchema);