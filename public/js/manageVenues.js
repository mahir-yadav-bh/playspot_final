// public/js/manageVenues.js
document.addEventListener('DOMContentLoaded', loadVenues);

let currentVenueId = null;

// ----------------------------
// Load all venues
// ----------------------------
async function loadVenues() {
  try {
    const res = await fetch('/api/venues');
    const venues = await res.json();

    const list = document.getElementById('venueList');

    list.innerHTML = venues
      .map(
        (v) => `
      <div class="admin-venue-card" data-id="${v._id}">
        <h3>${v.name}</h3>
        <p><strong>Sport:</strong> ${v.sport}</p>
        <p><strong>Location:</strong> ${v.location}</p>
        <p><strong>Price:</strong> ₹${v.price}</p>
        <p><strong>Slots:</strong> ${v.slots?.map((s) => s.time).join(', ')}</p>

        <div class="admin-actions">
          <button class="btn-edit" onclick="openEdit('${v._id}')">Edit</button>
          <button class="btn-delete" onclick="deleteVenue('${v._id}')">Delete</button>
        </div>
      </div>
    `
      )
      .join('');
  } catch (err) {
    console.error('Error loading venues', err);
    document.getElementById('venueList').innerHTML =
      '<p>Error loading venues</p>';
  }
}

// ----------------------------
// Open Edit Modal
// ----------------------------
async function openEdit(id) {
  currentVenueId = id;

  try {
    const res = await fetch(`/api/venues/${id}`);
    const v = await res.json();

    document.getElementById('editId').value = v._id;
    document.getElementById('editName').value = v.name || '';
    document.getElementById('editSport').value = v.sport || '';
    document.getElementById('editLocation').value = v.location || '';
    document.getElementById('editPrice').value = v.price || '';
    document.getElementById('editSlots').value = (v.slots || [])
      .map((s) => s.time)
      .join(', ');
    document.getElementById('editImages').value = (v.images || []).join(', ');
    document.getElementById('editMap').value = v.mapEmbedUrl || '';

    document.getElementById('editModal').classList.remove('hidden');
  } catch (err) {
    console.error('openEdit', err);
    window.showMessage('Failed to load venue for editing', 'error');
  }
}

// ----------------------------
// Close Modal
// ----------------------------
function closeModal() {
  document.getElementById('editModal').classList.add('hidden');
}

// ----------------------------
// Save Edited Venue
// ----------------------------
document
  .getElementById('editVenueForm')
  .addEventListener('submit', async (e) => {
    e.preventDefault();

    const id = document.getElementById('editId').value;

    const data = {
      name: document.getElementById('editName').value,
      sport: document.getElementById('editSport').value,
      location: document.getElementById('editLocation').value,
      price: parseFloat(document.getElementById('editPrice').value),
      slots: document
        .getElementById('editSlots')
        .value.split(',')
        .map((s) => ({ time: s.trim(), available: true }))
        .filter((s) => s.time),
      images: document
        .getElementById('editImages')
        .value.split(',')
        .map((i) => i.trim())
        .filter(Boolean),
      mapEmbedUrl: document.getElementById('editMap').value.trim() || '',
    };

    const token = localStorage.getItem('token');

    try {
      const res = await fetch(`/api/venues/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        window.showMessage(result.error || 'Update failed', 'error');
        return;
      }

      window.showMessage('Venue updated successfully!', 'success');
      closeModal();
      loadVenues();
    } catch (err) {
      console.error(err);
      window.showMessage('Network error', 'error');
    }
  });

// ----------------------------
// Delete Venue
// ----------------------------
async function deleteVenue(id) {
  if (!confirm('Are you sure you want to delete this venue?')) return;

  const token = localStorage.getItem('token');

  try {
    const res = await fetch(`/api/venues/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });

    const result = await res.json();

    if (!res.ok) {
      window.showMessage(result.error || 'Delete failed', 'error');
      return;
    }

    window.showMessage('Venue deleted successfully!', 'success');
    loadVenues();
  } catch (err) {
    console.error(err);
    window.showMessage('Network error', 'error');
  }
}
