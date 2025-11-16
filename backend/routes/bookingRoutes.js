const express = require('express');
const bookingController = require('../controllers/bookingController');
const { auth, adminOnly } = require('../middleware/authMiddleware');
const router = express.Router();

// ----- User Routes -----
router.get('/my', auth, bookingController.getUserBookings);
router.post('/', auth, bookingController.createBooking);
router.put('/:id', auth, bookingController.updateBooking);
router.delete('/:id', auth, bookingController.deleteBooking);

// ----- Admin Routes -----
router.get('/all', auth, adminOnly, bookingController.getAllBookings); // you need to implement this in controller

module.exports = router;
