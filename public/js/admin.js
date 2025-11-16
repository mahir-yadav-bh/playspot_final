document.getElementById('addVenueForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const token = localStorage.getItem('token');
  const formData = new FormData(e.target);
  const data = Object.fromEntries(formData.entries());

  // Convert comma-separated slots & images into arrays
  data.slots = data.slots
    ? data.slots.split(',').map(t => ({ time: t.trim(), available: true }))
    : [];
  data.images = data.images
    ? data.images.split(',').map(img => img.trim())
    : [];

  try {
    const res = await fetch('/api/venues', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });

    const result = await res.json();
    if (res.ok) {
      alert('Venue added successfully!');
      e.target.reset();
    } else {
      alert('Error: ' + result.error);
    }
  } catch (err) {
    console.error(err);
    alert('Network error. Please try again.');
  }
});
