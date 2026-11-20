import React, { useState, useEffect, useRef } from 'react';
import { Search, Terminal, BookOpen, GitBranch, FileText, Send, Sparkles, X } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export interface CommandItem {
  id: string;
  title: string;
  subtitle: string;
  category: 'Navigation' | 'Research & NLP' | 'Backend & DB' | 'Actions';
  icon: React.ElementType;
  action: () => void;
}

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (tabId: string) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose, onNavigate }) => {
  const { isDark, toggleTheme } = useTheme();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const commands: CommandItem[] = [
    {
      id: 'nav-overview',
      title: 'Overview & Narrative',
      subtitle: 'Executive introduction, verified credentials, and career impact',
      category: 'Navigation',
      icon: Terminal,
      action: () => { onNavigate('overview'); onClose(); }
    },
    {
      id: 'nav-portal',
      title: 'Sample Corpus',
      subtitle: 'Browse and export 52 parallel texts in Variety Z, L and D',
      category: 'Research & NLP',
      icon: BookOpen,
      action: () => { onNavigate('projects'); onClose(); }
    },
    {
      id: 'nav-nlp',
      title: 'Tigrinya Dialect Lab & Live Inference',
      subtitle: 'Paste Ge’ez text and classify it as Variety Z, L or D',
      category: 'Research & NLP',
      icon: Sparkles,
      action: () => { onNavigate('nlp-lab'); onClose(); }
    },
    {
      id: 'nav-repos',
      title: 'GitHub Repositories',
      subtitle: 'Browse public repositories',
      category: 'Navigation',
      icon: GitBranch,
      action: () => { onNavigate('github-hub'); onClose(); }
    },
    {
      id: 'nav-resume',
      title: 'Experience, Resume & ATS View',
      subtitle: '19+ years at Ethio Telecom, 500+ engineers upskilled, printable CV',
      category: 'Navigation',
      icon: FileText,
      action: () => { onNavigate('resume-cv'); onClose(); }
    },
    {
      id: 'nav-contact',
      title: 'Contact & Collaboration',
      subtitle: 'Get in touch',
      category: 'Actions',
      icon: Send,
      action: () => { onNavigate('contact'); onClose(); }
    },
    {
      id: 'action-theme',
      title: isDark ? 'Switch to Eye-Comfort Light Theme' : 'Switch to Dark Mode',
      subtitle: 'Toggle theme preference',
      category: 'Actions',
      icon: Sparkles,
      action: () => { toggleTheme(); onClose(); }
    },
    {
      id: 'action-paper',
      title: 'Open OpenReview Paper PDF',
      subtitle: 'Tigrinya Dialect Identification (kiG8qiUFm2u)',
      category: 'Research & NLP',
      icon: Sparkles,
      action: () => { window.open('https://openreview.net/pdf?id=kiG8qiUFm2u', '_blank', 'noopener,noreferrer'); onClose(); }
    }
  ];

  const filteredCommands = commands.filter((cmd) => {
    const q = query.toLowerCase().trim();
    if (!q) return true;
    return (
      cmd.title.toLowerCase().includes(q) ||
      cmd.subtitle.toLowerCase().includes(q) ||
      cmd.category.toLowerCase().includes(q)
    );
  });

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % (filteredCommands.length || 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + filteredCommands.length) % (filteredCommands.length || 1));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredCommands[selectedIndex]) {
          filteredCommands[selectedIndex].action();
        }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredCommands, selectedIndex, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div 
        className={`w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[75vh] border transition-colors ${
          isDark ? 'bg-slate-900 border-slate-700/80 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Search Bar */}
        <div className={`flex items-center px-4 py-3.5 border-b ${
          isDark ? 'border-slate-800 bg-slate-950/60' : 'border-slate-200 bg-slate-50'
        }`}>
          <Search className={`w-5 h-5 mr-3 flex-shrink-0 ${isDark ? 'text-teal-400' : 'text-[#0A66C2]'}`} />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Type a command, project, technology or action (e.g., 'NLP', 'FastAPI', 'Deploy')..."
            className={`flex-1 bg-transparent text-sm focus:outline-none ${
              isDark ? 'text-slate-100 placeholder-slate-500' : 'text-slate-900 placeholder-slate-400'
            }`}
          />
          <button 
            onClick={onClose}
            className={`p-1 transition ${isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-400 hover:text-slate-600'}`}
            aria-label="Close command palette"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className={`overflow-y-auto p-2 divide-y ${isDark ? 'divide-slate-800/40' : 'divide-slate-100'}`}>
          {filteredCommands.length === 0 ? (
            <div className={`py-12 text-center text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              No matching commands or projects found for "{query}".
            </div>
          ) : (
            filteredCommands.map((item, index) => {
              const Icon = item.icon;
              const isSelected = index === selectedIndex;
              return (
                <button
                  key={item.id}
                  onClick={item.action}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`w-full flex items-center gap-3 px-3.5 py-3 text-left transition-colors rounded-lg cursor-pointer ${
                    isSelected 
                      ? isDark
                        ? 'bg-teal-500/15 border border-teal-500/30 text-teal-100' 
                        : 'bg-blue-50 border border-blue-200 text-[#0A66C2]'
                      : isDark
                      ? 'hover:bg-slate-800/60 text-slate-300'
                      : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className={`p-2 rounded-lg flex-shrink-0 ${
                    isSelected 
                      ? (isDark ? 'bg-teal-500/20 text-teal-300' : 'bg-blue-100 text-[#0A66C2]') 
                      : (isDark ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-500')
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-medium ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>{item.title}</span>
                      <span className={`text-xs font-mono ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>· {item.category}</span>
                    </div>
                    <p className={`text-xs truncate mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{item.subtitle}</p>
                  </div>
                  {isSelected && (
                    <span className={`text-[11px] font-mono px-2 py-0.5 rounded border ${
                      isDark ? 'text-teal-400 bg-teal-950/50 border-teal-800/60' : 'text-[#0A66C2] bg-blue-100/60 border-blue-200'
                    }`}>
                      Press Enter
                    </span>
                  )}
                </button>
              );
            })
          )}
        </div>

        {/* Footer shortcuts */}
        <div className={`px-4 py-2.5 border-t flex items-center justify-between text-[11px] font-mono ${
          isDark ? 'bg-slate-950/80 border-slate-800 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-500'
        }`}>
          <div className="flex items-center gap-4">
            <span><strong className={isDark ? 'text-slate-300' : 'text-slate-700'}>↑↓</strong> Navigate</span>
            <span><strong className={isDark ? 'text-slate-300' : 'text-slate-700'}>↵</strong> Select</span>
            <span><strong className={isDark ? 'text-slate-300' : 'text-slate-700'}>ESC</strong> Close</span>
          </div>
          <span className={isDark ? 'text-teal-400' : 'text-[#0A66C2]'}>Asfaw Gedamu Dynamic Studio</span>
        </div>
      </div>
    </div>
  );
};
