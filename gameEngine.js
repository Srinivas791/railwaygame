/**
 * RailYatra - Indian Railways Booking Simulator Game Engine
 * Handles XP, Levels, RailCoins, Tatkal Rush Mini-Game, Scenarios & Achievements
 */

class RailGameEngine {
  constructor() {
    this.storageKey = "railyatra_game_state";
    this.state = this.loadState();
    this.tatkalTimer = null;
    this.tatkalState = null;
  }

  getDefaultState() {
    return {
      railCoins: 5000,
      xp: 350,
      level: 1,
      levelTitle: "Apprentice Traveler",
      totalBookings: 0,
      totalKm: 0,
      achievements: {
        firstBooking: { id: "firstBooking", title: "Pehli Yatra 🚆", desc: "Book your very first train ticket", unlocked: false, icon: "🎫" },
        tatkalNinja: { id: "tatkalNinja", title: "Tatkal Ninja ⚡", desc: "Successfully book a Tatkal ticket during rush", unlocked: false, icon: "⚡" },
        firstClassLuxe: { id: "firstClassLuxe", title: "First Class Maharaja 👑", desc: "Book a ticket in 1A or Executive Class (EC)", unlocked: false, icon: "👑" },
        longVoyage: { id: "longVoyage", title: "Desh Premi 🗺️", desc: "Accumulate more than 1,000 km of simulated travel", unlocked: false, icon: "🗺️" },
        familyConductor: { id: "familyConductor", title: "Family Conductor 👨‍👩‍👧‍👦", desc: "Book for 3 or more passengers together", unlocked: false, icon: "👨‍👩‍👧‍👦" },
        coachMaster: { id: "coachMaster", title: "Berth Architect 💺", desc: "Select custom seats using the interactive coach layout", unlocked: false, icon: "💺" },
        refundMaster: { id: "refundMaster", title: "Refund Maestro 🔄", desc: "Cancel a simulated ticket and reclaim refund", unlocked: false, icon: "🔄" },
        upiDigital: { id: "upiDigital", title: "Digital Bharat 📱", desc: "Complete payment using UPI or Dynamic QR", unlocked: false, icon: "📱" }
      },
      completedScenarios: [],
      history: []
    };
  }

  loadState() {
    const saved = localStorage.getItem(this.storageKey);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Merge with defaults in case of new achievements
        const defaults = this.getDefaultState();
        return {
          ...defaults,
          ...parsed,
          achievements: { ...defaults.achievements, ...(parsed.achievements || {}) }
        };
      } catch (e) {
        console.error("Error loading game state:", e);
      }
    }
    return this.getDefaultState();
  }

  saveState() {
    this.calculateLevel();
    localStorage.setItem(this.storageKey, JSON.stringify(this.state));
    this.notifyUI();
  }

  calculateLevel() {
    const xp = this.state.xp;
    if (xp >= 5000) {
      this.state.level = 5;
      this.state.levelTitle = "IRCTC Grandmaster 🌟";
    } else if (xp >= 2500) {
      this.state.level = 4;
      this.state.levelTitle = "Chief Station Master 🚂";
    } else if (xp >= 1200) {
      this.state.level = 3;
      this.state.levelTitle = "Tatkal Ninja ⚡";
    } else if (xp >= 500) {
      this.state.level = 2;
      this.state.levelTitle = "Regular Commuter 🚆";
    } else {
      this.state.level = 1;
      this.state.levelTitle = "Apprentice Traveler 🎫";
    }
  }

  addXP(amount, reason = "Game Action") {
    this.state.xp += amount;
    this.saveState();
    this.showToast(`+${amount} XP (${reason})`, "xp");
  }

  addRailCoins(amount, reason = "Reward") {
    this.state.railCoins += amount;
    this.saveState();
    this.showToast(`+₹${amount} RailCoins! (${reason})`, "coins");
    if (window.RailwaySound) window.RailwaySound.playCoinDing();
  }

  deductRailCoins(amount) {
    if (this.state.railCoins >= amount) {
      this.state.railCoins -= amount;
      this.saveState();
      return true;
    }
    return false;
  }

  unlockAchievement(key) {
    if (this.state.achievements[key] && !this.state.achievements[key].unlocked) {
      this.state.achievements[key].unlocked = true;
      this.addXP(250, `Achievement Unlocked: ${this.state.achievements[key].title}`);
      this.addRailCoins(300, "Achievement Reward");
      this.showAchievementBanner(this.state.achievements[key]);
      if (window.RailwaySound) window.RailwaySound.playSuccessChime();
      this.saveState();
    }
  }

  showToast(message, type = "info") {
    const container = document.getElementById("game-toast-container");
    if (!container) return;

    const toast = document.createElement("div");
    toast.className = `game-toast toast-${type}`;
    let icon = "🔔";
    if (type === "xp") icon = "✨";
    if (type === "coins") icon = "🪙";
    if (type === "success") icon = "✅";
    if (type === "warn") icon = "⚠️";

    toast.innerHTML = `<span class="toast-icon">${icon}</span> <span class="toast-text">${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.classList.add("show");
    }, 10);

    setTimeout(() => {
      toast.classList.remove("show");
      setTimeout(() => toast.remove(), 400);
    }, 3500);
  }

  showAchievementBanner(achievement) {
    const banner = document.getElementById("achievement-modal");
    if (!banner) return;

    const iconEl = banner.querySelector(".achieve-icon");
    const titleEl = banner.querySelector(".achieve-title");
    const descEl = banner.querySelector(".achieve-desc");

    if (iconEl) iconEl.textContent = achievement.icon;
    if (titleEl) titleEl.textContent = achievement.title;
    if (descEl) descEl.textContent = achievement.desc;

    banner.classList.add("active");
  }

  notifyUI() {
    const xpEl = document.getElementById("header-xp-val");
    const coinsEl = document.getElementById("header-coins-val");
    const levelEl = document.getElementById("header-level-badge");

    if (xpEl) xpEl.textContent = `${this.state.xp} XP`;
    if (coinsEl) coinsEl.textContent = `₹${this.state.railCoins.toLocaleString('en-IN')}`;
    if (levelEl) levelEl.textContent = `Lvl ${this.state.level}: ${this.state.levelTitle}`;

    // Update achievements list if visible
    this.renderAchievementsGrid();
  }

  renderAchievementsGrid() {
    const grid = document.getElementById("achievements-grid");
    if (!grid) return;

    grid.innerHTML = "";
    Object.values(this.state.achievements).forEach(ach => {
      const card = document.createElement("div");
      card.className = `achievement-card ${ach.unlocked ? 'unlocked' : 'locked'}`;
      card.innerHTML = `
        <div class="ach-icon">${ach.icon}</div>
        <div class="ach-info">
          <div class="ach-title">${ach.title}</div>
          <div class="ach-desc">${ach.desc}</div>
          <div class="ach-status">${ach.unlocked ? '✅ Unlocked (+250 XP)' : '🔒 Locked'}</div>
        </div>
      `;
      grid.appendChild(card);
    });
  }

  // Record a simulated booking into game progression
  recordBooking(booking) {
    this.state.totalBookings += 1;
    this.state.totalKm += (booking.distanceKm || 400);
    this.addXP(150, "Ticket Booked");
    this.addRailCoins(Math.round(booking.totalFare * 0.05), "5% RailCoins Cashback");

    // Check achievements
    this.unlockAchievement("firstBooking");

    if (booking.travelClass === "1A" || booking.travelClass === "EC") {
      this.unlockAchievement("firstClassLuxe");
    }

    if (booking.quota === "TQ" || booking.quota === "PT" || booking.isTatkalChallenge) {
      this.unlockAchievement("tatkalNinja");
    }

    if (this.state.totalKm >= 1000) {
      this.unlockAchievement("longVoyage");
    }

    if (booking.passengers && booking.passengers.length >= 3) {
      this.unlockAchievement("familyConductor");
    }

    if (booking.hasCustomBerths) {
      this.unlockAchievement("coachMaster");
    }

    if (booking.paymentMethod === "UPI") {
      this.unlockAchievement("upiDigital");
    }

    this.saveState();
  }

  // Record a simulated ticket cancellation
  recordCancellation(refundAmount) {
    this.addRailCoins(refundAmount, "Simulated IRCTC Refund");
    this.unlockAchievement("refundMaster");
    this.saveState();
  }
}

// Global Game Engine instance
window.RailGame = new RailGameEngine();
