// js/signup.js

document.getElementById('signupForm').addEventListener('submit', async (e) => {
    e.preventDefault();
  
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
  
    try {
      const res = await fetch('https://my-luna2.onrender.com/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
  
      const data = await res.json();
      if (res.ok) {
        alert('Signup successful! You can now login.');
        document.getElementById("signup").style.display = "none";
        document.getElementById("login").style.display = "block";
      } else {
        alert(data.msg || 'Signup failed');
      }
    } catch (err) {
      console.error(err);
      alert('Something went wrong during signup.');
    }
  });
  