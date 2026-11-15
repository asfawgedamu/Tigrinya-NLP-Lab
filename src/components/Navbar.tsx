import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { Menu, X, Moon, Sun, Code2 } from 'lucide-react';

export type ActiveTab = 'home' | 'projects' | 'resume' | 'code' | 'contact';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { toggleTheme, isDark } = useTheme();

  const navLinks: Array<{ id: ActiveTab; label: string }> = [
    { id: 'home', label: 'Home' },
    { id: 'projects', label: 'Projects' },
    { id: 'resume', label: 'Resume' },
    { id: 'code', label: 'Code' },
    { id: 'contact', label: 'Contact' }
  ];

  const handleSelectTab = (tab: ActiveTab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className={`sticky top-0 z-40 border-b transition-colors duration-150 ${
      isDark 
        ? 'border-slate-800/80 bg-slate-950/90 text-slate-100' 
        : 'border-slate-200 bg-white/90 text-slate-900'
    } backdrop-blur-xl`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Name */}
          <button
            onClick={() => handleSelectTab('home')}
            className={`font-serif text-xl sm:text-2xl font-bold tracking-tight transition-colors cursor-pointer text-left ${
              isDark ? 'text-slate-100 hover:text-teal-300' : 'text-slate-900 hover:text-[#0A66C2]'
            }`}
          >
            Asfaw Gedamu
          </button>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-6 text-base">
            <nav className="flex items-center gap-6" aria-label="Primary">
              {navLinks.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelectTab(item.id)}
                    className={`transition-colors duration-200 cursor-pointer pb-1 text-base font-medium ${
                      isActive
                        ? isDark 
                          ? 'border-b-2 border-teal-400 text-white font-bold' 
                          : 'border-b-2 border-[#0A66C2] text-slate-900 font-bold'
                        : isDark 
                          ? 'text-slate-300 hover:text-white border-b-2 border-transparent' 
                          : 'text-slate-600 hover:text-slate-900 border-b-2 border-transparent'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </nav>

            {/* Source code link */}
            <a
              href="https://github.com/asfawgedamu/Tigrinya-NLP-Lab"
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-[6px] border text-xs font-mono font-semibold transition cursor-pointer ${
                isDark 
                  ? 'border-slate-800 text-cyan-400 bg-slate-900/60 hover:bg-slate-900' 
                  : 'border-[#C5CEC8] text-cyan-700 bg-[#F2F5F0] hover:bg-[#E1E6E0]'
              }`}
              title="View the source code on GitHub"
            >
              <Code2 className="w-4 h-4" />
              <span>Source</span>
            </a>

            {/* Dark/Light Theme Toggle */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-[6px] border transition-colors cursor-pointer ${
                isDark 
                  ? 'border-[slate-800] text-[#E6ECE8] hover:bg-[slate-900/80]' 
                  : 'border-[#C5CEC8] text-[#17262A] hover:bg-[#E1E6E0]'
              }`}
              title={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
              aria-label="Toggle theme"
            >
              {isDark ? (
                <Sun className="w-4 h-4 text-[cyan-300]" />
              ) : (
                <Moon className="w-4 h-4 text-[#17262A]" />
              )}
            </button>
          </div>

          {/* Mobile Menu & Theme Controls */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-[6px] border transition-colors ${
                isDark ? 'border-[slate-800] text-[#E6ECE8]' : 'border-[#C5CEC8] text-[#17262A]'
              }`}
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="w-4 h-4 text-[cyan-300]" /> : <Moon className="w-4 h-4 text-[#17262A]" />}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`p-2 rounded-[6px] border transition-colors ${
                isDark ? 'border-[slate-800] text-[#E6ECE8]' : 'border-[#C5CEC8] text-[#17262A]'
              }`}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className={`md:hidden border-t px-4 py-3 space-y-1 ${
          isDark ? 'border-[slate-800] bg-[slate-950]' : 'border-[#C5CEC8] bg-[#ECEFEA]'
        }`}>
          {navLinks.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelectTab(item.id)}
                className={`w-full text-left py-2.5 px-3 rounded-[6px] text-base transition-colors ${
                  isActive
                    ? 'font-medium text-[cyan-400] ' + (isDark ? 'bg-[slate-900/80]' : 'bg-[#E1E6E0]')
                    : isDark ? 'text-[#9DB0AE] hover:text-white hover:bg-[slate-900/80]' : 'text-[#516064] hover:text-[#17262A] hover:bg-[#E1E6E0]'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
