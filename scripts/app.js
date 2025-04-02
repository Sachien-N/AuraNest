// Core App Functionality

// DOM Elements
const header = document.querySelector('.header');
const navLinks = document.querySelectorAll('.nav-links a');

// Scroll Handler
let lastScroll = 0;
window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > lastScroll && currentScroll > 100) {
        header.style.transform = 'translateY(-100%)';
    } else {
        header.style.transform = 'translateY(0)';
    }
    lastScroll = currentScroll;
});

// Active Link Handler
navLinks.forEach(link => {
    if (link.href === window.location.href) {
        link.classList.add('active');
    }
});

// Animation Observer
const animateOnScroll = new IntersectionObserver(
    (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                animateOnScroll.unobserve(entry.target);
            }
        });
    },
    { threshold: 0.1 }
);

// Animate sections on scroll
document.querySelectorAll('section').forEach(section => {
    animateOnScroll.observe(section);
});

// Feature Cards Animation
document.querySelectorAll('.feature-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-8px)';
        card.style.boxShadow = '0 8px 24px var(--shadow-color)';
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0)';
        card.style.boxShadow = '0 4px 6px var(--shadow-color)';
    });
});

// Utility Functions
const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

// Responsive Navigation
const handleResponsiveNav = () => {
    const nav = document.querySelector('.nav-links');
    if (window.innerWidth <= 768) {
        nav.style.display = 'none';
    } else {
        nav.style.display = 'flex';
    }
};

window.addEventListener('resize', debounce(handleResponsiveNav, 250));

// Form Validation
const validateForm = (form) => {
    const inputs = form.querySelectorAll('input[required]');
    let isValid = true;

    inputs.forEach(input => {
        if (!input.value.trim()) {
            isValid = false;
            input.classList.add('error-shake');
            setTimeout(() => input.classList.remove('error-shake'), 400);
        }
    });

    return isValid;
};

// Success Message
const showSuccess = (message) => {
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.textContent = message;
    document.body.appendChild(successDiv);

    setTimeout(() => {
        successDiv.remove();
    }, 3000);
};

// Error Message
const showError = (message) => {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-shake';
    errorDiv.textContent = message;
    document.body.appendChild(errorDiv);

    setTimeout(() => {
        errorDiv.remove();
    }, 3000);
};

// Export utilities for other scripts
window.AuraNest = {
    validateForm,
    showSuccess,
    showError,
    debounce
};