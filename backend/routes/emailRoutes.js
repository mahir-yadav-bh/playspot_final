const express = require('express');
const emailController = require('../controllers/emailController');
const router = express.Router();

router.post('/booking', emailController.sendBookingEmail);

module.exports = router;
