# PlaySpot

A sports booking web app built with HTML, CSS, JavaScript, Node.js, Express.js, and MongoDB. This application allows users to browse, book, and manage sports venues for activities like soccer, basketball, and more.

## Features

- **User Authentication**: Signup, login, and logout with JWT tokens.
- **Venue Management**: Browse venues with filters, view details, and book slots.
- **Booking System**: Real-time slot availability, booking confirmations, and email notifications.
- **Admin Panel**: Add, update, and delete venues (for admin users).
- **Google Maps Integration**: View venue locations on an interactive map.
- **Dark Mode**: Toggle between light and dark themes.
- **Responsive Design**: Works on desktop and mobile devices.

## Tech Stack

- **Frontend**: HTML, CSS, JavaScript (Vanilla JS), Handlebars for templating.
- **Backend**: Node.js, Express.js.
- **Database**: MongoDB (with Mongoose ODM).
- **Other**: JWT for authentication, Nodemailer for emails, Axios for API calls, Google Maps API.

## Installation and Setup

1. **Prerequisites**:
   - Install Node.js (v14+) from https://nodejs.org/.
   - Install MongoDB (local or use MongoDB Atlas for cloud).
   - Get a Google Maps API key from https://console.cloud.google.com/.

2. **Clone or Download the Project**:
   - Create a folder named `PlaySpot` and add all project files as per the structure.

3. **Install Dependencies**:
   - Open a terminal in the `PlaySpot` folder.
   - Run `npm install` to install all packages listed in `package.json`.

4. **Environment Configuration**:
   - Create a `.env` file in the root folder with the following:
     ```
     MONGO_URI=mongodb://localhost:27017/playspot  # Or your Atlas URI
     JWT_SECRET=your_secret_key_here
     GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
     EMAIL_USER=your_email@gmail.com
     EMAIL_PASS=your_email_password
     ```
   - Replace placeholders with your actual values.

5. **Run the Application**:
   - Ensure MongoDB is running (start MongoDB service or connect to Atlas).
   - Run `npm start` (or `node backend/server.js`).
   - Open http://localhost:5000 in your browser.

6. **Test the App**:
   - Sign up and log in.
   - Browse venues, view details, and book slots.
   - Check the dashboard for bookings.
   - Toggle dark mode and test maps.

## Project Structure
PlaySpot/ ├── backend/ │ ├── server.js │ ├── config/db.js │ ├── models/ │ ├── routes/ │ ├── controllers/ │ ├── utils/ │ └── middleware/ ├── views/ │ ├── layouts/main.hbs │ ├── partials/ │ └── .hbs (pages) ├── public/ │ ├── css/styles.css │ └── js/.js ├── .env ├── package.json ├── package-lock.json └── README.md

## API Endpoints

- **Auth**: `POST /api/auth/signup`, `POST /api/auth/login`
- **Venues**: `GET /api/venues`, `GET /api/venues/:id`, `POST /api/venues` (admin), etc.
- **Bookings**: `GET /api/bookings/my`, `POST /api/bookings`, etc.
- **Email**: `POST /api/email/booking`

Use tools like Postman to test APIs.

## Evaluation Criteria Compliance

- **HTML/CSS**: Responsive design with dark mode.
- **JavaScript**: JSON data fetching on browse/venue pages, OOP on venue page.
- **NodeJS/ExpressJS**: Full backend with routes and controllers.
- **Handlebars**: Used for common sections (header/footer).
- **MongoDB CRUD**: Complete operations for users, venues, and bookings.

## Contributing

- Fork the repo, make changes, and submit a pull request.
- Ensure code follows best practices and includes tests.

## License

This project is licensed under the MIT License.

## Contact

For questions, email support@playspot.com or create an issue on GitHub.