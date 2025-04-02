// Contact Form Functionality

// DOM Elements
const contactForm = document.getElementById('contactForm');
const errorMessages = document.querySelectorAll('.error-message');

// Initialize Contact Form
document.addEventListener('DOMContentLoaded', () => {
    initializeContactForm();
});

// Form Initialization
function initializeContactForm() {
    if (!contactForm) return;

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (validateForm()) {
            submitForm();
        }
    });
}

// Form Validation
function validateForm() {
    let isValid = true;
    const name = document.getElementById('name');
    const email = document.getElementById('email');
    const subject = document.getElementById('subject');
    const message = document.getElementById('message');

    // Reset error messages
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

    // Subject validation
    if (!subject.value) {
        showError(subject, 'Please select a subject');
        isValid = false;
    }

    // Message validation
    if (!message.value.trim()) {
        showError(message, 'Message is required');
        isValid = false;
    } else if (message.value.length < 10) {
        showError(message, 'Message must be at least 10 characters long');
        isValid = false;
    }

    return isValid;
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

// Form Submission
function submitForm() {
    const submitButton = contactForm.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    
    // Show loading state
    submitButton.disabled = true;
    submitButton.innerHTML = '<div class="loading-spinner"></div>';

    // Simulate API call
    setTimeout(() => {
        // Show success message
        window.AuraNest.showSuccess('Message sent successfully! We\'ll get back to you soon.');

        // Reset form
        contactForm.reset();

        // Reset button
        submitButton.disabled = false;
        submitButton.textContent = originalText;

        // Add success animation to form
        contactForm.classList.add('success-message');
        setTimeout(() => contactForm.classList.remove('success-message'), 500);
    }, 1500);
}