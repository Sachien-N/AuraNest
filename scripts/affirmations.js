// Affirmations Functionality

// DOM Elements
const dailyAffirmation = document.getElementById('dailyAffirmation');
const refreshAffirmationBtn = document.querySelector('.refresh-affirmation');
const categoryCards = document.querySelectorAll('.category-card');
const customAffirmationForm = document.getElementById('customAffirmationForm');
const savedAffirmationsList = document.getElementById('savedAffirmationsList');

// Local Storage Key
const STORAGE_KEY = 'auraNest_affirmations';

// Affirmations by Category
const AFFIRMATIONS = {
    'self-love': [
        'I am worthy of love, respect, and happiness',
        'I accept myself fully for who I am',
        'I am enough, just as I am',
        'My body deserves love and respect',
        'I radiate beauty, charm, and grace',
        'I choose to be confident and self-assured',
        'I am becoming my best self',
        'My presence is a gift to the world'
    ],
    'confidence': [
        'I am capable of achieving anything I set my mind to',
        'I trust my intuition and inner wisdom',
        'I face challenges with courage and determination',
        'My potential is limitless',
        'I am strong, confident, and capable',
        'Success comes naturally to me',
        'I believe in my abilities',
        'Every day I grow stronger and more confident'
    ],
    'growth': [
        'I embrace change and welcome new opportunities',
        'Every challenge helps me grow and learn',
        'I am constantly evolving and improving',
        'My mind is open to new possibilities',
        'I learn from my experiences and grow stronger',
        'Each day brings new opportunities for growth',
        'I am becoming the best version of myself',
        'Progress is my priority'
    ],
    'gratitude': [
        'I am thankful for all the blessings in my life',
        'Every day brings new things to be grateful for',
        'I appreciate the simple joys in life',
        'My heart is full of gratitude',
        'I find beauty in everyday moments',
        'I am surrounded by abundance',
        'Life is a precious gift',
        'I attract positivity and joy'
    ]
};

// Initialize Affirmations
document.addEventListener('DOMContentLoaded', () => {
    loadDailyAffirmation();
    initializeCategoryCards();
    loadSavedAffirmations();
});

// Daily Affirmation
function loadDailyAffirmation() {
    if (!dailyAffirmation) return;

    const categories = Object.keys(AFFIRMATIONS);
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];
    const affirmations = AFFIRMATIONS[randomCategory];
    const randomAffirmation = affirmations[Math.floor(Math.random() * affirmations.length)];

    updateAffirmationDisplay(randomAffirmation);
}

function updateAffirmationDisplay(text) {
    if (!dailyAffirmation) return;

    dailyAffirmation.style.opacity = '0';
    setTimeout(() => {
        dailyAffirmation.textContent = text;
        dailyAffirmation.style.opacity = '1';
    }, 300);
}

// Refresh Affirmation
if (refreshAffirmationBtn) {
    refreshAffirmationBtn.addEventListener('click', () => {
        loadDailyAffirmation();
        refreshAffirmationBtn.classList.add('rotate');
        setTimeout(() => refreshAffirmationBtn.classList.remove('rotate'), 500);
    });
}

// Category Cards
function initializeCategoryCards() {
    categoryCards.forEach(card => {
        card.addEventListener('click', () => {
            const category = card.dataset.category;
            const affirmations = AFFIRMATIONS[category];
            const randomAffirmation = affirmations[Math.floor(Math.random() * affirmations.length)];
            updateAffirmationDisplay(randomAffirmation);

            // Visual feedback
            card.classList.add('pulse');
            setTimeout(() => card.classList.remove('pulse'), 500);
        });
    });
}

// Custom Affirmations
if (customAffirmationForm) {
    customAffirmationForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (window.AuraNest.validateForm(customAffirmationForm)) {
            saveCustomAffirmation();
        }
    });
}

function saveCustomAffirmation() {
    const affirmationText = document.getElementById('affirmationText').value;
    const category = document.getElementById('affirmationCategory').value;
    const timestamp = new Date().toISOString();

    const affirmation = {
        id: timestamp,
        text: affirmationText,
        category,
        timestamp
    };

    // Get existing affirmations
    const savedAffirmations = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    savedAffirmations.unshift(affirmation);

    // Save to localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(savedAffirmations));

    // Show success message
    window.AuraNest.showSuccess('Affirmation saved successfully! ✨');

    // Reset form
    customAffirmationForm.reset();

    // Reload saved affirmations
    loadSavedAffirmations();
}

// Load Saved Affirmations
function loadSavedAffirmations() {
    if (!savedAffirmationsList) return;

    const savedAffirmations = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    savedAffirmationsList.innerHTML = savedAffirmations.length ? '' : '<p class="no-affirmations">No saved affirmations yet</p>';

    savedAffirmations.forEach((affirmation, index) => {
        const affirmationElement = document.createElement('div');
        affirmationElement.className = 'saved-affirmation fade-in';
        affirmationElement.style.animationDelay = `${index * 0.1}s`;

        affirmationElement.innerHTML = `
            <div class="affirmation-header">
                <span class="affirmation-category">${affirmation.category}</span>
                <div class="affirmation-actions">
                    <button class="btn btn-secondary btn-small" onclick="editAffirmation('${affirmation.id}')">Edit</button>
                    <button class="btn btn-secondary btn-small" onclick="deleteAffirmation('${affirmation.id}')">Delete</button>
                </div>
            </div>
            <p class="affirmation-text">${affirmation.text}</p>
            <div class="affirmation-date">${new Date(affirmation.timestamp).toLocaleDateString()}</div>
        `;

        savedAffirmationsList.appendChild(affirmationElement);
    });
}

// Edit Affirmation
function editAffirmation(affirmationId) {
    const savedAffirmations = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    const affirmation = savedAffirmations.find(a => a.id === affirmationId);

    if (affirmation) {
        document.getElementById('affirmationText').value = affirmation.text;
        document.getElementById('affirmationCategory').value = affirmation.category;

        // Scroll to form
        customAffirmationForm.scrollIntoView({ behavior: 'smooth' });

        // Delete the old affirmation
        deleteAffirmation(affirmationId, false);
    }
}

// Delete Affirmation
function deleteAffirmation(affirmationId, showConfirm = true) {
    if (showConfirm && !confirm('Are you sure you want to delete this affirmation?')) {
        return;
    }

    const savedAffirmations = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    const updatedAffirmations = savedAffirmations.filter(a => a.id !== affirmationId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedAffirmations));

    if (showConfirm) {
        window.AuraNest.showSuccess('Affirmation deleted successfully');
        loadSavedAffirmations();
    }
}