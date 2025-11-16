document.addEventListener('DOMContentLoaded', () => {
  loadUserDetails();
  loadUserBookings();
});



// ------------------- Load User Info -------------------
async function loadUserDetails() {
  const token = localStorage.getItem('token');
  const userNameEl = document.getElementById('userName');
  const userEmailEl = document.getElementById('userEmail');
  const userRoleEl = document.getElementById('userRole');

  if (!token) {
    if (userNameEl) userNameEl.textContent = 'Guest';
    if (userEmailEl) userEmailEl.textContent = '';
    if (userRoleEl) userRoleEl.textContent = '';
    return;
  }

  try {
    const response = await fetch('/api/auth/me', {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    const user = await response.json();
    if (response.ok && user) {
      if (userNameEl) userNameEl.textContent = user.name;
      if (userEmailEl) userEmailEl.textContent = user.email;
      if (userRoleEl) userRoleEl.textContent = user.role;
    } else {
      console.error('Failed to fetch user details');
    }
  } catch (err) {
    console.error('Error fetching user details:', err);
  }
}

// ------------------- Load User Bookings -------------------
async function loadUserBookings() {
  const token = localStorage.getItem('token');
  const bookingsContainer = document.getElementById('bookings');

  if (!token) {
    bookingsContainer.innerHTML = '<p>Please log in to view your bookings.</p>';
    return;
  }

  try {
    const response = await fetch('/api/bookings/my', {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    const bookings = await response.json();
    if (response.ok && bookings.length > 0) {
      bookingsContainer.innerHTML = bookings.map(b => `
        <div class="venue">
          <h3>${b.venue.name} (${b.venue.sport})</h3>
          <p>Location: ${b.venue.location}</p>
          <p>Slot: ${b.slot}</p>
          <p>Date: ${new Date(b.date).toLocaleDateString()}</p>
          <p>Status: ${b.status}</p>
          <button onclick="openEditModal('${b._id}', '${b.venue._id}', '${b.slot}', '${b.date}')">Edit Booking</button>
          <button onclick="cancelBooking('${b._id}')">Cancel Booking</button>
        </div>
      `).join('');
    } else {
      bookingsContainer.innerHTML = '<p>No bookings found.</p>';
    }
  } catch (err) {
    bookingsContainer.innerHTML = '<p>Error loading bookings. Please try again.</p>';
    console.error('Error loading bookings:', err);
  }
}

// ------------------- Cancel Booking -------------------
async function cancelBooking(id) {
  if (!confirm('Are you sure you want to cancel this booking?')) return;
  const token = localStorage.getItem('token');
  if (!token) {
    window.showMessage('Please log in', 'error');
    return;
  }

  try {
    const response = await fetch(`/api/bookings/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (response.ok) {
      window.showMessage('Booking cancelled successfully', 'success');
      loadUserBookings();
    } else {
      const error = await response.json();
      window.showMessage(error.error || 'Cancellation failed', 'error');
    }
  } catch (err) {
    window.showMessage('Network error', 'error');
    console.error('Error cancelling booking:', err);
  }
}

// ------------------- Edit Booking (Modal) -------------------
function openEditModal(bookingId, venueId, currentSlot, currentDate) {
  let modal = document.getElementById('editBookingModal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'editBookingModal';
    modal.innerHTML = `
      <div class="modal-overlay">
        <div class="modal-content" role="dialog" aria-modal="true">
          <h2>Edit Booking</h2>

          <label for="editDate">Select Date:</label>
          <input type="date" id="editDate">

          <label for="editSlot">Select Slot:</label>
          <select id="editSlot"></select>

          <div class="modal-buttons">
            <button id="closeEditBtn" type="button">Cancel</button>
            <button id="saveEditBtn" type="button">Save</button>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(modal);

    // close when clicking outside modal-content
    const overlay = modal.querySelector('.modal-overlay');
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) modal.style.display = 'none';
    });

    // close button
    modal.querySelector('#closeEditBtn').addEventListener('click', () => {
      modal.style.display = 'none';
    });
  }

  // show modal (use flex by CSS .modal-overlay)
  modal.style.display = 'block'; // container visible
  const overlay = modal.querySelector('.modal-overlay');
  if (overlay) overlay.style.display = 'flex';

  // restrict date to today or future
  const today = new Date().toISOString().split('T')[0];
  const dateInput = document.getElementById('editDate');
  dateInput.min = today;
  dateInput.value = currentDate ? currentDate.slice(0, 10) : today;

  // load slots dynamically
  loadAvailableSlots(venueId, currentSlot);

  // Save handler setup (rebind to current booking id)
  const saveBtn = document.getElementById('saveEditBtn');
  saveBtn.onclick = () => saveEditBooking(bookingId);
}


// ------------------- Load Available Slots (handles objects) -------------------
async function loadAvailableSlots(venueId, currentSlot) {
  try {
    console.log('Loading slots for venueId:', venueId);
    const response = await fetch(`/api/venues/${venueId}`);
    if (!response.ok) {
      console.error('Failed to fetch venue:', response.status, await response.text());
      document.getElementById('editSlot').innerHTML = '<option>Error loading slots</option>';
      return;
    }
    const venue = await response.json();
    console.log('Venue data for slots:', venue);

    const slotSelect = document.getElementById('editSlot');
    if (!slotSelect) {
      console.error('editSlot element not found');
      return;
    }

    // Defensive: ensure venue.slots exists and is an array
    const rawSlots = Array.isArray(venue.slots) ? venue.slots : [];

    if (rawSlots.length === 0) {
      slotSelect.innerHTML = '<option value="">No slots available</option>';
      return;
    }

    // Each slot might be an object { time, available } — handle both shapes
    slotSelect.innerHTML = rawSlots.map(s => {
      const time = (typeof s === 'string') ? s : s.time;
      const available = (typeof s === 'string') ? true : !!s.available;
      const disabled = (!available && time !== currentSlot) ? 'disabled' : '';
      const selected = (time === currentSlot) ? 'selected' : '';
      return `<option value="${time}" ${disabled} ${selected}>${time}${!available && time !== currentSlot ? ' (booked)' : ''}</option>`;
    }).join('');
  } catch (err) {
    console.error('Error loading available slots:', err);
    const slotSelect = document.getElementById('editSlot');
    if (slotSelect) slotSelect.innerHTML = '<option>Error loading slots</option>';
  }
}

// ------------------- Save Edited Booking -------------------
async function saveEditBooking(bookingId) {
  const token = localStorage.getItem('token');
  const newDate = document.getElementById('editDate')?.value;
  const newSlot = document.getElementById('editSlot')?.value;
  const modal = document.getElementById('editBookingModal');

  if (!token) {
    window.showMessage('Please log in', 'error');
    return;
  }

  if (!newDate || !newSlot) {
    window.showMessage('Please select both date and slot', 'error');
    return;
  }

  try {
    const response = await fetch(`/api/bookings/${bookingId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ date: newDate, slot: newSlot })
    });

    const result = await response.json();
    if (response.ok) {
      // show confirmation toast (uses your window.showMessage)
      window.showMessage('Booking updated successfully!', 'success');

      // hide modal after a short delay so user sees toast
      setTimeout(() => {
        if (modal) modal.style.display = 'none';
        loadUserBookings();
      }, 700);
    } else {
      console.error('Update failed response:', result);
      window.showMessage(result.error || 'Update failed', 'error');
    }
  } catch (err) {
    console.error('Error updating booking:', err);
    window.showMessage('Network error', 'error');
  }
}

// ------------------- Admin Dashboard Stats -------------------
document.addEventListener("DOMContentLoaded", () => {
  const isAdminDashboard = window.location.pathname === "/admin/dashboard";
  if (isAdminDashboard) loadAdminStats();
});

async function loadAdminStats() {
  const token = localStorage.getItem("token");
  if (!token) return;

  try {
    // Fetch venues
    const venuesRes = await fetch('/api/venues');
    const venues = await venuesRes.json();
    const venuesCountEl = document.getElementById("statVenues");
    if (venuesCountEl) venuesCountEl.textContent = venues.length;

    // Fetch bookings (admin only)
    const bookingsRes = await fetch('/api/bookings/all', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const bookings = await bookingsRes.json();
    const bookingsCountEl = document.getElementById("statBookings");
    if (bookingsCountEl) bookingsCountEl.textContent = bookings.length;

    // Fetch users
    const usersRes = await fetch('/api/users', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const users = await usersRes.json();
    const usersCountEl = document.getElementById("statUsers");
    if (usersCountEl) usersCountEl.textContent = users.length;

  } catch (err) {
    console.error("Error loading admin stats:", err);
  }
}
