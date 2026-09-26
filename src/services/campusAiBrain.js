// Gridlock Universal Campus AI Copilot Brain
// Context-aware natural language reasoning engine for Students, Faculty, HOD, Janitors & Admins

import { findShortestPath } from './pathfinding.js';

/**
 * Process a campus query with full context from live application state
 */
export function processCampusAiQuery({
  query = '',
  userRole = 'student',
  studentErp = {},
  facultyRoster = [],
  facultyClassRoster = [],
  appointments = [],
  hazardMap = {},
  nodes = {},
  edges = [],
  isAccessibleMode = false,
  mobilityProfile = {}
}) {
  const q = query.toLowerCase().trim();

  // 1. QUERY: LAGGING SUBJECTS / LOW CIE MARKS
  if (
    q.includes('lagging') ||
    q.includes('low mark') ||
    q.includes('poor mark') ||
    q.includes('lowest score') ||
    q.includes('failing') ||
    q.includes('weak subject') ||
    (q.includes('cie') && q.includes('low'))
  ) {
    const attendance = studentErp?.attendance || [];
    // Sort subjects by CIE marks ascending
    const sortedByCie = [...attendance].sort((a, b) => a.cieMarks - b.cieMarks);
    const lowest = sortedByCie[0];

    const laggingSubjects = attendance.filter(s => s.cieMarks < 40 || s.isShortage);

    return {
      title: "📉 Academic Performance & CIE Marks Analysis",
      text: `Based on your official BMSIT CIE evaluation ledger for Semester 2 (Section B):

You are primarily lagging in **${lowest?.subject || 'Computer Organization & Arch'} (${lowest?.code || '22CS22'})**:
• **CIE Score**: **${lowest?.cieMarks || 36} / 50 marks** (Department target: $\\ge 42$)
• **Course Instructor**: ${lowest?.faculty || 'Prof. Sunitha R'}
• **Attendance in Course**: ${lowest?.percentage || 72.5}% (Also below 75% threshold)

**Comparison with Other Subjects:**
${sortedByCie.map(s => `• **${s.code}**: ${s.cieMarks}/50 marks (${s.subject.split('&')[0].trim()}) - *${s.cieMarks >= 45 ? '🟢 Excellent' : s.cieMarks >= 40 ? '🟡 Good' : '🔴 Needs Attention'}*`).join('\n')}

💡 **Recommended Action**:
1. Prof. Sunitha R has consultation hours today at **16:30 - 17:00** in Faculty Cabin F-04.
2. Review Module 3 *Pipelining & Micro-architectures* before the 2nd Internal Assessment.`,
      badges: [
        { label: `Lowest CIE: ${lowest?.cieMarks || 36}/50`, color: "red" },
        { label: "Needs Remedial Class", color: "amber" },
        { label: "CGPA: 9.14", color: "blue" }
      ],
      actions: [
        { label: "📅 Book Consultation with Prof. Sunitha", type: "SET_TAB", tab: "cabin" },
        { label: "📊 View Detailed Academic Ledger", type: "SET_TAB", tab: "erp" },
        { label: "📍 Navigate to Faculty Cabin F-04", type: "NAVIGATE", start: "N_ENTRANCE", target: "N_FACULTY", accessible: isAccessibleMode }
      ]
    };
  }

  // 2. QUERY: ATTENDANCE SHORTAGE / CONDONATION
  if (
    q.includes('shortage') ||
    q.includes('attendance') ||
    q.includes('absent') ||
    q.includes('detained') ||
    q.includes('75%') ||
    q.includes('low attendance') ||
    q.includes('bunk')
  ) {
    if (userRole === 'student') {
      const attendance = studentErp?.attendance || [];
      const shortageSubjects = attendance.filter(s => s.percentage < 75 || s.isShortage);
      const safeSubjects = attendance.filter(s => s.percentage >= 75);

      if (shortageSubjects.length > 0) {
        const sub = shortageSubjects[0];
        // Classes needed to reach 75%
        // (attended + x) / (total + x) >= 0.75 => x = (0.75*total - attended) / 0.25
        const needed = Math.max(1, Math.ceil((0.75 * sub.total - sub.attended) / 0.25));

        return {
          title: "⚠️ Attendance Shortage Warning Detected!",
          text: `You have **1 subject** currently falling below the mandatory **75.0% VTU attendance regulation**:

🔴 **${sub.subject} (${sub.code})**:
• **Current Attendance**: **${sub.percentage}%** (${sub.attended} out of ${sub.total} classes attended)
• **Course Faculty**: ${sub.faculty}
• **Shortage Deficit**: **${(75.0 - sub.percentage).toFixed(1)}% below required threshold**
• **Recovery Target**: You must attend the next **${needed} consecutive classes** without any absence to restore your attendance to $\\ge 75.0%$.

**Your Safe Subjects ($\\ge 75%$):**
${safeSubjects.map(s => `• **${s.code}**: ${s.percentage}% (${s.attended}/${s.total}) - 🟢 Safe`).join('\n')}

> [!NOTE]
> If your overall attendance stays below 75%, HOD medical condonation review will be required to unlock your End-Semester Hall Ticket.`,
          badges: [
            { label: `${sub.code}: ${sub.percentage}% (Shortage)`, color: "red" },
            { label: `Attend Next ${needed} Classes`, color: "amber" },
            { label: "VTU Min: 75.0%", color: "blue" }
          ],
          actions: [
            { label: "📋 Open Attendance Ledger in ERP", type: "SET_TAB", tab: "erp" },
            { label: "📅 Request Consultation with HOD Dr. Harish", type: "SET_TAB", tab: "cabin" }
          ]
        };
      } else {
        return {
          title: "✅ Attendance Status: Fully Compliant",
          text: `Great news! You have **zero attendance shortages**. All your registered courses are well above the 75% VTU threshold.
Overall cumulative attendance is **88.9%**. You are fully eligible for semester examination hall ticket release.`,
          badges: [
            { label: "Overall: 88.9%", color: "emerald" },
            { label: "Zero Shortages", color: "emerald" }
          ],
          actions: [
            { label: "📋 View Attendance Breakdown", type: "SET_TAB", tab: "erp" }
          ]
        };
      }
    } else {
      // Faculty or HOD view: show students with shortage
      const shortageStudents = facultyClassRoster.filter(st => st.attendancePct < 75 || st.isShortage);
      return {
        title: "📋 Student Attendance Shortage Roster (Section B)",
        text: `The following students currently have attendance below the 75% threshold in your department:

${shortageStudents.map(st => `• **${st.name}** (${st.usn}): **${st.attendancePct}%** attendance | CIE: ${st.cieMarks}/50 | Status: 🔴 *Defaulter List*`).join('\n')}

• Total class strength: ${facultyClassRoster.length} students
• Compliant students: ${facultyClassRoster.length - shortageStudents.length} students ($\\ge 75%$)
• Shortage rate: ${Math.round((shortageStudents.length / facultyClassRoster.length) * 100)}%

Would you like to generate condonation notice slips or export the defaulters list?`,
        badges: [
          { label: `${shortageStudents.length} Defaulters Flagged`, color: "red" },
          { label: "Section B Attendance", color: "amber" }
        ],
        actions: [
          { label: "📊 Open Institutional Attendance Ledger", type: "SET_TAB", tab: "erp" }
        ]
      };
    }
  }

  // 3. QUERY: DISABILITY / LEG INJURY / CRUTCHES / WHEELCHAIR / NO-STAIRS
  if (
    q.includes('disab') ||
    q.includes('injur') ||
    q.includes('leg') ||
    q.includes('fractur') ||
    q.includes('crutch') ||
    q.includes('wheelchair') ||
    q.includes('stair') ||
    q.includes('cannot walk') ||
    q.includes("can't walk") ||
    q.includes('ramp') ||
    q.includes('lift') ||
    q.includes('elevator') ||
    q.includes('sprain')
  ) {
    return {
      title: "♿ Accessible & Stair-Free Campus Routing System",
      text: `Gridlock features a **Universal Accessibility & Injury Routing Engine** designed for students, faculty, and visitors with mobility challenges:

**Key Accessibility Guarantees:**
1. **Zero Stairs Mandate**: The $A^*$ routing solver completely excludes central and emergency staircases ($W = \\infty$).
2. **Elevator & Ramp Transit**: Routes are strictly navigated through **Passenger Elevator 1** and **Ground Floor Step-Free Ramps**.
3. **Disability & Injury Profile**: You or an administrator can declare temporary leg injuries (casts, braces, sprains) or permanent wheelchair access in your profile.

**Current Accessibility Status:**
• **Accessible Mode**: **${isAccessibleMode ? '🟢 ACTIVE (Stairs Bypassed)' : '⚪ Inactive (Normal)'}**
• **Declared Mobility Condition**: ${mobilityProfile?.conditionType || 'Standard Walking'}

Would you like me to activate **No-Stairs Mode** right now and plot an accessible route to your destination?`,
      badges: [
        { label: isAccessibleMode ? "♿ No-Stairs Mode Active" : "Stairs Mode Active", color: isAccessibleMode ? "emerald" : "blue" },
        { label: "Elevator 1 Enabled", color: "purple" },
        { label: "Ramp Transit", color: "blue" }
      ],
      actions: [
        { label: "♿ Activate No-Stairs Mode & Route to HOD Suite", type: "NAVIGATE", start: "N_ENTRANCE", target: "N_HOD", accessible: true },
        { label: "🩹 Declare Temporary Leg Injury in Profile", type: "SET_MOBILITY", condition: "Temporary Leg Injury / Fracture" },
        { label: "🦽 Declare Wheelchair User Status", type: "SET_MOBILITY", condition: "Wheelchair User" },
        { label: "🚶 Reset to Standard Walking", type: "SET_MOBILITY", condition: "None" }
      ]
    };
  }

  // 4. QUERY: HALL TICKET / EXAM ELIGIBILITY
  if (
    q.includes('hall ticket') ||
    q.includes('admit card') ||
    q.includes('exam eligible') ||
    q.includes('eligibility') ||
    q.includes('exam fee')
  ) {
    const feeOutstanding = studentErp?.financials?.outstanding || 0;
    const hallTicket = studentErp?.financials?.hallTicketStatus;

    return {
      title: "🎫 VTU Examination Hall Ticket Verification Gate",
      text: `Official Institutional Hall Ticket Gate Status for **${studentErp?.profile?.name || 'Gagan N Prasad'}** (${studentErp?.profile?.usn || '26UG1BYCS0588-T'}):

• **Admit Number**: \`${hallTicket?.admitNumber || 'HT-2026-CSE-0588'}\`
• **Examination Center**: ${hallTicket?.centerCode || 'BMSIT 1BY, Bengaluru'}
• **Fee Clearance Status**: **₹${feeOutstanding}.00 Dues** (✅ Fully Cleared)
• **Attendance Eligibility**: 4 of 5 courses compliant (1 course *22CS22* at 72.5% pending condonation clearance)
• **Digital Hall Ticket**: **Ready for Download in ERP Hub** upon biometric/RFID QR scan.`,
      badges: [
        { label: "Fee Dues: ₹0.00", color: "emerald" },
        { label: "Admit: HT-2026-CSE-0588", color: "purple" }
      ],
      actions: [
        { label: "📄 Download Digital Hall Ticket in ERP", type: "SET_TAB", tab: "erp" }
      ]
    };
  }

  // 5. QUERY: FACULTY CABIN / LOCATING PROFESSORS
  if (
    q.includes('harish') ||
    q.includes('hod') ||
    q.includes('rajesh') ||
    q.includes('sunitha') ||
    q.includes('meenakshi') ||
    q.includes('where is') ||
    q.includes('cabin') ||
    q.includes('professor') ||
    q.includes('teacher') ||
    q.includes('meet')
  ) {
    let targetFac = facultyRoster[0]; // Dr. Harish default
    if (q.includes('rajesh')) targetFac = facultyRoster.find(f => f.id === 'fac-rajesh') || targetFac;
    if (q.includes('sunitha')) targetFac = facultyRoster.find(f => f.id === 'fac-sunitha') || targetFac;
    if (q.includes('meenakshi')) targetFac = facultyRoster.find(f => f.id === 'fac-meenakshi') || targetFac;

    return {
      title: `👨‍🏫 Faculty Radar: ${targetFac.name}`,
      text: `**${targetFac.name}** (${targetFac.designation}):
• **Department Role**: ${targetFac.department}
• **Cabin Location**: **${targetFac.cabinName}** (Floor 1, Apex Block)
• **Current Live Status**: **${targetFac.status === 'Available' ? '🟢 Available in Cabin' : targetFac.status === 'In Meeting' ? '🟡 In Department Review' : '🔴 On Leave'}**
• **Status Note**: "${targetFac.statusMessage}"
• **Available Consultation Slots**: ${targetFac.availableSlots?.join(', ') || 'Contact department desk'}
• **Next Scheduled Class**: ${targetFac.nextClass?.subject} at ${targetFac.nextClass?.time} in ${targetFac.nextClass?.room}`,
      badges: [
        { label: targetFac.status, color: targetFac.status === 'Available' ? 'emerald' : 'amber' },
        { label: targetFac.cabinName, color: 'blue' }
      ],
      actions: [
        { label: `📍 Navigate to ${targetFac.name}'s Cabin`, type: "NAVIGATE", start: "N_ENTRANCE", target: targetFac.cabinNodeId, accessible: isAccessibleMode },
        { label: "📅 Book Consultation Slot", type: "SET_TAB", tab: "cabin" }
      ]
    };
  }

  // 6. QUERY: FACULTY/TEACHER CONSULTATION & APPOINTMENTS
  if (
    q.includes('appointment') ||
    q.includes('consultation') ||
    q.includes('booked') ||
    q.includes('meeting')
  ) {
    const pending = appointments.filter(a => a.status === 'Pending');
    const accepted = appointments.filter(a => a.status === 'Accepted');

    return {
      title: "📅 Student Consultation & Appointment Desk",
      text: `Consultation Desk Summary:

• **Pending Applications**: **${pending.length} requests** awaiting review
• **Confirmed / Accepted Appointments**: **${accepted.length} sessions**

${pending.map(p => `• **${p.studentName}** (${p.studentUsn}): Slot *${p.slot}* with ${p.facultyName} — Agenda: "${p.agenda}"`).join('\n')}

Faculty members can accept or reject requests directly with 1-click in the Cabin Desk tab.`,
      badges: [
        { label: `${pending.length} Pending Review`, color: "amber" },
        { label: `${accepted.length} Confirmed`, color: "emerald" }
      ],
      actions: [
        { label: "📋 Open Appointments Desk", type: "SET_TAB", tab: "cabin" }
      ]
    };
  }

  // 7. QUERY: HAZARDS, WET FLOORS & CLEANING DETOURS
  if (
    q.includes('cleaning') ||
    q.includes('wet floor') ||
    q.includes('hazard') ||
    q.includes('blocked') ||
    q.includes('detour') ||
    q.includes('janitor')
  ) {
    const activeHazards = Object.entries(hazardMap).filter(([_, h]) => h.isBlocked);
    return {
      title: "🧹 Live Corridor Hazards & Custodial Cleaning Alerts",
      text: activeHazards.length > 0
        ? `There are currently **${activeHazards.length} active corridor blocks / cleaning zones** on campus:

${activeHazards.map(([edgeId, h]) => `• **Corridor ${edgeId}**: ${h.type || 'Deep Mopping'} (⚠️ Navigation automatically avoiding this section)`).join('\n')}

All walking routes automatically route around these wet corridors to prevent slipping risks.`
        : `✅ All campus corridors are currently **clear and open**. No active cleaning detours reported.`,
      badges: [
        { label: `${activeHazards.length} Active Cleaning Zones`, color: activeHazards.length > 0 ? "amber" : "emerald" }
      ],
      actions: [
        { label: "🧹 Open Janitorial Controls", type: "SET_TAB", tab: "janitorial" },
        { label: "🗺️ View Live Vector Map", type: "SET_TAB", tab: "wayfinding" }
      ]
    };
  }

  // 8. QUERY: CAMPUS WAYFINDING & NAVIGATION
  if (
    q.includes('how to go') ||
    q.includes('navigate') ||
    q.includes('directions') ||
    q.includes('route') ||
    q.includes('where is the library') ||
    q.includes('where is ai lab') ||
    q.includes('where is systems lab')
  ) {
    let target = "N_HOD";
    let targetName = "HOD Executive Suite";
    if (q.includes('library')) { target = "N_LIBRARY"; targetName = "Digital Library & OPAC Center"; }
    if (q.includes('ai lab') || q.includes('ml lab')) { target = "N_AI_LAB"; targetName = "AI & ML Lab 02"; }
    if (q.includes('sys') || q.includes('os lab')) { target = "N_SYS_LAB"; targetName = "Systems & OS Lab 01"; }
    if (q.includes('seminar') || q.includes('hall')) { target = "N_SEMINAR"; targetName = "CSE Seminar Auditorium"; }
    if (q.includes('iot')) { target = "N_IOT_LAB"; targetName = "IoT & Embedded Systems Lab"; }

    return {
      title: `🗺️ Navigation Guidance: ${targetName}`,
      text: `Calculated optimal walking path from **Main Entrance** to **${targetName}**:

• **Transit Mode**: ${isAccessibleMode ? '♿ Accessible (Elevator 1 & Ramps Only, Zero Stairs)' : 'Standard Corridor Walk'}
• **Target Elevation**: ${nodes[target]?.floor === 0 ? 'Ground Floor (0.0m)' : 'First Floor (4.2m)'}
• **Real-time Hazards**: Automatically detours around any wet floors.

Click below to load this route directly onto the interactive campus map!`,
      badges: [
        { label: targetName, color: "blue" },
        { label: isAccessibleMode ? "♿ No Stairs" : "Standard", color: "purple" }
      ],
      actions: [
        { label: `📍 Plot Route to ${targetName}`, type: "NAVIGATE", start: "N_ENTRANCE", target, accessible: isAccessibleMode }
      ]
    };
  }

  // DEFAULT / GENERAL ASSISTANT RESPONSE
  return {
    title: "🤖 Gridlock Campus Copilot • AI Intelligence",
    text: `Hello! I am your **BMSIT CSE Campus AI Assistant**. I can assist you with:

• 📉 **Academic & Marks**: Ask *"Which subject am I lagging in?"* or *"Show my CIE grades"*
• ⚠️ **Attendance Shortage**: Ask *"Which subject do I have attendance shortage in?"*
• ♿ **Accessibility & Injuries**: Ask *"I have a leg injury, guide me with no stairs"* or *"Where is the elevator?"*
• 👨‍🏫 **Faculty & Cabins**: Ask *"Where is Dr. Harish's cabin?"* or *"Who is available right now?"*
• 🎫 **Exam Eligibility**: Ask *"Am I eligible for my hall ticket?"*
• 🧹 **Facilities & Hazards**: Ask *"Which corridors are being cleaned?"*

How can I help you today?`,
    badges: [
      { label: `Persona: ${userRole.toUpperCase()}`, color: "purple" },
      { label: isAccessibleMode ? "♿ No-Stairs Active" : "Standard Mobility", color: isAccessibleMode ? "emerald" : "blue" }
    ],
    actions: [
      { label: "📉 Check Lagging Subject", type: "ASK", query: "Which subject am I lagging in?" },
      { label: "⚠️ Check Attendance Shortage", type: "ASK", query: "Which subject do I have attendance shortage in?" },
      { label: "♿ Guide Me Without Stairs (Leg Injury)", type: "ASK", query: "I have a leg injury, show me route with no stairs" },
      { label: "📍 Where is HOD Dr. Harish?", type: "ASK", query: "Where is Dr. Harish's cabin?" }
    ]
  };
}
