import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { 
  FolderGit2, 
  ExternalLink, 
  Copy, 
  Check, 
  Layers, 
  Cpu, 
  CheckCircle2, 
  Sparkles, 
  Code2, 
  FileText, 
  ArrowUpRight, 
  Terminal,
  ShieldCheck,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { PROJECTS, Project } from '../data/portfolioData';

interface ProjectsShowcaseProps {
  onOpenRepoReadme: (project: Project) => void;
  recruiterMode: boolean;
}

export const ProjectsShowcase: React.FC<ProjectsShowcaseProps> = ({ 
  onOpenRepoReadme,
  recruiterMode
}) => {
  const { isDark } = useTheme();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [expandedArchitectureId, setExpandedArchitectureId] = useState<string | null>(null);

  const categories = [
    { id: 'all', label: 'All Flagship Projects' },
    { id: 'backend-api', label: 'Backend & FastAPI Series' },
    { id: 'ml-nlp', label: 'AI & OpenReview Research' },
  ];

  const filteredProjects = selectedCategory === 'all' 
    ? PROJECTS 
    : PROJECTS.filter(p => p.category === selectedCategory);

  const handleCopyMarkdown = (project: Project) => {
    navigator.clipboard.writeText(project.readmeMarkdown);
    setCopiedId(project.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <section id="projects" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-950/80 text-cyan-400 border border-cyan-800/60 mb-2">
            <Layers className="w-3.5 h-3.5" />
            <span>Curated Engineering Portfolio</span>
          </div>
          <h2 className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Flagship Technical Projects
          </h2>
          <p className={`text-sm max-w-2xl mt-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Production-grade architecture, peer-reviewed OpenReview paper, verified benchmarks, and comprehensive documentation ready for recruiters and collaborators.
          </p>
        </div>

        {/* Category Pills */}
        <div className={`flex flex-wrap gap-1.5 p-1.5 rounded-xl border transition-colors ${
          isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-300 shadow-sm'
        }`}>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                  : isDark ? 'text-slate-400 hover:text-white hover:bg-slate-800' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {filteredProjects.map((project) => {
          const isArchExpanded = expandedArchitectureId === project.id;
          const isOpenReviewPaper = project.id === 'tigrinya-dialect-nlp';

          return (
            <div
              key={project.id}
              className={`col-span-6 rounded-2xl border transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-xl hover:shadow-cyan-500/5 group p-6 ${
                isDark ? 'border-slate-800 bg-slate-900/80 hover:border-slate-700 text-white' : 'border-slate-300 bg-white hover:border-slate-400 text-slate-900 shadow-md'
              }`}
            >
                
                {/* Card Top Meta */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex flex-wrap gap-2">
                    <span className="text-[11px] font-mono uppercase tracking-wider font-semibold text-cyan-400 bg-cyan-950/70 px-2.5 py-0.5 rounded border border-cyan-900">
                      {project.category.replace('-', ' & ')}
                    </span>
                    {isOpenReviewPaper && (
                      <a
                        href="https://openreview.net/pdf?id=kiG8qiUFm2u"
                        target="_blank"
                        rel="noreferrer"
                        className="text-[11px] font-mono font-bold text-rose-300 bg-rose-950/80 hover:bg-rose-900 px-2.5 py-0.5 rounded border border-rose-800 inline-flex items-center gap-1 transition"
                      >
                        <FileText className="w-3 h-3 text-rose-400" />
                        <span>OpenReview PDF (kiG8qiUFm2u)</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    )}
                  </div>

                  {/* Highlight Metric Pill */}
                  <div className="text-right">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                      <Sparkles className="w-3 h-3 text-emerald-400" />
                      <span>{project.highlightMetric}</span>
                    </span>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      {project.metricLabel}
                    </div>
                  </div>
                </div>

                {/* Project Title & Tagline */}
                <h3 className={`text-xl font-bold transition-colors flex items-center gap-2 ${
                  isDark ? 'text-white group-hover:text-cyan-300' : 'text-slate-900 group-hover:text-cyan-700'
                }`}>
                  <span>{project.title}</span>
                </h3>
                <p className={`text-xs font-mono mt-0.5 mb-3 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  repo: github.com/asfawgedamu/{project.repoName}
                </p>

                <p className={`text-sm leading-relaxed mb-4 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  {project.description}
                </p>

                {/* Recruiter Impact vs Deep Tech Callout */}
                <div className={`p-3.5 rounded-xl border mb-4 text-xs ${
                  recruiterMode 
                    ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200' 
                    : isDark ? 'bg-slate-950/80 border-slate-800 text-slate-300' : 'bg-slate-100 border-slate-300 text-slate-800'
                }`}>
                  <div className={`flex items-center gap-1.5 font-semibold mb-1 ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
                    {recruiterMode ? (
                      <span className="text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Recruiter Impact Summary:
                      </span>
                    ) : (
                      <span className="text-cyan-600 dark:text-cyan-400 flex items-center gap-1">
                        <Cpu className="w-3.5 h-3.5" /> Technical Significance:
                      </span>
                    )}
                  </div>
                  <p className="leading-relaxed">
                    {project.recruiterImpact}
                  </p>
                </div>

                {/* Architecture Visual Accordion */}
                <div className={`border rounded-xl overflow-hidden mb-4 ${
                  isDark ? 'border-slate-800/80 bg-slate-950/60' : 'border-slate-300 bg-slate-50'
                }`}>
                  <button
                    onClick={() => setExpandedArchitectureId(isArchExpanded ? null : project.id)}
                    className={`w-full px-3.5 py-2 flex items-center justify-between text-xs font-mono transition ${
                      isDark ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                    }`}
                  >
                    <span className="flex items-center gap-1.5">
                      <Code2 className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                      <span>Architecture & Pipeline Flow</span>
                    </span>
                    {isArchExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>

                  {isArchExpanded && (
                    <div className={`p-3 border-t font-mono text-[11px] whitespace-pre-wrap leading-relaxed ${
                      isDark ? 'border-slate-800/80 bg-slate-950 text-cyan-300/90' : 'border-slate-300 bg-white text-cyan-800'
                    }`}>
                      {project.architectureOverview}
                    </div>
                  )}
                </div>

                {/* Key Features Bullet List */}
                <div className="space-y-1.5 mb-5">
                  <div className={`text-[11px] font-mono uppercase tracking-wider font-semibold ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    Core Highlights:
                  </div>
                  {project.keyFeatures.slice(0, 3).map((feat, idx) => (
                    <div key={idx} className={`flex items-start gap-2 text-xs ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                      <CheckCircle2 className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400 mt-0.5 shrink-0" />
                      <span className="leading-snug">{feat}</span>
                    </div>
                  ))}
                </div>

                {/* Tech Stack Badges */}
                <div className="space-y-1.5">
                  <div className={`text-[11px] font-mono uppercase tracking-wider font-semibold ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    Tech Stack:
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {project.techStack.map((tech) => (
                      <span
                        key={tech}
                        className={`px-2.5 py-1 rounded-md text-[11px] font-mono border transition ${
                          isDark 
                            ? 'bg-slate-800/90 text-slate-300 border-slate-700/80 hover:border-cyan-500/50 hover:text-white' 
                            : 'bg-slate-200/80 text-slate-800 border-slate-300 hover:border-cyan-600 hover:text-slate-950'
                        }`}
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

              {/* Card Footer Actions */}
              <div className="mt-4 pt-4 border-t border-slate-800/80 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <a
                    href={project.repoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-semibold text-slate-300 hover:text-cyan-400 flex items-center gap-1 transition"
                  >
                    <FolderGit2 className="w-3.5 h-3.5" />
                    <span>View Repository</span>
                    <ArrowUpRight className="w-3 h-3 text-slate-500" />
                  </a>

                  {isOpenReviewPaper && (
                    <a
                      href="https://openreview.net/pdf?id=kiG8qiUFm2u"
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs font-semibold text-rose-400 hover:text-rose-300 flex items-center gap-1 transition"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Paper PDF</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCopyMarkdown(project)}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 flex items-center gap-1.5 transition"
                    title="Copy production README markdown for this repository"
                  >
                    {copiedId === project.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-slate-400" />
                        <span>Copy README</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => onOpenRepoReadme(project)}
                    className="px-3 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 text-xs font-semibold border border-cyan-500/30 flex items-center gap-1 transition"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Inspect Stack</span>
                  </button>
                </div>
              </div>

            </div>
          );
        })}
      </div>

    </section>
  );
};
