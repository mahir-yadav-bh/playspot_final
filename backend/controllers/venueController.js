const Venue = require('../models/Venue');

exports.getVenues = async (req, res) => {
  try {
    const { sport, location } = req.query;
    const query = {};
    if (sport) query.sport = sport;
    if (location) query.location = location;

    const venues = await Venue.find(query);
    res.json(venues);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getVenueById = async (req, res) => {
  try {
    const venue = await Venue.findById(req.params.id);
    if (!venue) return res.status(404).json({ error: 'Venue not found' });
    res.json(venue);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.createVenue = async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Access denied' });
    const venue = new Venue(req.body);
    await venue.save();
    res.json(venue);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.updateVenue = async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Access denied' });
    const venue = await Venue.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!venue) return res.status(404).json({ error: 'Venue not found' });
    res.json(venue);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.deleteVenue = async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Access denied' });
    const venue = await Venue.findByIdAndDelete(req.params.id);
    if (!venue) return res.status(404).json({ error: 'Venue not found' });
    res.json({ message: 'Venue deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};