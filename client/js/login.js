// js/login.js

document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
  
    try {
      const res = await fetch('http://localhost:5000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
  
      const data = await res.json();
      if (res.ok) {
        // Save token in localStorage
        localStorage.setItem('token', data.token);
  
        // Optional: save name for dashboard use
        localStorage.setItem('userName', data.user.name);
  
        // Redirect to dashboard
        window.location.href = 'dashboard.html';
      } else {
        alert(data.msg || 'Login failed!');
      }
    } catch (err) {
      console.error(err);
      alert('Something went wrong during login.');
    }
  });
  