const notificationController = require('../controllers/NotificationController');

const express = require('express');
const router = express.Router();



router.get('/', notificationController.getNotifications);
router.put('/mark-read', notificationController.markNotificationsAsRead);
router.delete('/clear', notificationController.clearNotifications);

module.exports = router;