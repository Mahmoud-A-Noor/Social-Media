const notificationController = require('../controllers/notificationController');

const express = require('express');
const router = express.Router();



router.get('/', notificationController.getNotifications);
router.put('/mark-read', notificationController.markAllAsRead);
router.put('/:notificationId/mark-read', notificationController.markAsRead);
router.delete('/clear', notificationController.clearNotifications);
router.get('/unread-count', notificationController.getUnreadCount);

module.exports = router;