document.addEventListener('DOMContentLoaded', loadAllBookings);

async function loadAllBookings() {
  const token = localStorage.getItem('token');
  const container = document.getElementById('allBookings');

  try {
    const res = await fetch('/api/bookings/all', {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!res.ok) {
      const err = await res.json();
      container.innerHTML = `<p>${err.error || 'Not authorized'}</p>`;
      return;
    }

    const bookings = await res.json();

    if (!bookings.length) {
      container.innerHTML = '<p>No bookings found.</p>';
      return;
    }

    container.innerHTML = bookings.map(b => `
      <div class="card booking-card">
        <h3>${b.venue?.name || '—'}</h3>

        <p><strong>User:</strong> ${b.user?.name || '—'} (${b.user?.email || '—'})</p>
        <p><strong>Date:</strong> ${new Date(b.date).toLocaleDateString()}</p>
        <p><strong>Slot:</strong> ${b.slot}</p>
        <p><strong>Status:</strong> ${b.status}</p>

        <button class="btn-cancel-admin"
            onclick="adminCancelBooking('${b._id}')">
            Cancel Booking
        </button>
      </div>
    `).join('');

  } catch (err) {
    console.error('loadAllBookings error:', err);
    container.innerHTML = '<p>Error loading bookings</p>';
  }
}

// ⭐ Admin Cancel Booking Function
async function adminCancelBooking(id) {
  if (!confirm("Are you sure you want to cancel this booking?")) return;

  const token = localStorage.getItem('token');

  try {
    const res = await fetch(`/api/bookings/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });

    const result = await res.json();

    if (res.ok) {
      alert('Booking cancelled successfully');
      loadAllBookings(); // reload list
    } else {
      alert(result.error || 'Cancellation failed');
    }
  } catch (err) {
    console.error("adminCancelBooking error:", err);
    alert("Network error");
  }
}
