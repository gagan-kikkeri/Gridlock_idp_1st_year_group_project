import React, { useState, useEffect } from 'react';
import { STUDENT_ERP, FACULTY_CLASS_ROSTER } from '../data/campusData.js';
import { 
  GraduationCap, 
  CheckCircle2, 
  AlertTriangle, 
  CreditCard, 
  FileText, 
  Download, 
  QrCode, 
  User, 
  Calendar, 
  TrendingUp, 
  ShieldCheck,
  Building,
  Clock,
  Save,
  Check,
  X,
  Users,
  Award,
  Lock,
  Database
} from 'lucide-react';

export default function ErpHub({ userRole }) {
  // Student view states
  const [activeTab, setActiveTab] = useState('attendance');
  const [qrToken, setQrToken] = useState('GL-SEC-98421');
  const [qrRefreshCountdown, setQrRefreshCountdown] = useState(30);
  const [showHallTicketModal, setShowHallTicketModal] = useState(false);

  // Faculty view states
  const [classRoster, setClassRoster] = useState(FACULTY_CLASS_ROSTER);
  const [facultySavedToast, setFacultySavedToast] = useState(false);

  // HOD condonation state
  const [condonedStudents, setCondonedStudents] = useState({});

  // Auto-refresh dynamic token for student
  useEffect(() => {
    const timer = setInterval(() => {
      setQrRefreshCountdown(prev => {
        if (prev <= 1) {
          setQrToken(`GL-SEC-${Math.floor(10000 + Math.random() * 90000)}`);
          return 30;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const overallAttendance = (
    STUDENT_ERP.attendance.reduce((sum, item) => sum + item.percentage, 0) /
    STUDENT_ERP.attendance.length
  ).toFixed(1);

  const hasShortage = STUDENT_ERP.attendance.some(s => s.percentage < 75);

  // Toggle student attendance by faculty
  const handleToggleStudentAttendance = (usn) => {
    setClassRoster(prev => prev.map(s => {
      if (s.usn === usn) {
        return { ...s, presentToday: !s.presentToday };
      }
      return s;
    }));
  };

  // Update student CIE marks by faculty
  const handleUpdateCie = (usn, delta) => {
    setClassRoster(prev => prev.map(s => {
      if (s.usn === usn) {
        const newMarks = Math.max(0, Math.min(50, s.cieMarks + delta));
        return { ...s, cieMarks: newMarks };
      }
      return s;
    }));
  };

  const handleSaveFacultySession = () => {
    setFacultySavedToast(true);
    setTimeout(() => setFacultySavedToast(false), 2500);
  };

  // =========================================================================
  // VIEW 1: FACULTY ERP VIEW (Mark Attendance, Edit Marks)
  // =========================================================================
  if (userRole === 'faculty') {
    return (
      <div className="flex flex-col gap-5 rounded-2xl border border-blue-500/30 bg-slate-900/90 p-5 shadow-2xl">
        {/* Faculty Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl">👨‍💻</span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">
                  Prof. Rajesh K • Faculty Grading & Attendance Desk
                </h3>
                <span className="rounded bg-blue-500/20 text-blue-300 text-[10px] font-bold px-2 py-0.5 border border-blue-500/30">
                  SESSION 2026
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Course: <strong className="text-white">Data Structures & Algorithms (22CS21)</strong> • Section B (60 Students)
              </p>
            </div>
          </div>

          <button
            onClick={handleSaveFacultySession}
            className="flex items-center gap-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 px-4 py-2 text-xs font-bold text-white shadow-md shadow-blue-500/30 transition active:scale-95"
          >
            <Save className="h-4 w-4" />
            Save & Sync Attendance Ledger
          </button>
        </div>

        {facultySavedToast && (
          <div className="rounded-xl bg-emerald-500/15 border border-emerald-500/40 p-3 text-xs text-emerald-300 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4" />
            Session attendance and CIE scores successfully committed to institutional database!
          </div>
        )}

        {/* Student Cohort Roster Table */}
        <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/60">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/90 text-slate-400 border-b border-slate-800 font-mono">
              <tr>
                <th className="px-4 py-3">Student USN & Name</th>
                <th className="px-4 py-3 text-center">Cumulative %</th>
                <th className="px-4 py-3 text-center">Today's Lecture</th>
                <th className="px-4 py-3 text-center">CIE Score (/50)</th>
                <th className="px-4 py-3 text-center">Admit Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-200">
              {classRoster.map((student) => (
                <tr key={student.usn} className="hover:bg-slate-800/40 transition">
                  <td className="px-4 py-3">
                    <div className="font-bold text-white">{student.name}</div>
                    <div className="font-mono text-[10px] text-blue-400">{student.usn}</div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`font-mono font-bold ${student.attendancePct < 75 ? 'text-rose-400' : 'text-emerald-400'}`}>
                      {student.attendancePct}%
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => handleToggleStudentAttendance(student.usn)}
                      className={`inline-flex items-center gap-1 rounded-lg px-3 py-1 font-bold text-xs transition ${
                        student.presentToday
                          ? 'bg-emerald-600 text-white shadow-sm'
                          : 'bg-rose-900/40 text-rose-300 border border-rose-800'
                      }`}
                    >
                      {student.presentToday ? <Check className="h-3.5 w-3.5" /> : <X className="h-3.5 w-3.5" />}
                      {student.presentToday ? 'Present' : 'Absent'}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="inline-flex items-center gap-2">
                      <button
                        onClick={() => handleUpdateCie(student.usn, -1)}
                        className="h-6 w-6 rounded bg-slate-800 text-slate-300 hover:text-white font-bold"
                      >
                        -
                      </button>
                      <span className="font-mono font-bold text-blue-300 w-8 text-center">
                        {student.cieMarks}
                      </span>
                      <button
                        onClick={() => handleUpdateCie(student.usn, 1)}
                        className="h-6 w-6 rounded bg-slate-800 text-slate-300 hover:text-white font-bold"
                      >
                        +
                      </button>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    {student.attendancePct < 75 ? (
                      <span className="inline-flex items-center gap-1 rounded bg-rose-500/15 border border-rose-500/30 px-2 py-0.5 text-[10px] font-bold text-rose-300">
                        <AlertTriangle className="h-3 w-3" /> Detention Warning
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-bold text-emerald-300">
                        <CheckCircle2 className="h-3 w-3" /> Cleared
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW 2: HOD EXECUTIVE DASHBOARD (Department Metrics, Clearance Overrides)
  // =========================================================================
  if (userRole === 'hod') {
    return (
      <div className="flex flex-col gap-5 rounded-2xl border border-indigo-500/30 bg-slate-900/90 p-5 shadow-2xl">
        {/* HOD Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <span className="text-4xl">👨‍🏫</span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">
                  Dr. Harish Kumar N • Head of Department (CSE)
                </h3>
                <span className="rounded bg-amber-500/20 text-amber-300 text-[10px] font-bold px-2 py-0.5 border border-amber-500/30 flex items-center gap-1">
                  <Award className="h-3 w-3" /> HOD EXECUTIVE DESK
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Department of Computer Science & Engineering • Academic Oversight & Proctorial Approvals
              </p>
            </div>
          </div>
        </div>

        {/* High-level metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="rounded-xl bg-slate-950/60 p-4 border border-slate-800">
            <span className="text-xs text-slate-400">Department Cumulative Attendance</span>
            <div className="text-2xl font-extrabold text-white mt-1">84.8%</div>
            <span className="text-[11px] text-emerald-400 mt-1 block">Healthy Department Cohort</span>
          </div>

          <div className="rounded-xl bg-slate-950/60 p-4 border border-slate-800">
            <span className="text-xs text-slate-400">Detention Risk Shortage Cases</span>
            <div className="text-2xl font-extrabold text-amber-400 mt-1">1 Student</div>
            <span className="text-[11px] text-slate-400 mt-1 block">Rohan Verma (71.0%)</span>
          </div>

          <div className="rounded-xl bg-slate-950/60 p-4 border border-slate-800">
            <span className="text-xs text-slate-400">Hall Ticket Clearances Issued</span>
            <div className="text-2xl font-extrabold text-blue-400 mt-1">59 / 60</div>
            <span className="text-[11px] text-emerald-400 mt-1 block">98.3% Exam Readiness</span>
          </div>
        </div>

        {/* HOD Condonation & Hall Ticket Override Table */}
        <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3 flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            HOD Proctorial Clearance & Shortage Condonation
          </h4>
          <div className="space-y-2">
            <div className="flex flex-wrap items-center justify-between p-3 rounded-lg bg-slate-900/60 border border-slate-800 text-xs gap-3">
              <div>
                <div className="font-bold text-white">Rohan Verma (26UG1BYCS0310-T)</div>
                <div className="text-[11px] text-amber-400 font-mono mt-0.5">
                  Cumulative Attendance: 71.0% (Short by 4.0% due to hospitalized medical leave)
                </div>
              </div>
              <div className="flex items-center gap-2">
                {condonedStudents['26UG1BYCS0310-T'] ? (
                  <span className="rounded bg-emerald-500/20 text-emerald-300 px-3 py-1 font-bold text-xs border border-emerald-500/40 flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5" /> HOD Condonation Granted
                  </span>
                ) : (
                  <button
                    onClick={() => setCondonedStudents(prev => ({ ...prev, '26UG1BYCS0310-T': true }))}
                    className="rounded-lg bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 font-bold text-xs transition"
                  >
                    Grant Medical Condonation Override
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW 3: JANITORIAL ERP VIEW (Restricted from Grades; Facilities Ledger)
  // =========================================================================
  if (userRole === 'janitorial') {
    return (
      <div className="flex flex-col gap-5 rounded-2xl border border-amber-500/30 bg-slate-900/90 p-5 shadow-2xl">
        <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
          <span className="text-4xl">🧹</span>
          <div>
            <h3 className="text-base font-bold text-white">
              Ramesh M • Lead Custodial & Sanitation Supervisor
            </h3>
            <p className="text-xs text-slate-300">
              Department Facilities Management • Sanitation Logs & Restroom Hygiene
            </p>
          </div>
        </div>

        <div className="rounded-xl bg-amber-500/10 border border-amber-500/30 p-4 text-xs text-amber-200 space-y-1">
          <div className="font-bold flex items-center gap-1.5">
            <Lock className="h-4 w-4" /> 5-Tier RBAC Access Control Matrix Notice:
          </div>
          <p className="text-[11px] text-slate-300">
            Student academic grades, attendance marks, and tuition fee accounts are confidential and strictly restricted from janitorial credentials under the project security model (Slide 17).
          </p>
        </div>

        {/* Facilities Hygiene Checklist */}
        <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4 space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Daily Custodial Sanitation Protocol
          </h4>
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900/60 border border-slate-800">
              <span>Ground Floor Restroom Sanitation</span>
              <span className="text-emerald-400 font-bold">✓ Inspected 10:00 AM</span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900/60 border border-slate-800">
              <span>First Floor Faculty Hygiene Station</span>
              <span className="text-emerald-400 font-bold">✓ Cleaned 11:30 AM</span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900/60 border border-slate-800">
              <span>Corridor Wet Floor Safety Status</span>
              <span className="text-amber-400 font-bold">Managed via Janitorial Detour Controls</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW 4: ADMIN ERP VIEW (System Audit, Institutional Revenue)
  // =========================================================================
  if (userRole === 'admin') {
    return (
      <div className="flex flex-col gap-5 rounded-2xl border border-slate-700 bg-slate-900/90 p-5 shadow-2xl">
        <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
          <span className="text-4xl">⚙️</span>
          <div>
            <h3 className="text-base font-bold text-white">
              SuperAdmin • Systems & ERP Institutional Administration
            </h3>
            <p className="text-xs text-slate-300">
              PostgreSQL Relational DB • Full Audit Trails • Financial Gatekeeper
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="rounded-xl bg-slate-950/60 p-4 border border-slate-800">
            <span className="text-xs text-slate-400">Total Tuition Revenue</span>
            <div className="text-2xl font-extrabold text-white mt-1">₹4.85 Cr</div>
            <span className="text-[11px] text-emerald-400 mt-1 block">97.4% Fee Realization</span>
          </div>

          <div className="rounded-xl bg-slate-950/60 p-4 border border-slate-800">
            <span className="text-xs text-slate-400">Total Enrolled Accounts</span>
            <div className="text-2xl font-extrabold text-blue-400 mt-1">1,450</div>
            <span className="text-[11px] text-slate-400 mt-1 block">CSE, ISE, ECE Departments</span>
          </div>

          <div className="rounded-xl bg-slate-950/60 p-4 border border-slate-800">
            <span className="text-xs text-slate-400">Active JWT Sessions</span>
            <div className="text-2xl font-extrabold text-emerald-400 mt-1">312</div>
            <span className="text-[11px] text-emerald-400 mt-1 block">Zero XSS Security Policy</span>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW 5: STUDENT ERP VIEW (Default)
  // =========================================================================
  return (
    <div className="flex flex-col gap-5 rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-2xl">
      {/* Student Profile Quick Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl bg-gradient-to-r from-blue-950/70 via-slate-900 to-indigo-950/60 p-4 border border-blue-500/20">
        <div className="flex items-center gap-3.5">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-xl font-black text-white shadow-lg ring-2 ring-white/10">
            GP
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white">{STUDENT_ERP.profile.name}</h3>
              <span className="font-mono text-xs text-blue-400 bg-blue-500/15 px-2 py-0.5 rounded border border-blue-500/30">
                {STUDENT_ERP.profile.usn}
              </span>
            </div>
            <p className="text-xs text-slate-300">
              {STUDENT_ERP.profile.degree} • Semester {STUDENT_ERP.profile.semester} ('{STUDENT_ERP.profile.section}')
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Mentor: <span className="text-slate-200 font-medium">{STUDENT_ERP.profile.mentor}</span> • CGPA: <span className="text-emerald-400 font-bold">{STUDENT_ERP.profile.cgpa}</span>
            </p>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="flex flex-wrap gap-1 rounded-lg bg-slate-950/80 p-1 border border-slate-800">
          <button
            onClick={() => setActiveTab('attendance')}
            className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${
              activeTab === 'attendance'
                ? 'bg-blue-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Attendance & CIE
          </button>
          <button
            onClick={() => setActiveTab('finance')}
            className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${
              activeTab === 'finance'
                ? 'bg-blue-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Fees & Dues
          </button>
          <button
            onClick={() => setActiveTab('hallticket')}
            className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${
              activeTab === 'hallticket'
                ? 'bg-blue-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Hall Ticket Gate
          </button>
          <button
            onClick={() => setActiveTab('idcard')}
            className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${
              activeTab === 'idcard'
                ? 'bg-blue-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Dynamic Digital ID
          </button>
        </div>
      </div>

      {/* TAB 1: ATTENDANCE & CIE */}
      {activeTab === 'attendance' && (
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="rounded-xl bg-slate-950/60 p-4 border border-slate-800">
              <span className="text-xs text-slate-400">Cumulative Attendance</span>
              <div className="text-2xl font-extrabold text-white mt-1">
                {overallAttendance}%
              </div>
              <span className="text-[11px] text-emerald-400 mt-1 block">
                Above VTU Mandatory 75% Threshold
              </span>
            </div>

            <div className="rounded-xl bg-slate-950/60 p-4 border border-slate-800">
              <span className="text-xs text-slate-400">Shortage Courses</span>
              <div className={`text-2xl font-extrabold mt-1 ${hasShortage ? 'text-amber-400' : 'text-emerald-400'}`}>
                {STUDENT_ERP.attendance.filter(s => s.percentage < 75).length} <span className="text-xs font-normal text-slate-400">Subject</span>
              </div>
              <span className="text-[11px] text-slate-400 mt-1 block">
                Requires attendance recovery notice
              </span>
            </div>

            <div className="rounded-xl bg-slate-950/60 p-4 border border-slate-800">
              <span className="text-xs text-slate-400">CIE Average Marks</span>
              <div className="text-2xl font-extrabold text-blue-400 mt-1">
                45.2 <span className="text-xs font-normal text-slate-400">/ 50 Max</span>
              </div>
              <span className="text-[11px] text-blue-300 mt-1 block">
                Rank 4 in Department Cohort
              </span>
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/40">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/90 text-slate-400 border-b border-slate-800 font-mono">
                <tr>
                  <th className="px-4 py-3">Course Code & Title</th>
                  <th className="px-4 py-3">Faculty</th>
                  <th className="px-4 py-3 text-center">Sessions</th>
                  <th className="px-4 py-3 text-center">Attendance %</th>
                  <th className="px-4 py-3 text-center">CIE Marks</th>
                  <th className="px-4 py-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-200">
                {STUDENT_ERP.attendance.map((sub) => (
                  <tr key={sub.code} className="hover:bg-slate-800/30 transition">
                    <td className="px-4 py-3">
                      <div className="font-bold text-white">{sub.subject}</div>
                      <div className="font-mono text-[10px] text-slate-400">{sub.code}</div>
                    </td>
                    <td className="px-4 py-3 text-slate-300">{sub.faculty}</td>
                    <td className="px-4 py-3 text-center font-mono">{sub.attended} / {sub.total}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`font-mono font-bold ${sub.percentage < 75 ? 'text-rose-400' : 'text-emerald-400'}`}>
                        {sub.percentage}%
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center font-mono font-bold text-blue-300">
                      {sub.cieMarks}/50
                    </td>
                    <td className="px-4 py-3 text-center">
                      {sub.percentage < 75 ? (
                        <span className="inline-flex items-center gap-1 rounded bg-rose-500/15 border border-rose-500/30 px-2 py-0.5 text-[10px] font-bold text-rose-300 animate-pulse">
                          <AlertTriangle className="h-3 w-3" /> Shortage Alert
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-bold text-emerald-300">
                          <CheckCircle2 className="h-3 w-3" /> Eligible
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: FINANCIAL LEDGER */}
      {activeTab === 'finance' && (
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="rounded-xl bg-slate-950/60 p-4 border border-slate-800">
              <span className="text-xs text-slate-400">Total Billed Fees</span>
              <div className="text-2xl font-extrabold text-white mt-1">
                ₹{STUDENT_ERP.financials.totalFees.toLocaleString('en-IN')}
              </div>
              <span className="text-[11px] text-slate-400 mt-1 block">Annual Academic Schedule</span>
            </div>

            <div className="rounded-xl bg-slate-950/60 p-4 border border-slate-800">
              <span className="text-xs text-slate-400">Total Paid Amount</span>
              <div className="text-2xl font-extrabold text-emerald-400 mt-1">
                ₹{STUDENT_ERP.financials.paidAmount.toLocaleString('en-IN')}
              </div>
              <span className="text-[11px] text-emerald-400 mt-1 block">100% Cleared via NetBanking</span>
            </div>

            <div className="rounded-xl bg-slate-950/60 p-4 border border-slate-800">
              <span className="text-xs text-slate-400">Outstanding Balance</span>
              <div className="text-2xl font-extrabold text-white mt-1">
                ₹0.00
              </div>
              <span className="text-[11px] text-emerald-400 mt-1 block">Zero Dues Certificate Issued</span>
            </div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3">
              Audited Payment Ledger & Digital Receipts
            </h4>
            <div className="space-y-2">
              {STUDENT_ERP.financials.transactions.map((tx) => (
                <div key={tx.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-900/60 border border-slate-800 text-xs">
                  <div>
                    <div className="font-semibold text-white">{tx.desc}</div>
                    <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                      Txn ID: {tx.id} • Date: {tx.date}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-white">
                      ₹{tx.amount.toLocaleString('en-IN')}
                    </span>
                    <span className="rounded bg-emerald-500/20 text-emerald-400 px-2 py-0.5 text-[10px] font-bold">
                      {tx.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: HALL TICKET GATE */}
      {activeTab === 'hallticket' && (
        <div className="flex flex-col gap-4">
          <div className="rounded-xl bg-slate-950/60 p-5 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-5">
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <FileText className="h-4 w-4 text-blue-400" />
                Examination Hall Ticket Eligibility Verification Gate
              </h4>
              <p className="text-xs text-slate-300 max-w-xl">
                VTU Academic By-Laws require automated digital admit card clearance strictly gated behind minimum cumulative attendance (&ge; 75%) and complete institutional financial clearance.
              </p>

              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2 text-emerald-400">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Cumulative Attendance Requirement: <strong>{overallAttendance}%</strong> (Threshold: &ge; 75.0%)</span>
                </div>
                <div className="flex items-center gap-2 text-emerald-400">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Fee Ledger Clearance: <strong>₹0.00 Outstanding Dues</strong></span>
                </div>
                <div className="flex items-center gap-2 text-emerald-400">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Faculty Proctor Clearance: <strong>Approved by Dr. Harish Kumar N</strong></span>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center gap-2 shrink-0">
              <button
                onClick={() => setShowHallTicketModal(true)}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 px-5 py-3 text-xs font-bold text-white shadow-xl shadow-blue-500/25 transition active:scale-95"
              >
                <Download className="h-4 w-4" />
                View & Download Admit Card
              </button>
              <span className="text-[10px] text-slate-400 font-mono">
                Admit Ref: {STUDENT_ERP.financials.hallTicketStatus.admitNumber}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: DYNAMIC DIGITAL ID CARD */}
      {activeTab === 'idcard' && (
        <div className="flex justify-center py-2">
          <div className="w-full max-w-md rounded-2xl bg-gradient-to-br from-slate-900 via-blue-950/60 to-slate-900 p-6 border border-blue-500/40 shadow-2xl relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <div className="text-xs font-black tracking-widest text-blue-400">BMSIT&M</div>
                <div className="text-[10px] text-slate-300">Department of Computer Science</div>
              </div>
              <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-500/30">
                ACTIVE STUDENT
              </span>
            </div>

            <div className="mt-4 flex gap-4 items-center">
              <div className="h-20 w-20 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-3xl font-black text-white shadow-md">
                GP
              </div>
              <div>
                <h4 className="text-base font-bold text-white">{STUDENT_ERP.profile.name}</h4>
                <div className="text-xs font-mono text-blue-300 mt-0.5">{STUDENT_ERP.profile.usn}</div>
                <div className="text-[11px] text-slate-400 mt-1">Blood Group: {STUDENT_ERP.profile.bloodGroup}</div>
                <div className="text-[11px] text-slate-400">Valid Upto: {STUDENT_ERP.profile.validUpto}</div>
              </div>
            </div>

            <div className="mt-5 flex flex-col items-center gap-2 rounded-xl bg-slate-950/80 p-4 border border-white/10">
              <div className="p-2 bg-white rounded-lg shadow">
                <QrCode className="h-28 w-28 text-slate-900" />
              </div>
              <div className="flex items-center gap-2 text-[10px] font-mono text-slate-300">
                <Clock className="h-3 w-3 text-blue-400" />
                <span>Dynamic Security Token: <strong className="text-blue-400">{qrToken}</strong></span>
              </div>
              <div className="text-[9px] text-slate-500">
                Auto-refreshes in {qrRefreshCountdown}s to eliminate credential spoofing
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hall Ticket Preview Modal */}
      {showHallTicketModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-lg rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <div>
                <h3 className="text-sm font-bold text-white">BMS Institute of Technology & Management</h3>
                <p className="text-[11px] text-slate-400">{STUDENT_ERP.financials.hallTicketStatus.examCycle}</p>
              </div>
              <button
                onClick={() => setShowHallTicketModal(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs bg-slate-950/60 p-4 rounded-xl border border-slate-800 font-mono">
              <div className="flex justify-between">
                <span className="text-slate-400">Candidate Name:</span>
                <span className="font-bold text-white">{STUDENT_ERP.profile.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">USN:</span>
                <span className="font-bold text-blue-400">{STUDENT_ERP.profile.usn}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Admit Card No:</span>
                <span className="text-white">{STUDENT_ERP.financials.hallTicketStatus.admitNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Exam Center:</span>
                <span className="text-white">{STUDENT_ERP.financials.hallTicketStatus.centerCode} (Academic Complex)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Clearance Status:</span>
                <span className="text-emerald-400 font-bold">VERIFIED & AUTHORIZED</span>
              </div>
            </div>

            <div className="mt-5 flex justify-end gap-3">
              <button
                onClick={() => setShowHallTicketModal(false)}
                className="px-4 py-1.5 rounded-lg text-xs font-semibold text-slate-400 hover:text-white"
              >
                Close
              </button>
              <button
                onClick={() => {
                  alert("Admit Card PDF generated and saved for offline presentation!");
                  setShowHallTicketModal(false);
                }}
                className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-1.5 text-xs font-bold text-white hover:bg-blue-500 shadow-md"
              >
                <Download className="h-3.5 w-3.5" />
                Download PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
