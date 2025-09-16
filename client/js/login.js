document.addEventListener('DOMContentLoaded', () => {
  const registerBtn = document.getElementById('registerBtn');
  const loginBtn = document.getElementById('loginBtn');
  
  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');

  // API base URL
  const API_BASE_URL = 'http://localhost:3000/api/users';

  // Event listener for the Register button
  if (registerBtn) {
    registerBtn.addEventListener('click', async () => {
      const name = nameInput.value;
      const email = emailInput.value;
      const password = passwordInput.value;

      if (!name || !email || !password) {
        alert("Please fill in all fields to register.");
        return;
      }
      
      try {
        // UPDATED: Use the full backend URL
        const response = await fetch(`${API_BASE_URL}/register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name, email, password }),
        });
        const result = await response.json();
        
        if (response.ok) {
          alert("Registration successful! You can now log in.");
          nameInput.value = '';
          emailInput.value = '';
          passwordInput.value = '';
        } else {
          alert(result.message || "Registration failed. Please try again.");
        }
      } catch (error) {
        console.error('Registration error:', error);
        alert("An error occurred during registration. Please try again later.");
      }
    });
  }

  // Event listener for the Login button
  if (loginBtn) {
    loginBtn.addEventListener('click', async () => {
      const email = emailInput.value;
      const password = passwordInput.value;

      if (!email || !password) {
        alert("Please enter your email and password to log in.");
        return;
      }

      try {
        // UPDATED: Use the full backend URL
        const response = await fetch(`${API_BASE_URL}/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        });
        const result = await response.json();

        if (response.ok) {
          // Store the token and user info from the backend response
          localStorage.setItem('authToken', result.token);
          localStorage.setItem('citizenUser', JSON.stringify(result.user));
          window.location.href = "dashboard.html";
        } else {
          alert(result.message || "Login failed. Incorrect email or password.");
        }
      } catch (error) {
        console.error('Login error:', error);
        alert("An error occurred during login. Please try again later.");
      }
    });
  }
});