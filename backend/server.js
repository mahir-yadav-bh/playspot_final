const express = require('express');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const dashboardRoutes = require('./routes/dashboardRoutes');
const { auth, adminOnly } = require('./middleware/authMiddleware');


dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Set up Handlebars
app.engine('hbs', exphbs.engine({
  extname: 'hbs',
  defaultLayout: 'main',
  layoutsDir: 'views/layouts',
  partialsDir: 'views/partials'
}));
app.set('view engine', 'hbs');
app.set('views', 'views');

// Connect to MongoDB
connectDB();

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/venues', require('./routes/venueRoutes'));
app.use('/api/bookings', require('./routes/bookingRoutes'));
app.use('/api/email', require('./routes/emailRoutes'));
app.use('/', dashboardRoutes);
app.use('/api/users', require('./routes/userRoutes'));

// Render pages
app.get('/', (req, res) => res.render('index', { title: 'Home' }));
app.get('/about', (req, res) => res.render('about', { title: 'About' }));
app.get('/contact', (req, res) => res.render('contact', { title: 'Contact' }));
app.get('/login', (req, res) => res.render('login', { title: 'Login' }));
app.get('/signup', (req, res) => res.render('signup', { title: 'Signup' }));
app.get('/browse', async (req, res) => {
  try {
    const Venue = require('./models/Venue');
    const venues = await Venue.find().lean();
    res.render('browse', { title: 'Browse Venues', venues });
  } catch (err) {
    res.status(500).render('error', { message: 'Error loading venues' });
  }
});
app.get('/venue/:id', async (req, res) => {
  try {
    const Venue = require('./models/Venue');
    const venue = await Venue.findById(req.params.id).lean();
    if (!venue) return res.status(404).render('error', { message: 'Venue not found' });
    const today = new Date().toISOString().split('T')[0]; // current date in yyyy-mm-dd
    res.render('venue', { title: 'Venue Details', venue, today });
  } catch (err) {
    res.status(500).render('error', { message: 'Error loading venue' });
  }
});
app.get('/confirmation', (req, res) => res.render('confirmation', { title: 'Confirmation' }));
// ADMIN PAGES
app.get('/add-venue', (req, res) => res.render('add-venue', { title: 'Add Venue' }));
app.get('/manageVenues', (req, res) => res.render('manageVenues', { title: 'Manage Venues' }));
app.get('/adminBookings', (req, res) => res.render('adminBookings', { title: 'All Bookings' }));


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

