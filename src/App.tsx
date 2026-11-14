import React, { useState, useEffect } from 'react';
import { Navbar, ActiveTab } from './components/Navbar';
import { Footer } from './components/Footer';
import { OverviewHero } from './components/dynamic/OverviewHero';
import { ProjectsPage } from './components/ProjectsPage';
import { InteractiveResume } from './components/dynamic/InteractiveResume';
import { LiveGitHubExplorer } from './components/dynamic/LiveGitHubExplorer';
import { InteractiveContact } from './components/dynamic/InteractiveContact';
import { CommandPalette } from './components/dynamic/CommandPalette';
import { useTheme } from './context/ThemeContext';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [commandPaletteOpen, setCommandPaletteOpen] = useState<boolean>(false);
  const { isDark } = useTheme();

  // Global keyboard shortcut for Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleNavigate = (target: string) => {
    if (target === 'nlp-lab' || target === 'fastapi-arch' || target === 'database-console' || target === 'projects') {
      setActiveTab('projects');
    } else if (target === 'resume-cv' || target === 'resume') {
      setActiveTab('resume');
    } else if (target === 'github-hub' || target === 'code') {
      setActiveTab('code');
    } else if (target === 'contact') {
      setActiveTab('contact');
    } else {
      setActiveTab('home');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-150 ${
      isDark 
        ? 'bg-slate-950 text-slate-100' 
        : 'bg-[#ECEFEA] text-[#17262A]'
    }`}>
      
      {/* Navigation Header (Home, Projects, Resume, Code, Contact) */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Command Palette Modal */}
      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
        onNavigate={handleNavigate}
      />

      {/* Main Content Router */}
      <main className="flex-1">
        {activeTab === 'home' && (
          <OverviewHero
            onNavigate={handleNavigate}
            onOpenCommandPalette={() => setCommandPaletteOpen(true)}
          />
        )}

        {activeTab === 'projects' && (
          <ProjectsPage />
        )}

        {activeTab === 'resume' && (
          <InteractiveResume />
        )}

        {activeTab === 'code' && (
          <LiveGitHubExplorer />
        )}

        {activeTab === 'contact' && (
          <InteractiveContact />
        )}
      </main>

      {/* Clean Footer (Hero badges, divider rule, © 2026 Asfaw Gedamu) */}
      <Footer />

    </div>
  );
}
