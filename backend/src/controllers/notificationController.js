import prisma from '../config/db.js';

export const getNotifications = async (req, res) => {
  try {
    const notifications = await prisma.notification.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' }
    });
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
    const notification = await prisma.notification.findUnique({
      where: { id }
    });

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    if (notification.userId !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const updatedNotification = await prisma.notification.update({
      where: { id },
      data: { isRead: true }
    });

    return res.json({
      message: 'Notification marked as read',
      notification: updatedNotification
    });
  } catch (error) {
    console.error('[Mark Notification Read Error]', error);
    return res.status(500).json({ message: 'Server error updating notification status' });
  }
};
