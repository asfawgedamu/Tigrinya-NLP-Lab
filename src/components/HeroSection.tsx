import React from 'react';
import { 
  Sparkles, 
  Terminal, 
  Award, 
  Layers, 
  FileText, 
  Users, 
  ArrowRight, 
  Copy, 
  SearchCheck, 
  Github, 
  BookOpen, 
  MapPin, 
  Building2,
  ExternalLink 
} from 'lucide-react';
import { USER_INFO } from '../data/portfolioData';

interface HeroSectionProps {
  onExploreProjects: () => void;
  onOpenAudit: () => void;
  onOpenReadme: () => void;
  onOpenRecruiter: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onExploreProjects,
  onOpenAudit,
  onOpenReadme,
  onOpenRecruiter
}) => {
  return (
    <section className="relative pt-8 pb-14 overflow-hidden border-b border-slate-800/80 bg-radial-[at_top_center] from-slate-900/60 via-slate-950 to-slate-950">
      
      {/* Background ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 max-w-4xl h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-20 right-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Top availability pill */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-950/70 text-cyan-300 border border-cyan-800/60 shadow-sm shadow-cyan-950">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Available for Senior ML, Backend Architecture & Technical Consulting</span>
          </div>

          <div className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono text-slate-400 bg-slate-900/80 border border-slate-800">
            <MapPin className="w-3 h-3 text-cyan-400" />
            <span>Addis Ababa, Ethiopia</span>
          </div>

          <div className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono text-slate-400 bg-slate-900/80 border border-slate-800">
            <Building2 className="w-3 h-3 text-cyan-400" />
            <span>Ethio Telecom (@ethiotelecom-et)</span>
          </div>
        </div>

        {/* Main Hero Grid */}
        <div className="grid lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Headlines & Call to Actions */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-3">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.1]">
                Scaling Intelligence &{' '}
                <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-blue-400 bg-clip-text text-transparent">
                  Enterprise Systems.
                </span>
              </h1>
              <p className="text-base sm:text-lg text-slate-300 font-medium leading-relaxed max-w-2xl">
                {USER_INFO.role}
              </p>
              <p className="text-sm text-slate-400 leading-relaxed max-w-2xl">
                Bridging <strong className="text-slate-200">applied machine learning, enterprise backend infrastructure</strong>, and <strong className="text-slate-200">structured engineering enablement</strong>. Author of published research on Tigrinya Dialect Identification in{' '}
                <a
                  href="https://openreview.net/pdf?id=kiG8qiUFm2u"
                  target="_blank"
                  rel="noreferrer"
                  className="text-cyan-400 font-semibold underline underline-offset-2 hover:text-cyan-300 inline-flex items-center gap-0.5"
                >
                  <span>OpenReview (92.98% accuracy)</span>
                  <ExternalLink className="w-3 h-3" />
                </a>{' '}
                and architect of progressive 3-tier FastAPI enterprise lab series.
              </p>
            </div>

            {/* CTA Button Array */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={onExploreProjects}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-slate-950 font-bold text-sm flex items-center gap-2 shadow-lg shadow-cyan-500/25 transition-all hover:scale-[1.02]"
              >
                <span>Explore Technical Projects</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href="https://openreview.net/pdf?id=kiG8qiUFm2u"
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2.5 rounded-xl bg-rose-950/80 hover:bg-rose-900 text-rose-200 text-sm font-semibold border border-rose-800/80 flex items-center gap-2 transition hover:border-rose-500"
              >
                <FileText className="w-4 h-4 text-rose-400" />
                <span>OpenReview Paper PDF</span>
                <ExternalLink className="w-3 h-3 text-rose-400" />
              </a>

              <button
                onClick={onOpenAudit}
                className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 text-sm font-semibold border border-slate-700/80 flex items-center gap-2 transition hover:border-cyan-500/50"
              >
                <SearchCheck className="w-4 h-4 text-cyan-400" />
                <span>GitHub Profile Audit</span>
              </button>

              <button
                onClick={onOpenReadme}
                className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 text-sm font-semibold border border-slate-700/80 flex items-center gap-2 transition hover:border-cyan-500/50"
              >
                <Copy className="w-4 h-4 text-blue-400" />
                <span>Get Profile README</span>
              </button>
            </div>

            {/* Recruiter Quick-Action Link */}
            <div className="pt-2 text-xs text-slate-400 flex items-center gap-2">
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> Recruiter on a deadline?
              </span>
              <button
                onClick={onOpenRecruiter}
                className="text-slate-300 underline underline-offset-4 hover:text-cyan-400 transition"
              >
                View 30-Second Candidate Executive Summary →
              </button>
            </div>
          </div>

          {/* Right Column: Interactive Terminal & Avatar Card */}
          <div className="lg:col-span-5">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/90 shadow-2xl overflow-hidden backdrop-blur">
              
              {/* Terminal Window Header */}
              <div className="px-4 py-3 border-b border-slate-800 bg-slate-950/80 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
                  <span className="text-xs font-mono text-slate-400 ml-2">asfawgedamu@systems-core:~$</span>
                </div>
                <div className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-900">
                  v2026.10
                </div>
              </div>

              {/* Terminal Body */}
              <div className="p-5 font-mono text-xs text-slate-300 space-y-3">
                <div className="text-cyan-400">
                  $ curl -s https://api.asfawgedamu.dev/profile
                </div>

                <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800/80 space-y-1.5 text-[11px] leading-relaxed">
                  <p><span className="text-slate-500">"status":</span> <span className="text-emerald-400">"Systems & Security Training Expert | ML Practitioner"</span>,</p>
                  <p><span className="text-slate-500">"affiliation":</span> <span className="text-cyan-300">"Ethio Telecom (Tech Horizon CoE)"</span>,</p>
                  <p><span className="text-slate-500">"peer_reviewed_paper":</span> <span className="text-rose-400">"OpenReview: kiG8qiUFm2u"</span>,</p>
                  <p><span className="text-slate-500">"peak_accuracy":</span> <span className="text-emerald-400">"92.98% (Char-CNN)"</span>,</p>
                  <p><span className="text-slate-500">"fastapi_architecture":</span> <span className="text-cyan-300">"3-Tier Progressive Labs"</span>,</p>
                  <p><span className="text-slate-500">"professionals_upskilled":</span> <span className="text-amber-300">"500+ in AI, ML, CyberSec & FinTech"</span></p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800/60 text-[11px]">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping"></span>
                    Terminal Ready
                  </span>
                  <a
                    href={USER_INFO.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1 hover:underline"
                  >
                    <Github className="w-3.5 h-3.5" />
                    github.com/asfawgedamu
                  </a>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* Quantified Impact Banner Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 pt-8 border-t border-slate-800/60">
          
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-cyan-500/40 transition">
            <div className="flex items-center gap-2 mb-1 text-cyan-400">
              <Award className="w-4 h-4" />
              <span className="text-xs uppercase font-mono tracking-wider font-semibold">NLP Benchmark</span>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white">92.98%</div>
            <div className="text-xs text-slate-400 mt-1">Tigrinya Dialect Character CNN accuracy</div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-rose-500/40 transition">
            <div className="flex items-center gap-2 mb-1 text-rose-400">
              <BookOpen className="w-4 h-4" />
              <span className="text-xs uppercase font-mono tracking-wider font-semibold">Research Publication</span>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white">OpenReview</div>
            <div className="text-xs text-slate-400 mt-1">Paper PDF: kiG8qiUFm2u</div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-indigo-500/40 transition">
            <div className="flex items-center gap-2 mb-1 text-indigo-400">
              <Layers className="w-4 h-4" />
              <span className="text-xs uppercase font-mono tracking-wider font-semibold">API Architecture</span>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white">3 Levels</div>
            <div className="text-xs text-slate-400 mt-1">FastAPI Modular Clean Architecture</div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-amber-500/40 transition">
            <div className="flex items-center gap-2 mb-1 text-amber-400">
              <Users className="w-4 h-4" />
              <span className="text-xs uppercase font-mono tracking-wider font-semibold">Leadership</span>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white">500+ Devs</div>
            <div className="text-xs text-slate-400 mt-1">Upskilled in AI, ML, CyberSec & FinTech</div>
          </div>

        </div>

      </div>
    </section>
  );
};
