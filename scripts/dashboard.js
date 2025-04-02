// Dashboard Functionality

// DOM Elements
const habitList = document.querySelector('.habit-list');
const addHabitBtn = document.querySelector('.add-habit-btn');
const moodSlider = document.querySelector('.mood-slider');
const moodEmoji = document.querySelector('.mood-emoji');
const moodNotes = document.querySelector('.mood-notes');
const saveMoodBtn = document.querySelector('.save-mood-btn');
const refreshInsightBtn = document.querySelector('.refresh-insight-btn');

// Constants
const EMOJIS = ['😢', '😕', '😐', '😊', '😄'];
const INSIGHTS = [
    'Take a moment to breathe deeply and center yourself.',
    'Remember that every small step forward is progress.',
    'You are worthy of love, respect, and happiness.',
    'Your journey is unique, embrace your own path.',
    'Today is a new opportunity to grow and learn.',
    'Be patient with yourself as you grow.',
    'Your feelings are valid and deserve to be acknowledged.',
    'Focus on progress, not perfection.',
    'You have the strength to overcome any challenge.',
    'Self-care is not selfish, it\'s necessary',
];

// Local Storage Keys
const STORAGE_KEYS = {
    HABITS: 'auraNest_habits',
    MOOD_LOGS: 'auraNest_moodLogs',
    CHALLENGES: 'auraNest_challenges'
};

// Initialize Dashboard
document.addEventListener('DOMContentLoaded', () => {
    loadHabits();
    initializeMoodTracker();
    loadChallenges();
    initializeInsights();
});

// Daily Insights
function initializeInsights() {
    setRandomInsight();
    setupInsightRefresh();
}

function setRandomInsight() {
    const dailyQuote = document.querySelector('.daily-quote');
    if (!dailyQuote) return;

    const randomIndex = Math.floor(Math.random() * INSIGHTS.length);
    const insight = INSIGHTS[randomIndex];

    dailyQuote.style.opacity = '0';
    setTimeout(() => {
        dailyQuote.textContent = `"${insight}"`;
        dailyQuote.style.opacity = '1';
    }, 300);
}

function setupInsightRefresh() {
    const refreshBtn = document.querySelector('.refresh-insight-btn');
    if (!refreshBtn) return;

    refreshBtn.addEventListener('click', () => {
        refreshBtn.classList.add('rotate');
        setRandomInsight();
        setTimeout(() => refreshBtn.classList.remove('rotate'), 500);
    });
}

// Habit Tracking
function loadHabits() {
    const habits = JSON.parse(localStorage.getItem(STORAGE_KEYS.HABITS)) || [
        { id: 1, name: 'Morning Meditation', streak: 5, completed: false },
        { id: 2, name: 'Daily Exercise', streak: 3, completed: false },
        { id: 3, name: 'Gratitude Journal', streak: 7, completed: false }
    ];

    habits.forEach(habit => {
        const habitElement = createHabitElement(habit);
        habitList.appendChild(habitElement);
    });
}

function createHabitElement(habit) {
    const habitItem = document.createElement('div');
    habitItem.className = 'habit-item';
    habitItem.innerHTML = `
        <div class="habit-check">
            <input type="checkbox" id="habit${habit.id}" class="habit-checkbox" ${habit.completed ? 'checked' : ''}>
            <label for="habit${habit.id}">${habit.name}</label>
        </div>
        <div class="streak-counter">🔥 ${habit.streak} days</div>
    `;

    const checkbox = habitItem.querySelector('.habit-checkbox');
    checkbox.addEventListener('change', () => updateHabitStreak(habit.id, checkbox.checked));

    return habitItem;
}

function updateHabitStreak(habitId, completed) {
    const habits = JSON.parse(localStorage.getItem(STORAGE_KEYS.HABITS)) || [];
    const habitIndex = habits.findIndex(h => h.id === habitId);

    if (habitIndex !== -1) {
        if (completed && !habits[habitIndex].completed) {
            habits[habitIndex].streak++;
            habits[habitIndex].completed = true;
            showSuccess('Habit completed! Keep up the great work! 🎉');
        } else if (!completed && habits[habitIndex].completed) {
            habits[habitIndex].streak = Math.max(0, habits[habitIndex].streak - 1);
            habits[habitIndex].completed = false;
        }

        localStorage.setItem(STORAGE_KEYS.HABITS, JSON.stringify(habits));
        updateHabitDisplay();
    }
}

function updateHabitDisplay() {
    const habits = JSON.parse(localStorage.getItem(STORAGE_KEYS.HABITS)) || [];
    habitList.innerHTML = '';
    habits.forEach(habit => {
        const habitElement = createHabitElement(habit);
        habitList.appendChild(habitElement);
    });
}

// Mood Tracking
function initializeMoodTracker() {
    moodSlider.addEventListener('input', updateMoodEmoji);
    saveMoodBtn.addEventListener('click', saveMoodLog);
    updateMoodEmoji();
    loadMoodHistory();
}

function updateMoodEmoji() {
    const value = parseInt(moodSlider.value);
    moodEmoji.textContent = EMOJIS[value - 1];
    moodEmoji.classList.add('pulse');
    setTimeout(() => moodEmoji.classList.remove('pulse'), 500);

    // Update slider background gradient
    const percentage = ((value - 1) / 4) * 100;
    moodSlider.style.background = `linear-gradient(to right, var(--accent-blue) ${percentage}%, var(--card-bg) ${percentage}%)`;
}

function saveMoodLog() {
    const moodValue = parseInt(moodSlider.value);
    const notes = moodNotes.value.trim();
    const timestamp = new Date().toISOString();

    const moodLogs = JSON.parse(localStorage.getItem(STORAGE_KEYS.MOOD_LOGS)) || [];
    const newMoodLog = {
        mood: moodValue,
        emoji: EMOJIS[moodValue - 1],
        notes,
        timestamp
    };

    moodLogs.push(newMoodLog);
    localStorage.setItem(STORAGE_KEYS.MOOD_LOGS, JSON.stringify(moodLogs));

    // Show success message with mood-specific feedback
    const feedback = getMoodFeedback(moodValue);
    showSuccess(`Mood logged! ${feedback}`);

    // Clear input and update display
    moodNotes.value = '';
    updateMoodHistory(newMoodLog);

    // Check for mood tracking achievement
    if (typeof updateAchievementProgress === 'function') {
        updateAchievementProgress('mood_logs', 1);
    }
}

function getMoodFeedback(moodValue) {
    const feedbacks = [
        '🫂 Remember, it\'s okay not to be okay.',
        '💪 Small steps lead to big changes.',
        '😊 Steady and balanced.',
        '🌟 Keep that positive energy!',
        '🎉 Fantastic! You\'re radiating positivity!',
    ];
    return feedbacks[moodValue - 1];
}

function loadMoodHistory() {
    const moodLogs = JSON.parse(localStorage.getItem(STORAGE_KEYS.MOOD_LOGS)) || [];
    const recentLogs = moodLogs.slice(-5).reverse();
    recentLogs.forEach(updateMoodHistory);
}

function updateMoodHistory(moodLog) {
    const moodHistory = document.querySelector('.mood-history') || createMoodHistory();
    const moodEntry = document.createElement('div');
    moodEntry.className = 'mood-entry scale-in';
    moodEntry.innerHTML = `
        <span class="mood-emoji">${moodLog.emoji}</span>
        <span class="mood-time">${new Date(moodLog.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        ${moodLog.notes ? `<p class="mood-note">${moodLog.notes}</p>` : ''}
    `;

    if (moodHistory.children.length >= 5) {
        moodHistory.removeChild(moodHistory.lastChild);
    }
    moodHistory.insertBefore(moodEntry, moodHistory.firstChild);
}

function createMoodHistory() {
    const moodTracker = document.querySelector('.mood-tracker');
    const moodHistory = document.createElement('div');
    moodHistory.className = 'mood-history';
    moodTracker.appendChild(moodHistory);
    return moodHistory;
}
}

// Challenge Management
function loadChallenges() {
    const challenges = JSON.parse(localStorage.getItem(STORAGE_KEYS.CHALLENGES)) || [
        { id: 1, name: '7 Days of Meditation', total: 7, completed: 5 },
        { id: 2, name: '30 Days of Gratitude', total: 30, completed: 12 }
    ];

    updateChallengeDisplay(challenges);
}

function updateChallengeDisplay(challenges) {
    const challengeList = document.querySelector('.challenge-list');
    if (!challengeList) return;

    challengeList.innerHTML = challenges.map(challenge => {
        const progress = (challenge.completed / challenge.total) * 100;
        const isCompleted = progress >= 100;
        return `
            <div class="challenge-item ${isCompleted ? 'completed' : ''}" data-challenge-id="${challenge.id}">
                <h3>${challenge.name}</h3>
                <div class="progress-bar">
                    <div class="progress-bar-fill" style="width: ${progress}%;"></div>
                </div>
                <span class="challenge-progress">${challenge.completed}/${challenge.total} days completed</span>
                ${!isCompleted ? `
                    <button class="btn btn-small update-progress" onclick="updateChallengeProgress(${challenge.id})">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M8 3V13M3 8H13" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                        </svg>
                        Update Progress
                    </button>
                ` : `
                    <div class="completion-badge">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <path d="M16 6L8 14L4 10" stroke="#4CAF50" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        Challenge Complete!
                    </div>
                `}
            </div>
        `;
    }).join('');
}

function updateChallengeProgress(challengeId) {
    const challenges = JSON.parse(localStorage.getItem(STORAGE_KEYS.CHALLENGES)) || [];
    const challengeIndex = challenges.findIndex(c => c.id === challengeId);

    if (challengeIndex !== -1) {
        const challenge = challenges[challengeIndex];
        const oldProgress = challenge.completed;
        challenge.completed = Math.min(challenge.completed + 1, challenge.total);
        
        localStorage.setItem(STORAGE_KEYS.CHALLENGES, JSON.stringify(challenges));

        // Animate progress update
        const progressBar = document.querySelector(`[data-challenge-id="${challengeId}"] .progress-bar-fill`);
        if (progressBar) {
            const newProgress = (challenge.completed / challenge.total) * 100;
            progressBar.style.transition = 'width 0.5s ease-in-out';
            progressBar.style.width = `${newProgress}%`;
        }

        if (challenge.completed >= challenge.total && oldProgress < challenge.total) {
            showChallengeCompletion(challenge);
            // Trigger achievement check
            if (typeof updateAchievementProgress === 'function') {
                updateAchievementProgress('challenges_completed', 1);
            }
        } else if (challenge.completed < challenge.total) {
            showSuccess('Progress updated! Keep going! 💪');
        }

        updateChallengeDisplay(challenges);
    }
}

function showChallengeCompletion(challenge) {
    // Create completion overlay
    const overlay = document.createElement('div');
    overlay.className = 'challenge-completion-overlay';
    overlay.innerHTML = `
        <div class="completion-content">
            <div class="completion-icon">🏆</div>
            <h2>Challenge Complete!</h2>
            <p>${challenge.name}</p>
            <div class="completion-confetti"></div>
        </div>
    `;

    document.body.appendChild(overlay);

    // Add confetti effect
    const confettiColors = ['#FFD700', '#FFA500', '#FF69B4', '#00CED1', '#98FB98'];
    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti-piece';
        confetti.style.backgroundColor = confettiColors[Math.floor(Math.random() * confettiColors.length)];
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.animationDelay = Math.random() * 3 + 's';
        confetti.style.animationDuration = (Math.random() * 3 + 2) + 's';
        overlay.querySelector('.completion-confetti').appendChild(confetti);
    }

    // Show success message
    showSuccess('🎉 Challenge completed! Amazing work!');

    // Remove overlay after animation
    setTimeout(() => {
        overlay.classList.add('fade-out');
        setTimeout(() => overlay.remove(), 1000);
    }, 5000);
}

// Daily Insights
function setRandomInsight() {
    const insightText = document.querySelector('.insight-text');
    if (!insightText) return;

    function updateInsight() {
        const randomIndex = Math.floor(Math.random() * INSIGHTS.length);
        insightText.style.opacity = '0';
        
        setTimeout(() => {
            insightText.textContent = INSIGHTS[randomIndex];
            insightText.style.opacity = '1';
        }, 300);
    }

    refreshInsightBtn.addEventListener('click', updateInsight);
}

// Utility Functions
function showSuccess(message) {
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.textContent = message;
    document.body.appendChild(successDiv);

    setTimeout(() => {
        successDiv.remove();
    }, 3000);
}