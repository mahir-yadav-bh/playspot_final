document.addEventListener('DOMContentLoaded', () => {
  const signupForm = document.getElementById('signupForm');
  const loginForm = document.getElementById('loginForm');

  // Signup handler
  if (signupForm) {
    signupForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(signupForm);
      const data = Object.fromEntries(formData);

      try {
        const response = await fetch('/api/auth/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });

        const result = await response.json();
        if (response.ok) {
          window.showMessage('Signup successful! Please log in.', 'success');
          setTimeout(() => window.location.href = '/login', 2000);
        } else {
          window.showMessage(result.error || 'Signup failed', 'error');
        }
      } catch (err) {
        window.showMessage('Network error', 'error');
      }
    });
  }

  // Login handler
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(loginForm);
      const data = Object.fromEntries(formData);

      try {
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });

        const result = await response.json();
        if (response.ok) {
          localStorage.setItem('token', result.token);
          localStorage.setItem('user', JSON.stringify(result.user));
          window.showMessage('Login successful!', 'success');

          // Role-based redirect
          if (result.user.role === 'admin') {
            window.location.href = '/admin/dashboard';
          } else {
            window.location.href = '/dashboard';
          }
        } else {
          window.showMessage(result.error || 'Login failed', 'error');
        }
      } catch (err) {
        window.showMessage('Network error', 'error');
      }
    });
  }
});
