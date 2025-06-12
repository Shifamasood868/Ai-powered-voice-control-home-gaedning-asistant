import express from 'express';
import Contact from '../schema/contactSchema.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    const newContact = new Contact({
      name,
      email,
      subject,
      message
    });

    await newContact.save();

    console.log('Contact submission saved:', { name, email, subject, message });

    res.status(200).json({ success: true, message: 'Message received!' });
  } catch (error) {
    console.error('Error saving contact:', error);
    res.status(400).json({ success: false, error: error.message });
  }
});
router.get('/contactcount', async (req, res) => {
  try {
    const count = await Contact.countDocuments();
    res.json({ count });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});
router.get("/contactget", async (req, res) => {
  try {
    const contect = await Contact.find();
    res.status(200).json(contect);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
export default router;
