import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowUpRight, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';

type CardNavLink = {
  label: string;
  href: string;
  ariaLabel: string;
};

export type CardNavItem = {
  label: string;
  bgColor: string;
  textColor: string;
  links?: CardNavLink[];
  href?: string;
};

export interface CardNavProps {
  logo: React.ReactNode;
  items: CardNavItem[];
  className?: string;
  baseColor?: string;
  buttonBgColor?: string;
  buttonTextColor?: string;
}

const CardNav: React.FC<CardNavProps> = ({
  logo,
  items,
  className = '',
  baseColor = '#fff',
  buttonBgColor = '#000',
  buttonTextColor = '#fff'
}) => {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div
      className={`card-nav-container fixed left-1/2 -translate-x-1/2 w-[95%] max-w-[1200px] z-[99] top-[1.2em] md:top-[2em] grid grid-cols-[1fr_auto_1fr] items-center gap-4 ${className}`}
      ref={dropdownRef}
    >
      {/* Logo */}
      <div className="logo-container flex justify-start">
        {logo}
      </div>

      {/* Main Nav Bar */}
      <nav
        className="h-[60px] bg-white rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-black/5 flex items-center justify-center px-12 relative"
        style={{ backgroundColor: baseColor }}
      >
        <ul className="flex items-center gap-8">
          {items.map((item) => {
            const hasLinks = item.links && item.links.length > 0;
            const isActive = activeDropdown === item.label;

            return (
              <li key={item.label} className="relative">
                {hasLinks ? (
                  <button
                    onClick={() => setActiveDropdown(isActive ? null : item.label)}
                    className="flex items-center gap-1 font-bold uppercase tracking-widest text-[11px] hover:opacity-70 transition-opacity cursor-pointer whitespace-nowrap"
                  >
                    {item.label}
                    <ChevronDown size={14} className={`transition-transform duration-300 ${isActive ? 'rotate-180' : ''}`} />
                  </button>
                ) : (
                  <Link
                    to={item.href || '#'}
                    className="font-bold uppercase tracking-widest text-[11px] hover:opacity-70 transition-opacity whitespace-nowrap"
                  >
                    {item.label}
                  </Link>
                )}

                {/* Dropdown Content */}
                <AnimatePresence>
                  {hasLinks && isActive && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      className="absolute top-full left-1/2 -translate-x-1/2 mt-4 w-64 bg-black text-white p-4 rounded-xl shadow-2xl border border-white/10 z-[100]"
                    >
                      <div className="flex flex-col gap-3">
                        {item.links?.map((link) => (
                          <Link
                            key={link.label}
                            to={link.href}
                            className="flex items-center justify-between group hover:bg-white/10 p-2 rounded-lg transition-colors"
                            onClick={() => setActiveDropdown(null)}
                          >
                            <span className="font-bold uppercase tracking-widest text-[10px]">{link.label}</span>
                            <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-3">
        <button
          type="button"
          className="hidden md:inline-flex border-2 border-black bg-white rounded-lg px-6 items-center h-[60px] font-bold uppercase tracking-widest text-[11px] cursor-pointer transition-all duration-300 hover:bg-black hover:text-white shadow-[0_8px_30px_rgb(0,0,0,0.12)] whitespace-nowrap"
        >
          Sign In
        </button>
        <button
          type="button"
          className="hidden md:inline-flex bg-black text-white rounded-lg px-6 items-center h-[60px] font-bold uppercase tracking-widest text-[11px] cursor-pointer transition-all duration-300 hover:scale-105 active:scale-95 shadow-[0_8px_30px_rgb(0,0,0,0.12)] whitespace-nowrap"
          style={{ backgroundColor: buttonBgColor, color: buttonTextColor }}
        >
          Get Started
        </button>
      </div>
    </div>
  );
};

export default CardNav;

