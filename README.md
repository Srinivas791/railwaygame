# RailYatra – Indian Railway Ticket Booking Simulator 🚆

**RailYatra** is a realistic, interactive, and gamified Indian Railways ticket booking web application inspired by IRCTC. It brings the complete experience of Indian train travel—from searching routes across 15+ major junctions to interactive coach berth layouts, authentic Electronic Reservation Slips (ERS), simulated payments, and the high-adrenaline Tatkal Booking Challenge!

---

## 🌟 Key Features

### 1. 🇮🇳 IRCTC-Inspired Aesthetics & Real-Time IST Clock
- Authentic Indian Railways blue, saffron, and crisp white color palette.
- Live Indian Standard Time (IST) digital railway clock.
- Official-style alert ticker and educational simulation disclaimers.
- Sound effects via Web Audio API (Locomotive horn, PA station chime, wheel ambient, Tatkal ticking clock).

### 2. 🚉 15+ Major Indian Railway Junctions & Dynamic Route System
- Supports direct and connecting journeys between:
  - **Vijayawada Junction (BZA)**
  - **Guntur Junction (GNT)**
  - **Hyderabad Deccan (HYB)**
  - **Secunderabad Junction (SC)**
  - **Chennai Central (MAS)**
  - **Bengaluru City (SBC)**
  - **Visakhapatnam Junction (VSKP)**
  - **Tirupati (TPTY)**
  - **New Delhi (NDLS)**
  - **Mumbai Central (MMCT)**
  - **Howrah Junction (HWH)**
  - **Patna Junction (PNBE)**
  - **Kochi Ernakulam (ERS)**
  - **Mysuru Junction (MYS)**
  - **Pune Junction (PUNE)**
- Station search autocomplete with instant code matching and one-click origin/destination swap (`⇄`).

### 3. 🚆 Realistic Train Database & Live Seat Availability
- Iconic trains included:
  - **Godavari Superfast Express (12727)**
  - **Falaknuma Express (12704)**
  - **Kerala Express (12625)**
  - **Howrah Express (12863)**
  - **Grand Trunk (GT) Express (12615)**
  - **Shatabdi Express (12028)**
  - **Vande Bharat Express (20833 / 20607)**
  - **Charminar Express (12759)**
  - **Intercity Express (12795)**
  - **Mumbai Tejas Rajdhani Express (12951)**
  - **Howrah Rajdhani Express (12301)**
  - **Deccan Queen (12123)**
  - **Narayanadri Express (12733)**
  - **AP Sampark Kranti Express (12707)**
  - **Navjeevan Express (12656)**
  - **Sampoorna Kranti Express (12393)**
  - **Netravati Express (16345)**
  - **Duronto Express (12245)**
- Real-time simulated status badges: `AVAILABLE`, `RAC`, `WAITING LIST (WL)`, and `REGRET`.
- Quota support: General (GN), Tatkal (TQ), Premium Tatkal (PT), Ladies (LD), and Senior Citizen (SS).

### 4. 💺 Interactive Coach Berth & Seat Layout Map
- **Sleeper (SL) & AC 3-Tier (3A)**: Interactive 8-berth compartment bays with Lower Berth (LB), Middle Berth (MB), Upper Berth (UB), Side Lower (SL), and Side Upper (SU), restrooms, doors, and aisle walkway.
- **AC 2-Tier (2A)**: 2-level bay layout with privacy corridors.
- **AC Chair Car (CC & EC)**: 3x2 and 2x2 seating layouts with Window, Middle, and Aisle seats.
- Click to pick specific berths or allow auto-allocation.

### 5. 👥 Multi-Passenger Booking (Up to 6 Passengers)
- Dynamic passenger cards with age, gender, berth preferences, and catering choices.
- Simulated fare breakdown including Base Fare, Superfast charge, Tatkal surcharge, Travel Insurance, and GST.

### 6. 💳 Simulated Indian Payment Gateway (RailPay)
- **UPI & Dynamic QR Code**: Dynamic canvas QR code with 3-minute expiry countdown.
- **Credit / Debit Cards**: RuPay, Visa, and Mastercard simulation with 3D-Secure OTP verification and one-click autofill.
- **Net Banking**: State Bank of India (SBI), HDFC, ICICI, Axis, and PNB bank screens.
- **RailCoins Wallet**: Pay directly using earned game currency!

### 7. 📄 Authentic IRCTC Electronic Reservation Slip (ERS)
- Realistic IRCTC layout with Indian Railways crest, watermark, and barcode.
- Unique 10-digit PNR (`XXX-XXXXXXX`), Coach/Berth assignment, and journey breakdown.
- Dynamic 2D QR code canvas.
- One-click **Print / Save as PDF** (`@media print` optimized) and **Download JSON**.

### 8. 📋 My Bookings Dashboard & Cancellation Calculator
- Persistent localStorage history of all booked tickets.
- Instant PNR enquiry and e-ticket re-printing.
- **Ticket Cancellation**: Realistic Indian Railways cancellation fee calculation (clerkage deduction based on travel class) and instant refund credited back to RailCoins.

### 9. 🎫 Dedicated PNR Status Checker
- Instant query by 10-digit PNR.
- Charting status: "CHART NOT PREPARED" vs "CHART PREPARED".
- Simulated "Prepare Chart" button to upgrade Waiting List/RAC tickets to confirmed seats!
- Train rake coach position graphic (`LOCO - SLR - GS - S1 - S2 - B1 - PC - A1 - H1`).

### 10. 🎮 Game Mechanics & Progression
- **RailCoins & XP System**: Earn XP and points on bookings, searches, and challenges.
- **Level Progression**:
  - Level 1: *Apprentice Traveler*
  - Level 2: *Regular Commuter*
  - Level 3: *Tatkal Ninja*
  - Level 4: *Chief Station Master*
  - Level 5: *IRCTC Grandmaster*
- **10:00 AM Tatkal Rush Challenge**: High-pressure mini-game against a ticking clock, seat depletion counter, and security Captcha puzzle!
- **Scenario Quests**: Complete themed missions (Tirupati Family Pilgrimage, Vande Bharat Express Rush, Howrah Sleeper Voyage).
- **Achievements & Badges**: Unlock 8+ trophies including *Pehli Yatra*, *Tatkal Ninja*, *First Class Maharaja*, *Desh Premi*, and *Digital Bharat*.

---

## 🚀 How to Run

No installations (Node.js/Python) are required! The game runs completely in any modern web browser.

### Option 1: Double-Click (Easiest)
Simply double-click **`start.bat`** inside the `railyatra` folder.

### Option 2: Open HTML File Directly
Open `index.html` in Chrome, Microsoft Edge, Brave, or Firefox.

### Option 3: Run via PowerShell Local Server
```powershell
powershell -ExecutionPolicy Bypass -File .\serve.ps1
```
Then visit: `http://localhost:8080/`

---

## 📁 File Structure

```
railyatra/
├── index.html        # IRCTC-inspired main layout, views & modals
├── styles.css        # Responsive styling, coach map & printable ERS ticket
├── trainData.js      # 15+ stations database, train schedules & coach models
├── gameEngine.js     # XP, levels, RailCoins, achievements & state manager
├── sounds.js         # Web Audio API procedural railway horn & chimes
├── app.js            # Booking controller, PNR generator & payment flow
├── start.bat         # One-click browser launcher
├── serve.ps1         # Optional PowerShell local HTTP server
└── README.md         # Documentation
```
