# GRIDLOCK SUPER-APP
### Unified QR-Based Micro-Location Indoor Wayfinding & Comprehensive Campus ERP Ecosystem

> **Major Project Presentation • Technical Defense & Functional Prototype**  
> **Institution:** Department of Computer Science & Engineering, BMS Institute of Technology and Management (BMSIT&M)  
> **Project Team — Apex Achievers:**
> - **Gagan N Prasad** (26UG1BYCS0588-T)
> - **Manav Redhu** (26UG1BYCS0293-T)
> - **Chimbili Manju Ganesh** (26UG1BYCS0043-T)
> - **Machal Ritesh Govardhan** (26UG1BYCS0111-T)  
> 
> **Faculty Supervisor:** Dr. Harish Kumar N, Associate Professor, Dept. of CSE

---

## 📌 Executive Summary

Indoor navigation inside multi-story concrete academic institutions suffers from severe GPS signal attenuation and static signboard lag. At the same time, collegiate operations (attendance, marks, fee ledgers, hall tickets, faculty consultations, and facility maintenance) reside across fragmented, non-responsive desktop silos.

**Gridlock Super-App** bridges physical and digital collegiate realities by combining:
1. **Wall-Mounted QR Cartesian Anchors**: Fixed touchpoints that resolve user coordinates in $< 200\text{ms}$ with zero spatial drift and zero GPS reliance.
2. **Algorithmic Pathfinding ($A^*$ Solver)**: 3D multi-floor graph traversal with real-time hazard edge weight inflation ($W_{\text{active}} = W_{\text{base}} + \infty$) for automatic detour recalculation around wet floors or maintenance closures.
3. **Unified Campus ERP & Operations**: Live attendance with $<75\%$ shortage detention alerts, CIE evaluation ledger, fee dues clearance, time-variant cryptographic Digital ID, automated attendance-gated hall tickets, faculty cabin occupancy radar, and geo-tagged grievance tracking.

```
                         ┌────────────────────────────────────────┐
                         │      Physical Campus QR Scan Point     │
                         └───────────────────┬────────────────────┘
                                             │
                     ┌───────────────────────┴───────────────────────┐
                     ▼                                               ▼
    ┌─────────────────────────────────┐             ┌─────────────────────────────────┐
    │      Micro-Location Engine      │             │   Authenticated Student Portal  │
    │  (Static & Dynamic Spatial Graph)│             │     (Unified ERP / Academics)   │
    └────────────────┬────────────────┘             └────────────────┬────────────────┘
                     │                                               │
        ┌────────────┴────────────┐                     ┌────────────┴────────────┐
        ▼                         ▼                     ▼                         ▼
┌──────────────┐          ┌──────────────┐      ┌──────────────┐          ┌──────────────┐
│ Wayfinding & │          │ Janitorial & │      │  Academic &  │          │Administrative│
│ Routing Core │          │ Safety Detour│      │  Financials  │          │ & Desk Ops   │
├──────────────┤          ├──────────────┤      ├──────────────┤          ├──────────────┤
│• Turn-by-Turn│          │• Wet Floor   │      │• Attendance  │          │• Cabin Radar │
│• 3D Graph    │          │  Detour Math │      │  Tracker     │          │• Slot Booking│
│• Multi-Floor │          │• Janitorial  │      │• CIE Marks   │          │• Geo-Tagged  │
│  Transitions │          │  Live Toggle │      │• Fee Ledger  │          │  Grievance   │
│• Auto-Detours│          │• Egress SOS  │      │• Hall Ticket │          │• Digital ID  │
└──────────────┘          └──────────────┘      └──────────────┘          └──────────────┘
```

---

## 🏛️ Building Layout Model: BMSIT CSE Academic Complex

The prototype models the CSE Department Academic Block across two functional levels:

### Ground Floor (`GF`, Elevation: `0.0m`)
- **Entries & Atrium**: Main Campus Entrance (`QR-G-01`), Cafeteria & Lounge Annex (`QR-G-02`), Central Atrium & Helpdesk (`QR-G-03`), West Corridor (`QR-G-04`), Central Concourse (`QR-G-07`), East Corridor (`QR-G-11`).
- **Laboratories & Halls**: Systems & OS Lab (`QR-G-05`, Cap: 60), AI & Machine Learning Lab (`QR-G-06`, Cap: 60), CSE Main Seminar Auditorium (`QR-G-10`, Cap: 250).
- **Amenities & Safety**: Ground Floor Hygiene Wing (`QR-G-12`), Central Stairwell 1 (`QR-G-08`), Passenger Elevator 1 (`QR-G-09`), South Emergency Exit (`QR-G-13`), Designated Safe Assembly Ground (`QR-G-14`).

### First Floor (`1F`, Elevation: `4.2m`)
- **Vertical Landings**: Central Stairwell 1 Landing (`QR-1-01`), Passenger Elevator 1 Landing (`QR-1-02`).
- **Administrative Wing**: 1F West Faculty Passage (`QR-1-04`), HOD Executive Suite — Dr. Harish Kumar N (`QR-1-05`), Faculty Chambers Cabins F1-F12 (`QR-1-06`).
- **Academic & Research Wing**: 1F Central Concourse (`QR-1-03`), East Lecture Wing Junction (`QR-1-12`), Lecture Hall 101 (`QR-1-07`), Lecture Hall 102 (`QR-1-08`), Digital Library & OPAC Center (`QR-1-10`), IoT & Embedded Systems Lab (`QR-1-11`), North Emergency Fire Staircase (`QR-1-09`).

---

## 🧮 Mathematical Algorithmic Engine ($A^*$ Solver)

Pathfinding between any Cartesian origin $(x_u, y_u, \text{floor}_u)$ and target destination $(x_v, y_v, \text{floor}_v)$ uses the $A^*$ heuristic evaluation:

$$f(n) = g(n) + h(n)$$

Where:
- $g(n)$ is the accumulated walking corridor distance along traversed graph edges.
- $h(n)$ is the 3D Euclidean distance heuristic penalizing physical vertical transitions:

$$h(u, v) = \sqrt{(x_u - x_v)^2 + (y_u - y_v)^2 + ((\text{floor}_u - \text{floor}_v) \times 25.0)^2}$$

### Dynamic Hazard Edge Weight Inflation Protocol

When janitorial staff flags a wet floor or physical obstacle along corridor edge $e$:

$$W_{\text{active}} = W_{\text{base}} + \infty \quad (\approx 10^8)$$

The solver immediately diverts pedestrian routes through alternative clean corridors, updating active navigation sessions without spatial drift. Once the cleaning operation completes, a single tap removes the infinite weight penalty:

$$W_{\text{active}} = W_{\text{base}}$$

---

## 👥 5-Tier Role-Based Access Control (RBAC) Matrix

| Platform Feature | Student | Faculty | HOD | Janitorial / Facilities | Admin |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **Indoor QR Navigation** | Full Access | Full Access | Full Access | Service Routes | Node Editor |
| **Corridor Hazard Override** | Report Only | Report Only | Review Alerts | Toggle Status | Manage All |
| **Attendance & Marks** | View Only | Mark & Edit | Dept Metrics | No Access | Full Audit |
| **Fee Ledger & Payments** | View & Pay | No Access | No Access | No Access | Finance Mgmt |
| **Hall Ticket Download** | Gated (&ge;75%) | No Access | Override Gate | No Access | Audit Logs |
| **Cabin Appointments** | Book Slots | Manage Slots | Dept Calendar | No Access | Full Logs |
| **Geo-Tagged Grievances** | Submit Ticket | Department Fix | Escalate | Triage & Clean | Assign Staff |

---

## 🚀 Quick Start & Development

### Prerequisites
- **Node.js** (v18+ or v20+)
- **npm** (v9+)

### Installation
```bash
# Clone the repository
git clone https://github.com/gagan-kikkeri-bot/Gridlock_idp_1st_year_group_project.git
cd Gridlock_idp_1st_year_group_project

# Install dependencies (includes automated WASM compatibility hook)
npm install

# Start local development server
npm run dev
```

### Production Build & Preview
```bash
# Compile optimized production bundle
npm run build

# Preview production build locally
npm run preview
```

The application will be served at `http://localhost:3000` (or the port specified by Vite).

---

## 📂 Project Structure

```
├── data/
│   ├── building.json            # Building structural metadata & room registry
│   ├── nodes.json               # Wall-mounted Cartesian QR anchor nodes
│   └── edges.json               # Graph transit edges & base walking distances
├── scripts/
│   └── patch-rollup.js          # Windows WASM execution compatibility hook
├── src/
│   ├── components/
│   │   ├── Header.jsx           # 5-Tier RBAC switcher, QR scan trigger, SOS button
│   │   ├── BuildingMap.jsx      # Interactive SVG blueprint with multi-floor switching & hazards
│   │   ├── NavigationPanel.jsx  # Wayfinding selector, turn-by-turn directions, detour stats
│   │   ├── QRScannerModal.jsx   # Sub-200ms camera QR decode simulator
│   │   ├── ErpHub.jsx           # Attendance (<75% alert), CIE ledger, fees, digital ID, hall ticket
│   │   ├── CabinRadar.jsx       # Faculty cabin occupancy radar & appointment scheduler
│   │   ├── GrievanceDesk.jsx    # Geo-tagged helpdesk with 4-stage resolution pipeline
│   │   ├── JanitorialControls.jsx # Live corridor hazard toggling & detour demo
│   │   └── SosModal.jsx         # Emergency evacuation routing to closest safe assembly zone
│   ├── data/
│   │   └── campusData.js        # Graph structures, faculty roster, student academic records
│   ├── services/
│   │   └── pathfinding.js       # Mathematical A* algorithm, hazard inflation, emergency solver
│   ├── App.jsx                  # Main application orchestrator
│   ├── main.jsx                 # React root renderer
│   └── index.css                # Tailwind CSS & custom glowing vector animations
├── index.html                   # HTML5 entry point with responsive PWA viewport
├── package.json                 # Project dependencies & npm scripts
├── tailwind.config.js           # Tailwind utility theme configuration
└── vite.config.js               # Vite bundler configuration
```

---

## 🧪 Live Validation Scenarios

1. **Scenario 1 — Micro-Location QR Positioning**:
   - Click **"Scan QR Anchor"** in the top navigation or click any room on the map.
   - Select `Systems & OS Lab (QR-G-05)`.
   - The origin coordinates instantly lock in $< 180\text{ms}$ with zero drift.

2. **Scenario 2 — Dynamic Hazard Detour Recalculation**:
   - Set Origin: `Main Campus Entrance (Ground Floor)` & Destination: `HOD Suite (First Floor)`.
   - The default optimal route paths through `Ground Central Corridor West` &rarr; `Central Stairwell 1`.
   - Switch to the **"Janitorial Detour Controls"** tab and toggle **"Wet Floor / Cleaning"** on `Ground Central Corridor West`.
   - Notice the live route dynamically diverts via the southern concourse link, updating total distance and highlighting the active hazard on the map!

3. **Scenario 3 — Automated Hall Ticket Gate**:
   - Open **"Academic & Financial ERP"** &rarr; **"Hall Ticket Gate"**.
   - Notice the candidate has 83.2% cumulative attendance and ₹0.00 dues balance. The admit card is unlocked.
   - If attendance drops below 75% or fees are pending, the gate automatically restricts download until proctorial clearance.

4. **Scenario 4 — Rapid Emergency SOS Evacuation**:
   - Click the red **"SOS"** button in the header.
   - The system instantly computes the shortest safe evacuation route from your current room to the nearest fire exit or assembly point, automatically avoiding any corridors blocked by hazards.
