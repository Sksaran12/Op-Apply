import Notification from '../models/Notification.js';

export const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.user._id })
      .sort({ createdAt: -1 });
    return res.json(notifications);
  } catch (error) {
    console.error('[Get Notifications Error]', error);
    return res.status(500).json({ message: 'Server error retrieving notifications' });
  }
};

export const markAsRead = async (req, res) => {
  const { id } = req.params;

  try {
    // Confirm ownership
    const notification = await Notification.findById(id);

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    if (notification.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    notification.isRead = true;
    await notification.save();

    return res.json({
      message: 'Notification marked as read',
      notification
    });
  } catch (error) {
    console.error('[Mark Notification Read Error]', error);
    return res.status(500).json({ message: 'Server error updating notification status' });
  }
};
