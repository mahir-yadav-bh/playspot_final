document.addEventListener('DOMContentLoaded', () => {
  const bookForm = document.getElementById('bookForm');

  // ---- BOOKING FORM ONLY ----
  if (bookForm) {
    bookForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const formData = new FormData(bookForm);
      const data = Object.fromEntries(formData);

      data.venueId = document.getElementById("venueId").value;

      const selectedDate = document.getElementById("bookingDate").value;
      data.date = new Date(selectedDate + "T00:00:00Z").toISOString();

      const token = localStorage.getItem('token');
      if (!token) {
        window.showMessage('Please log in first', 'error');
        return;
      }

      try {
        const response = await fetch('/api/bookings', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        });

        const result = await response.json();

        if (response.ok) {
          window.showMessage('Booking successful!', 'success');
          setTimeout(() => window.location.href = '/confirmation', 1500);
        } else {
          window.showMessage(result.error || 'Booking failed', 'error');
        }

      } catch (err) {
        window.showMessage('Network error', 'error');
      }
    });
  }
});
