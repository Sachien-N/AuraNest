// Achievements Functionality

// DOM Elements
const achievementCards = document.querySelectorAll('.achievement-card');
const achievementStats = document.querySelector('.achievement-stats');

// Local Storage Key
const STORAGE_KEY = 'auraNest_achievements';

// Achievement Data
const ACHIEVEMENTS = [
    {
        id: 'first_steps',
        name: 'First Steps',
        description: 'Complete your first week of daily meditation',
        requirement: 7,
        type: 'meditation_sessions'
    },
    {
        id: 'gratitude_master',
        name: 'Gratitude Master',
        description: 'Write 30 gratitude journal entries',
        requirement: 30,
        type: 'journal_entries'
    },
    {
        id: 'inner_peace',
        name: 'Inner Peace',
        description: 'Complete 50 meditation sessions',
        requirement: 50,
        type: 'meditation_sessions'
    },
    {
        id: 'consistency_king',
        name: 'Consistency King',
        description: 'Maintain a 30-day streak in any habit',
        requirement: 30,
        type: 'habit_streak'
    },
    {
        id: 'mood_master',
        name: 'Mood Master',
        description: 'Log your mood for 60 consecutive days',
        requirement: 60,
        type: 'mood_logs'
    },
    {
        id: 'self_love_guru',
        name: 'Self-Love Guru',
        description: 'Create 100 positive affirmations',
        requirement: 100,
        type: 'affirmations'
    }
];

// Initialize Achievements
document.addEventListener('DOMContentLoaded', () => {
    loadAchievements();
    updateAchievementStats();
});

// Load Achievements
function loadAchievements() {
    const achievements = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
    
    ACHIEVEMENTS.forEach(achievement => {
        const progress = achievements[achievement.id] || {
            progress: 0,
            completed: false,
            completionDate: null
        };

        updateAchievementDisplay(achievement, progress);
    });
}

// Update Achievement Display
function updateAchievementDisplay(achievement, progress) {
    const card = document.querySelector(`[data-achievement="${achievement.id}"]`);
    if (!card) return;

    if (progress.completed) {
        card.classList.add('unlocked');
        card.querySelector('.achievement-date').textContent = 
            `Earned on ${new Date(progress.completionDate).toLocaleDateString()}`;
    } else {
        const progressBar = card.querySelector('.progress-bar-fill');
        const progressText = card.querySelector('.achievement-progress');
        
        if (progressBar && progressText) {
            const percentage = (progress.progress / achievement.requirement) * 100;
            progressBar.style.width = `${percentage}%`;
            progressText.textContent = `${progress.progress}/${achievement.requirement} ${getProgressLabel(achievement.type)}`;
        }
    }
}

// Update Achievement Progress
function updateAchievementProgress(type, amount = 1) {
    const achievements = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
    let updated = false;

    ACHIEVEMENTS.forEach(achievement => {
        if (achievement.type === type && !achievements[achievement.id]?.completed) {
            if (!achievements[achievement.id]) {
                achievements[achievement.id] = {
                    progress: 0,
                    completed: false,
                    completionDate: null
                };
            }

            achievements[achievement.id].progress += amount;

            if (achievements[achievement.id].progress >= achievement.requirement) {
                achievements[achievement.id].completed = true;
                achievements[achievement.id].completionDate = new Date().toISOString();
                showAchievementUnlock(achievement);
                updated = true;
            }

            updateAchievementDisplay(achievement, achievements[achievement.id]);
        }
    });

    if (updated) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(achievements));
        updateAchievementStats();
    }
}

// Show Achievement Unlock Animation
function showAchievementUnlock(achievement) {
    const notification = document.createElement('div');
    notification.className = 'achievement-unlock-notification';
    notification.innerHTML = `
        <div class="achievement-icon">
            <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
                <circle cx="30" cy="30" r="25" fill="#FFD166"/>
                <path d="M25 30L28 33L35 26" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        </div>
        <div class="achievement-details">
            <h3>${achievement.name}</h3>
            <p>${achievement.description}</p>
        </div>
    `;

    document.body.appendChild(notification);
    
    // Trigger confetti
    createConfetti();

    // Remove notification after animation
    setTimeout(() => {
        notification.remove();
    }, 5000);
}

// Create Confetti Effect
function createConfetti() {
    const colors = ['#FAD4D4', '#F5E4C3', '#A9D6E5', '#CDB4DB', '#FFD166'];
    
    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.animationDuration = (Math.random() * 3 + 2) + 's';
        confetti.style.opacity = Math.random();
        document.body.appendChild(confetti);

        setTimeout(() => confetti.remove(), 5000);
    }
}

// Update Achievement Stats
function updateAchievementStats() {
    if (!achievementStats) return;

    const achievements = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
    const stats = {
        earned: Object.values(achievements).filter(a => a.completed).length,
        streak: calculateCurrentStreak(),
        progress: calculateMonthlyProgress()
    };

    achievementStats.querySelector('.stat-number:nth-child(1)').textContent = stats.earned;
    achievementStats.querySelector('.stat-number:nth-child(2)').textContent = stats.streak;
    achievementStats.querySelector('.stat-number:nth-child(3)').textContent = stats.progress + '%';
}

// Helper Functions
function getProgressLabel(type) {
    const labels = {
        meditation_sessions: 'sessions',
        journal_entries: 'entries',
        habit_streak: 'days',
        mood_logs: 'days',
        affirmations: 'affirmations'
    };
    return labels[type] || 'steps';
}

function calculateCurrentStreak() {
    // Get streak from localStorage or calculate based on habit completion
    const habits = JSON.parse(localStorage.getItem('auraNest_habits')) || [];
    let maxStreak = 0;
    habits.forEach(habit => {
        if (habit.streak > maxStreak) maxStreak = habit.streak;
    });
    return maxStreak;
}

function calculateMonthlyProgress() {
    const achievements = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
    const totalAchievements = ACHIEVEMENTS.length;
    const completedAchievements = Object.values(achievements).filter(a => a.completed).length;
    return Math.round((completedAchievements / totalAchievements) * 100);
}

// Export functions for use in other modules
window.AuraNest = window.AuraNest || {};
window.AuraNest.achievements = {
    updateAchievementProgress
};