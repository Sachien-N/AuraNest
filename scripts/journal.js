// Journal Functionality

// DOM Elements
const journalForm = document.getElementById('journalForm');
const entriesList = document.getElementById('entriesList');
const searchInput = document.querySelector('.search-input');
const filterSelect = document.querySelector('.filter-select');

// Local Storage Key
const STORAGE_KEY = 'auraNest_journalEntries';

// Initialize Journal
document.addEventListener('DOMContentLoaded', () => {
    initializeJournal();
    loadEntries();
});

// Form Submission
if (journalForm) {
    journalForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (window.AuraNest.validateForm(journalForm)) {
            saveEntry();
        }
    });
}

// Search and Filter
if (searchInput) {
    searchInput.addEventListener('input', window.AuraNest.debounce(() => {
        filterEntries();
    }, 300));
}

if (filterSelect) {
    filterSelect.addEventListener('change', () => {
        filterEntries();
    });
}

// Initialize Journal
function initializeJournal() {
    // Set default date to today
    const dateInput = document.getElementById('entryDate');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.value = today;
        dateInput.max = today; // Prevent future dates
    }
}

// Save Entry
function saveEntry() {
    const entryDate = document.getElementById('entryDate').value;
    const entryTitle = document.getElementById('entryTitle').value;
    const entryContent = document.getElementById('entryContent').value;
    const mood = document.querySelector('input[name="mood"]:checked').value;
    const timestamp = new Date().toISOString();

    const entry = {
        id: timestamp,
        date: entryDate,
        title: entryTitle,
        content: entryContent,
        mood: parseInt(mood),
        timestamp
    };

    // Get existing entries
    const entries = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    entries.unshift(entry); // Add new entry at the beginning

    // Save to localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));

    // Show success message
    window.AuraNest.showSuccess('Journal entry saved successfully! 📝');

    // Reset form
    journalForm.reset();
    initializeJournal(); // Reset date to today

    // Reload entries
    loadEntries();
}

// Load Entries
function loadEntries() {
    if (!entriesList) return;

    const entries = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    displayEntries(entries);
}

// Filter Entries
function filterEntries() {
    if (!entriesList) return;

    const searchTerm = searchInput.value.toLowerCase();
    const filterValue = filterSelect.value;
    const entries = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

    const filteredEntries = entries.filter(entry => {
        const matchesSearch = entry.title.toLowerCase().includes(searchTerm) ||
                             entry.content.toLowerCase().includes(searchTerm);

        if (!matchesSearch) return false;

        const entryDate = new Date(entry.date);
        const now = new Date();

        switch (filterValue) {
            case 'week':
                const weekAgo = new Date(now.setDate(now.getDate() - 7));
                return entryDate >= weekAgo;
            case 'month':
                const monthAgo = new Date(now.setMonth(now.getMonth() - 1));
                return entryDate >= monthAgo;
            case 'year':
                const yearAgo = new Date(now.setFullYear(now.getFullYear() - 1));
                return entryDate >= yearAgo;
            default:
                return true;
        }
    });

    displayEntries(filteredEntries);
}

// Display Entries
function displayEntries(entries) {
    if (!entriesList) return;

    entriesList.innerHTML = entries.length ? '' : '<p class="no-entries">No journal entries found</p>';

    entries.forEach((entry, index) => {
        const entryElement = document.createElement('div');
        entryElement.className = 'journal-entry fade-in';
        entryElement.style.animationDelay = `${index * 0.1}s`;

        const moodEmoji = ['😢', '😕', '😊', '😄', '🥰'][entry.mood - 1];
        const formattedDate = new Date(entry.date).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        entryElement.innerHTML = `
            <div class="entry-header">
                <h3>${entry.title}</h3>
                <span class="entry-mood">${moodEmoji}</span>
            </div>
            <div class="entry-date">${formattedDate}</div>
            <div class="entry-content">
                <p>${entry.content}</p>
            </div>
            <div class="entry-actions">
                <button class="btn btn-secondary btn-small" onclick="editEntry('${entry.id}')">Edit</button>
                <button class="btn btn-secondary btn-small" onclick="deleteEntry('${entry.id}')">Delete</button>
            </div>
        `;

        entriesList.appendChild(entryElement);
    });
}

// Edit Entry
function editEntry(entryId) {
    const entries = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    const entry = entries.find(e => e.id === entryId);

    if (entry) {
        document.getElementById('entryDate').value = entry.date;
        document.getElementById('entryTitle').value = entry.title;
        document.getElementById('entryContent').value = entry.content;
        document.querySelector(`input[name="mood"][value="${entry.mood}"]`).checked = true;

        // Scroll to form
        journalForm.scrollIntoView({ behavior: 'smooth' });

        // Delete the old entry
        deleteEntry(entryId, false);
    }
}

// Delete Entry
function deleteEntry(entryId, showConfirm = true) {
    if (showConfirm && !confirm('Are you sure you want to delete this entry?')) {
        return;
    }

    const entries = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    const updatedEntries = entries.filter(entry => entry.id !== entryId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedEntries));

    if (showConfirm) {
        window.AuraNest.showSuccess('Journal entry deleted successfully');
        loadEntries();
    }
}