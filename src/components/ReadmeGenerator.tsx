import React, { useState } from 'react';
import { 
  FileCode2, 
  Copy, 
  Check, 
  Download, 
  Eye, 
  Code2, 
  Sparkles, 
  Sliders, 
  ExternalLink,
  ShieldAlert,
  Layers,
  Award,
  Terminal
} from 'lucide-react';
import { generateProfileReadme, ReadmeOptions } from '../utils/markdownGenerator';
import { USER_INFO } from '../data/portfolioData';

export const ReadmeGenerator: React.FC = () => {
  const [options, setOptions] = useState<ReadmeOptions>({
    includeStatsCards: true,
    includeTechBadges: true,
    includeFeaturedProjects: true,
    includePublications: true,
    includeSocialBadges: true,
    includeVisitorCounter: true,
    badgeStyle: 'for-the-badge',
    recruiterCallout: true
  });

  const [viewMode, setViewMode] = useState<'preview' | 'raw'>('preview');
  const [copied, setCopied] = useState<boolean>(false);

  const markdownContent = generateProfileReadme(options);

  const handleCopy = () => {
    navigator.clipboard.writeText(markdownContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownload = () => {
    const blob = new Blob([markdownContent], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'README.md';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-950/80 text-cyan-400 border border-cyan-800/60 mb-2">
            <FileCode2 className="w-3.5 h-3.5" />
            <span>Official Profile README Generator</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            High-Impact Profile README Studio
          </h1>
          <p className="text-sm text-slate-400 max-w-2xl mt-1">
            Engineered specifically for <code className="text-cyan-400 font-mono">github.com/{USER_INFO.username}/{USER_INFO.username}/README.md</code>. Custom configure badges, dynamic stats, publications, and recruiter callouts.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleCopy}
            className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-cyan-500/20 transition hover:scale-105"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 stroke-[3]" />
                <span>Copied to Clipboard!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copy README Markdown</span>
              </>
            )}
          </button>

          <button
            onClick={handleDownload}
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-semibold border border-slate-800 flex items-center gap-1.5 transition"
            title="Download README.md"
          >
            <Download className="w-4 h-4 text-slate-400" />
            <span className="hidden sm:inline">Download</span>
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Customizer Controls (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-5">
            <div className="flex items-center gap-2 text-sm font-bold text-white">
              <Sliders className="w-4 h-4 text-cyan-400" />
              <span>Configure README Modules</span>
            </div>

            <div className="space-y-3.5 text-xs">
              
              {/* Recruiter Callout */}
              <label className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950 border border-slate-800/80 cursor-pointer hover:border-slate-700">
                <span className="text-slate-300 font-medium">Recruiter Quick-Skim Hook</span>
                <input
                  type="checkbox"
                  checked={options.recruiterCallout}
                  onChange={(e) => setOptions({ ...options, recruiterCallout: e.target.checked })}
                  className="rounded border-slate-700 text-cyan-500 focus:ring-cyan-500/20"
                />
              </label>

              {/* Dynamic Stats Cards */}
              <label className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950 border border-slate-800/80 cursor-pointer hover:border-slate-700">
                <div>
                  <span className="text-slate-300 font-medium block">GitHub Stats Cards</span>
                  <span className="text-[10px] text-slate-500">Activity & Top Languages (TokyoNight)</span>
                </div>
                <input
                  type="checkbox"
                  checked={options.includeStatsCards}
                  onChange={(e) => setOptions({ ...options, includeStatsCards: e.target.checked })}
                  className="rounded border-slate-700 text-cyan-500 focus:ring-cyan-500/20"
                />
              </label>

              {/* Tech Badges */}
              <label className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950 border border-slate-800/80 cursor-pointer hover:border-slate-700">
                <span className="text-slate-300 font-medium">Categorized Tech Shields</span>
                <input
                  type="checkbox"
                  checked={options.includeTechBadges}
                  onChange={(e) => setOptions({ ...options, includeTechBadges: e.target.checked })}
                  className="rounded border-slate-700 text-cyan-500 focus:ring-cyan-500/20"
                />
              </label>

              {/* Featured Projects */}
              <label className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950 border border-slate-800/80 cursor-pointer hover:border-slate-700">
                <span className="text-slate-300 font-medium">Flagship Projects Showcase</span>
                <input
                  type="checkbox"
                  checked={options.includeFeaturedProjects}
                  onChange={(e) => setOptions({ ...options, includeFeaturedProjects: e.target.checked })}
                  className="rounded border-slate-700 text-cyan-500 focus:ring-cyan-500/20"
                />
              </label>

              {/* Publications */}
              <label className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950 border border-slate-800/80 cursor-pointer hover:border-slate-700">
                <span className="text-slate-300 font-medium">Research Publications (DBLP / arXiv)</span>
                <input
                  type="checkbox"
                  checked={options.includePublications}
                  onChange={(e) => setOptions({ ...options, includePublications: e.target.checked })}
                  className="rounded border-slate-700 text-cyan-500 focus:ring-cyan-500/20"
                />
              </label>

              {/* Visitor Counter */}
              <label className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950 border border-slate-800/80 cursor-pointer hover:border-slate-700">
                <span className="text-slate-300 font-medium">Profile View Counter</span>
                <input
                  type="checkbox"
                  checked={options.includeVisitorCounter}
                  onChange={(e) => setOptions({ ...options, includeVisitorCounter: e.target.checked })}
                  className="rounded border-slate-700 text-cyan-500 focus:ring-cyan-500/20"
                />
              </label>

              {/* Badge Style Selector */}
              <div className="pt-2">
                <label className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block mb-1.5 font-semibold">
                  Shields.io Badge Style
                </label>
                <select
                  value={options.badgeStyle}
                  onChange={(e) => setOptions({ ...options, badgeStyle: e.target.value as any })}
                  className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-lg p-2 font-mono focus:outline-none focus:border-cyan-500"
                >
                  <option value="for-the-badge">for-the-badge (Modern & Bold)</option>
                  <option value="flat">flat (Minimalist)</option>
                  <option value="flat-square">flat-square (Classic Tech)</option>
                </select>
              </div>

            </div>

            {/* GitHub Setup Instructions */}
            <div className="pt-4 border-t border-slate-800 text-xs text-slate-400 space-y-2">
              <div className="font-semibold text-slate-300 flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                <span>How to apply to GitHub:</span>
              </div>
              <ol className="list-decimal pl-4 space-y-1 text-[11px] text-slate-400">
                <li>Go to <code className="text-cyan-400 font-mono">github.com/{USER_INFO.username}/{USER_INFO.username}</code></li>
                <li>Edit or create <code className="text-cyan-400 font-mono">README.md</code></li>
                <li>Paste this generated markdown and click <strong>"Commit changes"</strong></li>
              </ol>
            </div>
          </div>
        </div>

        {/* Right Column: Live Preview & Code Viewer (8 cols) */}
        <div className="lg:col-span-8 rounded-2xl border border-slate-800 bg-slate-900/90 overflow-hidden shadow-2xl">
          
          {/* Header Bar */}
          <div className="px-5 py-3.5 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-slate-400">
                preview: {USER_INFO.username}/README.md
              </span>
            </div>

            <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800">
              <button
                onClick={() => setViewMode('preview')}
                className={`px-3 py-1 rounded text-xs font-semibold flex items-center gap-1.5 transition ${
                  viewMode === 'preview'
                    ? 'bg-cyan-500 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Rendered View</span>
              </button>

              <button
                onClick={() => setViewMode('raw')}
                className={`px-3 py-1 rounded text-xs font-semibold flex items-center gap-1.5 transition ${
                  viewMode === 'raw'
                    ? 'bg-cyan-500 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Code2 className="w-3.5 h-3.5" />
                <span>Raw Markdown</span>
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="p-6 max-h-[700px] overflow-y-auto">
            {viewMode === 'raw' ? (
              <pre className="font-mono text-xs text-cyan-300/90 bg-slate-950 p-4 rounded-xl border border-slate-800/80 whitespace-pre-wrap leading-relaxed select-all">
                {markdownContent}
              </pre>
            ) : (
              <div className="space-y-6 text-slate-200 text-sm leading-relaxed">
                
                {/* Simulated GitHub profile header */}
                <div className="text-center space-y-3 pb-6 border-b border-slate-800">
                  <h2 className="text-2xl font-bold text-white">👨‍💻 {USER_INFO.name}</h2>
                  <div className="text-cyan-400 font-semibold">{USER_INFO.role}</div>
                  <div className="text-xs text-slate-400">
                    📍 {USER_INFO.location} &nbsp;•&nbsp; 🏢 Ethio Telecom &nbsp;•&nbsp; 🎓 NLP Researcher
                  </div>

                  {options.includeSocialBadges && (
                    <div className="flex flex-wrap justify-center gap-1.5 pt-2">
                      <span className="px-2.5 py-1 rounded bg-[#0077B5] text-white font-mono text-xs font-bold">LINKEDIN</span>
                      <span className="px-2.5 py-1 rounded bg-[#0F172A] text-white font-mono text-xs font-bold border border-slate-700">LIVE PORTFOLIO</span>
                      <span className="px-2.5 py-1 rounded bg-[#FF5722] text-white font-mono text-xs font-bold">TOPMATE MENTORSHIP</span>
                      <span className="px-2.5 py-1 rounded bg-[#1DA1F2] text-white font-mono text-xs font-bold">TWITTER</span>
                      <span className="px-2.5 py-1 rounded bg-[#D14836] text-white font-mono text-xs font-bold">GMAIL</span>
                    </div>
                  )}

                  {options.includeVisitorCounter && (
                    <div className="pt-1">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-900">
                        PROFILE VIEWS: 1,842
                      </span>
                    </div>
                  )}
                </div>

                {/* Recruiter Callout Preview */}
                {options.recruiterCallout && (
                  <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/40 text-xs text-emerald-200 leading-relaxed">
                    <strong>💡 For Recruiters & Collaborators:</strong> Senior technologist combining <strong>8+ years of enterprise data systems experience</strong> with <strong>published deep learning research in low-resource NLP (92.98% benchmark accuracy)</strong> and <strong>proven engineering enablement (150+ engineers trained)</strong>.
                  </div>
                )}

                {/* Simulated At a glance table */}
                <div className="space-y-2">
                  <h3 className="text-base font-bold text-white">⚡ At a Glance</h3>
                  <div className="overflow-x-auto border border-slate-800 rounded-lg">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-slate-950 border-b border-slate-800 text-slate-400 font-mono">
                        <tr>
                          <th className="p-2.5">Domain</th>
                          <th className="p-2.5">Key Focus</th>
                          <th className="p-2.5">Primary Impact</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800 text-slate-300">
                        <tr>
                          <td className="p-2.5 font-semibold text-white">🧠 Applied AI & NLP</td>
                          <td className="p-2.5">Low-Resource African NLP, Character CNNs</td>
                          <td className="p-2.5 text-cyan-400 font-medium">92.98% dialect accuracy, DBLP publication</td>
                        </tr>
                        <tr>
                          <td className="p-2.5 font-semibold text-white">⚙️ Backend & APIs</td>
                          <td className="p-2.5">FastAPI, Layered Architecture, SQLAlchemy, JWT</td>
                          <td className="p-2.5 text-cyan-400 font-medium">Author of 3-level progressive enterprise series</td>
                        </tr>
                        <tr>
                          <td className="p-2.5 font-semibold text-white">🗄️ Enterprise Databases</td>
                          <td className="p-2.5">Oracle 19c, PostgreSQL Migration, AWR/ASH</td>
                          <td className="p-2.5 text-cyan-400 font-medium">Zero-downtime schema migrations & telemetry</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Simulated GitHub Stats Cards */}
                {options.includeStatsCards && (
                  <div className="space-y-2 pt-2">
                    <h3 className="text-base font-bold text-white">📊 GitHub Activity & Metrics</h3>
                    <div className="grid sm:grid-cols-2 gap-3">
                      <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                        <div className="text-xs font-mono text-cyan-400">Asfaw's GitHub Stats</div>
                        <div className="space-y-1 text-xs text-slate-300 font-mono">
                          <div>Total Stars Earned: <span className="text-cyan-400 font-bold">Growing</span></div>
                          <div>Total Repositories: <span className="text-cyan-400 font-bold">29</span></div>
                          <div>Account Created: <span className="text-cyan-400 font-bold">Nov 2016</span></div>
                          <div>Contributions: <span className="text-emerald-400 font-bold">Consistent Activity</span></div>
                        </div>
                      </div>

                      <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                        <div className="text-xs font-mono text-cyan-400">Top Languages</div>
                        <div className="space-y-1.5 text-xs">
                          <div className="flex justify-between font-mono text-slate-300">
                            <span>Python</span>
                            <span className="text-cyan-400">62%</span>
                          </div>
                          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-blue-400 h-full w-[62%]"></div>
                          </div>
                          <div className="flex justify-between font-mono text-slate-300">
                            <span>Jupyter / ML</span>
                            <span className="text-cyan-400">22%</span>
                          </div>
                          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-amber-400 h-full w-[22%]"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Featured Projects Preview */}
                {options.includeFeaturedProjects && (
                  <div className="space-y-3 pt-2">
                    <h3 className="text-base font-bold text-white">🚀 Flagship Projects (Pinned)</h3>
                    <div className="space-y-2.5">
                      <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs">
                        <div className="font-bold text-cyan-400">FastAPI Enterprise API Architecture Series</div>
                        <p className="text-slate-300 mt-1">3-Tier progressive lab series taking developers from single endpoints to layered production clean architecture.</p>
                      </div>
                      <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs">
                        <div className="font-bold text-indigo-400">Tigrinya Dialect Identification via Deep Learning</div>
                        <p className="text-slate-300 mt-1">92.98% peak classification accuracy on native Ge’ez script text using Character CNNs. Published in DBLP/Springer.</p>
                      </div>
                    </div>
                  </div>
                )}

              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
};
