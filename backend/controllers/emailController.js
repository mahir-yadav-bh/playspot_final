const { sendEmail } = require('../utils/emailService');

// For frontend manual email trigger
exports.sendBookingEmail = async (req, res) => {
  try {
    const { email, venue, slot, date } = req.body;

    await sendEmail(
      email,
      "Booking Confirmation - PlaySpot",
      `Your booking for ${venue} on ${date} at ${slot} is confirmed!`
    );

    res.json({ message: "Email sent successfully" });
  } catch (err) {
    console.error("Email error:", err);
    res.status(500).json({ error: "Failed to send email" });
  }
};
