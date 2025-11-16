const Booking = require('../models/Booking');
const Venue = require('../models/Venue');
const User = require('../models/User');
const { sendEmail } = require('../utils/emailService'); // ✅ Added

// Get bookings of logged-in user
exports.getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id }).populate('venue');
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Create a new booking (WITH proper duplicate prevention + email)
exports.createBooking = async (req, res) => {
  try {
    const { venueId, slot, date } = req.body;

    if (!venueId || !slot || !date) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const venue = await Venue.findById(venueId);
    if (!venue) return res.status(404).json({ error: "Venue not found" });

    // Normalize date to start of day (so comparisons match)
    const selectedDate = new Date(date);
    const startOfDay = new Date(selectedDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000);

    // Check if slot already booked for this date
    const existingBooking = await Booking.findOne({
      venue: venueId,
      slot,
      date: { $gte: startOfDay, $lt: endOfDay }
    });

    if (existingBooking) {
      return res.status(400).json({ error: "Slot already booked on this date" });
    }

    const booking = new Booking({
      user: req.user.id,
      venue: venueId,
      slot,
      date: startOfDay
    });

    await booking.save();

    // send confirmation email
    const user = await User.findById(req.user.id);
    await sendEmail(
      user.email,
      "Booking Confirmation - PlaySpot",
      `Your booking for ${venue.name} on ${startOfDay.toDateString()} at ${slot} is confirmed!`
    ); 
    
    res.json(booking);
  } catch (err) {
    console.error("BOOKING ERROR:", err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.updateBooking = async (req, res) => {
  try {
    const { slot, date } = req.body;
    const booking = await Booking.findById(req.params.id).populate("venue");

    if (!booking) return res.status(404).json({ error: "Booking not found" });

    const venue = booking.venue;
    if (!venue) return res.status(404).json({ error: "Venue not found" });

    // Normalize date range
    const selectedDate = new Date(date);
    const startOfDay = new Date(selectedDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000);

    // Check if slot exists in venue
    const slotExists = venue.slots.some(s => s.time === slot);
    if (!slotExists) {
      return res.status(400).json({ error: "Slot does not exist for this venue" });
    }

    // Check if new slot is already booked (excluding itself)
    const duplicate = await Booking.findOne({
      venue: venue._id,
      slot,
      date: { $gte: startOfDay, $lt: endOfDay },
      _id: { $ne: booking._id }
    });

    if (duplicate) {
      return res.status(400).json({ error: "Slot already booked on this date" });
    }

    booking.slot = slot;
    booking.date = startOfDay;
    await booking.save();

    res.json({ message: "Booking updated successfully", booking });

  } catch (err) {
    console.error("UPDATE ERROR:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Delete/cancel a booking
exports.deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);
    if (!booking) return res.status(404).json({ error: 'Booking not found' });

    // free up slot
    const venue = await Venue.findById(booking.venue);
    if (venue) {
      const slotIndex = venue.slots.findIndex(s => s.time === booking.slot);
      if (slotIndex !== -1) {
        venue.slots[slotIndex].available = true;
        await venue.save();
      }
    }

    res.json({ message: 'Booking cancelled' });

  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Get all bookings (admin only)
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().populate('venue').populate('user');
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};
