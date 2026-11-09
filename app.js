/**
 * RailYatra - Indian Railway Ticket Booking Simulator
 * Core Application Logic & State Controller
 */

// Application State
const AppState = {
  currentView: "home-view",
  searchParams: {
    fromCode: "BZA",
    toCode: "SC",
    journeyDate: getTodayDateString(1),
    passengerCount: 1,
    travelClass: "ALL",
    quota: "GN"
  },
  selectedTrain: null,
  selectedClass: null,
  selectedSeats: [], // Array of berth objects { coach, berthNumber, type }
  passengers: [],
  currentBooking: null,
  tatkalActive: false,
  tatkalInterval: null,
  tatkalSeatsLeft: 18,
  tatkalTimerSeconds: 45
};

// Date helper: Returns YYYY-MM-DD offset by days
function getTodayDateString(offsetDays = 0) {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().split("T")[0];
}

function formatDateDisplay(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  const options = { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' };
  return d.toLocaleDateString('en-IN', options);
}

// Initialize on DOM Ready
document.addEventListener("DOMContentLoaded", () => {
  initClock();
  initStationDropdowns();
  initFormInputs();
  initNavigation();
  initQuickRoutes();
  initTatkalGame();
  initPNRChecker();
  loadBookingsDashboard();
  renderScenarios();

  // Restore game state display
  if (window.RailGame) {
    window.RailGame.notifyUI();
  }

  // Set default date to tomorrow
  const dateInput = document.getElementById("search-date");
  if (dateInput) {
    dateInput.value = AppState.searchParams.journeyDate;
    dateInput.min = getTodayDateString(0);
  }

  // Audio Toggle Button Listener
  const audioToggle = document.getElementById("audio-toggle-btn");
  if (audioToggle && window.RailwaySound) {
    audioToggle.innerHTML = window.RailwaySound.muted ? "🔇 Sound Off" : "🔊 Sound On";
    audioToggle.addEventListener("click", () => {
      const isMuted = window.RailwaySound.toggleMute();
      audioToggle.innerHTML = isMuted ? "🔇 Sound Off" : "🔊 Sound On";
      if (!isMuted) window.RailwaySound.playHorn();
    });
  }

  // Play subtle horn on initial interaction
  document.body.addEventListener("click", () => {
    if (window.RailwaySound) window.RailwaySound.init();
  }, { once: true });
});

// Live IRCTC Indian Standard Time Clock
function initClock() {
  const clockEl = document.getElementById("irctc-live-clock");
  if (!clockEl) return;

  function update() {
    const now = new Date();
    const dateFormatted = now.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
    const timeFormatted = now.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false
    });
    clockEl.innerHTML = `<span class="clock-date">${dateFormatted}</span> <span class="clock-time">[${timeFormatted} IST]</span>`;
  }
  update();
  setInterval(update, 1000);
}

// Navigation between views
function navigateTo(viewId) {
  const views = document.querySelectorAll(".app-view");
  views.forEach(v => {
    v.classList.remove("active");
  });

  const target = document.getElementById(viewId);
  if (target) {
    target.classList.add("active");
    AppState.currentView = viewId;
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // Update active nav link
  const navLinks = document.querySelectorAll(".nav-link");
  navLinks.forEach(link => {
    if (link.getAttribute("data-view") === viewId) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });

  if (viewId === "mybookings-view") {
    loadBookingsDashboard();
  } else if (viewId === "game-view" && window.RailGame) {
    window.RailGame.renderAchievementsGrid();
  }
}

function initNavigation() {
  document.querySelectorAll("[data-navigate]").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const target = btn.getAttribute("data-navigate");
      navigateTo(target);
      if (window.RailwaySound) window.RailwaySound.playClick();
    });
  });

  // Mobile menu toggle
  const mobileMenuToggle = document.getElementById("mobile-menu-btn");
  const navLinksList = document.getElementById("primary-nav-links");
  if (mobileMenuToggle && navLinksList) {
    mobileMenuToggle.addEventListener("click", () => {
      navLinksList.classList.toggle("mobile-open");
    });
  }
}

// Station Dropdowns & Search
function initStationDropdowns() {
  const fromInput = document.getElementById("search-from");
  const toInput = document.getElementById("search-to");
  const fromSuggestions = document.getElementById("from-suggestions");
  const toSuggestions = document.getElementById("to-suggestions");
  const swapBtn = document.getElementById("swap-stations-btn");

  if (!fromInput || !toInput) return;

  // Pre-fill defaults
  const defFrom = window.STATIONS.find(s => s.code === AppState.searchParams.fromCode);
  const defTo = window.STATIONS.find(s => s.code === AppState.searchParams.toCode);
  if (defFrom) fromInput.value = `${defFrom.city} - ${defFrom.code}`;
  if (defTo) toInput.value = `${defTo.city} - ${defTo.code}`;

  setupAutocomplete(fromInput, fromSuggestions, (station) => {
    AppState.searchParams.fromCode = station.code;
    fromInput.value = `${station.city} (${station.code}) - ${station.name}`;
    fromSuggestions.classList.remove("open");
  });

  setupAutocomplete(toInput, toSuggestions, (station) => {
    AppState.searchParams.toCode = station.code;
    toInput.value = `${station.city} (${station.code}) - ${station.name}`;
    toSuggestions.classList.remove("open");
  });

  // Swap Stations button
  if (swapBtn) {
    swapBtn.addEventListener("click", () => {
      const tempCode = AppState.searchParams.fromCode;
      AppState.searchParams.fromCode = AppState.searchParams.toCode;
      AppState.searchParams.toCode = tempCode;

      const fromVal = fromInput.value;
      fromInput.value = toInput.value;
      toInput.value = fromVal;

      swapBtn.classList.add("rotated");
      setTimeout(() => swapBtn.classList.remove("rotated"), 300);

      if (window.RailwaySound) window.RailwaySound.playClick();
    });
  }

  // Close dropdowns when clicking outside
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".station-autocomplete-wrapper")) {
      if (fromSuggestions) fromSuggestions.classList.remove("open");
      if (toSuggestions) toSuggestions.classList.remove("open");
    }
  });
}

function setupAutocomplete(inputEl, dropdownEl, onSelect) {
  if (!inputEl || !dropdownEl) return;

  inputEl.addEventListener("focus", () => {
    renderSuggestions(inputEl.value.trim(), dropdownEl, onSelect);
    dropdownEl.classList.add("open");
  });

  inputEl.addEventListener("input", () => {
    renderSuggestions(inputEl.value.trim(), dropdownEl, onSelect);
    dropdownEl.classList.add("open");
  });
}

function renderSuggestions(query, dropdownEl, onSelect) {
  dropdownEl.innerHTML = "";
  const q = query.toLowerCase();

  const filtered = window.STATIONS.filter(s => {
    return s.code.toLowerCase().includes(q) ||
           s.name.toLowerCase().includes(q) ||
           s.city.toLowerCase().includes(q) ||
           s.state.toLowerCase().includes(q);
  });

  if (filtered.length === 0) {
    dropdownEl.innerHTML = `<div class="suggestion-item no-match">No railway stations found</div>`;
    return;
  }

  filtered.forEach(s => {
    const item = document.createElement("div");
    item.className = "suggestion-item";
    item.innerHTML = `
      <div class="sugg-main">
        <span class="sugg-city">${s.city}</span>
        <span class="sugg-code">${s.code}</span>
      </div>
      <div class="sugg-sub">${s.name} • ${s.state} (${s.zone})</div>
    `;
    item.addEventListener("click", (e) => {
      e.stopPropagation();
      onSelect(s);
      if (window.RailwaySound) window.RailwaySound.playClick();
    });
    dropdownEl.appendChild(item);
  });
}

// Popular route buttons
function initQuickRoutes() {
  document.querySelectorAll(".quick-route-chip").forEach(chip => {
    chip.addEventListener("click", () => {
      const from = chip.getAttribute("data-from");
      const to = chip.getAttribute("data-to");
      AppState.searchParams.fromCode = from;
      AppState.searchParams.toCode = to;

      const fromS = window.STATIONS.find(s => s.code === from);
      const toS = window.STATIONS.find(s => s.code === to);

      const fromInput = document.getElementById("search-from");
      const toInput = document.getElementById("search-to");

      if (fromS && fromInput) fromInput.value = `${fromS.city} (${fromS.code}) - ${fromS.name}`;
      if (toS && toInput) toInput.value = `${toS.city} (${toS.code}) - ${toS.name}`;

      if (window.RailwaySound) window.RailwaySound.playClick();
      handleSearchTrains();
    });
  });
}

// Form Inputs initialization
function initFormInputs() {
  const searchBtn = document.getElementById("search-trains-submit-btn");
  if (searchBtn) {
    searchBtn.addEventListener("click", (e) => {
      e.preventDefault();
      handleSearchTrains();
    });
  }

  // Quick date pills
  document.querySelectorAll(".date-pill").forEach(pill => {
    pill.addEventListener("click", () => {
      document.querySelectorAll(".date-pill").forEach(p => p.classList.remove("active"));
      pill.classList.add("active");
      const offset = parseInt(pill.getAttribute("data-offset") || "0", 10);
      const newDate = getTodayDateString(offset);
      AppState.searchParams.journeyDate = newDate;
      const dateInput = document.getElementById("search-date");
      if (dateInput) dateInput.value = newDate;
      if (window.RailwaySound) window.RailwaySound.playClick();
    });
  });

  // Quota selection change
  const quotaSelect = document.getElementById("search-quota");
  if (quotaSelect) {
    quotaSelect.addEventListener("change", (e) => {
      AppState.searchParams.quota = e.target.value;
      if (e.target.value === "TQ" || e.target.value === "PT") {
        if (window.RailGame) {
          window.RailGame.showToast("Tatkal Quota selected! Faster booking speeds required.", "warn");
        }
      }
    });
  }

  // Travel Class change
  const classSelect = document.getElementById("search-class");
  if (classSelect) {
    classSelect.addEventListener("change", (e) => {
      AppState.searchParams.travelClass = e.target.value;
    });
  }
}

// Execute Train Search
function handleSearchTrains() {
  const fromCode = AppState.searchParams.fromCode;
  const toCode = AppState.searchParams.toCode;

  if (!fromCode || !toCode) {
    alert("Please select both Origin and Destination stations.");
    return;
  }

  if (fromCode === toCode) {
    alert("Origin and Destination stations cannot be the same.");
    return;
  }

  const dateInput = document.getElementById("search-date");
  if (dateInput && dateInput.value) {
    AppState.searchParams.journeyDate = dateInput.value;
  }

  const quotaSelect = document.getElementById("search-quota");
  if (quotaSelect) AppState.searchParams.quota = quotaSelect.value;

  const classSelect = document.getElementById("search-class");
  if (classSelect) AppState.searchParams.travelClass = classSelect.value;

  if (window.RailwaySound) {
    window.RailwaySound.playAnnouncementChime();
  }

  if (window.RailGame) {
    window.RailGame.addXP(10, "Searched Trains");
  }

  const matchingTrains = window.findTrainsForRoute(fromCode, toCode);
  renderSearchResults(matchingTrains);
  navigateTo("trains-view");
}

// Render Search Results
function renderSearchResults(trains) {
  const container = document.getElementById("train-results-container");
  const countBadge = document.getElementById("results-count-badge");
  const routeHeader = document.getElementById("results-route-title");
  const subHeader = document.getElementById("results-route-subtitle");

  const fromS = window.STATIONS.find(s => s.code === AppState.searchParams.fromCode);
  const toS = window.STATIONS.find(s => s.code === AppState.searchParams.toCode);

  if (routeHeader) {
    routeHeader.innerHTML = `${fromS ? fromS.city : AppState.searchParams.fromCode} <span class="route-arrow">➔</span> ${toS ? toS.city : AppState.searchParams.toCode}`;
  }
  if (subHeader) {
    subHeader.innerHTML = `<strong>${formatDateDisplay(AppState.searchParams.journeyDate)}</strong> | Quota: <span class="quota-highlight">${getQuotaName(AppState.searchParams.quota)}</span> | ${trains.length} Trains Found`;
  }
  if (countBadge) {
    countBadge.textContent = `${trains.length} Trains`;
  }

  if (!container) return;
  container.innerHTML = "";

  if (trains.length === 0) {
    container.innerHTML = `
      <div class="no-trains-card">
        <div class="no-trains-icon">🚆</div>
        <h3>No Direct Trains Found</h3>
        <p>No scheduled trains match this specific route on this date. Try another station pair or date.</p>
        <button class="btn btn-secondary" onclick="navigateTo('home-view')">Back to Search</button>
      </div>
    `;
    return;
  }

  trains.forEach((train, index) => {
    const card = document.createElement("div");
    card.className = "train-card";

    // Day checklist
    const daysHtml = ["M", "T", "W", "T", "F", "S", "S"].map((dayLetter, dIdx) => {
      const fullDayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
      const runs = train.runningDays.includes(fullDayNames[dIdx]) || train.runningDays.includes("Daily");
      return `<span class="day-dot ${runs ? 'runs' : 'not-runs'}">${dayLetter}</span>`;
    }).join("");

    // Classes Carousel Cards
    const classCardsHtml = train.classes.map(cls => {
      const fare = train.scaledFares[cls] || 500;
      let availInfo = train.dynamicAvailability[cls] || { status: "AVL 24", type: "AVAILABLE", color: "green" };

      // Tatkal Quota adjustment
      if (AppState.searchParams.quota === "TQ" || AppState.searchParams.quota === "PT") {
        availInfo = {
          status: (cls === "1A") ? "REGRET" : `TATKAL AVL 0${Math.floor(Math.random() * 8) + 2}`,
          type: "AVAILABLE",
          color: "green"
        };
      }

      let statusBadgeClass = "badge-available";
      if (availInfo.type === "RAC") statusBadgeClass = "badge-rac";
      if (availInfo.type === "WL") statusBadgeClass = "badge-wl";
      if (availInfo.status === "REGRET") statusBadgeClass = "badge-regret";

      return `
        <div class="class-choice-card" onclick="selectTrainAndClass('${train.number}', '${cls}')">
          <div class="class-top">
            <span class="class-code-tag">${cls}</span>
            <span class="class-fare">₹${fare}</span>
          </div>
          <div class="class-name-small">${getClassName(cls)}</div>
          <div class="class-avail-badge ${statusBadgeClass}">
            ${availInfo.status}
          </div>
          <button class="btn-book-class">Book Now</button>
        </div>
      `;
    }).join("");

    card.innerHTML = `
      <div class="train-card-header">
        <div class="train-identity">
          <span class="train-number">${train.number}</span>
          <span class="train-name">${train.name}</span>
          <span class="train-type-badge" style="background-color: ${train.badgeColor || '#213d77'}">${train.type}</span>
          ${train.pantry ? '<span class="pantry-badge" title="Pantry Car Available">🍽️ Pantry</span>' : ''}
        </div>
        <div class="train-runs-days">
          Runs On: ${daysHtml}
        </div>
      </div>

      <div class="train-schedule-strip">
        <div class="station-block origin">
          <div class="station-time">${train.fromStop.dep}</div>
          <div class="station-name-code">${train.fromStop.name} (${train.fromStop.code})</div>
          <div class="station-day">Day 1</div>
        </div>

        <div class="journey-duration-bar">
          <span class="duration-text">${train.durationStr}</span>
          <div class="duration-line">
            <span class="line-dot start"></span>
            <span class="line-dot mid"></span>
            <span class="line-dot end"></span>
          </div>
          <span class="distance-text">${train.distanceKm} km</span>
        </div>

        <div class="station-block destination">
          <div class="station-time">${train.toStop.arr}</div>
          <div class="station-name-code">${train.toStop.name} (${train.toStop.code})</div>
          <div class="station-day">Day ${train.stops[train.stops.length-1].day || 1}</div>
        </div>
      </div>

      <div class="class-selection-carousel">
        ${classCardsHtml}
      </div>

      <div class="train-card-footer">
        <div class="sim-disclaimer-pill">⚠️ Simulated Game Data (IRCTC Inspired)</div>
        <div class="card-action-links">
          <button class="btn-text-link" onclick="openInteractiveCoach('${train.number}', '${train.classes[0]}')">💺 View Coach Layout</button>
          <button class="btn-text-link" onclick="showTrainRouteModal('${train.number}')">🗺️ View Route Schedule</button>
        </div>
      </div>
    `;

    container.appendChild(card);
  });
}

function getQuotaName(code) {
  const map = {
    "GN": "General (GN)",
    "TQ": "Tatkal (TQ)",
    "PT": "Premium Tatkal (PT)",
    "LD": "Ladies Quota (LD)",
    "SS": "Senior Citizen (SS)"
  };
  return map[code] || "General";
}

function getClassName(code) {
  const map = {
    "1A": "AC First Class",
    "2A": "AC 2 Tier",
    "3A": "AC 3 Tier",
    "SL": "Sleeper Class",
    "CC": "AC Chair Car",
    "2S": "Second Sitting",
    "EC": "Exec. Chair Car"
  };
  return map[code] || code;
}

// Select Train & Class and Proceed to Passenger Details
function selectTrainAndClass(trainNumber, travelClass) {
  const trains = window.findTrainsForRoute(AppState.searchParams.fromCode, AppState.searchParams.toCode);
  const train = trains.find(t => t.number === trainNumber);
  if (!train) return;

  AppState.selectedTrain = train;
  AppState.selectedClass = travelClass;
  AppState.selectedSeats = []; // Clear seats for auto or custom selection

  if (window.RailwaySound) window.RailwaySound.playClick();

  preparePassengerForm();
  navigateTo("passenger-view");
}

// Open Coach Map directly
function openInteractiveCoach(trainNumber, travelClass) {
  const trains = window.findTrainsForRoute(AppState.searchParams.fromCode, AppState.searchParams.toCode);
  const train = trains.find(t => t.number === trainNumber) || TRAIN_DATABASE.find(t => t.number === trainNumber);
  if (!train) return;

  AppState.selectedTrain = train;
  AppState.selectedClass = travelClass || train.classes[0];
  renderCoachLayout();
  navigateTo("coach-view");
}

// Interactive Visual Coach Layout Renderer
function renderCoachLayout() {
  const train = AppState.selectedTrain;
  const travelClass = AppState.selectedClass || "3A";
  if (!train) return;

  const coachHeader = document.getElementById("coach-header-info");
  const coachContainer = document.getElementById("coach-interactive-container");
  const selectedListEl = document.getElementById("coach-selected-list");

  const coachData = window.generateCoachLayout(travelClass, getCoachPrefix(travelClass) + "2");

  if (coachHeader) {
    coachHeader.innerHTML = `
      <h3>${train.number} - ${train.name}</h3>
      <div class="coach-sub">${coachData.className} | Coach ${coachData.coachNumber} | Max ${AppState.searchParams.passengerCount} Seat(s)</div>
    `;
  }

  if (selectedListEl) {
    renderSelectedBerthsList();
  }

  if (!coachContainer) return;
  coachContainer.innerHTML = "";

  if (coachData.type === "compartment" || coachData.type === "compartment-2a") {
    // Sleeper or AC 3/2-Tier Compartment Layout
    const trainCarriage = document.createElement("div");
    trainCarriage.className = "train-carriage compartment-mode";

    // Carriage Doors & Toilets Header
    const carriageHead = document.createElement("div");
    carriageHead.className = "carriage-end-section";
    carriageHead.innerHTML = `
      <div class="end-toilet">🚽 Toilet</div>
      <div class="end-entry">🚪 Door</div>
      <div class="end-attendant">👨‍✈️ Attendant Cabin</div>
      <div class="end-toilet">🚽 Toilet</div>
    `;
    trainCarriage.appendChild(carriageHead);

    // Bays
    const baysWrap = document.createElement("div");
    baysWrap.className = "bays-wrapper";

    coachData.bays.forEach(bay => {
      const bayEl = document.createElement("div");
      bayEl.className = "coach-bay";

      const compBerthsHtml = bay.compartmentBerths.map(berth => {
        const isSelected = AppState.selectedSeats.some(s => s.berthNumber === berth.number);
        const isBooked = berth.status === "booked";
        return `
          <div class="berth-box ${isBooked ? 'booked' : 'available'} ${isSelected ? 'selected' : ''}"
               onclick="toggleSeatSelection(${berth.number}, '${berth.type}', '${coachData.coachNumber}', '${berth.label}')">
            <span class="berth-num">${berth.number}</span>
            <span class="berth-type-label">${berth.type}</span>
          </div>
        `;
      }).join("");

      const sideBerthsHtml = bay.sideBerths.map(berth => {
        const isSelected = AppState.selectedSeats.some(s => s.berthNumber === berth.number);
        const isBooked = berth.status === "booked";
        return `
          <div class="berth-box side-berth ${isBooked ? 'booked' : 'available'} ${isSelected ? 'selected' : ''}"
               onclick="toggleSeatSelection(${berth.number}, '${berth.type}', '${coachData.coachNumber}', '${berth.label}')">
            <span class="berth-num">${berth.number}</span>
            <span class="berth-type-label">${berth.type}</span>
          </div>
        `;
      }).join("");

      bayEl.innerHTML = `
        <div class="bay-number-badge">Bay ${bay.bayNumber}</div>
        <div class="bay-grid">
          <div class="compartment-half">
            ${compBerthsHtml}
          </div>
          <div class="aisle-passage">Aisle Passage ➔</div>
          <div class="side-half">
            ${sideBerthsHtml}
          </div>
        </div>
      `;
      baysWrap.appendChild(bayEl);
    });

    trainCarriage.appendChild(baysWrap);

    // Carriage Tail
    const carriageTail = document.createElement("div");
    carriageTail.className = "carriage-end-section";
    carriageTail.innerHTML = `
      <div class="end-toilet">🚽 Toilet</div>
      <div class="end-entry">🚪 Door</div>
      <div class="end-vestibule">Gangway ➔ Next Coach</div>
    `;
    trainCarriage.appendChild(carriageTail);

    coachContainer.appendChild(trainCarriage);
  } else if (coachData.type === "chair-car") {
    // Chair car seating
    const trainCarriage = document.createElement("div");
    trainCarriage.className = "train-carriage chaircar-mode";

    const rowsWrap = document.createElement("div");
    rowsWrap.className = "chaircar-rows-wrap";

    coachData.rows.forEach(row => {
      const rowEl = document.createElement("div");
      rowEl.className = "chair-row";

      const leftHtml = row.left.map(seat => {
        const isSelected = AppState.selectedSeats.some(s => s.berthNumber === seat.number);
        const isBooked = seat.status === "booked";
        return `
          <div class="chair-seat ${isBooked ? 'booked' : 'available'} ${isSelected ? 'selected' : ''}"
               onclick="toggleSeatSelection(${seat.number}, '${seat.type}', '${coachData.coachNumber}', '${seat.label}')">
            <span class="chair-num">${seat.number}</span>
            <span class="chair-type">${seat.type}</span>
          </div>
        `;
      }).join("");

      const rightHtml = row.right.map(seat => {
        const isSelected = AppState.selectedSeats.some(s => s.berthNumber === seat.number);
        const isBooked = seat.status === "booked";
        return `
          <div class="chair-seat ${isBooked ? 'booked' : 'available'} ${isSelected ? 'selected' : ''}"
               onclick="toggleSeatSelection(${seat.number}, '${seat.type}', '${coachData.coachNumber}', '${seat.label}')">
            <span class="chair-num">${seat.number}</span>
            <span class="chair-type">${seat.type}</span>
          </div>
        `;
      }).join("");

      rowEl.innerHTML = `
        <div class="chair-group-left">${leftHtml}</div>
        <div class="chair-aisle">|</div>
        <div class="chair-group-right">${rightHtml}</div>
      `;
      rowsWrap.appendChild(rowEl);
    });

    trainCarriage.appendChild(rowsWrap);
    coachContainer.appendChild(trainCarriage);
  } else {
    // First AC
    const trainCarriage = document.createElement("div");
    trainCarriage.className = "train-carriage firstac-mode";
    coachData.cabins.forEach(cab => {
      const cabEl = document.createElement("div");
      cabEl.className = "first-ac-cabin";
      const berthsHtml = cab.berths.map(berth => {
        const isSelected = AppState.selectedSeats.some(s => s.berthNumber === berth.number);
        const isBooked = berth.status === "booked";
        return `
          <div class="berth-box first-class-berth ${isBooked ? 'booked' : 'available'} ${isSelected ? 'selected' : ''}"
               onclick="toggleSeatSelection(${berth.number}, '${berth.type}', '${coachData.coachNumber}', '${berth.label}')">
            <span class="berth-num">${berth.number}</span>
            <span class="berth-type-label">${berth.label}</span>
          </div>
        `;
      }).join("");
      cabEl.innerHTML = `<h4>${cab.name}</h4><div class="cabin-grid">${berthsHtml}</div>`;
      trainCarriage.appendChild(cabEl);
    });
    coachContainer.appendChild(trainCarriage);
  }
}

function getCoachPrefix(travelClass) {
  if (travelClass === "1A") return "H";
  if (travelClass === "2A") return "A";
  if (travelClass === "3A") return "B";
  if (travelClass === "CC") return "C";
  if (travelClass === "EC") return "E";
  if (travelClass === "2S") return "D";
  return "S"; // SL
}

// Seat selection toggle
function toggleSeatSelection(berthNumber, type, coach, label) {
  const existingIdx = AppState.selectedSeats.findIndex(s => s.berthNumber === berthNumber);

  if (existingIdx !== -1) {
    AppState.selectedSeats.splice(existingIdx, 1);
  } else {
    const maxAllowed = parseInt(AppState.searchParams.passengerCount || 1, 10);
    if (AppState.selectedSeats.length >= maxAllowed) {
      if (maxAllowed === 1) {
        // Replace previous single seat
        AppState.selectedSeats = [{ berthNumber, type, coach, label }];
      } else {
        alert(`You have chosen ${maxAllowed} passenger(s). Deselect an existing seat first or add more passengers.`);
        return;
      }
    } else {
      AppState.selectedSeats.push({ berthNumber, type, coach, label });
    }
  }

  if (window.RailwaySound) window.RailwaySound.playClick();
  renderCoachLayout();
  renderSelectedBerthsList();
}

function renderSelectedBerthsList() {
  const container = document.getElementById("coach-selected-list");
  if (!container) return;

  if (AppState.selectedSeats.length === 0) {
    container.innerHTML = `<span class="empty-note">No seats selected yet. Click any available seat above.</span>`;
    return;
  }

  container.innerHTML = AppState.selectedSeats.map(s => {
    return `<span class="selected-seat-chip">Coach ${s.coach} - Seat ${s.berthNumber} (${s.label})</span>`;
  }).join(" ");
}

function confirmCoachBerthsAndProceed() {
  if (AppState.selectedSeats.length === 0) {
    alert("Please select at least one seat/berth from the layout, or choose auto-allocation.");
    return;
  }
  preparePassengerForm();
  navigateTo("passenger-view");
}

// Passenger Form Preparation
function preparePassengerForm() {
  const train = AppState.selectedTrain;
  const travelClass = AppState.selectedClass;
  if (!train) return;

  const header = document.getElementById("passenger-header-summary");
  const count = parseInt(AppState.searchParams.passengerCount || 1, 10);
  const container = document.getElementById("passenger-cards-container");

  if (header) {
    const fare = (train.scaledFares[travelClass] || 500);
    header.innerHTML = `
      <div class="train-mini-badge">
        <span class="train-no">${train.number}</span>
        <span class="train-title">${train.name}</span>
        <span class="class-pill">${getClassName(travelClass)} (${travelClass})</span>
      </div>
      <div class="route-date-line">
        ${train.fromStop.name} ➔ ${train.toStop.name} | ${formatDateDisplay(AppState.searchParams.journeyDate)} | Fare: <strong>₹${fare}</strong> per passenger
      </div>
    `;
  }

  if (!container) return;
  container.innerHTML = "";

  for (let i = 1; i <= count; i++) {
    const card = document.createElement("div");
    card.className = "passenger-form-card";

    // If custom seat was pre-selected from coach view
    const preSeat = AppState.selectedSeats[i - 1];
    const preSeatLabel = preSeat ? `Pre-selected: Coach ${preSeat.coach} / Seat ${preSeat.berthNumber} (${preSeat.label})` : "";

    card.innerHTML = `
      <div class="passenger-card-header">
        <h4>Passenger ${i}</h4>
        <span class="pre-seat-indicator">${preSeatLabel}</span>
      </div>
      <div class="passenger-fields-grid">
        <div class="form-group">
          <label>Full Name *</label>
          <input type="text" class="input-field p-name" placeholder="Name as per Govt ID" required value="${i === 1 ? 'Srinivas Rao' : ''}">
        </div>
        <div class="form-group small-field">
          <label>Age *</label>
          <input type="number" class="input-field p-age" placeholder="Age" min="1" max="110" required value="${i === 1 ? '28' : '26'}">
        </div>
        <div class="form-group">
          <label>Gender *</label>
          <select class="input-field p-gender">
            <option value="Male" ${i === 1 ? 'selected' : ''}>Male</option>
            <option value="Female" ${i === 2 ? 'selected' : ''}>Female</option>
            <option value="Transgender">Transgender</option>
          </select>
        </div>
        <div class="form-group">
          <label>Berth Preference</label>
          <select class="input-field p-berth">
            <option value="No Preference">No Preference</option>
            <option value="Lower Berth (LB)">Lower Berth (LB)</option>
            <option value="Middle Berth (MB)">Middle Berth (MB)</option>
            <option value="Upper Berth (UB)">Upper Berth (UB)</option>
            <option value="Side Lower (SL)">Side Lower (SL)</option>
            <option value="Side Upper (SU)">Side Upper (SU)</option>
            <option value="Window Seat (WS)">Window Seat</option>
          </select>
        </div>
        <div class="form-group">
          <label>Meal Preference</label>
          <select class="input-field p-meal">
            <option value="Veg">Veg Hindu Meal</option>
            <option value="Non-Veg">Non-Veg</option>
            <option value="Jain">Jain Meal</option>
            <option value="No Food">No Food</option>
          </select>
        </div>
      </div>
    `;
    container.appendChild(card);
  }

  updateFareSummary();
}

function addAnotherPassenger() {
  const currentCount = parseInt(AppState.searchParams.passengerCount || 1, 10);
  if (currentCount >= 6) {
    alert("Indian Railways allows a maximum of 6 passengers per ticket reservation.");
    return;
  }
  AppState.searchParams.passengerCount = currentCount + 1;
  const countSelect = document.getElementById("search-passengers");
  if (countSelect) countSelect.value = AppState.searchParams.passengerCount;

  preparePassengerForm();
  if (window.RailwaySound) window.RailwaySound.playClick();
}

// Update Pricing Breakdown in Passenger View
function updateFareSummary() {
  const train = AppState.selectedTrain;
  const travelClass = AppState.selectedClass;
  if (!train) return;

  const count = parseInt(AppState.searchParams.passengerCount || 1, 10);
  const baseRate = train.scaledFares[travelClass] || 500;
  const baseFare = baseRate * count;

  let reservationFee = 40 * count;
  let superfastCharge = 45 * count;
  let tatkalFee = (AppState.searchParams.quota === "TQ" || AppState.searchParams.quota === "PT") ? (150 * count) : 0;
  let insurance = 0.45 * count;
  let gst = (travelClass !== "SL" && travelClass !== "2S") ? Math.round(baseFare * 0.05) : 0;

  const total = Math.round(baseFare + reservationFee + superfastCharge + tatkalFee + insurance + gst);

  const fareBox = document.getElementById("fare-breakdown-box");
  if (fareBox) {
    fareBox.innerHTML = `
      <div class="fare-row"><span>Ticket Base Fare (${count}x ₹${baseRate}):</span> <span>₹${baseFare}</span></div>
      <div class="fare-row"><span>Reservation & Superfast Charge:</span> <span>₹${reservationFee + superfastCharge}</span></div>
      ${tatkalFee > 0 ? `<div class="fare-row tatkal-line"><span>Tatkal Surcharge:</span> <span>₹${tatkalFee}</span></div>` : ''}
      <div class="fare-row"><span>Travel Insurance:</span> <span>₹${insurance.toFixed(2)}</span></div>
      ${gst > 0 ? `<div class="fare-row"><span>GST (5%):</span> <span>₹${gst}</span></div>` : ''}
      <div class="fare-total-row"><span>Total Amount:</span> <span class="total-price">₹${total}</span></div>
    `;
  }
  return total;
}

// Submit Passenger Details and Go to Payment
function proceedToPayment() {
  const train = AppState.selectedTrain;
  const travelClass = AppState.selectedClass;
  if (!train) {
    alert("Please select a train first.");
    return;
  }

  // Collect passengers
  const pCards = document.querySelectorAll(".passenger-form-card");
  const passengers = [];

  for (let idx = 0; idx < pCards.length; idx++) {
    const card = pCards[idx];
    const nameInput = card.querySelector(".p-name");
    const ageInput = card.querySelector(".p-age");
    const genderSelect = card.querySelector(".p-gender");
    const berthSelect = card.querySelector(".p-berth");
    const mealSelect = card.querySelector(".p-meal");

    const name = nameInput.value.trim();
    const age = parseInt(ageInput.value, 10);
    if (!name) {
      alert(`Please enter the name for Passenger ${idx + 1}`);
      nameInput.focus();
      return;
    }
    if (isNaN(age) || age <= 0 || age > 115) {
      alert(`Please enter a valid age for Passenger ${idx + 1}`);
      ageInput.focus();
      return;
    }

    // Determine Coach / Berth allocation
    let allocatedCoach = getCoachPrefix(travelClass) + (Math.floor(Math.random() * 4) + 1);
    let allocatedBerth = (Math.floor(Math.random() * 60) + 1);
    let berthLabel = berthSelect.value !== "No Preference" ? berthSelect.value.split(" ")[0] : "Lower";

    // If pre-selected custom berth exists
    if (AppState.selectedSeats[idx]) {
      allocatedCoach = AppState.selectedSeats[idx].coach;
      allocatedBerth = AppState.selectedSeats[idx].berthNumber;
      berthLabel = AppState.selectedSeats[idx].label;
    }

    passengers.push({
      sno: idx + 1,
      name,
      age,
      gender: genderSelect.value,
      berthPreference: berthSelect.value,
      mealPreference: mealSelect.value,
      allocatedCoach,
      allocatedBerth,
      allocatedBerthType: berthLabel,
      bookingStatus: "CNF"
    });
  }

  AppState.passengers = passengers;

  // Prepare simulated booking draft
  const totalFare = updateFareSummary();
  const mobileInput = document.getElementById("contact-mobile");
  const emailInput = document.getElementById("contact-email");

  AppState.currentBooking = {
    pnr: generatePNR(),
    transactionId: "TXN" + Date.now().toString().slice(-9),
    bookingTimestamp: new Date().toISOString(),
    trainNumber: train.number,
    trainName: train.name,
    fromStation: train.fromStop.name,
    fromCode: train.fromStop.code,
    toStation: train.toStop.name,
    toCode: train.toStop.code,
    journeyDate: AppState.searchParams.journeyDate,
    departureTime: train.fromStop.dep,
    arrivalTime: train.toStop.arr,
    distanceKm: train.distanceKm,
    durationStr: train.durationStr,
    travelClass,
    quota: AppState.searchParams.quota,
    passengers,
    totalFare,
    paymentMethod: "UPI",
    status: "CONFIRMED",
    hasCustomBerths: AppState.selectedSeats.length > 0,
    isTatkalChallenge: AppState.tatkalActive,
    chartStatus: "CHART NOT PREPARED",
    contactMobile: (mobileInput && mobileInput.value) || "9876543210",
    contactEmail: (emailInput && emailInput.value) || "passenger@railyatra.in"
  };

  renderPaymentGateway(totalFare);
  navigateTo("payment-view");
}

// Generate authentic IRCTC style 10-digit PNR (3 digits + 7 digits)
function generatePNR() {
  const prefix = Math.floor(200 + Math.random() * 700); // 3-digit zone prefix
  const suffix = Math.floor(1000000 + Math.random() * 9000000); // 7-digit sequential
  return `${prefix}-${suffix}`;
}

// Render Payment Modal
function renderPaymentGateway(totalFare) {
  const amountEl = document.getElementById("payment-amount-display");
  const walletBalEl = document.getElementById("payment-wallet-bal");
  if (amountEl) amountEl.textContent = `₹${totalFare}`;
  if (walletBalEl && window.RailGame) {
    walletBalEl.textContent = `₹${window.RailGame.state.railCoins.toLocaleString('en-IN')}`;
  }

  // Draw Dynamic Simulated UPI QR Code on Canvas
  drawUPIQRCode("upi-qr-canvas", `railyatra-irctc@sbi?am=${totalFare}&pn=IndianRailways`);

  // Start UPI countdown timer (3:00)
  startPaymentCountdown(180);
}

function startPaymentCountdown(seconds) {
  const timerEl = document.getElementById("upi-countdown-timer");
  if (!timerEl) return;

  let rem = seconds;
  if (window.paymentInterval) clearInterval(window.paymentInterval);

  window.paymentInterval = setInterval(() => {
    rem--;
    const mins = Math.floor(rem / 60);
    const secs = rem % 60;
    timerEl.textContent = `QR expires in ${mins}:${secs < 10 ? '0' : ''}${secs}`;
    if (rem <= 0) {
      clearInterval(window.paymentInterval);
      timerEl.textContent = "QR Expired. Refresh to retry.";
    }
  }, 1000);
}

// Draw a realistic QR-Code matrix on HTML5 Canvas
function drawUPIQRCode(canvasId, text) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const size = canvas.width || 180;
  ctx.clearRect(0, 0, size, size);

  // Background
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, size, size);

  // Simple pseudo-random hash generator based on text for authentic aesthetic QR look
  const cells = 25;
  const cellSize = size / cells;

  let seed = 0;
  for (let i = 0; i < text.length; i++) seed = (seed + text.charCodeAt(i) * 31) % 10000;

  // Outer boundary corners (Standard QR markers)
  function drawCorner(r, c) {
    ctx.fillStyle = "#0f3868";
    ctx.fillRect(c * cellSize, r * cellSize, cellSize * 7, cellSize * 7);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect((c + 1) * cellSize, (r + 1) * cellSize, cellSize * 5, cellSize * 5);
    ctx.fillStyle = "#0f3868";
    ctx.fillRect((c + 2) * cellSize, (r + 2) * cellSize, cellSize * 3, cellSize * 3);
  }

  drawCorner(0, 0);
  drawCorner(0, cells - 7);
  drawCorner(cells - 7, 0);

  // Data dots
  ctx.fillStyle = "#111827";
  for (let r = 0; r < cells; r++) {
    for (let c = 0; c < cells; c++) {
      // Skip corners
      if ((r < 8 && c < 8) || (r < 8 && c >= cells - 8) || (r >= cells - 8 && c < 8)) continue;
      seed = (seed * 9301 + 49297) % 233280;
      if (seed / 233280 > 0.48) {
        ctx.fillRect(c * cellSize, r * cellSize, cellSize - 0.5, cellSize - 0.5);
      }
    }
  }

  // Center Indian flag or train icon badge
  ctx.fillStyle = "#f37021";
  ctx.beginPath();
  ctx.arc(size / 2, size / 2, cellSize * 2, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#ffffff";
  ctx.font = `bold ${cellSize * 2}px sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("🚆", size / 2, size / 2);
}

// Process Simulated Payment
function completePayment(method) {
  if (!AppState.currentBooking) return;
  AppState.currentBooking.paymentMethod = method;

  // RailCoins check
  if (method === "RailCoins") {
    if (window.RailGame && !window.RailGame.deductRailCoins(AppState.currentBooking.totalFare)) {
      alert("Insufficient RailCoins balance! Choose UPI or Card, or complete more challenges.");
      return;
    }
  }

  // Show OTP verification modal
  showOTPModal(() => {
    finalizeBooking();
  });
}

function showOTPModal(onSuccess) {
  const modal = document.getElementById("otp-modal");
  const otpInput = document.getElementById("sim-otp-input");
  const randomOtp = Math.floor(100000 + Math.random() * 900000);

  const otpHint = document.getElementById("otp-sent-hint");
  if (otpHint) otpHint.innerHTML = `Simulated OTP <strong>${randomOtp}</strong> sent to ${AppState.currentBooking.contactMobile}`;

  if (otpInput) otpInput.value = "";
  if (modal) modal.classList.add("active");

  // Autofill button
  const autoFillBtn = document.getElementById("btn-autofill-otp");
  if (autoFillBtn) {
    autoFillBtn.onclick = () => {
      if (otpInput) otpInput.value = randomOtp;
      if (window.RailwaySound) window.RailwaySound.playClick();
    };
  }

  // Confirm button
  const verifyBtn = document.getElementById("btn-verify-otp");
  if (verifyBtn) {
    verifyBtn.onclick = () => {
      if (modal) modal.classList.remove("active");
      if (onSuccess) onSuccess();
    };
  }

  // Close
  const closeBtn = document.getElementById("btn-close-otp");
  if (closeBtn) {
    closeBtn.onclick = () => {
      if (modal) modal.classList.remove("active");
    };
  }
}

// Finalize Booking and save to LocalStorage
function finalizeBooking() {
  const booking = AppState.currentBooking;
  if (!booking) return;

  // Save to LocalStorage
  saveBookingToStorage(booking);

  // Record into Game Engine
  if (window.RailGame) {
    window.RailGame.recordBooking(booking);
  }

  if (window.RailwaySound) {
    window.RailwaySound.playSuccessChime();
  }

  // Render IRCTC E-Ticket
  renderTicket(booking);
  navigateTo("ticket-view");
}

function saveBookingToStorage(booking) {
  const list = getBookingsFromStorage();
  list.unshift(booking);
  localStorage.setItem("railyatra_saved_bookings", JSON.stringify(list));
}

function getBookingsFromStorage() {
  const saved = localStorage.getItem("railyatra_saved_bookings");
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
  }
  return [];
}

// Render Authentic IRCTC Electronic Reservation Slip (ERS)
function renderTicket(booking) {
  const ticketEl = document.getElementById("printable-ticket-content");
  if (!ticketEl) return;

  const pnrFormatted = booking.pnr;
  const passengersRows = booking.passengers.map((p, idx) => {
    return `
      <tr>
        <td class="text-center">${idx + 1}</td>
        <td><strong>${p.name}</strong></td>
        <td>${p.age}</td>
        <td>${p.gender === 'Male' ? 'M' : 'F'}</td>
        <td><span class="cnf-tag">${p.bookingStatus}</span></td>
        <td><strong>Coach: ${p.allocatedCoach} / Berth: ${p.allocatedBerth}</strong></td>
        <td>${p.allocatedBerthType}</td>
      </tr>
    `;
  }).join("");

  ticketEl.innerHTML = `
    <div class="ticket-slip-container">
      <div class="ticket-watermark">INDIAN RAILWAYS / IRCTC SIMULATOR</div>

      <div class="ticket-header-irctc">
        <div class="ticket-logo-left">
          <span class="indian-rail-symbol">🚆</span>
          <div>
            <h3>INDIAN RAILWAYS</h3>
            <div class="irctc-sub-title">Electronic Reservation Slip (ERS) - Simulated Copy</div>
          </div>
        </div>
        <div class="ticket-logo-right">
          <div class="irctc-crest-text">IRCTC E-TICKETING</div>
          <div class="ticket-txnid">Txn ID: ${booking.transactionId}</div>
          <div class="ticket-booked-date">Booked On: ${new Date(booking.bookingTimestamp).toLocaleString('en-IN')}</div>
        </div>
      </div>

      <div class="ticket-pnr-banner">
        <div class="pnr-main-block">
          <span class="pnr-label">PNR NUMBER</span>
          <span class="pnr-value">${pnrFormatted}</span>
        </div>
        <div class="pnr-sub-block">
          <span>Train No. & Name: <strong>${booking.trainNumber} / ${booking.trainName}</strong></span>
          <span>Quota: <strong>${getQuotaName(booking.quota)}</strong></span>
        </div>
        <div class="pnr-sub-block">
          <span>Class: <strong>${getClassName(booking.travelClass)} (${booking.travelClass})</strong></span>
          <span>Booking Status: <strong class="badge-cnf">${booking.status}</strong></span>
        </div>
      </div>

      <table class="ticket-table journey-details-table">
        <thead>
          <tr>
            <th>From Station</th>
            <th>Boarding Station</th>
            <th>To Station</th>
            <th>Reservation Upto</th>
            <th>Distance</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>${booking.fromStation} (${booking.fromCode})</strong></td>
            <td>${booking.fromStation} (${booking.fromCode})</td>
            <td><strong>${booking.toStation} (${booking.toCode})</strong></td>
            <td>${booking.toStation} (${booking.toCode})</td>
            <td>${booking.distanceKm} KM</td>
          </tr>
          <tr>
            <td colspan="2">Scheduled Departure: <strong>${booking.departureTime} hrs</strong> (${formatDateDisplay(booking.journeyDate)})</td>
            <td colspan="2">Scheduled Arrival: <strong>${booking.arrivalTime} hrs</strong></td>
            <td>Duration: <strong>${booking.durationStr}</strong></td>
          </tr>
        </tbody>
      </table>

      <div class="passenger-section-heading">Passenger Details</div>
      <table class="ticket-table passengers-table">
        <thead>
          <tr>
            <th class="text-center">#</th>
            <th>Passenger Name</th>
            <th>Age</th>
            <th>Sex</th>
            <th>Booking Status</th>
            <th>Current Status (Coach / Seat)</th>
            <th>Berth Type</th>
          </tr>
        </thead>
        <tbody>
          ${passengersRows}
        </tbody>
      </table>

      <div class="ticket-fare-section">
        <div class="ticket-qr-box">
          <canvas id="ticket-qr-canvas" width="130" height="130"></canvas>
          <div class="qr-label">Scan to Verify Simulated PNR</div>
        </div>
        <div class="ticket-fare-table-wrap">
          <table class="ticket-fare-table">
            <tr><td>Ticket Fare:</td><td>₹${booking.totalFare}</td></tr>
            <tr><td>IRCTC Convenience Fee:</td><td>₹0.00 (Simulator Promo)</td></tr>
            <tr><td>Total Amount Paid:</td><td><strong class="total-bold">₹${booking.totalFare}</strong></td></tr>
            <tr><td>Payment Mode:</td><td>${booking.paymentMethod} (Simulated)</td></tr>
          </table>
        </div>
      </div>

      <div class="ticket-footer-instructions">
        <strong>IMPORTANT INSTRUCTIONS:</strong>
        <ol>
          <li>This is a simulated Indian Railways e-ticket generated for entertainment and educational purposes in RailYatra.</li>
          <li>In real Indian Railways travel, passengers must carry a valid original government photo ID (Aadhaar, Voter ID, Passport, PAN Card, Driving License).</li>
          <li>Train chart is typically prepared 4 hours prior to scheduled departure.</li>
        </ol>
      </div>
    </div>
  `;

  // Draw Ticket QR Code
  setTimeout(() => {
    drawUPIQRCode("ticket-qr-canvas", `IRCTC-PNR:${booking.pnr}|TRAIN:${booking.trainNumber}|DATE:${booking.journeyDate}`);
  }, 100);
}

// Download Ticket as Printable PDF
function printTicket() {
  window.print();
}

// Download Ticket as JSON file
function downloadTicketJSON() {
  if (!AppState.currentBooking) return;
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(AppState.currentBooking, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute("href", dataStr);
  downloadAnchor.setAttribute("download", `RailYatra_Ticket_${AppState.currentBooking.pnr}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

// My Bookings Dashboard
function loadBookingsDashboard() {
  const container = document.getElementById("my-bookings-list");
  if (!container) return;

  const bookings = getBookingsFromStorage();
  container.innerHTML = "";

  if (bookings.length === 0) {
    container.innerHTML = `
      <div class="no-bookings-card">
        <div class="empty-icon">📭</div>
        <h3>No Tickets Booked Yet</h3>
        <p>You haven't booked any simulated journeys yet. Start exploring Indian railway routes!</p>
        <button class="btn btn-primary" onclick="navigateTo('home-view')">Book Your First Journey</button>
      </div>
    `;
    return;
  }

  bookings.forEach(b => {
    const card = document.createElement("div");
    card.className = `booking-history-card ${b.status.toLowerCase()}`;
    const pNames = b.passengers.map(p => p.name).join(", ");

    card.innerHTML = `
      <div class="bh-top">
        <div class="bh-pnr">PNR: <strong>${b.pnr}</strong></div>
        <div class="bh-status status-${b.status.toLowerCase()}">${b.status}</div>
      </div>
      <div class="bh-middle">
        <div class="bh-train">${b.trainNumber} - ${b.trainName}</div>
        <div class="bh-route">${b.fromStation} (${b.fromCode}) ➔ ${b.toStation} (${b.toCode})</div>
        <div class="bh-date">Journey Date: <strong>${formatDateDisplay(b.journeyDate)}</strong> | Class: ${b.travelClass}</div>
        <div class="bh-passengers">Passengers: ${pNames}</div>
        <div class="bh-fare">Total Fare: <strong>₹${b.totalFare}</strong></div>
      </div>
      <div class="bh-actions">
        <button class="btn btn-secondary btn-sm" onclick="viewHistoricalTicket('${b.pnr}')">📄 View E-Ticket</button>
        <button class="btn btn-secondary btn-sm" onclick="checkSpecificPNR('${b.pnr}')">🔍 Check Status</button>
        ${b.status !== 'CANCELLED' ? `<button class="btn btn-danger btn-sm" onclick="cancelBooking('${b.pnr}')">❌ Cancel Ticket</button>` : '<span class="cancelled-tag">Cancelled</span>'}
      </div>
    `;
    container.appendChild(card);
  });
}

function viewHistoricalTicket(pnr) {
  const bookings = getBookingsFromStorage();
  const b = bookings.find(item => item.pnr === pnr);
  if (!b) return;

  AppState.currentBooking = b;
  renderTicket(b);
  navigateTo("ticket-view");
}

// Cancel Booking with realistic IRCTC cancellation deductions
function cancelBooking(pnr) {
  const bookings = getBookingsFromStorage();
  const b = bookings.find(item => item.pnr === pnr);
  if (!b || b.status === "CANCELLED") return;

  // Realistic Indian Railways cancellation charges:
  // Flat clerkage fee: 1A=₹240, 2A=₹200, 3A=₹180, SL=₹120, 2S=₹60 per passenger
  let clerkage = 120;
  if (b.travelClass === "1A") clerkage = 240;
  else if (b.travelClass === "2A") clerkage = 200;
  else if (b.travelClass === "3A") clerkage = 180;
  else if (b.travelClass === "SL") clerkage = 120;
  else if (b.travelClass === "2S") clerkage = 60;

  const totalDeduction = clerkage * b.passengers.length;
  const refundAmount = Math.max(0, b.totalFare - totalDeduction);

  const confirmMsg = `Are you sure you want to cancel simulated ticket PNR ${pnr}?\n\nOriginal Fare: ₹${b.totalFare}\nIRCTC Cancellation Clerkage: ₹${totalDeduction}\nSimulated Refund Credit: ₹${refundAmount}`;
  if (!confirm(confirmMsg)) return;

  b.status = "CANCELLED";
  b.passengers.forEach(p => p.bookingStatus = "CAN");
  localStorage.setItem("railyatra_saved_bookings", JSON.stringify(bookings));

  if (window.RailGame) {
    window.RailGame.recordCancellation(refundAmount);
  }

  alert(`Ticket ${pnr} cancelled successfully! Simulated refund of ₹${refundAmount} has been credited to your RailCoins.`);
  loadBookingsDashboard();
}

// Dedicated PNR Status Checker
function initPNRChecker() {
  const pnrInput = document.getElementById("pnr-query-input");
  const pnrSubmit = document.getElementById("pnr-query-submit-btn");

  if (pnrSubmit && pnrInput) {
    pnrSubmit.addEventListener("click", () => {
      const pnr = pnrInput.value.trim();
      if (!pnr) {
        alert("Please enter a 10-digit PNR number.");
        return;
      }
      checkSpecificPNR(pnr);
    });
  }
}

function checkSpecificPNR(pnr) {
  navigateTo("pnr-view");
  const pnrInput = document.getElementById("pnr-query-input");
  if (pnrInput) pnrInput.value = pnr;

  const resultsBox = document.getElementById("pnr-query-results");
  if (!resultsBox) return;

  const bookings = getBookingsFromStorage();
  const b = bookings.find(item => item.pnr.replace('-', '') === pnr.replace('-', ''));

  if (b) {
    displayPNRDetails(b, resultsBox);
  } else {
    // Generate simulated dynamic lookup for arbitrary PNR
    const mock = {
      pnr,
      trainNumber: "12727",
      trainName: "Godavari Superfast Express",
      fromStation: "Vijayawada Jn",
      fromCode: "BZA",
      toStation: "Secunderabad Jn",
      toCode: "SC",
      journeyDate: getTodayDateString(2),
      travelClass: "3A",
      chartStatus: "CHART NOT PREPARED",
      status: "CONFIRMED",
      passengers: [
        { sno: 1, name: "Passenger 1", age: 32, gender: "M", bookingStatus: "WL 12", allocatedCoach: "B2", allocatedBerth: 44, allocatedBerthType: "Lower", currentStatus: "RAC 4" }
      ]
    };
    displayPNRDetails(mock, resultsBox);
  }

  if (window.RailwaySound) window.RailwaySound.playClick();
}

function displayPNRDetails(b, container) {
  const isCancelled = b.status === "CANCELLED";
  const passRows = b.passengers.map((p, idx) => {
    return `
      <tr>
        <td>${idx + 1}</td>
        <td><strong>${p.name}</strong></td>
        <td><span class="${isCancelled ? 'badge-regret' : 'badge-cnf'}">${isCancelled ? 'CAN' : (p.bookingStatus || 'CNF')}</span></td>
        <td><strong>${isCancelled ? 'Cancelled' : `CNF Coach ${p.allocatedCoach} / Berth ${p.allocatedBerth} (${p.allocatedBerthType})`}</strong></td>
      </tr>
    `;
  }).join("");

  container.innerHTML = `
    <div class="pnr-result-card">
      <div class="pnr-res-header">
        <div>
          <span class="pnr-pill">PNR: ${b.pnr}</span>
          <h3>${b.trainNumber} - ${b.trainName}</h3>
        </div>
        <div class="chart-status-box">
          <span class="chart-status-label">Charting Status:</span>
          <span class="chart-tag ${b.chartStatus === 'CHART PREPARED' ? 'chart-done' : 'chart-pending'}" id="pnr-chart-tag">
            ${b.chartStatus || 'CHART NOT PREPARED'}
          </span>
        </div>
      </div>

      <div class="pnr-route-strip">
        <span>From: <strong>${b.fromStation} (${b.fromCode})</strong></span>
        <span>➔</span>
        <span>To: <strong>${b.toStation} (${b.toCode})</strong></span>
        <span>| Date: <strong>${formatDateDisplay(b.journeyDate)}</strong></span>
        <span>| Class: <strong>${b.travelClass}</strong></span>
      </div>

      <table class="pnr-pass-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Passenger</th>
            <th>Booking Status</th>
            <th>Current Status</th>
          </tr>
        </thead>
        <tbody>
          ${passRows}
        </tbody>
      </table>

      <!-- Simulated Train Coach Composition Rake Indicator -->
      <div class="coach-rake-visual">
        <div class="rake-title">Estimated Coach Position:</div>
        <div class="rake-track">
          <span class="rake-box loco">🚂 LOCO</span>
          <span class="rake-box slr">SLR</span>
          <span class="rake-box gen">GS</span>
          <span class="rake-box coach">S1</span>
          <span class="rake-box coach">S2</span>
          <span class="rake-box coach active-rake">B1</span>
          <span class="rake-box coach">B2</span>
          <span class="rake-box coach">A1</span>
          <span class="rake-box pantry">🍽️ PC</span>
          <span class="rake-box coach">H1</span>
          <span class="rake-box gen">GS</span>
          <span class="rake-box slr">SLR</span>
        </div>
      </div>

      <div class="pnr-simulation-actions">
        <button class="btn btn-secondary btn-sm" onclick="simulateChartPreparation('${b.pnr}')">⚡ Simulate Chart Preparation</button>
      </div>
    </div>
  `;
}

function simulateChartPreparation(pnr) {
  const chartTag = document.getElementById("pnr-chart-tag");
  if (chartTag) {
    chartTag.className = "chart-tag chart-done";
    chartTag.textContent = "CHART PREPARED (Charted 4 hrs prior to dep)";
  }
  if (window.RailGame) {
    window.RailGame.showToast("Chart prepared! All RAC/WL positions upgraded to confirmed berths.", "success");
    window.RailGame.addXP(50, "Simulated Charting");
  }
  if (window.RailwaySound) window.RailwaySound.playSuccessChime();
}

// Tatkal Booking Challenge Game Mode
function initTatkalGame() {
  const startBtn = document.getElementById("btn-start-tatkal-challenge");
  if (!startBtn) return;

  startBtn.addEventListener("click", () => {
    startTatkalChallenge();
  });
}

function startTatkalChallenge() {
  const gameArea = document.getElementById("tatkal-game-arena");
  if (!gameArea) return;

  AppState.tatkalActive = true;
  AppState.tatkalSeatsLeft = 14;
  AppState.tatkalTimerSeconds = 30;

  if (window.RailwaySound) {
    window.RailwaySound.playHorn();
  }

  gameArea.innerHTML = `
    <div class="tatkal-arena-card">
      <div class="tatkal-clock-top">
        <div class="tatkal-live-timer" id="tatkal-clock">09:59:58 AM</div>
        <div class="tatkal-window-status" id="tatkal-msg">Window Opening in 2 seconds...</div>
      </div>

      <div class="tatkal-depletion-meter">
        <span class="meter-label">Live Tatkal Seats Remaining:</span>
        <span class="meter-count" id="tatkal-seat-count">${AppState.tatkalSeatsLeft}</span>
      </div>

      <div class="tatkal-challenge-box" id="tatkal-step-container">
        <p>Prepare yourself! When the clock strikes 10:00:00 AM, solve the captcha and grab your confirmed seat before they sell out!</p>
      </div>
    </div>
  `;

  // 2-second countdown to 10:00:00 AM Tatkal open
  let preCountdown = 2;
  const preTimer = setInterval(() => {
    preCountdown--;
    if (preCountdown <= 0) {
      clearInterval(preTimer);
      beginTatkalRushCountdown();
    }
  }, 1000);
}

function beginTatkalRushCountdown() {
  const clockEl = document.getElementById("tatkal-clock");
  const msgEl = document.getElementById("tatkal-msg");
  const countEl = document.getElementById("tatkal-seat-count");
  const stepContainer = document.getElementById("tatkal-step-container");

  if (clockEl) clockEl.textContent = "10:00:00 AM (AC Tatkal OPEN)";
  if (msgEl) {
    msgEl.textContent = "🔥 HIGH DEMAND RUSH! FASTEST FINGERS FIRST!";
    msgEl.className = "tatkal-window-status rush-open";
  }

  // Generate railway Captcha puzzle
  const num1 = Math.floor(Math.random() * 20) + 10;
  const num2 = Math.floor(Math.random() * 15) + 5;
  const correctSum = num1 + num2;

  if (stepContainer) {
    stepContainer.innerHTML = `
      <div class="tatkal-captcha-panel">
        <h4>Step 1: Security Verification</h4>
        <div class="captcha-question">Solve to prove you are human: <strong>${num1} + ${num2} = ?</strong></div>
        <div class="captcha-input-row">
          <input type="number" id="tatkal-captcha-ans" placeholder="Answer" autofocus>
          <button class="btn btn-primary" id="btn-submit-captcha">Submit & Proceed ➔</button>
        </div>
      </div>
    `;

    document.getElementById("btn-submit-captcha").onclick = () => {
      const val = parseInt(document.getElementById("tatkal-captcha-ans").value, 10);
      if (val === correctSum) {
        tatkalStepTwo();
      } else {
        alert("Incorrect Captcha! Tatkal seats are slipping away!");
        if (window.RailwaySound) window.RailwaySound.playTick();
      }
    };
  }

  // Seat depletion ticker every 3 seconds
  if (AppState.tatkalInterval) clearInterval(AppState.tatkalInterval);
  AppState.tatkalInterval = setInterval(() => {
    AppState.tatkalSeatsLeft -= Math.floor(Math.random() * 3) + 1;
    if (window.RailwaySound) window.RailwaySound.playTick();

    if (AppState.tatkalSeatsLeft <= 0) {
      clearInterval(AppState.tatkalInterval);
      AppState.tatkalSeatsLeft = 0;
      if (countEl) {
        countEl.textContent = "WL 14 (Regret)";
        countEl.style.color = "red";
      }
    } else {
      if (countEl) countEl.textContent = `${AppState.tatkalSeatsLeft}`;
    }
  }, 2500);
}

function tatkalStepTwo() {
  const stepContainer = document.getElementById("tatkal-step-container");
  if (!stepContainer) return;

  stepContainer.innerHTML = `
    <div class="tatkal-form-step">
      <h4>Step 2: Instant Passenger Fill</h4>
      <p>Seats are dropping fast! Confirm quick passenger details:</p>
      <div class="tatkal-fast-fields">
        <input type="text" id="tatkal-fast-name" value="Srinivas Rao (Self)">
        <select id="tatkal-fast-berth">
          <option value="Lower">Lower Berth</option>
          <option value="Side Lower">Side Lower</option>
        </select>
        <button class="btn btn-success" id="btn-tatkal-lock">Lock & Book Ticket ⚡</button>
      </div>
    </div>
  `;

  document.getElementById("btn-tatkal-lock").onclick = () => {
    if (AppState.tatkalInterval) clearInterval(AppState.tatkalInterval);

    if (AppState.tatkalSeatsLeft > 0) {
      // Won Tatkal
      AppState.searchParams.fromCode = "BZA";
      AppState.searchParams.toCode = "SC";
      AppState.searchParams.quota = "TQ";
      AppState.searchParams.travelClass = "3A";
      AppState.searchParams.passengerCount = 1;

      const trains = window.findTrainsForRoute("BZA", "SC");
      AppState.selectedTrain = trains[0];
      AppState.selectedClass = "3A";

      proceedToPayment();

      if (window.RailGame) {
        window.RailGame.addXP(400, "Tatkal Challenge Won!");
        window.RailGame.addRailCoins(600, "Tatkal Bonus");
        window.RailGame.unlockAchievement("tatkalNinja");
      }
    } else {
      alert("Oh no! All Tatkal seats were booked before checkout! Try again to hone your speed.");
    }
  };
}

// Render Passenger Scenarios
function renderScenarios() {
  const container = document.getElementById("scenarios-list-container");
  if (!container) return;

  const scenarios = [
    {
      id: "sc-1",
      title: "The Grand Tirupati Pilgrimage",
      desc: "Book a trip from Vijayawada (BZA) to Tirupati (TPTY) for a family of 4 with senior citizens.",
      badge: "Family Quest",
      from: "BZA",
      to: "TPTY",
      passengers: 4,
      travelClass: "3A",
      reward: "300 XP + ₹400 RailCoins"
    },
    {
      id: "sc-2",
      title: "The Techie Hyderabad Express",
      desc: "Fast business travel: Vijayawada (BZA) to Secunderabad (SC) on the high-speed Vande Bharat.",
      badge: "Speed Quest",
      from: "BZA",
      to: "SC",
      passengers: 1,
      travelClass: "CC",
      reward: "200 XP + ₹250 RailCoins"
    },
    {
      id: "sc-3",
      title: "Capital Journey to New Delhi",
      desc: "Cross 2,000+ km from Vijayawada (BZA) to New Delhi (NDLS) on the Grand Trunk or Kerala Express.",
      badge: "Long Voyage",
      from: "BZA",
      to: "NDLS",
      passengers: 2,
      travelClass: "2A",
      reward: "500 XP + ₹600 RailCoins"
    },
    {
      id: "sc-4",
      title: "The Howrah Gateway",
      desc: "Secunderabad (SC) to Howrah (HWH) on the legendary Falaknuma Express.",
      badge: "Classic Express",
      from: "SC",
      to: "HWH",
      passengers: 2,
      travelClass: "SL",
      reward: "350 XP + ₹350 RailCoins"
    }
  ];

  container.innerHTML = scenarios.map(sc => {
    return `
      <div class="scenario-card">
        <div class="scenario-badge">${sc.badge}</div>
        <h4>${sc.title}</h4>
        <p>${sc.desc}</p>
        <div class="scenario-meta">
          <span>Route: <strong>${sc.from} ➔ ${sc.to}</strong></span>
          <span>Reward: <strong>${sc.reward}</strong></span>
        </div>
        <button class="btn btn-primary btn-sm" onclick="startScenario('${sc.from}', '${sc.to}', ${sc.passengers}, '${sc.travelClass}')">Accept Challenge ➔</button>
      </div>
    `;
  }).join("");
}

function startScenario(fromCode, toCode, passengers, travelClass) {
  AppState.searchParams.fromCode = fromCode;
  AppState.searchParams.toCode = toCode;
  AppState.searchParams.passengerCount = passengers;
  AppState.searchParams.travelClass = travelClass;

  const fromS = window.STATIONS.find(s => s.code === fromCode);
  const toS = window.STATIONS.find(s => s.code === toCode);
  const fromInput = document.getElementById("search-from");
  const toInput = document.getElementById("search-to");
  const pCount = document.getElementById("search-passengers");

  if (fromS && fromInput) fromInput.value = `${fromS.city} (${fromS.code}) - ${fromS.name}`;
  if (toS && toInput) toInput.value = `${toS.city} (${toS.code}) - ${toS.name}`;
  if (pCount) pCount.value = passengers;

  if (window.RailGame) {
    window.RailGame.showToast(`Scenario active: Travel from ${fromCode} to ${toCode}!`, "xp");
  }

  handleSearchTrains();
}

// Show Train Route Modal with intermediate stops
function showTrainRouteModal(trainNumber) {
  const train = TRAIN_DATABASE.find(t => t.number === trainNumber);
  if (!train) return;

  const modal = document.getElementById("route-modal");
  const title = document.getElementById("route-modal-title");
  const body = document.getElementById("route-modal-body");

  if (title) title.innerHTML = `${train.number} - ${train.name} (${train.type})`;

  if (body) {
    const stopsRows = train.stops.map((s, idx) => {
      return `
        <tr>
          <td>${idx + 1}</td>
          <td><strong>${s.name} (${s.code})</strong></td>
          <td>${s.arr}</td>
          <td>${s.dep}</td>
          <td>${s.km} KM</td>
          <td>Day ${s.day || 1}</td>
        </tr>
      `;
    }).join("");

    body.innerHTML = `
      <table class="modal-schedule-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Station</th>
            <th>Arr</th>
            <th>Dep</th>
            <th>Distance</th>
            <th>Day</th>
          </tr>
        </thead>
        <tbody>
          ${stopsRows}
        </tbody>
      </table>
    `;
  }

  if (modal) modal.classList.add("active");
}

function closeRouteModal() {
  const modal = document.getElementById("route-modal");
  if (modal) modal.classList.remove("active");
}

// Global functions exposed to window
window.navigateTo = navigateTo;
window.selectTrainAndClass = selectTrainAndClass;
window.openInteractiveCoach = openInteractiveCoach;
window.toggleSeatSelection = toggleSeatSelection;
window.confirmCoachBerthsAndProceed = confirmCoachBerthsAndProceed;
window.addAnotherPassenger = addAnotherPassenger;
window.proceedToPayment = proceedToPayment;
window.completePayment = completePayment;
window.printTicket = printTicket;
window.downloadTicketJSON = downloadTicketJSON;
window.viewHistoricalTicket = viewHistoricalTicket;
window.checkSpecificPNR = checkSpecificPNR;
window.cancelBooking = cancelBooking;
window.simulateChartPreparation = simulateChartPreparation;
window.startScenario = startScenario;
window.showTrainRouteModal = showTrainRouteModal;
window.closeRouteModal = closeRouteModal;
