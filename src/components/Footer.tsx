import React from 'react';
import { SocialBadges } from './SocialBadges';
import { useTheme } from '../context/ThemeContext';

export const Footer: React.FC = () => {
  const { isDark } = useTheme();

  return (
    <footer className={`mt-auto py-10 px-4 sm:px-6 border-t transition-colors ${
      isDark ? 'border-slate-800/80 bg-slate-950 text-slate-400' : 'border-slate-200 bg-[#ECEFEA] text-slate-600'
    }`}>
      <div className="max-w-4xl mx-auto space-y-6 text-center">
        
        {/* Footer Badges */}
        <div>
          <SocialBadges />
        </div>

        {/* Clean Divider Line */}
        <hr className={`border-t ${isDark ? 'border-slate-800' : 'border-slate-300'}`} />

        {/* Copyright and Name */}
        <p className="text-sm font-mono">
          &copy; 2026 Asfaw Gedamu · All rights reserved.
        </p>

      </div>
    </footer>
  );
};
