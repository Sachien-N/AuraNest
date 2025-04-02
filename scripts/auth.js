// Auth Functionality

// DOM Elements
const loginForm = document.getElementById('loginForm');
const passwordInput = document.getElementById('password');
const passwordToggle = document.querySelector('.password-toggle');
const errorMessages = document.querySelectorAll('.error-message');

// Password Visibility Toggle
if (passwordToggle) {
    passwordToggle.addEventListener('click', () => {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        
        // Update icon based on password visibility
        const eyeIcon = passwordToggle.querySelector('.eye-icon');
        if (type === 'password') {
            eyeIcon.innerHTML = '<path d="M12 4C7 4 2.73 7.11 1 12C2.73 16.89 7 20 12 20C17 20 21.27 16.89 23 12C21.27 7.11 17 4 12 4ZM12 17C9.24 17 7 14.76 7 12C7 9.24 9.24 7 12 7C14.76 7 17 9.24 17 12C17 14.76 14.76 17 12 17ZM12 9C10.34 9 9 10.34 9 12C9 13.66 10.34 15 12 15C13.66 15 15 13.66 15 12C15 10.34 13.66 9 12 9Z" fill="currentColor"/>';
        } else {
            eyeIcon.innerHTML = '<path d="M12 7C14.76 7 17 9.24 17 12C17 12.65 16.87 13.26 16.64 13.83L19.56 16.75C21.07 15.49 22.26 13.86 23 12C21.27 7.11 17 4 12 4C10.6 4 9.26 4.29 8 4.83L10.1 6.93C10.65 6.7 11.32 6.56 12 6.56V7ZM12 17C9.24 17 7 14.76 7 12C7 11.35 7.13 10.74 7.36 10.17L4.44 7.25C2.93 8.51 1.74 10.14 1 12C2.73 16.89 7 20 12 20C13.4 20 14.74 19.71 16 19.17L13.9 17.07C13.35 17.3 12.68 17.44 12 17.44V17Z" fill="currentColor"/><path d="M12 9C13.66 9 15 10.34 15 12C15 12.68 14.8 13.3 14.45 13.83L16.24 15.62C16.7 14.84 17 13.93 17 13C17 10.24 14.76 8 12 8C11.07 8 10.16 8.3 9.38 8.76L11.17 10.55C11.7 10.2 12.32 10 13 10H12V9Z" fill="currentColor"/><path d="M2.71 3.16L1.29 4.58L4.44 7.73C3.93 8.5 3.51 9.35 3.21 10.25L2 12L3.21 13.75C4.94 18.64 9.21 21.75 14.21 21.75C15.61 21.75 16.95 21.46 18.21 20.92L20.84 23.55L22.26 22.13L2.71 3.16ZM12 17C9.24 17 7 14.76 7 12C7 11.32 7.2 10.7 7.55 10.17L9.34 11.96C9.3 12.3 9.3 12.65 9.3 13C9.3 14.66 10.64 16 12.3 16C12.65 16 13 15.95 13.34 15.84L15.13 17.63C14.3 17.85 13.57 18 12.79 18L12 17Z" fill="currentColor"/>';
        }
    });
}

// Form Validation
if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        let isValid = true;
        const email = document.getElementById('email');
        const password = document.getElementById('password');

        // Reset error messages
        errorMessages.forEach(msg => msg.textContent = '');

        // Email validation
        if (!email.value.trim()) {
            showError(email, 'Email is required');
            isValid = false;
        } else if (!isValidEmail(email.value)) {
            showError(email, 'Please enter a valid email address');
            isValid = false;
        }

        // Password validation
        if (!password.value.trim()) {
            showError(password, 'Password is required');
            isValid = false;
        } else if (password.value.length < 8) {
            showError(password, 'Password must be at least 8 characters');
            isValid = false;
        }

        if (isValid) {
            // Simulate login - Replace with actual authentication
            simulateLogin(email.value, password.value);
        }
    });
}

// Helper Functions
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showError(input, message) {
    const errorDiv = input.parentElement.querySelector('.error-message');
    if (errorDiv) {
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
        input.classList.add('error');

        // Add shake animation
        input.classList.add('error-shake');
        setTimeout(() => input.classList.remove('error-shake'), 500);
    }
}

function simulateLogin(email, password) {
    // Show loading state
    const submitButton = loginForm.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.disabled = true;
    submitButton.innerHTML = '<div class="loading-spinner"></div>';

    // Simulate API call
    setTimeout(() => {
        // For demo purposes, always succeed
        window.AuraNest.showSuccess('Login successful!');
        
        // Reset button
        submitButton.disabled = false;
        submitButton.textContent = originalText;

        // Redirect to dashboard
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1000);
    }, 1500);
}

// Remember Me Functionality
const rememberCheckbox = document.getElementById('remember');
if (rememberCheckbox) {
    // Check if there's a saved email
    const savedEmail = localStorage.getItem('rememberedEmail');
    if (savedEmail) {
        document.getElementById('email').value = savedEmail;
        rememberCheckbox.checked = true;
    }

    rememberCheckbox.addEventListener('change', () => {
        const email = document.getElementById('email').value;
        if (rememberCheckbox.checked && email) {
            localStorage.setItem('rememberedEmail', email);
        } else {
            localStorage.removeItem('rememberedEmail');
        }
    });
}

// Registration Form Handling
const registerForm = document.getElementById('registerForm');
if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        let isValid = true;
        const name = document.getElementById('name');
        const email = document.getElementById('email');
        const password = document.getElementById('password');
        const confirmPassword = document.getElementById('confirmPassword');
        const terms = document.getElementById('terms');

        // Reset error messages
        const errorMessages = registerForm.querySelectorAll('.error-message');
        errorMessages.forEach(msg => msg.textContent = '');

        // Name validation
        if (!name.value.trim()) {
            showError(name, 'Name is required');
            isValid = false;
        }

        // Email validation
        if (!email.value.trim()) {
            showError(email, 'Email is required');
            isValid = false;
        } else if (!isValidEmail(email.value)) {
            showError(email, 'Please enter a valid email address');
            isValid = false;
        }

        // Password validation
        if (!password.value.trim()) {
            showError(password, 'Password is required');
            isValid = false;
        } else if (password.value.length < 8) {
            showError(password, 'Password must be at least 8 characters');
            isValid = false;
        }

        // Confirm password validation
        if (!confirmPassword.value.trim()) {
            showError(confirmPassword, 'Please confirm your password');
            isValid = false;
        } else if (confirmPassword.value !== password.value) {
            showError(confirmPassword, 'Passwords do not match');
            isValid = false;
        }

        // Terms validation
        if (!terms.checked) {
            const termsError = terms.parentElement.nextElementSibling || document.createElement('div');
            termsError.className = 'error-message';
            termsError.textContent = 'You must agree to the Terms of Service and Privacy Policy';
            if (!terms.parentElement.nextElementSibling) {
                terms.parentElement.after(termsError);
            }
            isValid = false;
        }

        if (isValid) {
            // Simulate registration - Replace with actual registration logic
            simulateRegistration(name.value, email.value, password.value);
        }
    });
}

function simulateRegistration(name, email, password) {
    // Show loading state
    const submitButton = registerForm.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.disabled = true;
    submitButton.innerHTML = '<div class="loading-spinner"></div>';

    // Simulate API call
    setTimeout(() => {
        // For demo purposes, always succeed
        window.AuraNest.showSuccess('Registration successful!');
        
        // Reset button
        submitButton.disabled = false;
        submitButton.textContent = originalText;

        // Redirect to dashboard
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1000);
    }, 1500);
}