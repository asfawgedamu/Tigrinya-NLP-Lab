import React, { Suspense, lazy, useState, useEffect } from 'react';
import { Navbar, ActiveTab } from './components/Navbar';
import { Footer } from './components/Footer';
import { OverviewHero } from './components/dynamic/OverviewHero';
const ProjectsPage = lazy(() => import('./components/ProjectsPage').then((m) => ({ default: m.ProjectsPage })));
const InteractiveResume = lazy(() => import('./components/dynamic/InteractiveResume').then((m) => ({ default: m.InteractiveResume })));
const LiveGitHubExplorer = lazy(() => import('./components/dynamic/LiveGitHubExplorer').then((m) => ({ default: m.LiveGitHubExplorer })));
const InteractiveContact = lazy(() => import('./components/dynamic/InteractiveContact').then((m) => ({ default: m.InteractiveContact })));
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
        <Suspense fallback={<div className="p-10 text-center font-mono text-xs opacity-70">Loading…</div>}>
        {activeTab === 'home' && (
          <OverviewHero onNavigate={handleNavigate} />
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
        </Suspense>
      </main>

      {/* Clean Footer (Hero badges, divider rule, © 2026 Asfaw Gedamu) */}
      <Footer />

    </div>
  );
}
