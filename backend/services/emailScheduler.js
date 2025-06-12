// services/emailScheduler.js
import Plant from '../schema/Plantreminder.js';
import { sendEmailNotification } from './emailService.js';
import schedule from 'node-schedule';

export const scheduleEmailNotifications = () => {
  // Run every day at 9am
  const job = schedule.scheduleJob('0 9 * * *', async () => {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      // Find plants due today or overdue
      const plantsToNotify = await Plant.find({
        notifications: true,
        userEmail: { $exists: true, $ne: '' },
        $or: [
          { nextWatering: { $lte: tomorrow } },
          { nextWatering: { $lte: new Date() } }
        ]
      });

      for (const plant of plantsToNotify) {
        const daysUntil = Math.ceil((plant.nextWatering - new Date()) / (1000 * 60 * 60 * 24));
        let subject, text;

        if (daysUntil < 0) {
          subject = `URGENT: ${plant.name} needs water!`;
          text = `Your ${plant.name} is ${Math.abs(daysUntil)} days overdue for watering!`;
        } else if (daysUntil === 0) {
          subject = `Reminder: Water your ${plant.name} today`;
          text = `Today is the day to water your ${plant.name}!`;
        } else {
          subject = `Upcoming: ${plant.name} needs water soon`;
          text = `Your ${plant.name} will need water in ${daysUntil} days (${plant.nextWatering.toDateString()})`;
        }

        await sendEmailNotification(plant.userEmail, subject, text);
      }
    } catch (error) {
      console.error('Error in email scheduler:', error);
    }
  });

  console.log('Email scheduler started');
};