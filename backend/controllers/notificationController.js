import NotificationModel from '../models/NotificationModel.js';
import volunteerModel from '../models/volunteerModel.js';

// Create notification for all available volunteers
const notifyVolunteers = async (notificationData) => {
  try {
    // Get all available volunteers
    const availableVolunteers = await volunteerModel.find({ available: true }).select('_id');
    
    if (availableVolunteers.length === 0) {
      console.log('No available volunteers to notify');
      return;
    }

    // Create notifications for all available volunteers
    const notifications = availableVolunteers.map(volunteer => ({
      recipient: volunteer._id,
      ...notificationData
    }));

    await NotificationModel.insertMany(notifications);
    console.log(`✅ Notifications sent to ${availableVolunteers.length} volunteers`);
  } catch (error) {
    console.error('❌ Error creating notifications:', error);
  }
};

// Get notifications for a volunteer
const getVolunteerNotifications = async (req, res) => {
  try {
    const volunteerId = req.volunteer._id;
    
    const notifications = await NotificationModel.find({ recipient: volunteerId })
      .sort({ createdAt: -1 })
      .limit(50); // Limit to last 50 notifications

    res.status(200).json({
      success: true,
      notifications,
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

// Mark notification as read
const markNotificationAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const volunteerId = req.volunteer._id;

    const notification = await NotificationModel.findOneAndUpdate(
      { _id: notificationId, recipient: volunteerId },
      { read: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Notification marked as read',
      notification,
    });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

// Mark all notifications as read
const markAllNotificationsAsRead = async (req, res) => {
  try {
    const volunteerId = req.volunteer._id;

    await NotificationModel.updateMany(
      { recipient: volunteerId, read: false },
      { read: true }
    );

    res.status(200).json({
      success: true,
      message: 'All notifications marked as read',
    });
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

// Get unread notification count
const getUnreadCount = async (req, res) => {
  try {
    const volunteerId = req.volunteer._id;

    const count = await NotificationModel.countDocuments({
      recipient: volunteerId,
      read: false,
    });

    res.status(200).json({
      success: true,
      count,
    });
  } catch (error) {
    console.error('Error getting unread count:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

export {
  notifyVolunteers,
  getVolunteerNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  getUnreadCount,
}; 