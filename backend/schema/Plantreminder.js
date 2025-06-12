// models/Plant.js
import mongoose from 'mongoose';

const plantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  imageUrl: { type: String, required: true },
  nextWatering: { type: Date, required: true },
  lastWatered: { type: Date, required: true },
  careSchedule: {
    watering: String,
    fertilizing: String,
    pruning: String
  },
  notifications: { type: Boolean, default: false },
  userEmail: { type: String, validate: {
    validator: function(v) {
      return !this.notifications || /.+@.+\..+/.test(v);
    },
    message: 'Email is required when notifications are enabled'
  }},
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Plantreminder', plantSchema);