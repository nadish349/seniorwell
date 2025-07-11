import express from 'express';
import authVolunteer from '../middlewares/authVolunteer.js';
import { 
  getVolunteerNotifications, 
  markNotificationAsRead, 
  markAllNotificationsAsRead, 
  getUnreadCount 
} from '../controllers/notificationController.js';

const notificationRouter = express.Router();

// Get volunteer notifications
notificationRouter.get('/volunteer', authVolunteer, getVolunteerNotifications);

// Mark notification as read
notificationRouter.put('/read/:notificationId', authVolunteer, markNotificationAsRead);

// Mark all notifications as read
notificationRouter.put('/read-all', authVolunteer, markAllNotificationsAsRead);

// Get unread notification count
notificationRouter.get('/unread-count', authVolunteer, getUnreadCount);

export default notificationRouter; 