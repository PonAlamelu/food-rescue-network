const mongoose = require('mongoose');
const Notification = require('../models/Notification');
const User = require('../models/User');
const sendSMS = require('./smsService');
const sendEmail = require('./emailService');

const createAndSendNotification = async (req, { recipient, senderId, donationId, message, smsMessage, emailSubject, emailHtml, emailText }) => {
    let recipientUser = recipient;

    // If recipient is just an ID, fetch the user object to get phone and email
    if (typeof recipient === 'string' || recipient instanceof mongoose.Types.ObjectId) {
        recipientUser = await User.findById(recipient);
    }

    if (!recipientUser) {
        console.error('Recipient not found for notification.');
        return;
    }

    // 1. Create notification in database
    const notification = await Notification.create({
        recipient: recipientUser._id,
        sender: senderId,
        donation: donationId,
        message: message,
    });

    // 2. Send real-time notification via Socket.io
    const io = req.app.get('socketio');
    if (io) {
        io.to(recipientUser._id.toString()).emit('notification', {
            _id: notification._id,
            message,
            createdAt: notification.createdAt,
            isRead: false
        });
    }

    // 3. Send SMS if possible
    if (recipientUser.phone && smsMessage) {
        await sendSMS(recipientUser.phone, smsMessage);
    }

    // 4. Send Email if possible
    if (recipientUser.email && (emailSubject || emailHtml || emailText)) {
        await sendEmail(recipientUser.email, emailSubject, emailText, emailHtml);
    }
};

module.exports = createAndSendNotification;
