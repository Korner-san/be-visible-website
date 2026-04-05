import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, ArrowUpRight } from 'lucide-react';
import { Hexagon } from './Hexagon';

interface NavLink {
  label: string;
  href: string;
  ariaLabel: string;
  description?: string;
}

interface NavItem {
  label: string;
  links?: NavLink[];
  href?: string;
}

interface NavbarProps {
  items: NavItem[];
  onGetStarted?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ items, onGetStarted }) => {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [manualShow, setManualShow] = useState(false);
  const location = useLocation();

  const isVisible = scrolled || manualShow;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="fixed left-0 right-0 z-[99] flex justify-center pointer-events-none">
      <motion.nav 
        initial={false}
        animate={{
          y: scrolled ? 16 : 0,
          width: scrolled ? "90%" : "100%",
          maxWidth: scrolled ? "1100px" : "100%",
          borderRadius: scrolled ? "24px" : "0px",
          backgroundColor: scrolled ? "rgba(255, 255, 255, 0.8)" : "rgba(0, 0, 0, 0)",
          borderColor: scrolled ? "rgba(0, 0, 0, 0.05)" : "rgba(0, 0, 0, 0)",
          backdropFilter: scrolled ? "blur(16px)" : "blur(0px)",
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="h-[72px] flex items-center justify-between px-8 relative border pointer-events-auto"
      >
        {/* Left Section: Logo */}
        <div className="flex-shrink-0">
          <Link to="/" aria-label="Home" className="block outline-none">
            <img 
              src="/logo.png" 
              alt="Be-visible Logo" 
              className={`h-8 w-auto transition-all duration-500 ${!scrolled ? 'invert brightness-0 filter' : ''}`}
            />
          </Link>
        </div>

        {/* Nav Links */}
        <div className="hidden md:flex items-center gap-10 absolute left-1/2 -translate-x-1/2">
          {items.map((item) => {
            const isActive = item.href === location.pathname || 
                           (item.links && item.links.some(l => l.href === location.pathname));
            
            return (
              <div
                key={item.label}
                className="relative h-[72px] flex items-center"
                onMouseEnter={() => item.links && setActiveDropdown(item.label)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                {item.href ? (
                  <Link
                    to={item.href}
                    className={`text-[13px] font-medium tracking-wide transition-all duration-500 relative group
                      ${isActive ? (scrolled ? 'text-ink' : 'text-white') : (scrolled ? 'text-ink/50 hover:text-ink' : 'text-white/50 hover:text-white')}`}
                  >
                    {item.label}
                    <motion.div 
                      className="absolute -bottom-1 left-0 right-0 h-[1px] bg-current origin-left"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: isActive ? 1 : 0 }}
                      whileHover={{ scaleX: 1 }}
                    />
                  </Link>
                ) : (
                  <button className={`text-[13px] font-medium tracking-wide flex items-center gap-1.5 transition-all duration-500 cursor-default relative group
                    ${isActive ? (scrolled ? 'text-ink' : 'text-white') : (scrolled ? 'text-ink/50 hover:text-ink' : 'text-white/50 hover:text-white')}`}>
                    {item.label}
                    {item.links && <ChevronDown size={12} className={`transition-transform duration-300 ${activeDropdown === item.label ? 'rotate-180' : ''}`} />}
                    <motion.div 
                      className="absolute -bottom-1 left-0 right-0 h-[1px] bg-current origin-left"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: isActive ? 1 : 0 }}
                    />
                  </button>
                )}

              {/* Dropdown Menu */}
              <AnimatePresence>
                {activeDropdown === item.label && item.links && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.98 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full left-1/2 -translate-x-1/2 pt-4"
                  >
                    <div className="bg-white border border-ink/5 rounded-3xl shadow-[0_32px_64px_rgba(0,0,0,0.08)] p-8 min-w-[600px] relative overflow-hidden">
                      <div className="grid grid-cols-2 gap-4">
                        {item.links.map((link) => (
                          <Link
                            key={link.label}
                            to={link.href}
                            onClick={() => setActiveDropdown(null)}
                            className="group flex items-start gap-4 p-4 rounded-2xl hover:bg-surface-50 transition-all duration-300"
                          >
                            <div className="mt-1 w-10 h-10 rounded-xl bg-surface-100 flex items-center justify-center group-hover:bg-ink group-hover:text-white transition-all">
                              <ArrowUpRight size={16} className="opacity-40 group-hover:opacity-100 transition-all" />
                            </div>
                            <div className="flex-1">
                              <div className="text-[14px] font-bold text-ink mb-1">
                                {link.label}
                              </div>
                              {link.description && (
                                <div className="text-[12px] text-ink/40 leading-relaxed">
                                  {link.description}
                                </div>
                              )}
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* Auth Buttons */}
      <div className="flex items-center gap-4">
        <button
          type="button"
          className={`hidden md:inline-flex text-[12px] font-bold tracking-wide transition-colors duration-500
            ${scrolled ? 'text-ink/60 hover:text-ink' : 'text-white/60 hover:text-white'}`}
        >
          Sign In
        </button>
        <button
          type="button"
          onClick={onGetStarted}
          className={`px-6 py-2.5 rounded-full text-[12px] font-bold tracking-wide transition-all duration-500 shadow-sm
            ${scrolled 
              ? 'bg-ink text-white hover:bg-ink/90' 
              : 'bg-white text-ink hover:bg-white/90'}`}
        >
          Get Started
        </button>
      </div>
    </motion.nav>
  </div>
);
};

export default Navbar;
