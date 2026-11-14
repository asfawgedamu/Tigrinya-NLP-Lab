import React, { useState } from 'react';
import { 
  Layers, 
  Copy, 
  Check, 
  Download, 
  ExternalLink, 
  Tag, 
  Sparkles, 
  Terminal, 
  CheckCircle2, 
  FileCode2,
  Code2
} from 'lucide-react';
import { PROJECTS, Project } from '../data/portfolioData';

interface RepoReadmeSuiteProps {
  initialSelectedProjectId?: string;
}

export const RepoReadmeSuite: React.FC<RepoReadmeSuiteProps> = ({ initialSelectedProjectId }) => {
  const [selectedProjectId, setSelectedProjectId] = useState<string>(
    initialSelectedProjectId || PROJECTS[0].id
  );
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copiedTopics, setCopiedTopics] = useState<boolean>(false);

  const currentProject = PROJECTS.find(p => p.id === selectedProjectId) || PROJECTS[0];

  const handleCopyMarkdown = () => {
    navigator.clipboard.writeText(currentProject.readmeMarkdown);
    setCopiedId(currentProject.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([currentProject.readmeMarkdown], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${currentProject.repoName}-README.md`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleCopyTopics = () => {
    navigator.clipboard.writeText(currentProject.techStack.map(s => s.toLowerCase().replace(/[^a-z0-9]/g, '-')).join(', '));
    setCopiedTopics(true);
    setTimeout(() => setCopiedTopics(false), 2000);
  };

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-950/80 text-cyan-400 border border-cyan-800/60 mb-2">
            <Layers className="w-3.5 h-3.5" />
            <span>Repository-Level Tech Stack & Documentation Suite</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Major Repositories: Tech Stacks & READMEs
          </h1>
          <p className="text-sm text-slate-400 max-w-2xl mt-1">
            Turn your key repositories into recruiter magnets. Each repository is equipped with curated GitHub Topics, tech stack badges, and reproducible setup guides.
          </p>
        </div>

        {/* Global Action */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleCopyMarkdown}
            className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-cyan-500/20 transition hover:scale-105"
          >
            {copiedId === currentProject.id ? (
              <>
                <Check className="w-4 h-4 stroke-[3]" />
                <span>Copied to Clipboard!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copy Repo README</span>
              </>
            )}
          </button>

          <button
            onClick={handleDownload}
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-semibold border border-slate-800 flex items-center gap-1.5 transition"
          >
            <Download className="w-4 h-4 text-slate-400" />
            <span>Download</span>
          </button>
        </div>
      </div>

      {/* Repo Selector Tabs */}
      <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-none">
        {PROJECTS.map((proj) => (
          <button
            key={proj.id}
            onClick={() => setSelectedProjectId(proj.id)}
            className={`px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
              selectedProjectId === proj.id
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20 font-bold'
                : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
            }`}
          >
            <span>{proj.repoName}</span>
            <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
              selectedProjectId === proj.id ? 'bg-cyan-900/40 text-cyan-950 font-bold' : 'bg-slate-800 text-slate-400'
            }`}>
              {proj.highlightMetric}
            </span>
          </button>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Repository Intelligence & Optimization Specs (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Card: Repository Details */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono uppercase tracking-wider font-semibold text-cyan-400 bg-cyan-950/70 px-2.5 py-0.5 rounded border border-cyan-900">
                {currentProject.category}
              </span>
              <div className="flex items-center gap-3">
                {currentProject.id === 'tigrinya-dialect-nlp' && (
                  <a
                    href="https://openreview.net/pdf?id=kiG8qiUFm2u"
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-rose-400 hover:text-rose-300 font-semibold flex items-center gap-1 transition"
                  >
                    <span>Paper PDF (kiG8qiUFm2u)</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
                <a
                  href={currentProject.repoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition"
                >
                  <span>Open on GitHub</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold text-white mb-1">
                {currentProject.title}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed font-mono">
                github.com/asfawgedamu/{currentProject.repoName}
              </p>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {currentProject.description}
            </p>

            {/* Recruiter & Collaborator Takeaway */}
            <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-500/30 space-y-1 text-xs">
              <div className="text-emerald-400 font-semibold flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Recruiter Signal & Business Impact:</span>
              </div>
              <p className="text-emerald-200/90 leading-relaxed">
                {currentProject.recruiterImpact}
              </p>
            </div>

            {/* Tech Stack Breakdown */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <div className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold">
                Verified Tech Stack:
              </div>
              <div className="flex flex-wrap gap-1.5">
                {currentProject.techStack.map((tech) => (
                  <span
                    key={tech}
                    className="px-2.5 py-1 rounded-md text-xs font-mono bg-slate-950 text-cyan-300 border border-slate-800"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* GitHub Topics Tag Copy */}
            <div className="pt-2 border-t border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
                  <Tag className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Recommended Topics:</span>
                </span>
                <button
                  onClick={handleCopyTopics}
                  className="text-xs text-cyan-400 hover:text-cyan-300 font-mono font-semibold transition"
                >
                  {copiedTopics ? 'Copied!' : 'Copy Tags'}
                </button>
              </div>

              <div className="flex flex-wrap gap-1">
                {currentProject.techStack.map((t) => (
                  <span
                    key={t}
                    className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-slate-950 text-slate-400 border border-slate-800"
                  >
                    #{t.toLowerCase().replace(/[^a-z0-9]/g, '-')}
                  </span>
                ))}
              </div>
            </div>

          </div>

          {/* Card: Quick Commit Guide */}
          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-400 space-y-2">
            <div className="font-semibold text-slate-300 flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-cyan-400" />
              <span>How to update this repo on GitHub:</span>
            </div>
            <ol className="list-decimal pl-4 space-y-1 text-[11px]">
              <li>Open <code className="text-cyan-400 font-mono">{currentProject.repoUrl}</code></li>
              <li>Click on <code className="text-cyan-400 font-mono">README.md</code> → Click the pencil icon to edit</li>
              <li>Paste the markdown on the right and click <strong>"Commit changes"</strong></li>
              <li>Under <strong>About</strong> (top right gear icon), paste the recommended Topics tags!</li>
            </ol>
          </div>

        </div>

        {/* Right Column: Code & Markdown Viewer (7 cols) */}
        <div className="lg:col-span-7 rounded-2xl border border-slate-800 bg-slate-900/90 overflow-hidden shadow-2xl">
          <div className="px-5 py-3.5 border-b border-slate-800 bg-slate-900 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileCode2 className="w-4 h-4 text-cyan-400" />
              <span className="font-mono text-xs text-slate-300">
                {currentProject.repoName} / README.md
              </span>
            </div>

            <button
              onClick={handleCopyMarkdown}
              className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono flex items-center gap-1 transition"
            >
              {copiedId === currentProject.id ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-400" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>

          <div className="p-6 max-h-[640px] overflow-y-auto">
            <pre className="font-mono text-xs text-slate-200 bg-slate-950 p-4 rounded-xl border border-slate-800 whitespace-pre-wrap leading-relaxed select-all">
              {currentProject.readmeMarkdown}
            </pre>
          </div>
        </div>

      </div>

    </div>
  );
};
