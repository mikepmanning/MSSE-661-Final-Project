const loginBtn = document.getElementById('login-btn');
const logoutBtn = document.getElementById('logout-btn');
const loginModal = document.getElementById('loginModal');
const registerBtn = document.getElementById('register-btn');
const registerModal = document.getElementById('registerModal');
const closeBtn = document.querySelectorAll('.close-btn');
const registerForm = document.getElementById('registerForm');
const welcomeMessage = document.getElementById("welcome-text");
const loginErrorMessage = document.getElementById("loginErrorMessage");
const registerErrorMessage = document.getElementById('registrationErrorMessage');
const updateProfileModal = document.getElementById('updateProfileModal');


loginBtn.onclick = function() {
  loginModal.style.display = 'block';
}

closeBtn.forEach(button => {
  button.onclick = function() {
    loginModal.style.display = 'none';
    registerModal.style.display = 'none';
    updateProfileModal.style.display = 'none';
  }
});

window.onclick = function(event) {
  if (event.target == loginModal) {
    loginModal.style.display = 'none';
  }
  else if (event.target == registerModal) {
    registerModal.style.display = 'none';
  }
  else if (event.target == updateProfileModal) {
    updateProfileModal.style.display = 'none';
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
      
      const loginToken = response.headers.get('auth-token'); 
      if (loginToken) {
          // Store the token in localStorage
          localStorage.setItem(AUTH_TOKEN, loginToken);
      } else {
          console.error('Token not found in response header');
      }

      return response.json();
  }).then(data => {
      successfulLogin(data);
  }).catch(error => {
      console.error('Login error:', error);
      
      loginErrorMessage.textContent = 'Invalid username or password';
  });
}

const successfulLogin = function(data) {
  console.log('Login successful:', data);

  const name = data.user.firstName + " " + data.user.lastName;

  registerBtn.style.visibility = 'hidden';
  loginBtn.style.visibility = 'hidden';
  logoutBtn.style.visibility = 'visible';

  welcomeMessage.textContent = `Welcome ${name}!`;

  // No longer display the modal and clear the inputs
  loginModal.style.display = 'none';
  document.getElementById('username').value = '';
  document.getElementById('password').value = '';
  if (loginErrorMessage.textContent != '') {
    loginErrorMessage.textContent = '';
  }

  populateProfile(data.user);
  populateUpdateModal(data.user);
}

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

logoutBtn.addEventListener('click', () => {
  localStorage.removeItem('authToken');

  registerBtn.style.visibility = 'visible';
  loginBtn.style.visibility = 'visible';
  logoutBtn.style.visibility = 'hidden';
  if (welcomeMessage) {
    welcomeMessage.textContent = 'Welcome';
  }
  clearProfile();
});

registerBtn.onclick = function() {
  registerModal.style.display = 'block';
}


const genericRegistrationFailure = function() {
  registerErrorMessage.textContent = 'Registration failed. Please try again later.';
}

registerForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const firstName = document.getElementById('firstName').value;
  const middleName = document.getElementById('middleName').value;
  const lastName = document.getElementById('lastName').value;
  const birthdate = document.getElementById('dob').value;
  const email = document.getElementById('email').value;
  const username = document.getElementById('regUsername').value;
  const password = document.getElementById('regPassword').value;

  // Create the registration data object
  const registrationData = {
    firstName,
    middleName,
    lastName,
    birthdate,
    email,
    username,
    password
  };

  register(registrationData)
  .then(response => {
      if (!response.ok) {
        throw response;
      }
      return response.json();
    })
  .then(data => {
      console.log('Registration successful:', data);
      if (data.success) {
        welcomeMessage.textContent = `Registration Successful, please login now!`;
      }

      registerModal.style.display = 'none';
    })
  .catch(error => {
      console.error('Registration error:', error);
      error.json().then(errorData => {
        if (errorData && errorData.error) {
          registerErrorMessage.textContent = errorData.error;
        } else {
          genericRegistrationFailure();
        }
      }).catch(() => {
        // Fallback to a generic error message if parsing fails
        genericRegistrationFailure();
      });
    });
});

function populateProfile(userData) {
  document.getElementById('profile-firstName').textContent = userData.firstName;
  document.getElementById('profile-middleName').textContent = userData.middleName || '';
  document.getElementById('profile-lastName').textContent = userData.lastName;
  document.getElementById('profile-email').textContent = userData.email;

  const birthdate = new Date(userData.birthdate);
  const formattedBirthdate = birthdate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    timeZone: 'UTC'
  });
  document.getElementById('profile-birthdate').textContent = formattedBirthdate;

  // Show the profile section and update button
  document.getElementById('profile').style.display = 'block';
  document.getElementById('update-profile-btn').style.display = 'block';
}

function clearProfile() {
  document.getElementById('profile-firstName').textContent = "";
  document.getElementById('profile-middleName').textContent = '';
  document.getElementById('profile-lastName').textContent = "";
  document.getElementById('profile-birthdate').textContent = "";
  document.getElementById('profile-email').textContent = "";

  // Show the profile section and update button
  document.getElementById('profile').style.display = 'none';
  document.getElementById('update-profile-btn').style.display = 'none';
  
  document.getElementById('update-firstName').value = "";
  document.getElementById('update-middleName').value = "";
  document.getElementById('update-lastName').value = "";
  document.getElementById('update-birthdate').value = "";
  document.getElementById('update-username').value = "";

}

function populateUpdateModal(userData) {
  document.getElementById('update-id').value = userData._id;
  document.getElementById('update-firstName').value = userData.firstName;
  document.getElementById('update-middleName').value = userData.middleName;
  document.getElementById('update-lastName').value = userData.lastName;
  document.getElementById('update-username').value = userData.username;
  const birthdate = new Date(userData.birthdate);
  const year = birthdate.getUTCFullYear();
  const month = ('0' + (birthdate.getUTCMonth() + 1)).slice(-2); // Add leading zero if needed
  const day = ('0' + birthdate.getUTCDate()).slice(-2); // Add leading zero if needed
  const formattedBirthdate = `${year}-${month}-${day}`;

  document.getElementById('update-birthdate').value = formattedBirthdate;

}

const updateProfileBtn = document.getElementById('update-profile-btn');
updateProfileBtn.addEventListener('click', () => {
  const updateProfileModal = document.getElementById('updateProfileModal');
  updateProfileModal.style.display = 'block';
});




