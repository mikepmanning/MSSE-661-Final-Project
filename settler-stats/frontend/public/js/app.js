const loginBtn = document.getElementById('login-btn');
const loginModal = document.getElementById('loginModal');
const closeBtn = document.querySelector('.close-btn');

loginBtn.onclick = function() {
  loginModal.style.display = 'block';
}

closeBtn.onclick = function() {
  loginModal.style.display = 'none';
}

window.onclick = function(event) {
  if (event.target == loginModal) {
    loginModal.style.display = 'none';
  }
}

const doLogin = function(e) {
  e.preventDefault();
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  login({
      username: username,
      password: password
  }).then(response => {
      if (!response.ok) {
          throw new Error('Login failed');
      }
      console.log('Response Object:', response);
      
      const token = response.headers.get('auth-token'); 
      if (token) {
          // Store the token in localStorage
          localStorage.setItem('authToken', token);
      } else {
          console.error('Token not found in response header');
      }

      return response.json();
  }).then(data => {
      successfulLogin(data);
  }).catch(error => {
      console.error('Login error:', error);
  });
}

const successfulLogin = function(data) {
  console.log('Login successful:', data);

      const name = data.firstName + " " + data.lastName;

      document.getElementById('register-btn').style.display = 'none';
      document.getElementById('login-btn').style.display = 'none';

      const welcomeMessage = document.getElementById("welcome-text");
      welcomeMessage.textContent = `Welcome ${name}!`;

      // No longer display the modal
      loginModal.style.display = 'none';
}

const token = localStorage.getItem('authToken');
if (token) {
    
  getUserByToken({ 'auth-token': `${token}`})
  .then(response => {
        if (!response.ok) {
            throw new Error('Failed to get user information');
        }
        return response.json();
    })
  .then(userData => {
        successfulLogin(userData);
    })
  .catch(error => {
        console.error('Error getting user information:', error);
        localStorage.removeItem('authToken');
    });
}