import mongoose from 'mongoose';

const plantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  scientificName: String,
  description: String,
  careInstructions: {
    watering: String,
    sunlight: String,
    soil: String,
    temperature: String
  },
  plantingTips: [String],
  commonProblems: [String],
  seasonalCare: {
    spring: String,
    summer: String,
    fall: String,
    winter: String
  }
}, {
  timestamps: true
});

export default mongoose.model('Plant', plantSchema);