class VenueBrowser {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.venues = [];
  }

  async fetchVenues() {
    try {
      const response = await fetch('/api/venues');
      if (!response.ok) throw new Error('Failed to fetch venues');
      this.venues = await response.json();
      this.render();
    } catch (error) {
      console.error('Error fetching venues:', error);
      this.container.innerHTML = '<p>Error loading venues. Please try again.</p>';
    }
  }

  render() {
    this.container.innerHTML = this.venues.map(v => `
      <div class="card venue-card">

        <img src="${v.images?.[0] || '/images/placeholder.jpg'}" 
            alt="${v.name}" class="venue-img">

        <div class="card-content">
          <h3>${v.name}</h3>

          <div class="venue-tags">
            <span class="tag">${v.sport}</span>
            <span class="tag">${v.location}</span>
          </div>

          <div class="rating">⭐ 4.${Math.floor(Math.random() * 5)} • Popular</div>

          <div class="price">₹${v.price}</div>

          <a class="btn-primary view-btn" href="/venue/${v._id}">
            View Details
          </a>
        </div>

      </div>
    `).join('');
  }
}

const browser = new VenueBrowser('venues');
browser.fetchVenues();