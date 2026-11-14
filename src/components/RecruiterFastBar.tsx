import React from 'react';
import { CheckCircle2, Award, Mail, ExternalLink, Terminal, FileText, X } from 'lucide-react';
import { USER_INFO } from '../data/portfolioData';
import { useTheme } from '../context/ThemeContext';

interface RecruiterFastBarProps {
  onClose: () => void;
  onOpenReadme: () => void;
}

export const RecruiterFastBar: React.FC<RecruiterFastBarProps> = ({ onClose, onOpenReadme }) => {
  const { isDark } = useTheme();

  return (
    <div className={`border-b px-4 py-4 sm:px-6 shadow-xs relative transition-colors ${
      isDark 
        ? 'bg-gradient-to-r from-emerald-950/90 via-slate-900/95 to-slate-950/95 border-emerald-500/30 text-slate-100' 
        : 'bg-white border-blue-200 text-slate-900 shadow-sm'
    }`}>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          
          {/* Executive Overview */}
          <div className="space-y-1.5 max-w-3xl">
            <div className="flex items-center gap-2">
              <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider border ${
                isDark 
                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40' 
                  : 'bg-blue-50 text-[#0A66C2] border-blue-200'
              }`}>
                Recruiter 15-Second Executive Skim
              </span>
              <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Target Roles: Staff/Principal ML Engineer, Backend Architect, Tech Learning Director
              </span>
            </div>
            
            <p className={`text-sm leading-relaxed ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
              <strong className={isDark ? 'text-emerald-300' : 'text-[#0A66C2]'}>{USER_INFO.name}</strong> ({USER_INFO.companyName}): Combining 
              <strong className={isDark ? 'text-emerald-400' : 'text-slate-900'}> 19+ years at Ethio Telecom</strong> with 
              <strong className={isDark ? 'text-emerald-400' : 'text-slate-900'}> published low-resource NLP research (OpenReview: kiG8qiUFm2u, 92.98% accuracy)</strong> and 
              <strong className={isDark ? 'text-emerald-400' : 'text-slate-900'}> 500+ professionals upskilled in AI, ML, cybersecurity & FinTech</strong>.
            </p>

            <div className={`flex flex-wrap items-center gap-x-4 gap-y-1 text-xs pt-0.5 ${
              isDark ? 'text-slate-300' : 'text-slate-600'
            }`}>
              <span className="flex items-center gap-1">
                <CheckCircle2 className={`w-3.5 h-3.5 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`} /> 
                <span><strong>Core Stack:</strong> Python, FastAPI, PyTorch, PostgreSQL, Docker, Linux</span>
              </span>
              <span className="flex items-center gap-1">
                <Award className={`w-3.5 h-3.5 ${isDark ? 'text-rose-400' : 'text-rose-600'}`} /> 
                <span><strong>Research:</strong> Published in OpenReview (kiG8qiUFm2u)</span>
              </span>
              <span className="flex items-center gap-1">
                <Terminal className={`w-3.5 h-3.5 ${isDark ? 'text-cyan-400' : 'text-[#0A66C2]'}`} /> 
                <span><strong>Code Quality:</strong> Test-driven (Pytest), Pydantic v2 schemas</span>
              </span>
            </div>
          </div>

          {/* Quick Contact & Action CTA */}
          <div className="flex items-center gap-2.5 w-full sm:w-auto shrink-0">
            <a
              href={`mailto:${USER_INFO.email}?subject=Senior%20Engineering%20Opportunity%20-%20Recruiter%20Inquiry`}
              className={`flex-1 sm:flex-initial px-4 py-2 rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 transition ${
                isDark 
                  ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/20' 
                  : 'bg-[#0A66C2] hover:bg-[#004182] text-white shadow-xs'
              }`}
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Contact Directly</span>
            </a>

            <button
              onClick={onOpenReadme}
              className={`px-3.5 py-2 rounded-lg text-xs font-semibold border flex items-center gap-1.5 transition cursor-pointer ${
                isDark 
                  ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700' 
                  : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-300 shadow-2xs'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>ATS Resume</span>
            </button>

            <button
              onClick={onClose}
              className={`p-1.5 rounded-lg border transition ${
                isDark ? 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white' : 'bg-slate-50 border-slate-200 text-slate-500 hover:text-slate-800'
              }`}
              aria-label="Close fast bar"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
