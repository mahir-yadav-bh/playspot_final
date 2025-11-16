document.addEventListener('DOMContentLoaded', () => {
  const profileForm = document.getElementById('profileForm');
  const logoutBtn = document.getElementById('logoutBtn');

  const token = localStorage.getItem('token');
  if (!token) return;

  // Load current user info
  fetch('/api/users/me', {
    headers: { 'Authorization': `Bearer ${token}` }
  })
    .then(res => res.json())
    .then(user => {
      if (profileForm) {
        profileForm.name.value = user.name;
        profileForm.email.value = user.email;
      }
    })
    .catch(err => console.error(err));

  // Update profile
  if (profileForm) {
    profileForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(profileForm);
      const data = Object.fromEntries(formData);

      try {
        const res = await fetch('/api/users/me', {
          method: 'PUT',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(data)
        });
        const result = await res.json();
        if (res.ok) window.showMessage('Profile updated!', 'success');
        else window.showMessage(result.error || 'Update failed', 'error');
      } catch (err) {
        window.showMessage('Network error', 'error');
      }
    });
  }

  // Logout
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    });
  }
});
