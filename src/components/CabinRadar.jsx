import React, { useState } from 'react';
import { 
  Users, 
  MapPin, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Send, 
  Navigation, 
  Award,
  BookOpen,
  ArrowRight,
  Filter
} from 'lucide-react';

export default function CabinRadar({ 
  userRole, 
  appointments = [],
  onAcceptAppointment,
  onRejectAppointment,
  onBookAppointment,
  facultyList = [],
  onUpdateFacultyStatus,
  onNavigateToNode 
}) {
  // Student modal booking state
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const [bookingSlot, setBookingSlot] = useState('');
  const [bookingAgenda, setBookingAgenda] = useState('');
  const [bookedSuccess, setBookedSuccess] = useState(false);

  // Active faculty persona based on role
  const activeFacultyMember = userRole === 'hod' 
    ? facultyList.find(f => f.id === 'fac-harish') || facultyList[0]
    : facultyList.find(f => f.id === 'fac-rajesh') || facultyList[1];

  // Handle student appointment submission
  const handleSubmitBooking = (e) => {
    e.preventDefault();
    if (!bookingSlot || !selectedFaculty) return;

    onBookAppointment({
      id: `APT-${Math.floor(1000 + Math.random() * 9000)}`,
      studentName: 'Gagan N Prasad',
      studentUsn: '26UG1BYCS0588-T',
      facultyId: selectedFaculty.id,
      facultyName: selectedFaculty.name,
      cabinName: selectedFaculty.cabinName,
      slot: bookingSlot,
      agenda: bookingAgenda,
      status: 'Pending',
      timestamp: 'Just now'
    });

    setBookedSuccess(true);
    setTimeout(() => {
      setBookedSuccess(false);
      setSelectedFaculty(null);
      setBookingSlot('');
      setBookingAgenda('');
    }, 1800);
  };

  // Filter appointments for faculty / hod
  const facultyAppointments = userRole === 'hod'
    ? appointments // HOD sees all or their own
    : appointments.filter(a => a.facultyId === activeFacultyMember?.id);

  // =========================================================================
  // VIEW A: FACULTY & HOD DASHBOARD (Accept / Reject Applications)
  // =========================================================================
  if (userRole === 'faculty' || userRole === 'hod') {
    return (
      <div className="flex flex-col gap-5 rounded-2xl border border-blue-500/30 bg-slate-900/90 p-5 shadow-2xl">
        {/* Header Banner */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <span className="text-4xl">{activeFacultyMember.avatar}</span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white">
                  {activeFacultyMember.name}
                </h3>
                <span className="rounded bg-blue-500/20 px-2 py-0.5 text-[11px] font-bold text-blue-400 border border-blue-500/30">
                  {userRole.toUpperCase()} DESK
                </span>
              </div>
              <p className="text-xs text-slate-300">
                {activeFacultyMember.designation} • {activeFacultyMember.cabinName} (First Floor)
              </p>
            </div>
          </div>

          {/* Cabin Presence Swipe Controls */}
          <div className="flex flex-col items-end gap-1.5">
            <span className="text-[10px] font-mono uppercase text-slate-400">
              Live Cabin Occupancy Status:
            </span>
            <div className="flex rounded-lg bg-slate-950 p-1 border border-slate-800">
              {['Available', 'In Meeting', 'On Leave'].map(statusOption => (
                <button
                  key={statusOption}
                  onClick={() => onUpdateFacultyStatus(activeFacultyMember.id, statusOption)}
                  className={`rounded-md px-3 py-1 text-xs font-bold transition ${
                    activeFacultyMember.status === statusOption
                      ? statusOption === 'Available'
                        ? 'bg-emerald-600 text-white shadow-md'
                        : statusOption === 'In Meeting'
                        ? 'bg-amber-600 text-white shadow-md'
                        : 'bg-slate-700 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {statusOption === 'Available' && '🟢 '}
                  {statusOption === 'In Meeting' && '🟡 '}
                  {statusOption === 'On Leave' && '⚪ '}
                  {statusOption}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Transition Assist Alert Card (Slide 11 & 14) */}
        {activeFacultyMember.nextClass && (
          <div className="rounded-xl bg-gradient-to-r from-blue-950/60 to-indigo-950/40 p-4 border border-blue-500/30 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600/30 text-blue-300">
                <BookOpen className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-blue-300 uppercase tracking-wide">
                    Transition Assist • Next Scheduled Lecture
                  </span>
                  <span className="text-[10px] text-amber-400 font-mono bg-amber-500/10 px-1.5 py-0.2 rounded border border-amber-500/20">
                    {activeFacultyMember.nextClass.time}
                  </span>
                </div>
                <div className="text-sm font-extrabold text-white mt-0.5">
                  {activeFacultyMember.nextClass.subject} ({activeFacultyMember.nextClass.room})
                </div>
              </div>
            </div>

            <button
              onClick={() => onNavigateToNode(activeFacultyMember.nextClass.targetNode)}
              className="flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 px-4 py-2 text-xs font-bold text-white shadow-md shadow-blue-500/25 transition active:scale-95"
            >
              <Navigation className="h-4 w-4" />
              Route from Cabin to Classroom
            </button>
          </div>
        )}

        {/* SECTION: INCOMING STUDENT APPOINTMENT APPLICATIONS */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Calendar className="h-4 w-4 text-emerald-400" />
                Student Consultation Applications
              </h4>
              <span className="rounded-full bg-blue-500/20 px-2 py-0.5 text-[10px] font-mono text-blue-300">
                {facultyAppointments.length} Applications
              </span>
            </div>
            <span className="text-[11px] text-slate-400">
              Action Required: <strong>Accept</strong> or <strong>Reject</strong> slot bookings
            </span>
          </div>

          {facultyAppointments.length === 0 ? (
            <div className="rounded-xl bg-slate-950/40 p-8 text-center text-xs text-slate-400 border border-slate-800">
              No pending appointment requests currently.
            </div>
          ) : (
            <div className="space-y-3">
              {facultyAppointments.map(app => {
                const isPending = app.status === 'Pending';
                const isAccepted = app.status === 'Accepted';
                const isRejected = app.status === 'Rejected';

                return (
                  <div
                    key={app.id}
                    className={`flex flex-col md:flex-row items-start md:items-center justify-between gap-4 rounded-xl p-4 border transition ${
                      isPending
                        ? 'bg-slate-950/80 border-blue-500/40 shadow-lg shadow-blue-500/5'
                        : isAccepted
                        ? 'bg-emerald-950/20 border-emerald-500/30'
                        : 'bg-rose-950/20 border-rose-500/20 opacity-70'
                    }`}
                  >
                    {/* Student Info & Agenda */}
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2.5">
                        <span className="font-mono text-xs font-bold text-blue-400 bg-blue-500/15 px-2 py-0.5 rounded border border-blue-500/20">
                          {app.studentUsn}
                        </span>
                        <h5 className="text-sm font-bold text-white">{app.studentName}</h5>
                        <span className="text-[10px] text-slate-400 font-mono">• {app.timestamp}</span>
                      </div>

                      <div className="flex items-center gap-2 text-xs text-slate-300">
                        <Clock className="h-3.5 w-3.5 text-blue-400" />
                        <span>Requested Slot: <strong className="text-white font-mono">{app.slot}</strong></span>
                        <span className="text-slate-500">|</span>
                        <span>Cabin: <strong className="text-slate-200">{app.cabinName}</strong></span>
                      </div>

                      <p className="text-xs text-slate-300 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/60 mt-1">
                        <strong>Agenda:</strong> "{app.agenda}"
                      </p>
                    </div>

                    {/* Action Buttons: Accept / Reject */}
                    <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row items-end sm:items-center gap-2 shrink-0">
                      {isPending ? (
                        <>
                          <button
                            onClick={() => onAcceptAppointment(app.id)}
                            className="flex items-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 px-4 py-2 text-xs font-bold text-white shadow-md shadow-emerald-600/30 transition active:scale-95"
                          >
                            <CheckCircle2 className="h-4 w-4" />
                            Accept Appointment
                          </button>
                          <button
                            onClick={() => onRejectAppointment(app.id)}
                            className="flex items-center gap-1.5 rounded-xl bg-rose-600/80 hover:bg-rose-600 px-3.5 py-2 text-xs font-bold text-white transition active:scale-95"
                          >
                            <XCircle className="h-4 w-4" />
                            Reject
                          </button>
                        </>
                      ) : isAccepted ? (
                        <div className="flex items-center gap-2">
                          <span className="flex items-center gap-1 rounded-lg bg-emerald-500/20 border border-emerald-500/40 px-3 py-1.5 text-xs font-bold text-emerald-300">
                            <CheckCircle2 className="h-4 w-4" /> Confirmed
                          </span>
                          <button
                            onClick={() => onRejectAppointment(app.id)}
                            className="text-xs text-slate-400 hover:text-rose-400 px-2 py-1 transition"
                          >
                            Revoke
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="flex items-center gap-1 rounded-lg bg-rose-500/20 border border-rose-500/30 px-3 py-1.5 text-xs font-bold text-rose-300">
                            <XCircle className="h-4 w-4" /> Declined
                          </span>
                          <button
                            onClick={() => onAcceptAppointment(app.id)}
                            className="text-xs text-slate-400 hover:text-emerald-400 px-2 py-1 transition"
                          >
                            Re-Accept
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW B: STUDENT DASHBOARD (View Radar, Apply for Slot, Check Status)
  // =========================================================================
  const myApplications = appointments.filter(a => a.studentUsn === '26UG1BYCS0588-T');

  return (
    <div className="flex flex-col gap-5 rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-2xl">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-600/20 text-purple-400">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              Faculty Cabin Occupancy Radar
              <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
            </h3>
            <p className="text-xs text-slate-400">
              Live professor office presence • Book consultation appointments & eliminate hallway waiting
            </p>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 text-[11px] font-medium text-slate-400">
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
            <span>Available</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-amber-500"></span>
            <span>In Meeting</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-slate-500"></span>
            <span>On Leave</span>
          </div>
        </div>
      </div>

      {/* Student's Existing Applications Status Banner */}
      {myApplications.length > 0 && (
        <div className="rounded-xl bg-slate-950/60 border border-slate-800 p-4 space-y-2.5">
          <div className="text-xs font-bold text-white flex items-center gap-2">
            <Calendar className="h-4 w-4 text-blue-400" />
            Your Submitted Consultation Requests:
          </div>
          <div className="space-y-2">
            {myApplications.map(app => (
              <div key={app.id} className="flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-lg bg-slate-900/70 border border-slate-800 text-xs">
                <div>
                  <span className="font-bold text-white">{app.facultyName}</span> ({app.cabinName})
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Slot: <strong className="text-slate-200">{app.slot}</strong> • "{app.agenda}"
                  </div>
                </div>
                <div>
                  {app.status === 'Accepted' && (
                    <span className="inline-flex items-center gap-1 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2.5 py-1 text-xs font-bold">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Accepted by Professor
                    </span>
                  )}
                  {app.status === 'Pending' && (
                    <span className="inline-flex items-center gap-1 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2.5 py-1 text-xs font-bold">
                      <Clock className="h-3.5 w-3.5" /> Awaiting Review
                    </span>
                  )}
                  {app.status === 'Rejected' && (
                    <span className="inline-flex items-center gap-1 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40 px-2.5 py-1 text-xs font-bold">
                      <XCircle className="h-3.5 w-3.5" /> Declined / Reschedule
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Faculty Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {facultyList.map(faculty => {
          const isHOD = faculty.id === 'fac-harish';
          const isAvailable = faculty.status === 'Available';
          const isInMeeting = faculty.status === 'In Meeting';

          return (
            <div
              key={faculty.id}
              className={`flex flex-col justify-between rounded-xl p-4 border transition-all ${
                isAvailable
                  ? 'bg-slate-950/70 border-emerald-500/30 shadow-lg shadow-emerald-500/5'
                  : isInMeeting
                  ? 'bg-slate-950/70 border-amber-500/30'
                  : 'bg-slate-950/40 border-slate-800 opacity-80'
              }`}
            >
              <div>
                {/* Top row: Avatar, Name, Status badge */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{faculty.avatar}</span>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="text-sm font-bold text-white">{faculty.name}</h4>
                        {isHOD && (
                          <span className="text-[10px] font-bold text-amber-300 bg-amber-500/20 px-1.5 py-0.2 rounded border border-amber-500/40 flex items-center gap-0.5">
                            <Award className="h-2.5 w-2.5" /> HOD
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-blue-400 font-medium">{faculty.designation}</p>
                    </div>
                  </div>

                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold tracking-wide uppercase border ${
                      isAvailable
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        : isInMeeting
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                        : 'bg-slate-700/40 text-slate-400 border-slate-700'
                    }`}
                  >
                    {faculty.status}
                  </span>
                </div>

                <div className="mt-3 space-y-1.5 text-xs">
                  <div className="flex items-center gap-1.5 text-slate-300">
                    <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                    <span>Location: <strong className="text-white">{faculty.cabinName}</strong> (First Floor)</span>
                  </div>
                  <div className="text-[11px] text-slate-400 italic">
                    "{faculty.statusMessage}"
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Specialization: <span className="text-slate-300">{faculty.specialization}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons for Student */}
              <div className="mt-4 flex items-center gap-2 pt-3 border-t border-slate-800/80">
                <button
                  onClick={() => onNavigateToNode(faculty.cabinNodeId)}
                  className="flex-1 flex items-center justify-center gap-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600 text-blue-300 hover:text-white px-3 py-1.5 text-xs font-semibold border border-blue-500/30 transition"
                  title="Route directly to this cabin on map"
                >
                  <Navigation className="h-3.5 w-3.5" />
                  Route to Cabin
                </button>

                <button
                  onClick={() => setSelectedFaculty(faculty)}
                  disabled={faculty.status === 'On Leave'}
                  className="flex-1 flex items-center justify-center gap-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 text-xs font-semibold transition disabled:opacity-40 disabled:hover:bg-slate-800"
                >
                  <Calendar className="h-3.5 w-3.5" />
                  Apply for Slot
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Appointment Application Modal for Student */}
      {selectedFaculty && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-2xl border border-slate-700 bg-slate-900 p-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <div>
                <h4 className="text-sm font-bold text-white">
                  Apply for Consultation Slot
                </h4>
                <p className="text-xs text-slate-400">
                  Request consultation with {selectedFaculty.name} ({selectedFaculty.cabinName})
                </p>
              </div>
              <button
                onClick={() => setSelectedFaculty(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            {bookedSuccess ? (
              <div className="py-6 flex flex-col items-center gap-2 text-center">
                <CheckCircle2 className="h-10 w-10 text-emerald-400 animate-scale" />
                <h5 className="text-base font-bold text-white">Application Dispatched!</h5>
                <p className="text-xs text-slate-300">
                  Application forwarded to professor's desk for review. You will be notified once Accepted.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmitBooking} className="space-y-4 text-xs">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">
                    Select Consultation Slot:
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {selectedFaculty.availableSlots.map(slot => (
                      <button
                        type="button"
                        key={slot}
                        onClick={() => setBookingSlot(slot)}
                        className={`p-2 rounded-lg border text-left font-mono transition ${
                          bookingSlot === slot
                            ? 'bg-blue-600/30 border-blue-400 text-white'
                            : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                        }`}
                      >
                        <Clock className="h-3 w-3 inline mr-1 text-blue-400" /> {slot}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-slate-300 font-semibold block mb-1">
                    Discussion Agenda & Purpose:
                  </label>
                  <textarea
                    rows="3"
                    value={bookingAgenda}
                    onChange={(e) => setBookingAgenda(e.target.value)}
                    placeholder="e.g. Major Project review, CIE score re-evaluation, or lab doubts..."
                    className="w-full rounded-lg bg-slate-950 border border-slate-800 p-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedFaculty(null)}
                    className="px-4 py-2 rounded-lg text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 font-bold text-white hover:bg-blue-500 shadow-md"
                  >
                    <Send className="h-3.5 w-3.5" /> Submit Application
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
