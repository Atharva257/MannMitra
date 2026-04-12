/**
 * Badge Definitions and Logic
 */
export const BADGE_DEFINITIONS = [
  // Streak Badges
  { name: "First Step", category: "Streak", icon: "🌱", criteria: (user) => (user.stats.chatCount + user.stats.breathingCount + user.stats.journalCount + user.stats.canvasCount) >= 1 },
  { name: "3-Day Streak", category: "Streak", icon: "🔥", criteria: (user) => user.currentStreak >= 3 },
  { name: "Week Warrior", category: "Streak", icon: "🛡️", criteria: (user) => user.currentStreak >= 7 },
  { name: "Fortnight Strong", category: "Streak", icon: "⚔️", criteria: (user) => user.currentStreak >= 14 },
  { name: "Monthly Champion", category: "Streak", icon: "👑", criteria: (user) => user.currentStreak >= 30 },

  // Therapy Module Badges
  { name: "Deep Breather", category: "Therapy", icon: "🌬️", criteria: (user) => user.stats.breathingCount >= 1 },
  { name: "Calm Master", category: "Therapy", icon: "🧘", criteria: (user) => user.stats.breathingCount >= 10 },
  { name: "Artist Within", category: "Therapy", icon: "🎨", criteria: (user) => user.stats.canvasCount >= 1 },
  { name: "Color Your Mind", category: "Therapy", icon: "🌈", criteria: (user) => user.stats.canvasCount >= 5 },
  { name: "Grateful Heart", category: "Therapy", icon: "✍️", criteria: (user) => user.stats.journalCount >= 1 },
  { name: "Gratitude Guru", category: "Therapy", icon: "🙏", criteria: (user) => user.stats.journalCount >= 7 },

  // CBT & Reframing Badges
  { name: "Thought Challenger", category: "CBT", icon: "🧩", criteria: (user) => user.stats.cbtCount >= 1 },
  { name: "Mind Shifter", category: "CBT", icon: "🌀", criteria: (user) => user.stats.cbtCount >= 5 },
  { name: "Pattern Breaker", category: "CBT", icon: "🔨", criteria: (user) => user.stats.cbtCount >= 10 },

  // Assessment Badges
  { name: "Self Aware", category: "Assessment", icon: "👁️", criteria: (user) => user.stats.assessmentCount >= 1 },
  { name: "Check-In Pro", category: "Assessment", icon: "📊", criteria: (user) => user.stats.assessmentCount >= 3 },

  // Connection Badges
  { name: "Not Alone", category: "Connection", icon: "🤝", criteria: (user) => user.stats.sessionCount >= 1 },
  { name: "Open Up", category: "Connection", icon: "💬", criteria: (user) => user.stats.chatCount >= 1 },

  // Extra/Surprise Badges
  { name: "Night Owl", category: "Special", icon: "🦉", criteria: (user) => {
    const hour = new Date().getHours();
    return hour >= 22 || hour < 4;
  }},
  { name: "Early Bird", category: "Special", icon: "🌅", criteria: (user) => {
    const hour = new Date().getHours();
    return hour >= 5 && hour < 8;
  }},
];

/**
 * Checks and awards new badges to a user
 * @param {Object} user - Mongoose user document
 * @returns {Array} - Array of newly awarded badge objects
 */
export const checkAndAwardBadges = async (user) => {
  const newlyAwarded = [];
  const existingBadgeNames = user.badges.map(b => b.name);

  for (const badgeDef of BADGE_DEFINITIONS) {
    if (!existingBadgeNames.includes(badgeDef.name)) {
      if (badgeDef.criteria(user)) {
        const newBadge = {
          name: badgeDef.name,
          category: badgeDef.category,
          icon: badgeDef.icon,
          awardedAt: new Date()
        };
        user.badges.push(newBadge);
        newlyAwarded.push(newBadge);
      }
    }
  }

  // Handle Milestone Badges (Meta-badges)
  if (!existingBadgeNames.includes("MannMitra Star") && user.badges.length >= 10) {
    const starBadge = { name: "MannMitra Star", category: "Milestone", icon: "🌟", awardedAt: new Date() };
    user.badges.push(starBadge);
    newlyAwarded.push(starBadge);
  }

  if (!user.firstLogin && !existingBadgeNames.includes("Journey Begun")) {
    const onboardingBadge = { name: "Journey Begun", category: "Milestone", icon: "🚀", awardedAt: new Date() };
    user.badges.push(onboardingBadge);
    newlyAwarded.push(onboardingBadge);
  }

  if (newlyAwarded.length > 0) {
    await user.save();
  }

  return newlyAwarded;
};