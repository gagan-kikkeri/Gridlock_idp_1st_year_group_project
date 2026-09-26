import React, { useState } from 'react';
import { FACULTY_ROSTER } from '../data/campusData.js';
import { 
  Users, 
  MapPin, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Send, 
  Navigation, 
  Sparkles,
  Award
} from 'lucide-react';

export default function CabinRadar({ userRole, onNavigateToNode }) {
  const [facultyList, setFacultyList] = useState(FACULTY_ROSTER);
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const [bookingSlot, setBookingSlot] = useState('');
  const [bookingAgenda, setBookingAgenda] = useState('');
  const [bookedSuccess, setBookedSuccess] = useState(false);

  // If user is Faculty or HOD, allow toggling their status
  const handleToggleStatus = (facultyId, newStatus) => {
    setFacultyList(prev => prev.map(f => {
      if (f.id === facultyId) {
        return {
          ...f,
          status: newStatus,
          statusMessage: newStatus === 'Available' ? 'Available in cabin for student consultation' : newStatus === 'In Meeting' ? 'In Department Academic Review' : 'Out of station'
        };
      }
      return f;
    }));
  };

  const handleBookAppointment = (e) => {
    e.preventDefault();
    if (!bookingSlot) return;
    setBookedSuccess(true);
    setTimeout(() => {
      setBookedSuccess(false);
      setSelectedFaculty(null);
      setBookingSlot('');
      setBookingAgenda('');
    }, 2000);
  };

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
              Dynamic Cabin Occupancy Radar
              <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
            </h3>
            <p className="text-xs text-slate-400">
              Real-time faculty office presence to eliminate corridor queues & unscheduled waiting
            </p>
          </div>
        </div>

        {/* Status quick key */}
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

                  {/* Status Pill */}
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

                {/* Cabin location & status message */}
                <div className="mt-3 space-y-1.5 text-xs">
                  <div className="flex items-center gap-1.5 text-slate-300">
                    <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                    <span>Location: <strong className="text-white">{faculty.cabinName}</strong> (First Floor)</span>
                  </div>
                  <div className="text-[11px] text-slate-400 italic">
                    "{faculty.statusMessage}"
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Expertise: <span className="text-slate-300">{faculty.specialization}</span>
                  </div>
                </div>

                {/* Faculty/HOD Quick Status Toggle */}
                {(userRole === 'faculty' || userRole === 'hod' || userRole === 'admin') && (
                  <div className="mt-3 pt-2.5 border-t border-slate-800 flex items-center gap-2">
                    <span className="text-[10px] text-slate-400 font-mono">Swipe Status:</span>
                    <div className="flex gap-1">
                      {['Available', 'In Meeting', 'On Leave'].map(st => (
                        <button
                          key={st}
                          onClick={() => handleToggleStatus(faculty.id, st)}
                          className={`px-2 py-0.5 rounded text-[10px] font-semibold transition ${
                            faculty.status === st
                              ? 'bg-blue-600 text-white'
                              : 'bg-slate-800 text-slate-400 hover:text-white'
                          }`}
                        >
                          {st}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
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
                  Book Slot
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Appointment Booking Modal */}
      {selectedFaculty && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-2xl border border-slate-700 bg-slate-900 p-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <div>
                <h4 className="text-sm font-bold text-white">
                  Schedule Cabin Consultation
                </h4>
                <p className="text-xs text-slate-400">
                  With {selectedFaculty.name} ({selectedFaculty.cabinName})
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
                <h5 className="text-base font-bold text-white">Consultation Confirmed!</h5>
                <p className="text-xs text-slate-300">
                  Appointment added to faculty ledger. Turn-by-turn transition alert will trigger 10 minutes prior to meeting.
                </p>
              </div>
            ) : (
              <form onSubmit={handleBookAppointment} className="space-y-4 text-xs">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">
                    Select Available Slot Today:
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
                    Consultation Agenda & Notes:
                  </label>
                  <textarea
                    rows="3"
                    value={bookingAgenda}
                    onChange={(e) => setBookingAgenda(e.target.value)}
                    placeholder="e.g. Major Project Defense slides review and A* algorithm evaluation..."
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
                    <Send className="h-3.5 w-3.5" /> Confirm Appointment
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
