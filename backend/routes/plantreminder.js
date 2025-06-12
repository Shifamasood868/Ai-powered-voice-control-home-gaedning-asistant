import express from 'express';
import Plant from '../schema/Plantreminder.js';
import multer from "multer"
import path from 'path';
import fs from 'fs';
import { sendEmailNotification } from '../services/emailService.js';

const router = express.Router();
const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
      cb(null, true);
    } else {
      cb(new Error('Only JPEG/PNG images allowed'), false);
    }
  }
});

// Get all plants
router.get('/', async (req, res) => {
  try {
    const plants = await Plant.find().sort({ nextWatering: 1 });
    res.json({ success: true, data: plants });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
});

// Create new plant
router.post('/', upload.single('image'), async (req, res) => {
  try {
    let imageUrl = req.file 
      ? `/uploads/${req.file.filename}` 
      : req.body.imageUrl || '';

    if (!imageUrl) {
      return res.status(400).json({ success: false, error: 'Image required' });
    }

    const wateringFrequency = parseInt(req.body.wateringFrequency) || 7;
    const nextWatering = new Date();
    nextWatering.setDate(nextWatering.getDate() + wateringFrequency);

    const plant = await Plant.create({
      name: req.body.name,
      location: req.body.location,
      imageUrl,
      nextWatering,
      lastWatered: new Date(),
      careSchedule: {
        watering: `Every ${wateringFrequency} days`,
        fertilizing: "Monthly",
        pruning: "As needed"
      },
      notifications: req.body.notifications !== 'false',
      userEmail: req.body.userEmail // Add user email to plant
    });

    // Send welcome email if notifications are enabled
    if (plant.notifications && plant.userEmail) {
      await sendEmailNotification(
        plant.userEmail,
        `Welcome to Plant Care for ${plant.name}`,
        `You've successfully added ${plant.name} to your plant care tracker. 
        Your next watering is scheduled for ${plant.nextWatering.toDateString()}.`
      );
    }

    res.status(201).json({ success: true, data: plant });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});
router.put('/:id/water', async (req, res) => {
  try {
    const plant = await Plant.findById(req.params.id);
    if (!plant) {
      return res.status(404).json({ success: false, error: 'Plant not found' });
    }

    // Calculate new watering date
    const wateringMatch = plant.careSchedule.watering.match(/\d+/);
    const frequency = wateringMatch ? parseInt(wateringMatch[0]) : 7;
    
    const nextWatering = new Date();
    nextWatering.setDate(nextWatering.getDate() + frequency);

    // Update plant
    plant.lastWatered = new Date();
    plant.nextWatering = nextWatering;
    await plant.save();

    // Send confirmation email if notifications enabled
    if (plant.notifications && plant.userEmail) {
      await sendEmailNotification(
        plant.userEmail,
        `Watering Confirmation for ${plant.name}`,
        `You've successfully watered ${plant.name}. 
        Next watering is scheduled for ${plant.nextWatering.toDateString()}.`
      );
    }

    res.json({ success: true, data: plant });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
});

// Delete a plant
router.delete('/:id', async (req, res) => {
  try {
    const plant = await Plant.findByIdAndDelete(req.params.id);
    if (!plant) {
      return res.status(404).json({ success: false, error: 'Plant not found' });
    }

    // Delete image if it was an upload
    if (plant.imageUrl.startsWith('/uploads/')) {
      const imagePath = path.join(__dirname, '..', plant.imageUrl);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    res.json({ success: true, data: {} });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
});
export default router;