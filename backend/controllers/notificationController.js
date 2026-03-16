const asyncHandler = require('express-async-handler');
const Notification = require('../models/Notification');

// @desc    Get notifications for the logged-in user
// @route   GET /api/notifications
// @access  Private
const getMyNotifications = asyncHandler(async (req, res) => {
    const notifications = await Notification.find({ recipient: req.user._id })
                                            .populate('sender', 'name')
                                            .populate('donation', 'description')
                                            .sort({ createdAt: -1 });

    res.json(notifications);
});

// @desc    Mark a notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
const markAsRead = asyncHandler(async (req, res) => {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
        res.status(404);
        throw new Error('Notification not found');
    }

    // Ensure the user is the recipient of the notification
    if (notification.recipient.toString() !== req.user._id.toString()) {
        res.status(401);
        throw new Error('Not authorized to update this notification');
    }

    notification.isRead = true;
    await notification.save();

    res.json(notification);
});

// @desc    Get unread notification count for the logged-in user
// @route   GET /api/notifications/unread-count
// @access  Private
const getUnreadCount = asyncHandler(async (req, res) => {
    const count = await Notification.countDocuments({ recipient: req.user._id, isRead: false });
    res.json({ count });
});


module.exports = {
    getMyNotifications,
    markAsRead,
    getUnreadCount,
};
