import React, { useState } from 'react';
import { 
  Code2, 
  Database, 
  BrainCircuit, 
  Server, 
  Terminal, 
  Users, 
  ExternalLink, 
  Check, 
  Copy, 
  Sparkles,
  Tag
} from 'lucide-react';
import { TECH_SKILLS, TechItem } from '../data/portfolioData';

export const TechStackMatrix: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'ai-ml' | 'backend' | 'database' | 'devops' | 'leadership'>('all');
  const [copiedTopic, setCopiedTopic] = useState<string | null>(null);

  const filterTabs = [
    { id: 'all', label: 'All Technologies' },
    { id: 'backend', label: 'Backend & APIs' },
    { id: 'ai-ml', label: 'AI & NLP' },
    { id: 'database', label: 'Enterprise Databases' },
    { id: 'devops', label: 'DevOps & Linux' },
    { id: 'leadership', label: 'Tech Strategy & Labs' },
  ];

  const filteredSkills = activeFilter === 'all' 
    ? TECH_SKILLS 
    : TECH_SKILLS.filter(s => s.category === activeFilter);

  const repoTopicPresets: Record<string, string[]> = {
    'api-design-fundamentals': ['fastapi', 'python3', 'pydantic-v2', 'sqlalchemy', 'rest-api', 'clean-architecture', 'pytest', 'jwt-auth'],
    'Tigrinya-Dialect-Identification': ['nlp', 'deep-learning', 'pytorch', 'tigrinya', 'low-resource-nlp', 'character-cnn', 'openreview-paper'],
    'asfawgedamu.github.io': ['portfolio', 'github-pages', 'profile-showcase', 'tech-strategy']
  };

  const copyTopics = (repo: string, topics: string[]) => {
    const topicString = topics.join(', ');
    navigator.clipboard.writeText(topicString);
    setCopiedTopic(repo);
    setTimeout(() => setCopiedTopic(null), 2000);
  };

  return (
    <section id="skills" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-800/80">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-950/80 text-cyan-400 border border-cyan-800/60 mb-2">
            <Code2 className="w-3.5 h-3.5" />
            <span>Skills & Tech Stack Matrix</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Enterprise & Research Competencies
          </h2>
          <p className="text-sm text-slate-400 max-w-2xl mt-1">
            Every technical skill is grounded in production systems at Ethio Telecom, peer-reviewed AI research, or open-source educational repositories.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-1.5 bg-slate-900/90 p-1.5 rounded-xl border border-slate-800">
          {filterTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id as any)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                activeFilter === tab.id
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tech Cards Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
        {filteredSkills.map((skill) => (
          <div
            key={skill.name}
            className="p-5 rounded-xl border border-slate-800 bg-slate-900/70 hover:border-slate-700 transition-all flex flex-col justify-between group hover:shadow-lg hover:shadow-cyan-500/5"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <h3 className="font-bold text-white text-base group-hover:text-cyan-300 transition-colors">
                  {skill.name}
                </h3>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-cyan-400 border border-slate-700">
                  {skill.years}
                </span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                {skill.description}
              </p>
            </div>

            <div className="space-y-3 pt-3 border-t border-slate-800/80">
              {/* Proficiency Bar */}
              <div>
                <div className="flex justify-between items-center text-[10px] font-mono text-slate-400 mb-1">
                  <span>Proficiency</span>
                  <span className="text-cyan-400">{skill.proficiency}%</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-500"
                    style={{ width: `${skill.proficiency}%` }}
                  />
                </div>
              </div>

              {/* Verified In Repos */}
              <div>
                <div className="text-[10px] font-mono uppercase tracking-wider text-slate-500 mb-1">
                  Verified in Repositories:
                </div>
                <div className="flex flex-wrap gap-1">
                  {skill.featuredIn.map((repo) => (
                    <span
                      key={repo}
                      className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-950 text-slate-300 border border-slate-800"
                    >
                      {repo}
                    </span>
                  ))}
                </div>
              </div>
            </div>

          </div>
        ))}
      </div>

      {/* GitHub Topics Tag Strategy (Actionable Improvement for Discoverability) */}
      <div className="p-6 rounded-2xl border border-cyan-900/50 bg-gradient-to-br from-slate-900 via-slate-950 to-cyan-950/30">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Tag className="w-4 h-4 text-cyan-400" />
              <h3 className="font-bold text-white text-base">
                Discoverability Fix: Recommended GitHub Topics by Repository
              </h3>
            </div>
            <p className="text-xs text-slate-400">
              GitHub algorithms rank profiles by repository tags. Add these curated topic tags to your repositories to attract recruiters searching for specific stacks:
            </p>
          </div>
          <span className="text-xs font-mono px-3 py-1 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800 shrink-0">
            One-Click Copy Ready
          </span>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
          {Object.entries(repoTopicPresets).map(([repoName, topics]) => (
            <div
              key={repoName}
              className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-xs font-semibold text-white truncate max-w-[190px]">
                  {repoName}
                </span>
                <button
                  onClick={() => copyTopics(repoName, topics)}
                  className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-mono flex items-center gap-1 transition"
                  title="Copy tags to clipboard"
                >
                  {copiedTopic === repoName ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span className="text-emerald-400">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3 text-slate-400" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>

              <div className="flex flex-wrap gap-1">
                {topics.map((t) => (
                  <span
                    key={t}
                    className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-cyan-950/60 text-cyan-300 border border-cyan-900/60"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

    </section>
  );
};
