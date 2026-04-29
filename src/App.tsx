import { useState, useRef, useEffect, createContext, useContext } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown, X, Calendar, Clock, ChevronLeft, ChevronRight, CheckCircle2 } from "lucide-react";
import { Routes, Route, Link, useLocation } from "react-router-dom";
import { Hexagon } from "./components/Hexagon";
import { Home } from "./pages/Home";
import { Pricing } from "./pages/Pricing";
import { Terms } from "./pages/Terms";
import { Solutions } from "./pages/Solutions";
import Navbar from "./components/Navbar";
import PixelBlast from "./components/PixelBlast";

// Booking Context
interface BookingContextType {
  openBooking: (plan: string) => void;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context) throw new Error("useBooking must be used within a BookingProvider");
  return context;
};

const BookingModal = ({ isOpen, onClose, planName }: { isOpen: boolean, onClose: () => void, planName: string }) => {
  const [step, setStep] = useState<'date' | 'time' | 'form' | 'success'>('date');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });

  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    return { firstDay, daysInMonth };
  };

  const { firstDay, daysInMonth } = getDaysInMonth(currentMonth);
  const calendarDays = Array.from({ length: 42 }, (_, i) => {
    const day = i - firstDay + 1;
    return day > 0 && day <= daysInMonth ? day : null;
  });

  const times = ["09:00 AM", "10:00 AM", "11:00 AM", "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM"];

  const handleDateSelect = (day: number) => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    setSelectedDate(date);
    setStep('time');
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    setStep('form');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('success');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-4xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]"
      >
        {/* Sidebar Info */}
        <div className="w-full md:w-80 bg-surface-50 p-8 border-b md:border-b-0 md:border-r border-ink/5">
          <div className="mb-8">
            <Hexagon size={32} outline className="text-ink/10 mb-6" />
            <h3 className="text-[10px] uppercase tracking-[0.3em] font-bold text-ink/40 mb-2">Booking Strategy</h3>
            <h2 className="text-2xl font-nixie text-ink">{planName}</h2>
          </div>
          
          <div className="space-y-6">
            <div className="flex items-center gap-3 text-sm text-ink/60">
              <Clock size={16} className="text-ink/20" />
              <span>45 min session</span>
            </div>
            {selectedDate && (
              <div className="flex items-center gap-3 text-sm text-ink/60">
                <Calendar size={16} className="text-ink/20" />
                <span>{selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
              </div>
            )}
            {selectedTime && (
              <div className="flex items-center gap-3 text-sm text-ink/60">
                <Clock size={16} className="text-ink/20" />
                <span>{selectedTime}</span>
              </div>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8 md:p-12 overflow-y-auto relative">
          <button onClick={onClose} className="absolute top-8 right-8 text-ink/20 hover:text-ink transition-colors">
            <X size={24} />
          </button>

          <AnimatePresence mode="wait">
            {step === 'date' && (
              <motion.div 
                key="date"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <div className="flex items-center justify-between mb-8">
                  <h4 className="text-xl font-nixie">Select a Date</h4>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() - 1)))}
                      className="p-2 hover:bg-surface-50 rounded-full transition-colors"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <button 
                      onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() + 1)))}
                      className="p-2 hover:bg-surface-50 rounded-full transition-colors"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </div>
                </div>
                
                <div className="text-center mb-6 font-medium text-sm uppercase tracking-widest text-ink/40">
                  {months[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                </div>

                <div className="grid grid-cols-7 gap-2">
                  {days.map(day => (
                    <div key={day} className="text-[10px] font-bold uppercase tracking-widest text-ink/20 text-center py-2">
                      {day}
                    </div>
                  ))}
                  {calendarDays.map((day, i) => (
                    <div key={i} className="aspect-square flex items-center justify-center">
                      {day && (
                        <button 
                          onClick={() => handleDateSelect(day)}
                          className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-light hover:bg-ink hover:text-white transition-all border border-transparent hover:border-ink"
                        >
                          {day}
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 'time' && (
              <motion.div 
                key="time"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <button 
                  onClick={() => setStep('date')}
                  className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-ink/30 mb-8 hover:text-ink transition-colors"
                >
                  <ChevronLeft size={12} /> Back to Calendar
                </button>
                <h4 className="text-xl font-nixie mb-8">Select a Time</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {times.map(time => (
                    <button 
                      key={time}
                      onClick={() => handleTimeSelect(time)}
                      className="p-4 rounded-2xl border border-ink/10 text-sm font-light hover:border-ink hover:bg-ink hover:text-white transition-all text-center"
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 'form' && (
              <motion.div 
                key="form"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <button 
                  onClick={() => setStep('time')}
                  className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-ink/30 mb-8 hover:text-ink transition-colors"
                >
                  <ChevronLeft size={12} /> Back to Times
                </button>
                <h4 className="text-xl font-nixie mb-8">Enter Details</h4>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-ink/40">Full Name</label>
                    <input 
                      required
                      type="text" 
                      className="w-full p-4 rounded-2xl border border-ink/10 bg-surface-50 focus:outline-none focus:border-ink transition-colors text-sm font-light"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-ink/40">Email Address</label>
                    <input 
                      required
                      type="email" 
                      className="w-full p-4 rounded-2xl border border-ink/10 bg-surface-50 focus:outline-none focus:border-ink transition-colors text-sm font-light"
                      placeholder="john@company.com"
                      value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-ink/40">Message (Optional)</label>
                    <textarea 
                      className="w-full p-4 rounded-2xl border border-ink/10 bg-surface-50 focus:outline-none focus:border-ink transition-colors text-sm font-light h-32 resize-none"
                      placeholder="Tell us about your project..."
                      value={formData.message}
                      onChange={e => setFormData({...formData, message: e.target.value})}
                    />
                  </div>
                  <button 
                    type="submit"
                    className="w-full py-5 rounded-2xl bg-ink text-white font-bold text-[11px] uppercase tracking-widest hover:bg-ink/90 transition-all shadow-xl shadow-ink/10"
                  >
                    Confirm Booking
                  </button>
                </form>
              </motion.div>
            )}

            {step === 'success' && (
              <motion.div 
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12"
              >
                <div className="flex justify-center mb-8 text-emerald-500">
                  <CheckCircle2 size={64} />
                </div>
                <h4 className="text-3xl font-nixie mb-4">Booking Confirmed</h4>
                <p className="text-sm text-ink/50 font-light mb-12 leading-relaxed">
                  We've sent a calendar invitation to <span className="text-ink font-medium">{formData.email}</span>. <br />
                  Looking forward to discussing your AI visibility strategy.
                </p>
                <button 
                  onClick={onClose}
                  className="px-12 py-4 rounded-xl border border-ink/10 font-bold text-[11px] uppercase tracking-widest hover:bg-surface-50 transition-all"
                >
                  Close
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default function App() {
  const location = useLocation();
  const [bookingPlan, setBookingPlan] = useState<string | null>(null);

  const openBooking = (plan: string) => setBookingPlan(plan);
  const closeBooking = () => setBookingPlan(null);

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const navItems = [
    {
      label: "Solutions",
      links: [
        { label: "Analyze Presence", href: "/solutions/presence", ariaLabel: "Analyze Presence", description: "Deep dive into your brand's digital footprint across all channels." },
        { label: "Market Comparison", href: "/solutions/comparison", ariaLabel: "Market Comparison", description: "Benchmark your performance against industry leaders." },
        { label: "Prompt Intelligence", href: "/solutions/prompts", ariaLabel: "Prompt Intelligence", description: "Optimize your AI interactions for maximum visibility." },
        { label: "Source Tracking", href: "/solutions/citations", ariaLabel: "Source Tracking", description: "Monitor how and where your brand is being cited." }
      ]
    },
    {
      label: "Connect",
      links: [
        { label: "Twitter", href: "#", ariaLabel: "Twitter", description: "Follow us for real-time updates and industry insights." },
        { label: "LinkedIn", href: "#", ariaLabel: "LinkedIn", description: "Join our professional network and community." },
        { label: "Contact", href: "#", ariaLabel: "Contact", description: "Get in touch with our team for personalized support." }
      ]
    },
    {
      label: "Pricing",
      href: "/pricing"
    }
  ];

  return (
    <BookingContext.Provider value={{ openBooking }}>
      <div className="min-h-screen bg-white selection:bg-black selection:text-white relative overflow-clip">
        {/* Subtle Background Hexagons */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.02] z-0">
          <div className="absolute top-20 left-10"><Hexagon size={120} outline className="text-ink" /></div>
          <div className="absolute top-1/2 right-20"><Hexagon size={200} outline className="text-ink" /></div>
          <div className="absolute bottom-40 left-1/4"><Hexagon size={150} outline className="text-ink" /></div>
          <div className="absolute top-1/4 right-1/3"><Hexagon size={80} outline className="text-ink" /></div>
        </div>

        {/* Navigation */}
        <Navbar
          items={navItems}
          onGetStarted={() => openBooking("AI Visibility Strategy")}
        />

        <main className="relative z-10">
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<Home />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/solutions/:type" element={<Solutions />} />
            </Routes>
          </AnimatePresence>
        </main>

        {/* Footer */}
        <footer className="py-24 px-6 relative z-10 bg-white border-t border-ink/5">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-24">
              <div className="col-span-1 md:col-span-2">
                <Link to="/" className="font-nixie font-bold text-2xl tracking-tighter flex items-center gap-3 mb-8 text-ink">
                  Be-visible <Hexagon size={12} outline className="text-ink/20" />
                </Link>
                <p className="text-ink/40 font-light max-w-sm leading-relaxed">
                  Elevating brand visibility through advanced AI intelligence and algorithmic optimization. The future of digital presence is here.
                </p>
              </div>
              <div>
                <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-ink/20 mb-8">Platform</h4>
                <ul className="space-y-4 text-sm font-light text-ink/60">
                  <li><Link to="/solutions/presence" className="hover:text-ink transition-colors">Presence Analysis</Link></li>
                  <li><Link to="/solutions/comparison" className="hover:text-ink transition-colors">Market Comparison</Link></li>
                  <li><Link to="/pricing" className="hover:text-ink transition-colors">Pricing</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-ink/20 mb-8">Company</h4>
                <ul className="space-y-4 text-sm font-light text-ink/60">
                  <li><Link to="/terms" className="hover:text-ink transition-colors">Terms of Service</Link></li>
                  <li><a href="#" className="hover:text-ink transition-colors">Privacy Policy</a></li>
                  <li><a href="#" className="hover:text-ink transition-colors">Contact</a></li>
                </ul>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row justify-between items-center pt-12 border-t border-ink/5 gap-8">
              <div className="text-[10px] font-mono text-ink/20 tracking-widest uppercase">
                © 2026 Be-visible. ALL RIGHTS RESERVED.
              </div>
              <div className="flex gap-8">
                <a href="#" className="text-ink/40 hover:text-ink transition-colors"><Hexagon size={16} outline /></a>
                <a href="#" className="text-ink/40 hover:text-ink transition-colors"><Hexagon size={16} outline /></a>
              </div>
            </div>
          </div>
        </footer>

        <AnimatePresence>
          {bookingPlan && (
            <BookingModal 
              isOpen={!!bookingPlan} 
              onClose={closeBooking} 
              planName={bookingPlan} 
            />
          )}
        </AnimatePresence>

        <style>{`
          @keyframes marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .animate-marquee {
            animation: marquee 30s linear infinite;
          }
        `}</style>
      </div>
    </BookingContext.Provider>
  );
}
