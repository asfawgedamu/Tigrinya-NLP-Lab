import React, { useState } from 'react';
import { 
  SearchCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Sparkles, 
  ArrowRight, 
  Copy, 
  Check, 
  Pin, 
  Tag, 
  FileText, 
  ExternalLink,
  ChevronRight,
  Filter,
  Eye,
  SlidersHorizontal,
  Flame,
  GitFork
} from 'lucide-react';
import { AUDIT_METRICS, AUDIT_CHECKLIST, USER_INFO } from '../data/portfolioData';

interface GitHubAuditReportProps {
  onOpenReadmeGen: () => void;
  onOpenRepoReadmes: () => void;
  onOpenDeployPages: () => void;
}

export const GitHubAuditReport: React.FC<GitHubAuditReportProps> = ({
  onOpenReadmeGen,
  onOpenRepoReadmes,
  onOpenDeployPages
}) => {
  const [completedItems, setCompletedItems] = useState<Record<string, boolean>>({
    'pin-repos': false,
    'clean-forks': false,
    'fix-portfolio-site': false,
    'add-repo-topics': false,
    'elevate-readmes': false,
  });

  const [activeTab, setActiveTab] = useState<'audit' | 'before-after' | 'pinned-strategy' | 'fork-triage'>('audit');
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const toggleItem = (id: string) => {
    setCompletedItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const completedCount = Object.values(completedItems).filter(Boolean).length;
  const progressPercent = Math.round((completedCount / Object.keys(completedItems).length) * 100);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2000);
  };

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
      
      {/* Title & Audit Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-amber-950/80 text-amber-300 border border-amber-800/80 mb-2">
            <SearchCheck className="w-4 h-4 text-amber-400" />
            <span>Live Profile Inspection: github.com/{USER_INFO.username}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            GitHub Optimization & Recruiter Audit
          </h1>
          <p className="text-sm text-slate-400 max-w-2xl mt-1">
            Diagnostic of your GitHub presence highlighting your peer-reviewed OpenReview paper (<a href="https://openreview.net/pdf?id=kiG8qiUFm2u" target="_blank" rel="noreferrer" className="text-cyan-400 underline font-mono">kiG8qiUFm2u</a>) and enterprise FastAPI architectures.
          </p>
        </div>

        {/* Audit Score Card */}
        <div className="flex items-center gap-4 bg-slate-900/90 border border-slate-800 p-4 rounded-2xl shadow-xl">
          <div className="relative w-16 h-16 flex items-center justify-center">
            <svg className="w-16 h-16 -rotate-90">
              <circle
                cx="32"
                cy="32"
                r="28"
                stroke="currentColor"
                strokeWidth="5"
                className="text-slate-800"
                fill="transparent"
              />
              <circle
                cx="32"
                cy="32"
                r="28"
                stroke="currentColor"
                strokeWidth="5"
                strokeDasharray="175.9"
                strokeDashoffset={175.9 - (175.9 * (72 + (completedCount * 5.5))) / 100}
                className="text-cyan-400 transition-all duration-700"
                fill="transparent"
              />
            </svg>
            <div className="absolute text-center">
              <span className="text-lg font-extrabold text-white">
                {Math.min(100, Math.round(72 + completedCount * 5.5))}
              </span>
              <span className="text-[10px] text-slate-400 block -mt-1">/100</span>
            </div>
          </div>

          <div className="space-y-0.5">
            <div className="text-xs font-mono uppercase tracking-wider text-slate-400">Profile Health</div>
            <div className="text-sm font-bold text-white">
              {completedCount === 0 ? 'Good Potential (Needs Curation)' : 'Substantially Improved'}
            </div>
            <div className="text-xs text-cyan-400">
              {completedCount} of 5 improvements applied
            </div>
          </div>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('audit')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition ${
            activeTab === 'audit' 
              ? 'bg-cyan-500 text-slate-950 font-bold shadow-md' 
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <SearchCheck className="w-3.5 h-3.5" />
          <span>Diagnostic & Action Checklist</span>
        </button>

        <button
          onClick={() => setActiveTab('pinned-strategy')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition ${
            activeTab === 'pinned-strategy' 
              ? 'bg-cyan-500 text-slate-950 font-bold shadow-md' 
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Pin className="w-3.5 h-3.5" />
          <span>Pinned Repos Strategy</span>
        </button>

        <button
          onClick={() => setActiveTab('fork-triage')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition ${
            activeTab === 'fork-triage' 
              ? 'bg-cyan-500 text-slate-950 font-bold shadow-md' 
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <GitFork className="w-3.5 h-3.5" />
          <span>Fork Triage (29 Repos Analysis)</span>
        </button>

        <button
          onClick={() => setActiveTab('before-after')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition ${
            activeTab === 'before-after' 
              ? 'bg-cyan-500 text-slate-950 font-bold shadow-md' 
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>Before vs. After Comparison</span>
        </button>
      </div>

      {/* TAB 1: Diagnostic & Action Checklist */}
      {activeTab === 'audit' && (
        <div className="space-y-8">
          
          {/* Urgent Findings Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-slate-400">Readability</span>
                <span className="text-xs font-bold text-amber-400">78 / 100</span>
              </div>
              <p className="text-xs text-slate-300">
                README exists but lacks visual hierarchy, dynamic GitHub stats, and fast-skimming badges for hiring managers.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-slate-400">Recruiter Skim</span>
                <span className="text-xs font-bold text-rose-400">65 / 100</span>
              </div>
              <p className="text-xs text-slate-300">
                Course forks dilute your original Tigrinya NLP OpenReview research and enterprise FastAPI series.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-slate-400">Repo Topics / SEO</span>
                <span className="text-xs font-bold text-amber-400">64 / 100</span>
              </div>
              <p className="text-xs text-slate-300">
                Key repositories lack GitHub Topics (#fastapi, #nlp, #pytorch, #openreview), missing organic search queries.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-slate-400">Live Portfolio Link</span>
                <span className="text-xs font-bold text-rose-400">Critical</span>
              </div>
              <p className="text-xs text-slate-300">
                <code className="text-cyan-400">asfawgedamu.github.io</code> is linked in profile bio but displays "Under construction".
              </p>
            </div>
          </div>

          {/* Interactive Checklist */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <span>Actionable Step-by-Step Optimization Roadmap</span>
              </h3>
              <span className="text-xs font-mono text-slate-400">
                Click checkboxes as you apply each fix on GitHub
              </span>
            </div>

            <div className="space-y-3">
              {AUDIT_CHECKLIST.map((item) => {
                const isDone = !!completedItems[item.id];

                return (
                  <div
                    key={item.id}
                    className={`p-5 rounded-xl border transition-all duration-200 ${
                      isDone 
                        ? 'bg-emerald-950/20 border-emerald-500/40' 
                        : item.severity === 'high' 
                          ? 'bg-slate-900/90 border-slate-800 hover:border-slate-700' 
                          : 'bg-slate-900/60 border-slate-800/80'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      
                      {/* Checkbox */}
                      <button
                        onClick={() => toggleItem(item.id)}
                        className={`mt-0.5 w-5 h-5 rounded flex items-center justify-center border transition ${
                          isDone 
                            ? 'bg-emerald-500 border-emerald-500 text-slate-950' 
                            : 'border-slate-600 hover:border-cyan-400 bg-slate-950'
                        }`}
                        title={isDone ? 'Mark as incomplete' : 'Mark as applied'}
                      >
                        {isDone && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </button>

                      {/* Content */}
                      <div className="flex-1 space-y-2">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className={`text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded ${
                              item.severity === 'high' 
                                ? 'bg-rose-950 text-rose-400 border border-rose-900' 
                                : 'bg-amber-950 text-amber-400 border border-amber-900'
                            }`}>
                              {item.severity} priority
                            </span>
                            <h4 className={`text-sm font-bold ${isDone ? 'line-through text-slate-400' : 'text-white'}`}>
                              {item.issue}
                            </h4>
                          </div>

                          <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                            <span>Effort: <strong className="text-slate-300">{item.effort}</strong></span>
                          </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-3 text-xs pt-1">
                          <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/80 text-slate-400">
                            <span className="text-slate-500 font-semibold uppercase font-mono block mb-1">
                              Current Observation:
                            </span>
                            {item.currentObservation}
                          </div>

                          <div className="p-3 rounded-lg bg-cyan-950/30 border border-cyan-900/40 text-cyan-200">
                            <span className="text-cyan-400 font-semibold uppercase font-mono block mb-1">
                              Recommended Solution:
                            </span>
                            {item.recommendedAction}
                          </div>
                        </div>

                        <div className="text-xs text-slate-400 pt-1 flex items-center justify-between">
                          <span>
                            <strong className="text-slate-300">Recruiter Impact:</strong> {item.impact}
                          </span>

                          {item.id === 'fix-portfolio-site' && (
                            <button
                              onClick={onOpenDeployPages}
                              className="text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1 ml-2 shrink-0"
                            >
                              <span>Export Pages Code</span>
                              <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                          )}

                          {item.id === 'pin-repos' && (
                            <button
                              onClick={() => setActiveTab('pinned-strategy')}
                              className="text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1 ml-2 shrink-0"
                            >
                              <span>View Pinned Repos</span>
                              <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>

                      </div>

                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      )}

      {/* TAB 2: Pinned Repositories Strategy */}
      {activeTab === 'pinned-strategy' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Pin className="w-5 h-5 text-cyan-400" />
              <span>Recommended Pinned Repositories</span>
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed max-w-3xl">
              Focusing on your primary flagships provides immediate, unmistakable hiring signals for recruiters and collaborators:
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            
            {/* Pinned 1 */}
            <div className="p-5 rounded-xl bg-slate-900/90 border border-cyan-800/80 space-y-3 relative overflow-hidden">
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 font-bold border border-cyan-900">
                  SLOT 1 • BACKEND API
                </span>
                <span className="text-xs font-bold text-emerald-400">Highest Recruiter ROI</span>
              </div>
              <h4 className="font-bold text-white text-base">api-design-fundamentals</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Progressive FastAPI REST API lab series taking developers from basic endpoints to enterprise layered 3-tier architecture with SQLAlchemy & JWT.
              </p>
              <div className="text-[11px] font-mono text-cyan-300/80">
                Tags: #fastapi #python #pydantic #sqlalchemy #clean-architecture
              </div>
            </div>

            {/* Pinned 2 */}
            <div className="p-5 rounded-xl bg-slate-900/90 border border-rose-800/80 space-y-3 relative overflow-hidden">
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-950 text-rose-300 font-bold border border-rose-900">
                  SLOT 2 • OPENREVIEW RESEARCH
                </span>
                <span className="text-xs font-bold text-emerald-400">92.98% Benchmark</span>
              </div>
              <h4 className="font-bold text-white text-base">Tigrinya-Dialect-Identification</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Peer-reviewed research published in OpenReview (kiG8qiUFm2u). Systematic dataset and Character-level CNN achieving 92.98% accuracy.
              </p>
              <div className="text-[11px] font-mono text-rose-300/80">
                Tags: #openreview #nlp #pytorch #character-cnn #tigrinya
              </div>
            </div>

            {/* Pinned 3 */}
            <div className="p-5 rounded-xl bg-slate-900/90 border border-cyan-800/80 space-y-3 relative overflow-hidden">
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 font-bold border border-cyan-900">
                  SLOT 3 • LIVE PORTFOLIO
                </span>
                <span className="text-xs font-bold text-emerald-400">Deployed Site</span>
              </div>
              <h4 className="font-bold text-white text-base">asfawgedamu.github.io</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                The deployed modern portfolio site showcasing research publications, interactive system diagrams, and mentorship availability.
              </p>
              <div className="text-[11px] font-mono text-cyan-300/80">
                Tags: #portfolio #github-pages #web #showcase
              </div>
            </div>

          </div>

          <div className="p-4 rounded-xl bg-cyan-950/40 border border-cyan-800/60 text-xs text-cyan-300 flex items-center justify-between">
            <span>
              💡 <strong>How to set this on GitHub:</strong> Navigate to your profile <code className="font-mono">github.com/asfawgedamu</code> → Click <strong>"Customize your pins"</strong> → Select these flagship repositories → Click <strong>"Save pins"</strong>.
            </span>
          </div>
        </div>
      )}

      {/* TAB 3: Fork Triage */}
      {activeTab === 'fork-triage' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <GitFork className="w-5 h-5 text-amber-400" />
              <span>Fork Triage: Separating Original IP from Learning Repos</span>
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed max-w-3xl">
              From our live API inspection of your 29 repositories, 18+ repositories are course clones. Here is a curated guide to ensure recruiters see your original engineering genius first:
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            
            {/* Column A: Flagship Original Repos (Promote) */}
            <div className="p-5 rounded-xl bg-slate-900/90 border border-emerald-500/30 space-y-4">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                <CheckCircle2 className="w-4 h-4" />
                <span>Original Flagships (Keep Prominent & Polish)</span>
              </div>

              <ul className="space-y-3 text-xs">
                <li className="p-3 rounded-lg bg-slate-950/80 border border-slate-800 space-y-1">
                  <div className="font-bold text-white">api-design-fundamentals</div>
                  <div className="text-slate-400">Complete progressive curriculum written by you. Layered modular architecture, Pydantic v2 schemas, and Pytest coverage.</div>
                </li>
                <li className="p-3 rounded-lg bg-slate-950/80 border border-slate-800 space-y-1">
                  <div className="font-bold text-white">Tigrinya-Dialect-Identification</div>
                  <div className="text-slate-400">Published research in OpenReview (<a href="https://openreview.net/pdf?id=kiG8qiUFm2u" target="_blank" rel="noreferrer" className="text-rose-400 font-mono underline">kiG8qiUFm2u</a>). 92.98% benchmark, Character CNN, and annotated dataset.</div>
                </li>
                <li className="p-3 rounded-lg bg-slate-950/80 border border-slate-800 space-y-1">
                  <div className="font-bold text-white">asfawgedamu.github.io</div>
                  <div className="text-slate-400">Deploy the full modern portfolio provided in this applet into GitHub Pages.</div>
                </li>
              </ul>
            </div>

            {/* Column B: Clutter Forks (Action Plan) */}
            <div className="p-5 rounded-xl bg-slate-900/90 border border-amber-500/30 space-y-4">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                <AlertTriangle className="w-4 h-4" />
                <span>Course Forks & Reference Repos (Triage Plan)</span>
              </div>

              <div className="text-xs text-slate-300 leading-relaxed space-y-2">
                <p>The following repositories show up in your public profile but provide little hiring signal:</p>
                <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800 font-mono text-[11px] text-slate-400 space-y-1 max-h-48 overflow-y-auto">
                  <div>- learning-the-javascript-language-4369302 (LinkedIn Learning)</div>
                  <div>- androiddev-esst-2835051 (Android Essential Training)</div>
                  <div>- hands-on-advanced-python-2703239 (LinkedIn Learning)</div>
                  <div>- deep-learning-coursera (Coursera clone)</div>
                  <div>- neural-networks-and-deep-learning (Andrew Ng clone)</div>
                  <div>- books-2 (PDF collection)</div>
                  <div>- cudf (GPU DataFrame fork)</div>
                  <div>- mml-book.github.io (Book website)</div>
                  <div>- guidance (Fork)</div>
                  <div>- mlflow (Fork)</div>
                </div>

                <div className="p-3 rounded-lg bg-amber-950/30 border border-amber-900/50 text-amber-200 space-y-1.5 mt-2">
                  <strong className="block text-amber-400">Recommended Action:</strong>
                  <span>Change repository visibility of tutorial course clones to <strong>Private</strong>, or leave them unpinned. This ensures recruiters immediately discover your OpenReview paper and FastAPI series!</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* TAB 4: Before vs After Comparison */}
      {activeTab === 'before-after' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <SlidersHorizontal className="w-5 h-5 text-cyan-400" />
              <span>Transformation: Before vs. After Inspection</span>
            </h3>
            <p className="text-sm text-slate-300">
              See the direct difference between the current profile state and the optimized recruiter-ready presence:
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            
            {/* Before */}
            <div className="p-6 rounded-2xl bg-slate-950 border border-rose-900/50 space-y-4">
              <div className="flex items-center justify-between border-b border-rose-900/40 pb-3">
                <span className="text-xs font-mono uppercase tracking-wider text-rose-400 font-bold">
                  Current Profile State
                </span>
                <span className="text-xs px-2 py-0.5 rounded bg-rose-950 text-rose-300">
                  Unoptimized
                </span>
              </div>

              <ul className="space-y-3 text-xs text-slate-400">
                <li className="flex items-start gap-2">
                  <span className="text-rose-400">✗</span>
                  <span><strong>Portfolio URL:</strong> Shows "This portfolio is under construction" when clicked.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-400">✗</span>
                  <span><strong>Repositories:</strong> 29 repos visible, majority are course forks with 0 stars.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-400">✗</span>
                  <span><strong>README Layout:</strong> Standard markdown tables without dynamic GitHub stats, language charts, or recruiter hooks.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-400">✗</span>
                  <span><strong>OpenReview Paper:</strong> Missing prominent link to the peer-reviewed paper PDF (kiG8qiUFm2u).</span>
                </li>
              </ul>
            </div>

            {/* After */}
            <div className="p-6 rounded-2xl bg-slate-950 border border-emerald-500/50 space-y-4 shadow-xl shadow-emerald-500/5">
              <div className="flex items-center justify-between border-b border-emerald-500/40 pb-3">
                <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-bold">
                  Optimized Portfolio & Profile
                </span>
                <span className="text-xs px-2 py-0.5 rounded bg-emerald-950 text-emerald-300">
                  World-Class Recruiter Grade
                </span>
              </div>

              <ul className="space-y-3 text-xs text-slate-300">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                  <span><strong>Live Portfolio:</strong> Fully responsive modern site deployed on GitHub Pages with dark mode, interactive architecture diagrams, and Topmate booking.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                  <span><strong>Pinned Showcase:</strong> Curated flagship repositories (FastAPI 3-Tier Enterprise Series, 92.98% Tigrinya Dialect NLP OpenReview paper, Portfolio).</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                  <span><strong>OpenReview Paper Prominence:</strong> Direct PDF links (kiG8qiUFm2u), BibTeX copier, and 92.98% benchmark tables.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                  <span><strong>Dynamic Profile README:</strong> Shields.io badges, dynamic TokyoNight GitHub stats, research citations, and 15-second recruiter hook.</span>
                </li>
              </ul>
            </div>

          </div>

          <div className="flex justify-center pt-4">
            <button
              onClick={onOpenReadmeGen}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-slate-950 font-bold text-sm flex items-center gap-2 shadow-lg shadow-cyan-500/20 hover:scale-[1.02] transition"
            >
              <span>Generate Profile README Now</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
