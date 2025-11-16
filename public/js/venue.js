class VenueManager {
  constructor(venueId) {
    this.venueId = venueId;
    this.venue = {};
  }

  async fetchVenue() {
    try {
      const response = await fetch(`/api/venues/${this.venueId}`);
      if (!response.ok) throw new Error('Failed to fetch venue');
      this.venue = await response.json();
      console.log('✅ Fetched venue:', this.venue);
    } catch (error) {
      console.error('❌ Error fetching venue:', error);
      alert('Error loading venue details.');
    }
  }
}

// Get venue ID
const venueIdInput = document.getElementById('venueId');
const venueId = venueIdInput ? venueIdInput.value.trim() : null;

console.log('📦 Loaded venueId from DOM:', venueId);

if (venueId) {
  const manager = new VenueManager(venueId);
  manager.fetchVenue();
} else {
  console.error('❌ Venue ID not found in DOM');
}
