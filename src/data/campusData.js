// Gridlock Super-App - Campus & Building Spatial Graph Dataset
// BMS Institute of Technology and Management (BMSIT&M) - CSE Complex

export const BUILDING_METADATA = {
  id: "bmsit-cse-apex",
  name: "Department of Computer Science & Engineering",
  campus: "BMSIT&M Campus, Yelahanka, Bengaluru",
  block: "Apex Block / Academic Complex",
  totalFloors: 2,
  floors: [
    { id: 0, code: "GF", name: "Ground Floor", elevation: "0.0m", description: "Lobby, Core Labs, Seminar Hall, Canteen" },
    { id: 1, code: "1F", name: "First Floor", elevation: "4.2m", description: "HOD Suite, Faculty Cabins, Smart Classrooms, Library" }
  ]
};

export const SPATIAL_NODES = {
  // === GROUND FLOOR (floor: 0) ===
  "N_ENTRANCE": {
    id: "N_ENTRANCE",
    floor: 0,
    x: 100,
    y: 480,
    label: "Main Campus Entrance",
    qr: "QR-G-01",
    type: "entry",
    description: "RFID Turnstiles & Security Post",
    details: "Primary pedestrian entry point from campus quadrangle."
  },
  "N_CANTEEN": {
    id: "N_CANTEEN",
    floor: 0,
    x: 100,
    y: 320,
    label: "Cafeteria & Lounge Annex",
    qr: "QR-G-02",
    type: "amenity",
    description: "Student Lounge & Refreshments",
    details: "Seating capacity 120, snack kiosk and water station."
  },
  "N_LOBBY": {
    id: "N_LOBBY",
    floor: 0,
    x: 260,
    y: 480,
    label: "Atrium & Welcome Desk",
    qr: "QR-G-03",
    type: "lobby",
    description: "Central Information Hub",
    details: "Interactive digital kiosk and campus visitor registry."
  },
  "N_CORR_W": {
    id: "N_CORR_W",
    floor: 0,
    x: 260,
    y: 320,
    label: "West Corridor Junction (G)",
    qr: "QR-G-04",
    type: "corridor",
    description: "Access to Systems Lab & Canteen",
    details: "High-traffic corridor intersection."
  },
  "N_SYS_LAB": {
    id: "N_SYS_LAB",
    floor: 0,
    x: 180,
    y: 160,
    label: "Systems & OS Lab (Lab 01)",
    qr: "QR-G-05",
    type: "lab",
    description: "60 High-Performance Linux Terminals",
    details: "Equipped with dual-boot Linux/Windows workstations."
  },
  "N_AI_LAB": {
    id: "N_AI_LAB",
    floor: 0,
    x: 380,
    y: 160,
    label: "AI & Machine Learning Lab (Lab 02)",
    qr: "QR-G-06",
    type: "lab",
    description: "NVIDIA RTX GPU Workstations",
    details: "Dedicated to Deep Learning and Edge AI projects."
  },
  "N_CORR_C": {
    id: "N_CORR_C",
    floor: 0,
    x: 500,
    y: 320,
    label: "Central Corridor Concourse (G)",
    qr: "QR-G-07",
    type: "corridor",
    description: "Main Ground Floor Artery",
    details: "Links East and West academic wings."
  },
  "N_STAIR_G": {
    id: "N_STAIR_G",
    floor: 0,
    x: 450,
    y: 420,
    label: "Central Stairwell 1 (G)",
    qr: "QR-G-08",
    type: "stair",
    connectsTo: "N_STAIR_1F",
    description: "Multi-floor Vertical Transition",
    details: "Wide fire-rated stairwell connecting Floor 0 to Floor 1."
  },
  "N_LIFT_G": {
    id: "N_LIFT_G",
    floor: 0,
    x: 550,
    y: 420,
    label: "Passenger Elevator 1 (G)",
    qr: "QR-G-09",
    type: "lift",
    connectsTo: "N_LIFT_1F",
    description: "Accessible Vertical Transit",
    details: "13-passenger automatic elevator with braille controls."
  },
  "N_SEMINAR": {
    id: "N_SEMINAR",
    floor: 0,
    x: 640,
    y: 160,
    label: "CSE Main Seminar Auditorium",
    qr: "QR-G-10",
    type: "hall",
    description: "Tiered Seating Hall (Cap: 250)",
    details: "Acoustically treated, Dolby sound and 4K laser projector."
  },
  "N_CORR_E": {
    id: "N_CORR_E",
    floor: 0,
    x: 760,
    y: 320,
    label: "East Corridor Junction (G)",
    qr: "QR-G-11",
    type: "corridor",
    description: "Access to Seminar Hall & Restrooms",
    details: "Corridor branch towards the eastern exit."
  },
  "N_RESTROOM_G": {
    id: "N_RESTROOM_G",
    floor: 0,
    x: 880,
    y: 160,
    label: "Ground Floor Hygiene Wing",
    qr: "QR-G-12",
    type: "amenity",
    description: "Restrooms & Custodial Station",
    details: "Cleaned hourly by janitorial facilities team."
  },
  "N_FIRE_EXIT_S": {
    id: "N_FIRE_EXIT_S",
    floor: 0,
    x: 880,
    y: 480,
    label: "South Emergency Fire Exit",
    qr: "QR-G-13",
    type: "emergency",
    description: "Push-Bar Egress Door",
    details: "Direct rapid access to southern open grounds."
  },
  "N_ASSEMBLY": {
    id: "N_ASSEMBLY",
    floor: 0,
    x: 500,
    y: 540,
    label: "Safe Assembly Zone A",
    qr: "QR-G-14",
    type: "emergency",
    description: "Campus Evacuation Muster Point",
    details: "Open-air designated safe gathering perimeter."
  },

  // === FIRST FLOOR (floor: 1) ===
  "N_STAIR_1F": {
    id: "N_STAIR_1F",
    floor: 1,
    x: 450,
    y: 420,
    label: "Central Stairwell 1 (1F Landing)",
    qr: "QR-1-01",
    type: "stair",
    connectsTo: "N_STAIR_G",
    description: "Vertical Stairwell Transition",
    details: "Landing for Central Staircase 1 on First Floor."
  },
  "N_LIFT_1F": {
    id: "N_LIFT_1F",
    floor: 1,
    x: 550,
    y: 420,
    label: "Passenger Elevator 1 (1F Landing)",
    qr: "QR-1-02",
    type: "lift",
    connectsTo: "N_LIFT_G",
    description: "Vertical Elevator Transit",
    details: "Elevator lobby for 1st floor academic offices."
  },
  "N_1F_CORR_C": {
    id: "N_1F_CORR_C",
    floor: 1,
    x: 500,
    y: 320,
    label: "1st Floor Central Concourse",
    qr: "QR-1-03",
    type: "corridor",
    description: "Main Departmental Hallway",
    details: "Primary corridor on level 1."
  },
  "N_1F_CORR_W": {
    id: "N_1F_CORR_W",
    floor: 1,
    x: 260,
    y: 320,
    label: "Faculty Wing Corridor (1F)",
    qr: "QR-1-04",
    type: "corridor",
    description: "Access to HOD & Staff Cabins",
    details: "Quiet zone adjacent to administrative cabins."
  },
  "N_HOD": {
    id: "N_HOD",
    floor: 1,
    x: 200,
    y: 160,
    label: "HOD Suite - Dr. Harish Kumar N",
    qr: "QR-1-05",
    type: "office",
    description: "Head of Dept Cabin & Conference",
    details: "Room 101. Office hours: 14:00 - 16:30. Inquiries via appointment radar."
  },
  "N_FACULTY": {
    id: "N_FACULTY",
    floor: 1,
    x: 370,
    y: 160,
    label: "Faculty Chambers (Cabins F1-F12)",
    qr: "QR-1-06",
    type: "office",
    description: "CSE Faculty Consultation Suites",
    details: "Professors Sunitha R, Rajesh K, Meenakshi S cabins."
  },
  "N_LH_101": {
    id: "N_LH_101",
    floor: 1,
    x: 600,
    y: 160,
    label: "Lecture Hall 101 (2nd Year CSE)",
    qr: "QR-1-07",
    type: "classroom",
    description: "Smart Classroom (Cap: 75)",
    details: "Interactive smart podium, surround mic, hybrid recording."
  },
  "N_LH_102": {
    id: "N_LH_102",
    floor: 1,
    x: 780,
    y: 160,
    label: "Lecture Hall 102 (3rd Year CSE)",
    qr: "QR-1-08",
    type: "classroom",
    description: "Multimedia Lecture Hall (Cap: 75)",
    details: "Dual projection screens and lecture capture cameras."
  },
  "N_FIRE_EXIT_N": {
    id: "N_FIRE_EXIT_N",
    floor: 1,
    x: 900,
    y: 160,
    label: "North Emergency Fire Staircase",
    qr: "QR-1-09",
    type: "emergency",
    description: "External Fire Escape Stairwell",
    details: "Direct descent to North Perimeter Assembly zone."
  },
  "N_LIBRARY": {
    id: "N_LIBRARY",
    floor: 1,
    x: 180,
    y: 480,
    label: "Digital Library & OPAC Center",
    qr: "QR-1-10",
    type: "amenity",
    description: "E-Journals, Books & Silent Study",
    details: "Automated RFID checkouts, 40 terminal catalog stations."
  },
  "N_IOT_LAB": {
    id: "N_IOT_LAB",
    floor: 1,
    x: 760,
    y: 480,
    label: "IoT & Embedded Systems Lab",
    qr: "QR-1-11",
    type: "lab",
    description: "Microcontroller & Sensor Racks",
    details: "Raspberry Pi 5, ESP32 testbeds and PCB prototyping stations."
  },
  "N_1F_CORR_E": {
    id: "N_1F_CORR_E",
    floor: 1,
    x: 760,
    y: 320,
    label: "East Lecture Wing Junction (1F)",
    qr: "QR-1-12",
    type: "corridor",
    description: "Access to Classrooms & Labs",
    details: "Corridor junction leading to LH 101/102 and IoT Lab."
  }
};

// Realistic physical walking graph edges with base distances in meters
export const GRAPH_EDGES = [
  { id: "e-gf-01", u: "N_ENTRANCE", v: "N_LOBBY", distance: 16, corridor: "Entrance Walkway" },
  { id: "e-gf-02", u: "N_LOBBY", v: "N_CORR_W", distance: 18, corridor: "Lobby-West Corridor", canHaveHazard: true },
  { id: "e-gf-03", u: "N_CORR_W", v: "N_CANTEEN", distance: 14, corridor: "West Amenity Passage" },
  { id: "e-gf-04", u: "N_CORR_W", v: "N_SYS_LAB", distance: 18, corridor: "Systems Lab Entrance" },
  { id: "e-gf-05", u: "N_CORR_W", v: "N_AI_LAB", distance: 22, corridor: "AI Lab Approach" },
  { id: "e-gf-06", u: "N_CORR_W", v: "N_CORR_C", distance: 24, corridor: "Ground Central Corridor West", canHaveHazard: true },
  { id: "e-gf-07", u: "N_CORR_C", v: "N_CORR_E", distance: 26, corridor: "Ground Central Corridor East", canHaveHazard: true },
  { id: "e-gf-08", u: "N_CORR_C", v: "N_STAIR_G", distance: 12, corridor: "Staircase 1 Foyer" },
  { id: "e-gf-09", u: "N_CORR_C", v: "N_LIFT_G", distance: 12, corridor: "Elevator 1 Foyer" },
  { id: "e-gf-10", u: "N_CORR_E", v: "N_SEMINAR", distance: 20, corridor: "Auditorium Walkway" },
  { id: "e-gf-11", u: "N_CORR_E", v: "N_RESTROOM_G", distance: 22, corridor: "Hygiene Wing Passage", canHaveHazard: true },
  { id: "e-gf-12", u: "N_CORR_E", v: "N_FIRE_EXIT_S", distance: 18, corridor: "South Egress Route" },
  { id: "e-gf-13", u: "N_LOBBY", v: "N_ASSEMBLY", distance: 25, corridor: "Main Assembly Path" },
  { id: "e-gf-14", u: "N_FIRE_EXIT_S", v: "N_ASSEMBLY", distance: 30, corridor: "South Evacuation Trail" },
  { id: "e-gf-15", u: "N_STAIR_G", v: "N_LOBBY", distance: 22, corridor: "South Atrium Link" },

  // Vertical Inter-Floor Transitions
  { id: "e-vert-stair", u: "N_STAIR_G", v: "N_STAIR_1F", distance: 18, corridor: "Central Stairwell Flight", isVertical: true, transitType: "stairs" },
  { id: "e-vert-lift", u: "N_LIFT_G", v: "N_LIFT_1F", distance: 10, corridor: "Elevator Shaft Flight", isVertical: true, transitType: "elevator" },

  // First Floor Corridor Backbone
  { id: "e-1f-01", u: "N_STAIR_1F", v: "N_1F_CORR_C", distance: 12, corridor: "1F Staircase Landing" },
  { id: "e-1f-02", u: "N_LIFT_1F", v: "N_1F_CORR_C", distance: 12, corridor: "1F Elevator Landing" },
  { id: "e-1f-03", u: "N_1F_CORR_C", v: "N_1F_CORR_W", distance: 24, corridor: "1F West Faculty Passage", canHaveHazard: true },
  { id: "e-1f-04", u: "N_1F_CORR_C", v: "N_1F_CORR_E", distance: 26, corridor: "1F East Academic Passage", canHaveHazard: true },
  { id: "e-1f-05", u: "N_1F_CORR_W", v: "N_HOD", distance: 18, corridor: "HOD Executive Suite Entrance" },
  { id: "e-1f-06", u: "N_1F_CORR_W", v: "N_FACULTY", distance: 20, corridor: "Staff Consultation Chambers" },
  { id: "e-1f-07", u: "N_1F_CORR_W", v: "N_LIBRARY", distance: 22, corridor: "Library & OPAC Wing", canHaveHazard: true },
  { id: "e-1f-08", u: "N_1F_CORR_E", v: "N_LH_101", distance: 18, corridor: "Lecture Hall 101 Access" },
  { id: "e-1f-09", u: "N_1F_CORR_E", v: "N_LH_102", distance: 20, corridor: "Lecture Hall 102 Access" },
  { id: "e-1f-10", u: "N_1F_CORR_E", v: "N_IOT_LAB", distance: 24, corridor: "IoT Lab Access" },
  { id: "e-1f-11", u: "N_LH_102", v: "N_FIRE_EXIT_N", distance: 16, corridor: "North Egress Route" },
  { id: "e-1f-12", u: "N_1F_CORR_E", v: "N_FIRE_EXIT_N", distance: 20, corridor: "East Fire Escape Approach" }
];

export const FLOOR_ROOMS = {
  0: [
    { id: "MAIN-ENTRANCE", label: "Main Entrance / Security", x: 60, y: 440, w: 120, h: 90, color: "rgba(30, 58, 138, 0.35)", border: "#3b82f6", icon: "DoorOpen" },
    { id: "CAFETERIA", label: "Cafeteria & Lounge", x: 60, y: 270, w: 120, h: 120, color: "rgba(180, 83, 9, 0.25)", border: "#f59e0b", icon: "Coffee" },
    { id: "LOBBY", label: "Central Atrium & Lobby", x: 220, y: 440, w: 180, h: 90, color: "rgba(15, 23, 42, 0.5)", border: "#64748b", icon: "Compass" },
    { id: "SYS-LAB", label: "Systems Lab 01", x: 130, y: 100, w: 160, h: 130, color: "rgba(13, 148, 136, 0.25)", border: "#14b8a6", icon: "Terminal" },
    { id: "AI-LAB", label: "AI & ML Lab 02", x: 310, y: 100, w: 160, h: 130, color: "rgba(99, 102, 241, 0.25)", border: "#6366f1", icon: "Cpu" },
    { id: "SEMINAR", label: "CSE Seminar Auditorium", x: 550, y: 90, w: 200, h: 140, color: "rgba(217, 70, 239, 0.25)", border: "#d946ef", icon: "Users" },
    { id: "RESTROOM-G", label: "Restrooms (G)", x: 820, y: 100, w: 130, h: 120, color: "rgba(100, 116, 139, 0.25)", border: "#94a3b8", icon: "Droplet" },
    { id: "FIRE-EXIT-S", label: "South Fire Exit", x: 830, y: 440, w: 120, h: 80, color: "rgba(239, 68, 68, 0.25)", border: "#ef4444", icon: "Flame" },
    { id: "STAIR-AREA-G", label: "Stairs 1", x: 420, y: 390, w: 60, h: 60, color: "rgba(14, 165, 233, 0.25)", border: "#0ea5e9", icon: "Footprints" },
    { id: "LIFT-AREA-G", label: "Lift 1", x: 520, y: 390, w: 60, h: 60, color: "rgba(168, 85, 247, 0.25)", border: "#a855f7", icon: "ArrowUpDown" },
    { id: "ASSEMBLY-G", label: "Open Assembly Field", x: 400, y: 520, w: 200, h: 45, color: "rgba(34, 197, 94, 0.25)", border: "#22c55e", icon: "ShieldAlert" }
  ],
  1: [
    { id: "LIBRARY", label: "Digital Library & OPAC", x: 100, y: 430, w: 180, h: 110, color: "rgba(16, 185, 129, 0.25)", border: "#10b981", icon: "BookOpen" },
    { id: "HOD-OFFICE", label: "HOD Suite (Dr. Harish Kumar N)", x: 130, y: 100, w: 170, h: 130, color: "rgba(244, 63, 94, 0.3)", border: "#f43f5e", icon: "Award" },
    { id: "FACULTY-CABINS", label: "Faculty Chambers (F1-F12)", x: 320, y: 100, w: 180, h: 130, color: "rgba(14, 165, 233, 0.25)", border: "#0ea5e9", icon: "Briefcase" },
    { id: "LH-101", label: "Lecture Hall 101", x: 530, y: 100, w: 150, h: 130, color: "rgba(234, 179, 8, 0.25)", border: "#eab308", icon: "Presentation" },
    { id: "LH-102", label: "Lecture Hall 102 (Smart)", x: 700, y: 100, w: 150, h: 130, color: "rgba(234, 179, 8, 0.25)", border: "#eab308", icon: "Presentation" },
    { id: "FIRE-EXIT-N", label: "North Emergency Stair", x: 860, y: 120, w: 90, h: 90, color: "rgba(239, 68, 68, 0.25)", border: "#ef4444", icon: "Flame" },
    { id: "IOT-LAB", label: "IoT & Cloud Research Lab", x: 680, y: 430, w: 180, h: 110, color: "rgba(147, 51, 234, 0.25)", border: "#9333ea", icon: "Wifi" },
    { id: "STAIR-AREA-1F", label: "Stairs 1", x: 420, y: 390, w: 60, h: 60, color: "rgba(14, 165, 233, 0.25)", border: "#0ea5e9", icon: "Footprints" },
    { id: "LIFT-AREA-1F", label: "Lift 1", x: 520, y: 390, w: 60, h: 60, color: "rgba(168, 85, 247, 0.25)", border: "#a855f7", icon: "ArrowUpDown" }
  ]
};

// Faculty Roster
export const FACULTY_ROSTER = [
  {
    id: "fac-harish",
    name: "Dr. Harish Kumar N",
    designation: "Associate Professor & Supervisor",
    department: "Computer Science & Engineering",
    cabinNodeId: "N_HOD",
    cabinName: "HOD & Research Suite 101",
    status: "Available",
    statusMessage: "Available in cabin for student consultation",
    specialization: "High Performance Cloud, Spatial Systems, IoT Networks",
    availableSlots: ["14:30 - 15:00", "15:00 - 15:30", "16:00 - 16:30"],
    email: "harish.kumar@bmsit.in",
    avatar: "👨‍🏫",
    nextClass: { room: "Lecture Hall 101", subject: "Cloud Computing & Distributed Systems", time: "14:00 Today", targetNode: "N_LH_101" }
  },
  {
    id: "fac-rajesh",
    name: "Prof. Rajesh K",
    designation: "Assistant Professor",
    department: "Computer Science & Engineering",
    cabinNodeId: "N_FACULTY",
    cabinName: "Faculty Cabin F-08",
    status: "Available",
    statusMessage: "Consultation hours for Data Structures & Algorithms",
    specialization: "Operating Systems, Linux Kernel, Graph Theory",
    availableSlots: ["11:00 - 11:30", "12:00 - 12:30"],
    email: "rajesh.k@bmsit.in",
    avatar: "👨‍💻",
    nextClass: { room: "Systems & OS Lab 01", subject: "Linux Shell Scripting Practical", time: "15:30 Today", targetNode: "N_SYS_LAB" }
  },
  {
    id: "fac-sunitha",
    name: "Prof. Sunitha R",
    designation: "Assistant Professor",
    department: "Computer Science & Engineering",
    cabinNodeId: "N_FACULTY",
    cabinName: "Faculty Cabin F-04",
    status: "In Meeting",
    statusMessage: "Department Academic Committee Review",
    specialization: "Applied Deep Learning, Computer Vision",
    availableSlots: ["16:30 - 17:00"],
    email: "sunitha.r@bmsit.in",
    avatar: "👩‍🏫",
    nextClass: { room: "AI & ML Lab 02", subject: "Deep Learning Model Optimization", time: "16:30 Today", targetNode: "N_AI_LAB" }
  },
  {
    id: "fac-meenakshi",
    name: "Prof. Meenakshi S",
    designation: "Associate Professor",
    department: "Computer Science & Engineering",
    cabinNodeId: "N_FACULTY",
    cabinName: "Faculty Cabin F-02",
    status: "On Leave",
    statusMessage: "Attending International IEEE Conference until Monday",
    specialization: "Cybersecurity, Cryptography, Blockchain",
    availableSlots: ["Monday 10:30 - 11:00"],
    email: "meenakshi.s@bmsit.in",
    avatar: "👩‍💼",
    nextClass: { room: "Lecture Hall 102", subject: "Network Security & Applied Crypto", time: "Monday 11:30", targetNode: "N_LH_102" }
  }
];

// Initial shared student appointment applications for faculty review
export const INITIAL_APPOINTMENTS = [
  {
    id: "APT-2026-01",
    studentName: "Gagan N Prasad",
    studentUsn: "26UG1BYCS0588-T",
    facultyId: "fac-harish",
    facultyName: "Dr. Harish Kumar N",
    cabinName: "HOD & Research Suite 101",
    slot: "14:30 - 15:00",
    agenda: "Major Project Defense slides review and A* dynamic detour solver evaluation",
    status: "Pending", // "Pending", "Accepted", "Rejected"
    timestamp: "Today, 10:30 AM"
  },
  {
    id: "APT-2026-02",
    studentName: "Manav Redhu",
    studentUsn: "26UG1BYCS0293-T",
    facultyId: "fac-rajesh",
    facultyName: "Prof. Rajesh K",
    cabinName: "Faculty Cabin F-08",
    slot: "11:00 - 11:30",
    agenda: "Data Structures lab assignment query and tree balancing clarification",
    status: "Pending",
    timestamp: "Today, 09:15 AM"
  },
  {
    id: "APT-2026-03",
    studentName: "Chimbili Manju Ganesh",
    studentUsn: "26UG1BYCS0043-T",
    facultyId: "fac-harish",
    facultyName: "Dr. Harish Kumar N",
    cabinName: "HOD & Research Suite 101",
    slot: "15:00 - 15:30",
    agenda: "Micro-location Cartesian QR node ground calibration at entrance turnstiles",
    status: "Accepted",
    timestamp: "Yesterday, 04:20 PM"
  }
];

// Student ERP Academic & Financial Data
export const STUDENT_ERP = {
  profile: {
    name: "Gagan N Prasad",
    usn: "26UG1BYCS0588-T",
    degree: "B.E. Computer Science & Engineering",
    semester: 2,
    section: "B",
    group: "Apex Achievers",
    cgpa: 9.14,
    mentor: "Dr. Harish Kumar N",
    validUpto: "June 2028",
    bloodGroup: "O+ve",
    phone: "+91 98450 12345",
    email: "gagan.gagn.kikkeri@gmail.com"
  },
  attendance: [
    { code: "22CS21", subject: "Data Structures & Algorithms", attended: 41, total: 45, percentage: 91.1, cieMarks: 47, faculty: "Prof. Rajesh K" },
    { code: "22CS22", subject: "Computer Organization & Arch", attended: 29, total: 40, percentage: 72.5, cieMarks: 36, faculty: "Prof. Sunitha R", isShortage: true },
    { code: "22CS23", subject: "Discrete Mathematical Structures", attended: 36, total: 42, percentage: 85.7, cieMarks: 44, faculty: "Dr. K. V. Sharma" },
    { code: "22CS24", subject: "Object Oriented Java & C++", attended: 42, total: 44, percentage: 95.4, cieMarks: 49, faculty: "Prof. Meenakshi S" },
    { code: "22CSL25", subject: "Data Structures Lab & Linux Shell", attended: 22, total: 22, percentage: 100.0, cieMarks: 50, faculty: "Prof. Rajesh K" }
  ],
  financials: {
    totalFees: 125000,
    paidAmount: 125000,
    outstanding: 0,
    transactions: [
      { id: "TXN-89421", date: "2026-08-14", desc: "Even Semester Tuition Fee", amount: 110000, status: "SUCCESS", receiptUrl: "#" },
      { id: "TXN-89422", date: "2026-08-14", desc: "Campus IT & Lab Consumables Fee", amount: 12000, status: "SUCCESS", receiptUrl: "#" },
      { id: "TXN-91040", date: "2026-09-02", desc: "End-Semester Examination Admit Fee", amount: 3000, status: "SUCCESS", receiptUrl: "#" }
    ],
    hallTicketStatus: {
      eligible: true,
      examCycle: "VTU Even Semester End Examinations 2026",
      centerCode: "BMSIT 1BY",
      admitNumber: "HT-2026-CSE-0588"
    }
  }
};

// Faculty grading roster
export const FACULTY_CLASS_ROSTER = [
  { usn: "26UG1BYCS0588-T", name: "Gagan N Prasad", attendancePct: 91.1, cieMarks: 47, presentToday: true },
  { usn: "26UG1BYCS0293-T", name: "Manav Redhu", attendancePct: 88.0, cieMarks: 44, presentToday: true },
  { usn: "26UG1BYCS0043-T", name: "Chimbili Manju Ganesh", attendancePct: 84.5, cieMarks: 42, presentToday: false },
  { usn: "26UG1BYCS0111-T", name: "Machal Ritesh Govardhan", attendancePct: 89.2, cieMarks: 45, presentToday: true },
  { usn: "26UG1BYCS0310-T", name: "Rohan Verma", attendancePct: 71.0, cieMarks: 32, presentToday: false, isShortage: true },
  { usn: "26UG1BYCS0415-T", name: "Sneha Hegde", attendancePct: 95.0, cieMarks: 49, presentToday: true }
];

// Initial Geo-tagged Grievances
export const INITIAL_GRIEVANCES = [
  {
    id: "GRV-1042",
    nodeId: "N_LH_101",
    room: "Lecture Hall 101",
    floor: 1,
    title: "Overhead Projector HDMI Port Faulty",
    category: "Audio/Visual",
    status: "Technician Dispatched",
    priority: "High",
    reportedBy: "Gagan N Prasad",
    timestamp: "2026-09-26 10:15 AM",
    description: "The ceiling projector flickers green on HDMI-1; classes facing projection blackout."
  },
  {
    id: "GRV-1039",
    nodeId: "N_SYS_LAB",
    room: "Systems Lab 01",
    floor: 0,
    title: "Terminal 14 LAN Keystone Damaged",
    category: "Networking",
    status: "Under Review",
    priority: "Medium",
    reportedBy: "Manav Redhu",
    timestamp: "2026-09-25 03:40 PM",
    description: "Ethernet jack snapped, workstation unable to lease DHCP address."
  },
  {
    id: "GRV-1028",
    nodeId: "N_RESTROOM_G",
    room: "Ground Floor Restroom",
    floor: 0,
    title: "Hand Sanitizer Dispenser Refill",
    category: "Janitorial",
    status: "Resolved",
    priority: "Low",
    reportedBy: "Chimbili Manju Ganesh",
    timestamp: "2026-09-24 11:20 AM",
    description: "Automatic sensor dispenser empty."
  }
];
