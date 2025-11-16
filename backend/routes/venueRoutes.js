const express = require('express');
const venueController = require('../controllers/venueController');
const { auth, adminOnly } = require('../middleware/authMiddleware');
const router = express.Router();

// GET /api/venues - Get all venues (public)
router.get('/', venueController.getVenues);

// GET /api/venues/:id - Get venue by ID (public)
router.get('/:id', venueController.getVenueById);

// POST /api/venues - Create venue (admin only)
router.post('/', auth, adminOnly, venueController.createVenue);

// PUT /api/venues/:id - Update venue (admin only)
router.put('/:id', auth, adminOnly, venueController.updateVenue);

// DELETE /api/venues/:id - Delete venue (admin only)
router.delete('/:id', auth, adminOnly, venueController.deleteVenue);



module.exports = router;