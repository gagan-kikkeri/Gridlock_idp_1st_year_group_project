import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, 
  Send, 
  X, 
  Bot, 
  User, 
  ArrowRight, 
  Accessibility, 
  CheckCircle2, 
  AlertTriangle, 
  MapPin, 
  GraduationCap, 
  Calendar, 
  HelpCircle,
  Minimize2,
  Maximize2
} from 'lucide-react';
import { processCampusAiQuery } from '../services/campusAiBrain.js';

export default function CampusAiCopilot({
  userRole = 'student',
  studentErp = {},
  facultyRoster = [],
  facultyClassRoster = [],
  appointments = [],
  hazardMap = {},
  nodes = {},
  edges = [],
  isAccessibleMode = false,
  mobilityProfile = {},
  onNavigate,
  onSetTab,
  onUpdateMobilityProfile,
  onToggleAccessibleMode
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 'msg-welcome',
      sender: 'ai',
      timestamp: 'Just now',
      title: "🤖 Gridlock Campus Copilot • AI Intelligence",
      text: `Hello! I am your **BMSIT CSE Campus AI Assistant**. I have real-time access to your academic records, attendance percentages, faculty presence, and campus navigation.

How can I help you today? Try asking me anything or tap one of the suggested questions below!`,
      badges: [
        { label: `Persona: ${userRole.toUpperCase()}`, color: "purple" },
        { label: isAccessibleMode ? "♿ No-Stairs Active" : "Standard Mobility", color: isAccessibleMode ? "emerald" : "blue" }
      ],
      actions: userRole === 'student' ? [
        { label: "📉 Which subject am I lagging in?", type: "ASK", query: "Which subject am I lagging in?" },
        { label: "⚠️ Check my attendance shortage", type: "ASK", query: "Which subject do I have attendance shortage in?" },
        { label: "♿ I have a leg injury (No stairs)", type: "ASK", query: "I have a leg injury, show me route with no stairs" }
      ] : [
        { label: "⚠️ Which students have low attendance?", type: "ASK", query: "Which students have attendance shortage?" },
        { label: "📅 Who applied for appointments?", type: "ASK", query: "Who applied for appointments with me?" }
      ]
    }
  ]);

  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    if (isOpen && !isMinimized) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isMinimized]);

  // Suggested prompt chips based on role
  const promptChips = {
    student: [
      "📉 Which subject am I lagging in?",
      "⚠️ Which subject has attendance shortage?",
      "♿ I have a leg injury (No stairs)",
      "🎫 Check Hall Ticket eligibility",
      "📍 Where is HOD Dr. Harish's cabin?",
      "💰 What are my pending college fees?"
    ],
    faculty: [
      "⚠️ Which students have attendance shortage?",
      "📅 Who applied for appointments with me?",
      "🏫 Where is my next lecture scheduled?",
      "🧹 Check corridor cleaning & hazards",
      "♿ Enable No-Stairs Mode"
    ],
    hod: [
      "📋 Show department attendance shortage audit",
      "📅 View pending student consultation requests",
      "📊 Check building topology & accessibility score",
      "🚨 Any active corridor cleaning hazards?"
    ],
    janitorial: [
      "🧹 Which corridors are currently wet or blocked?",
      "⚠️ Show reported cleaning hazards on campus"
    ],
    admin: [
      "📊 Building topology health & accessibility score",
      "📋 Check student examination hall ticket audit",
      "🚨 Active campus hazards and cleaning alerts"
    ]
  };

  const currentChips = promptChips[userRole] || promptChips.student;

  const handleSendMessage = (textToSend) => {
    const query = textToSend || inputMessage;
    if (!query.trim()) return;

    // Add user message
    const userMsg = {
      id: `msg-${Date.now()}-user`,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: query
    };

    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');

    // Generate AI response
    setTimeout(() => {
      const response = processCampusAiQuery({
        query,
        userRole,
        studentErp,
        facultyRoster,
        facultyClassRoster,
        appointments,
        hazardMap,
        nodes,
        edges,
        isAccessibleMode,
        mobilityProfile
      });

      const aiMsg = {
        id: `msg-${Date.now()}-ai`,
        sender: 'ai',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        title: response.title,
        text: response.text,
        badges: response.badges,
        actions: response.actions
      };

      setMessages(prev => [...prev, aiMsg]);
    }, 350);
  };

  const handleExecuteAction = (action) => {
    if (!action) return;

    if (action.type === 'NAVIGATE') {
      onNavigate?.(action.start, action.target, action.accessible);
      setIsOpen(false);
    } else if (action.type === 'SET_TAB') {
      onSetTab?.(action.tab);
      setIsOpen(false);
    } else if (action.type === 'SET_MOBILITY') {
      onUpdateMobilityProfile?.(action.condition);
    } else if (action.type === 'ASK') {
      handleSendMessage(action.query);
    }
  };

  return (
    <>
      {/* Floating Launcher Button */}
      {!isOpen && (
        <button
          onClick={() => {
            setIsOpen(true);
            setIsMinimized(false);
          }}
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-4 py-3 text-sm font-bold text-white shadow-2xl shadow-indigo-500/40 hover:scale-105 active:scale-95 transition border border-indigo-400/40 group"
          title="Open Gridlock Campus AI Assistant"
        >
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-400"></span>
          </span>
          <Sparkles className="h-4 w-4 text-amber-300 group-hover:rotate-12 transition-transform" />
          <span className="tracking-wide">Ask Campus AI</span>
          {isAccessibleMode && (
            <span className="rounded-full bg-emerald-500/30 px-2 py-0.5 text-[10px] text-emerald-200 border border-emerald-400/40">
              ♿ No-Stairs
            </span>
          )}
        </button>
      )}

      {/* Slide-out / Floating Chat Window */}
      {isOpen && (
        <div 
          className={`fixed right-4 sm:right-6 bottom-4 sm:bottom-6 z-50 flex flex-col rounded-2xl border border-indigo-500/40 bg-slate-950/95 shadow-2xl shadow-black/80 backdrop-blur-xl transition-all duration-300 ${
            isMinimized 
              ? 'w-80 h-16 overflow-hidden' 
              : 'w-[95vw] sm:w-[460px] h-[85vh] sm:h-[620px] max-h-[85vh]'
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-800 bg-gradient-to-r from-slate-900 via-indigo-950/50 to-slate-900 px-4 py-3 rounded-t-2xl">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-purple-600 text-white shadow-md shadow-indigo-500/30">
                <Sparkles className="h-5 w-5 text-amber-300" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-extrabold text-white">Campus AI Copilot</h3>
                  <span className="rounded-md bg-purple-500/20 px-1.5 py-0.5 text-[10px] font-mono font-bold text-purple-300 border border-purple-500/30">
                    {userRole.toUpperCase()}
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
                  <span>BMSIT Real-time Intelligence</span>
                  {isAccessibleMode && (
                    <span className="text-emerald-400 font-medium">• ♿ No-Stairs Active</span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
                title={isMinimized ? "Expand" : "Minimize"}
              >
                {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
                title="Close AI Assistant"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Message Feed */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                  >
                    <div className="flex items-center gap-1.5 mb-1 px-1 text-[10px] text-slate-400">
                      {msg.sender === 'user' ? (
                        <>
                          <span>You</span>
                          <span>•</span>
                          <span>{msg.timestamp}</span>
                        </>
                      ) : (
                        <>
                          <Bot className="h-3 w-3 text-purple-400" />
                          <span className="font-semibold text-purple-300">Campus Copilot</span>
                          <span>•</span>
                          <span>{msg.timestamp}</span>
                        </>
                      )}
                    </div>

                    <div
                      className={`max-w-[90%] rounded-2xl p-3.5 leading-relaxed shadow-lg ${
                        msg.sender === 'user'
                          ? 'bg-blue-600 text-white rounded-tr-none'
                          : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none'
                      }`}
                    >
                      {msg.title && (
                        <div className="font-bold text-white text-xs mb-2 border-b border-slate-800/80 pb-1.5 flex items-center gap-1.5">
                          {msg.title}
                        </div>
                      )}

                      {/* Text content with simple markdown formatting */}
                      <div className="space-y-1.5 whitespace-pre-line text-[11px] sm:text-xs">
                        {msg.text}
                      </div>

                      {/* Badges */}
                      {msg.badges && msg.badges.length > 0 && (
                        <div className="mt-2.5 flex flex-wrap gap-1.5 pt-2 border-t border-slate-800/60">
                          {msg.badges.map((b, idx) => (
                            <span
                              key={idx}
                              className={`rounded-md px-2 py-0.5 text-[10px] font-semibold border ${
                                b.color === 'red'
                                  ? 'bg-red-500/20 text-red-300 border-red-500/40'
                                  : b.color === 'amber'
                                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                                  : b.color === 'emerald'
                                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                                  : b.color === 'purple'
                                  ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                                  : 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                              }`}
                            >
                              {b.label}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Action Buttons */}
                      {msg.actions && msg.actions.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-1.5 pt-2 border-t border-slate-800/60">
                          {msg.actions.map((act, idx) => (
                            <button
                              key={idx}
                              onClick={() => handleExecuteAction(act)}
                              className="flex items-center gap-1 rounded-lg bg-indigo-600/30 hover:bg-indigo-600 text-indigo-200 hover:text-white px-2.5 py-1 text-[11px] font-semibold transition border border-indigo-500/30"
                            >
                              <span>{act.label}</span>
                              <ArrowRight className="h-3 w-3" />
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Prompt Suggestion Chips */}
              <div className="border-t border-slate-800/80 bg-slate-900/60 p-2.5">
                <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1 px-1">
                  <Sparkles className="h-3 w-3 text-amber-400" />
                  <span>Suggested Questions</span>
                </div>
                <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-1">
                  {currentChips.map((chip, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSendMessage(chip)}
                      className="whitespace-nowrap rounded-lg bg-slate-800/80 hover:bg-blue-600 hover:text-white text-slate-300 px-2.5 py-1 text-[11px] font-medium transition border border-slate-700/60"
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              </div>

              {/* Text Input Box */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="p-3 border-t border-slate-800 bg-slate-950 flex items-center gap-2 rounded-b-2xl"
              >
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Ask anything (e.g. 'Which subject am I lagging in?')..."
                  className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
                <button
                  type="submit"
                  disabled={!inputMessage.trim()}
                  className="p-2.5 rounded-xl bg-indigo-600 text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-indigo-500 transition shadow-md shadow-indigo-600/30"
                  title="Send message"
                >
                  <Send className="h-4 w-4" />
                </button>
              </form>
            </>
          )}
        </div>
      )}
    </>
  );
}
