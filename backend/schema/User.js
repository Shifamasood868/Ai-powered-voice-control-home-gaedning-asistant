import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    select: false
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'inactive'
  },
  lastActive: Date,
  lastLogin: Date,
  lastLogout: Date,
  avatar: String,
  phone: String,
  location: String,
  joinDate: {
    type: Date,
    default: Date.now
  },
  connections: {  // Track multiple connections
    type: Number,
    default: 0
  }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Add index for frequently queried fields
userSchema.index({ status: 1 });
userSchema.index({ lastActive: 1 });

// Add method to update status safely
userSchema.methods.updateStatus = async function(newStatus) {
  this.status = newStatus;
  if (newStatus === 'active') {
    this.lastActive = new Date();
    this.lastLogin = new Date();
  } else {
    this.lastLogout = new Date();
  }
  return this.save();
};

const User = mongoose.model('User', userSchema);

export default User;