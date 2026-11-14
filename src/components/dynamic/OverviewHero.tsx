import React from 'react';
import { USER_INFO } from '../../data/portfolioData';
import { useTheme } from '../../context/ThemeContext';
import { 
  Brain, 
  Layers, 
  Database, 
  Terminal, 
  FileText, 
  Send, 
  Users, 
  TrendingUp, 
  Eye, 
  Search, 
  Building2, 
  GraduationCap, 
  ChevronRight,
  Sparkles,
  ExternalLink
} from 'lucide-react';

import { ProjectHighlights } from './ProjectHighlights';
import { SocialBadges } from '../SocialBadges';

interface OverviewHeroProps {
  onNavigate: (tabId: string) => void;
  onOpenCommandPalette: () => void;
}

export const OverviewHero: React.FC<OverviewHeroProps> = ({ onNavigate, onOpenCommandPalette }) => {
  const { isDark } = useTheme();

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8">
      
      {/* Top Hero Badges */}
      <div className="pb-1">
        <SocialBadges />
      </div>
      
      {/* Hero Header Card */}
      <div className={`p-6 sm:p-8 rounded-2xl border transition-colors ${
        isDark 
          ? 'bg-slate-900/80 border-slate-800 text-slate-100' 
          : 'bg-white border-slate-200 text-slate-900 shadow-xs'
      }`}>
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono border ${
              isDark 
                ? 'bg-teal-950/60 border-teal-800/80 text-teal-300' 
                : 'bg-blue-50 border-blue-200 text-[#0A66C2]'
            }`}>
              <span className={`w-2 h-2 rounded-full ${isDark ? 'bg-teal-400' : 'bg-[#0A66C2]'} animate-pulse`} />
              <span>Ethio Telecom Tech Horizon Center of Excellence (formerly TExA)</span>
            </div>

            <button
              onClick={onOpenCommandPalette}
              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono border transition ${
                isDark 
                  ? 'bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border-slate-800' 
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200'
              }`}
            >
              <Terminal className={`w-3.5 h-3.5 ${isDark ? 'text-teal-400' : 'text-[#0A66C2]'}`} />
              <span>Quick Jump (Cmd + K)</span>
            </button>
          </div>

          <div className="space-y-3 max-w-4xl">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
              {USER_INFO.name}
            </h1>
            <p className={`text-lg sm:text-xl font-medium ${isDark ? 'text-teal-300' : 'text-[#0A66C2]'}`}>
              {USER_INFO.roleShort}
            </p>
            <p className={`text-sm sm:text-base leading-relaxed max-w-3xl ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              Senior technical leader with rare dual mastery: published deep learning research in low-resource African NLP 
              (<span className={`font-semibold font-mono ${isDark ? 'text-teal-300' : 'text-[#0A66C2]'}`}>OpenReview: kiG8qiUFm2u, 92.98% accuracy</span>) and production 
              backend systems architecture (FastAPI clean architecture & Oracle/PostgreSQL database engineering), 
              backed by <strong className={isDark ? 'text-white' : 'text-slate-900'}>19+ years at Ethio Telecom</strong> training and upskilling 
              over <strong className={isDark ? 'text-white' : 'text-slate-900'}>500+ engineers</strong>.
            </p>
          </div>

          {/* Quick CTA Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <button
              onClick={() => onNavigate('nlp-lab')}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-[4px] font-bold text-xs font-mono transition shadow-2xs cursor-pointer ${
                isDark 
                  ? 'bg-[cyan-400] hover:bg-[#8F1E18] text-white' 
                  : 'bg-[cyan-400] hover:bg-[#8F1E18] text-white'
              }`}
            >
              <Brain className="w-4 h-4" />
              Tigrinya Dialect Lab (92.98%)
            </button>

            <button
              onClick={() => onNavigate('fastapi-arch')}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs font-mono transition shadow-xs ${
                isDark 
                  ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-950/40' 
                  : 'bg-slate-800 hover:bg-slate-700 text-white'
              }`}
            >
              <Layers className="w-4 h-4" />
              FastAPI Pipeline Simulator
            </button>

            <button
              onClick={() => onNavigate('resume-cv')}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-mono transition border ${
                isDark 
                  ? 'bg-slate-950 hover:bg-slate-800 text-slate-200 border-slate-800' 
                  : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-300 shadow-xs'
              }`}
            >
              <FileText className="w-4 h-4 text-slate-400" />
              ATS Resume & CV
            </button>

            <button
              onClick={() => onNavigate('contact')}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-mono transition border ${
                isDark 
                  ? 'bg-slate-950 hover:bg-slate-800 text-slate-200 border-slate-800' 
                  : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-300 shadow-xs'
              }`}
            >
              <Send className={`w-4 h-4 ${isDark ? 'text-teal-400' : 'text-[#0A66C2]'}`} />
              Direct Contact
            </button>
          </div>
        </div>
      </div>

      {/* Project Highlights Widget (Animated Grid of Core Metrics) */}
      <ProjectHighlights onNavigate={onNavigate} />

      {/* Verified Professional Analytics (Reflecting Asfaw's LinkedIn Screenshot) */}
      <div className={`p-6 sm:p-7 rounded-2xl border transition-colors ${
        isDark 
          ? 'bg-slate-900/70 border-slate-800 text-slate-100' 
          : 'bg-white border-slate-200 text-slate-900 shadow-xs'
      }`}>
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <TrendingUp className={`w-4 h-4 ${isDark ? 'text-teal-400' : 'text-[#0A66C2]'}`} />
              <h2 className="text-base font-bold">Executive Analytics & Professional Reach</h2>
            </div>
            <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Verified engagement metrics from technical publications, LinkedIn reach, and academic citations
            </p>
          </div>
          <span className={`text-[11px] font-mono px-2.5 py-1 rounded border ${
            isDark ? 'bg-slate-950 border-slate-800 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-600'
          }`}>
            LinkedIn & Academic Network
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className={`p-4 rounded-xl border flex items-start gap-3.5 ${
            isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-[#F9FAFB] border-slate-200'
          }`}>
            <TrendingUp className={`w-5 h-5 flex-shrink-0 mt-0.5 ${isDark ? 'text-teal-400' : 'text-[#0A66C2]'}`} />
            <div>
              <div className={`text-xl sm:text-2xl font-bold font-mono ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {USER_INFO.stats.postImpressions7Days}
              </div>
              <div className={`text-xs font-semibold mt-0.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                Post Impressions
              </div>
              <div className={`text-[11px] mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Technical insights in AI, NLP & telecom systems (past 7 days)
              </div>
            </div>
          </div>

          <div className={`p-4 rounded-xl border flex items-start gap-3.5 ${
            isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-[#F9FAFB] border-slate-200'
          }`}>
            <Eye className={`w-5 h-5 flex-shrink-0 mt-0.5 ${isDark ? 'text-teal-400' : 'text-[#0A66C2]'}`} />
            <div>
              <div className={`text-xl sm:text-2xl font-bold font-mono ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {USER_INFO.stats.profileViews}
              </div>
              <div className={`text-xs font-semibold mt-0.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                Profile Views
              </div>
              <div className={`text-[11px] mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Industry leaders, university researchers & recruiters
              </div>
            </div>
          </div>

          <div className={`p-4 rounded-xl border flex items-start gap-3.5 ${
            isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-[#F9FAFB] border-slate-200'
          }`}>
            <Search className={`w-5 h-5 flex-shrink-0 mt-0.5 ${isDark ? 'text-teal-400' : 'text-[#0A66C2]'}`} />
            <div>
              <div className={`text-xl sm:text-2xl font-bold font-mono ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {USER_INFO.stats.searchAppearances}
              </div>
              <div className={`text-xs font-semibold mt-0.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                Search Appearances
              </div>
              <div className={`text-[11px] mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Appearing in AI/ML, FastAPI and Telecom queries
              </div>
            </div>
          </div>
        </div>

        {/* Academic and Industry Network Proof */}
        <div className={`mt-4 pt-3.5 border-t flex flex-wrap items-center justify-between text-xs ${
          isDark ? 'border-slate-800 text-slate-400' : 'border-slate-200 text-slate-600'
        }`}>
          <div className="flex items-center gap-2">
            <GraduationCap className={`w-4 h-4 ${isDark ? 'text-teal-400' : 'text-[#0A66C2]'}`} />
            <span>Top Viewer Network: <strong>Addis Ababa University (AAU)</strong> · Technology, Information & Telecommunications</span>
          </div>
          <a
            href={USER_INFO.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className={`font-semibold flex items-center gap-1 hover:underline ${
              isDark ? 'text-teal-400' : 'text-[#0A66C2]'
            }`}
          >
            <span>Connect on LinkedIn</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* Featured Interactive Pillars */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className={`text-lg font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            <Sparkles className={`w-4 h-4 ${isDark ? 'text-teal-400' : 'text-[#0A66C2]'}`} />
            Core Technical Pillars & Interactive Labs
          </h2>
          <span className={`text-xs font-mono ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
            Select any lab to explore live
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Pillar 1: Tigrinya NLP */}
          <div 
            onClick={() => onNavigate('nlp-lab')}
            className={`p-6 rounded-2xl border transition cursor-pointer group flex flex-col justify-between space-y-4 ${
              isDark 
                ? 'bg-slate-900/70 border-slate-800 hover:border-teal-500/50' 
                : 'bg-white border-slate-200 hover:border-teal-600 shadow-xs hover:shadow-md'
            }`}
          >
            <div>
              <div className={`flex items-center justify-between text-xs font-mono mb-2 ${
                isDark ? 'text-teal-400' : 'text-teal-700'
              }`}>
                <span>01 · Low-Resource NLP</span>
                <span className="group-hover:translate-x-1 transition">&rarr;</span>
              </div>
              <h3 className={`text-base font-bold transition ${
                isDark ? 'text-white group-hover:text-teal-300' : 'text-slate-900 group-hover:text-teal-700'
              }`}>
                Tigrinya Dialect Identification
              </h3>
              <p className={`text-xs mt-2 leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                Benchmark dataset of 2,964 sentences classifying Tigrinya varieties (Z, L, D). 
                Character-level CNNs achieving 92.98% accuracy on Ethiopic Ge'ez script.
              </p>
            </div>
            <div className={`pt-3 border-t flex items-center justify-between text-xs font-mono ${
              isDark ? 'border-slate-800 text-slate-400' : 'border-slate-100 text-slate-500'
            }`}>
              <span>Interactive Fidel Board</span>
              <span className={`font-bold ${isDark ? 'text-teal-400' : 'text-teal-700'}`}>Launch Lab &rarr;</span>
            </div>
          </div>

          {/* Pillar 2: FastAPI Clean Architecture */}
          <div 
            onClick={() => onNavigate('fastapi-arch')}
            className={`p-6 rounded-2xl border transition cursor-pointer group flex flex-col justify-between space-y-4 ${
              isDark 
                ? 'bg-slate-900/70 border-slate-800 hover:border-indigo-500/50' 
                : 'bg-white border-slate-200 hover:border-[#0A66C2] shadow-xs hover:shadow-md'
            }`}
          >
            <div>
              <div className={`flex items-center justify-between text-xs font-mono mb-2 ${
                isDark ? 'text-indigo-400' : 'text-[#0A66C2]'
              }`}>
                <span>02 · Backend Architecture</span>
                <span className="group-hover:translate-x-1 transition">&rarr;</span>
              </div>
              <h3 className={`text-base font-bold transition ${
                isDark ? 'text-white group-hover:text-indigo-300' : 'text-slate-900 group-hover:text-[#0A66C2]'
              }`}>
                FastAPI 3-Tier Architecture
              </h3>
              <p className={`text-xs mt-2 leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                Progressive lab series from single-file CRUD prototypes to clean hexagonal layered architecture 
                with Pydantic v2 schemas, JWT authentication, and automated Pytest test suites.
              </p>
            </div>
            <div className={`pt-3 border-t flex items-center justify-between text-xs font-mono ${
              isDark ? 'border-slate-800 text-slate-400' : 'border-slate-100 text-slate-500'
            }`}>
              <span>Request Pipeline Simulator</span>
              <span className={`font-bold ${isDark ? 'text-indigo-400' : 'text-[#0A66C2]'}`}>Launch Lab &rarr;</span>
            </div>
          </div>

          {/* Pillar 3: Database Diagnostics */}
          <div 
            onClick={() => onNavigate('database-console')}
            className={`p-6 rounded-2xl border transition cursor-pointer group flex flex-col justify-between space-y-4 ${
              isDark 
                ? 'bg-slate-900/70 border-slate-800 hover:border-amber-500/50' 
                : 'bg-white border-slate-200 hover:border-amber-600 shadow-xs hover:shadow-md'
            }`}
          >
            <div>
              <div className={`flex items-center justify-between text-xs font-mono mb-2 ${
                isDark ? 'text-amber-400' : 'text-amber-700'
              }`}>
                <span>03 · Enterprise Reliability</span>
                <span className="group-hover:translate-x-1 transition">&rarr;</span>
              </div>
              <h3 className={`text-base font-bold transition ${
                isDark ? 'text-white group-hover:text-amber-300' : 'text-slate-900 group-hover:text-amber-700'
              }`}>
                Database Diagnostics Suite
              </h3>
              <p className={`text-xs mt-2 leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                15 production-hardened SQL/PL-SQL performance tuning and health monitoring scripts for Oracle 19c 
                and PostgreSQL 15+, battle-tested across telecom subscriber databases.
              </p>
            </div>
            <div className={`pt-3 border-t flex items-center justify-between text-xs font-mono ${
              isDark ? 'border-slate-800 text-slate-400' : 'border-slate-100 text-slate-500'
            }`}>
              <span>Telemetry & Query Tuning</span>
              <span className={`font-bold ${isDark ? 'text-amber-400' : 'text-amber-700'}`}>Launch Lab &rarr;</span>
            </div>
          </div>

        </div>
      </section>

      {/* Terminal Profile Snapshot */}
      <section className={`p-5 rounded-2xl border font-mono text-xs space-y-2 ${
        isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-900 text-slate-100 border-slate-800 shadow-sm'
      }`}>
        <div className="flex items-center justify-between text-slate-400 border-b border-slate-800 pb-2">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span className="ml-2 text-slate-300">asfaw@ethio-telecom-coe:~$</span>
          </div>
          <span className="text-teal-400">bash · python3.11</span>
        </div>

        <div className="text-slate-300 space-y-1 pt-1 leading-relaxed">
          <div><span className="text-teal-400">&gt;</span> <span className="text-indigo-300">python -c</span> <span className="text-emerald-300">"import torch, fastapi; print('Ready for production AI & backend systems')"</span></div>
          <div className="text-slate-400">Ready for production AI &amp; backend systems</div>
          <div><span className="text-teal-400">&gt;</span> <span className="text-indigo-300">curl -s</span> https://openreview.net/forum?id=kiG8qiUFm2u | grep "Accuracy"</div>
          <div className="text-emerald-400 font-bold">Tigrinya Dialect Identification Benchmark: 92.98% Accuracy (Character CNN)</div>
        </div>
      </section>

    </div>
  );
};
