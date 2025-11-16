const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Page route for user dashboard
router.get('/dashboard', async (req, res) => {
  res.render('userDashboard'); // title etc can be added
});

// Page route for admin dashboard
router.get('/admin/dashboard', async (req, res) => {
  res.render('adminDashboard');
});

module.exports = router;