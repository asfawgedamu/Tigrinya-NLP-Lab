import React, { useState, useEffect } from 'react';
import { GitBranch, Star, GitFork, ExternalLink, Search, RefreshCw, Copy, Check, Code2 } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface GitHubRepo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  fork: boolean;
  updated_at: string;
  topics?: string[];
}

const FALLBACK_REPOS: GitHubRepo[] = [
  {
    id: 1,
    name: 'Tigrinya-Dialect-Identification',
    description: 'Empirical benchmark and dataset for identifying Tigrinya text dialects using Classical ML and Deep Neural Networks (Character-level CNNs, BiLSTM). Published in OpenReview: kiG8qiUFm2u.',
    html_url: 'https://github.com/asfawgedamu/Tigrinya-Dialect-Identification',
    language: 'Python',
    stargazers_count: 12,
    forks_count: 4,
    fork: false,
    updated_at: '2026-10-24T12:00:00Z',
    topics: ['nlp', 'deep-learning', 'pytorch', 'tigrinya', 'geez-script', 'low-resource-languages']
  },
  {
    id: 2,
    name: 'api-design-fundamentals',
    description: 'Progressive 3-Tier FastAPI evolutionary lab series: Single-file CRUD (Level 1) -> Modular Router & Pydantic (Level 2) -> Clean Hexagonal Architecture (Level 3).',
    html_url: 'https://github.com/asfawgedamu/api-design-fundamentals',
    language: 'Python',
    stargazers_count: 9,
    forks_count: 2,
    fork: false,
    updated_at: '2026-10-22T10:30:00Z',
    topics: ['fastapi', 'clean-architecture', 'pydantic-v2', 'jwt-auth', 'backend-engineering']
  },
  {
    id: '3' as unknown as number,
    name: 'database',
    description: 'Enterprise database administration, monitoring, and performance tuning SQL scripts for Oracle 19c and PostgreSQL 15+ in telecom environments.',
    html_url: 'https://github.com/asfawgedamu/database',
    language: 'PLpgSQL',
    stargazers_count: 6,
    forks_count: 1,
    fork: false,
    updated_at: '2026-10-18T14:15:00Z',
    topics: ['oracle-19c', 'postgresql', 'performance-tuning', 'dba', 'awr']
  },
  {
    id: 4,
    name: 'asfawgedamu.github.io',
    description: 'Personal technical portfolio and research publications showcase for Asfaw Gedamu.',
    html_url: 'https://github.com/asfawgedamu/asfawgedamu.github.io',
    language: 'HTML',
    stargazers_count: 3,
    forks_count: 0,
    fork: false,
    updated_at: '2026-10-28T16:00:00Z',
    topics: ['portfolio', 'github-pages', 'minimalist', 'typography']
  }
];

export const LiveGitHubExplorer: React.FC = () => {
  const { isDark } = useTheme();
  const [repos, setRepos] = useState<GitHubRepo[]>(FALLBACK_REPOS);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [offline, setOffline] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('All');
  const [includeForks, setIncludeForks] = useState<boolean>(false);
  const [copiedCloneId, setCopiedCloneId] = useState<string | null>(null);

  const fetchRepos = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('https://api.github.com/users/asfawgedamu/repos?sort=updated&per_page=100');
      if (res.ok) {
        const data: GitHubRepo[] = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setRepos(data);
          setOffline(false);
        }
      } else {
        setOffline(true);
      }
    } catch {
      setOffline(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRepos();
  }, []);

  const languages = ['All', ...Array.from(new Set(repos.map((r) => r.language).filter(Boolean)))];

  const filteredRepos = repos.filter((repo) => {
    if (!includeForks && repo.fork) return false;
    if (selectedLanguage !== 'All' && repo.language !== selectedLanguage) return false;
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase().trim();
    return (
      repo.name.toLowerCase().includes(q) ||
      (repo.description && repo.description.toLowerCase().includes(q)) ||
      (repo.topics && repo.topics.some(t => t.toLowerCase().includes(q)))
    );
  });

  const handleCopyClone = (repo: GitHubRepo) => {
    navigator.clipboard.writeText(`git clone ${repo.html_url}.git`);
    setCopiedCloneId(String(repo.id));
    setTimeout(() => setCopiedCloneId(null), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-10">
      
      {/* Header Banner */}
      <div className={`p-6 sm:p-8 rounded-2xl border transition-colors ${
        isDark ? 'bg-slate-900/80 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900 shadow-xs'
      }`}>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className={`flex items-center gap-2 text-xs font-mono mb-2 ${
              isDark ? 'text-cyan-400' : 'text-[#0A66C2]'
            }`}>
              <GitBranch className="w-4 h-4" />
              <span>GitHub</span>
              <span className="text-slate-400">·</span>
              <span>@asfawgedamu ({repos.filter((r) => !r.fork).length} repositories{offline ? ', featured only' : ''})</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              GitHub Repositories
            </h1>
            <p className={`mt-2 text-sm sm:text-base max-w-3xl leading-relaxed ${
              isDark ? 'text-slate-300' : 'text-slate-600'
            }`}>
              Real-time exploration of public repositories, NLP experiments, backend architectures, 
              and database tools. Filter by language, topic, or clone directly.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchRepos}
              disabled={isLoading}
              className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-mono transition border disabled:opacity-50 cursor-pointer ${
                isDark ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700' : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-300 shadow-xs'
              }`}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              {isLoading ? 'Syncing...' : 'Sync GitHub'}
            </button>
            <a
              href="https://github.com/asfawgedamu"
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-xs transition shadow-xs ${
                isDark ? 'bg-cyan-500 hover:bg-cyan-400 text-slate-950' : 'bg-[#0A66C2] hover:bg-[#004182] text-white'
              }`}
            >
              <ExternalLink className="w-3.5 h-3.5" />
              View on GitHub
            </a>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mt-8">
          <div className="relative flex-1 max-w-md">
            <Search className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 ${
              isDark ? 'text-slate-400' : 'text-slate-400'
            }`} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search repositories by name, topic, or tech..."
              className={`w-full border rounded-xl pl-9 pr-4 py-2 text-xs focus:outline-none transition ${
                isDark 
                  ? 'bg-slate-950 border-slate-800 text-slate-200 focus:border-cyan-500' 
                  : 'bg-[#F9FAFB] border-slate-300 text-slate-800 focus:border-[#0A66C2]'
              }`}
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className={`flex items-center gap-1 p-1 rounded-lg border overflow-x-auto text-xs ${
              isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-100 border-slate-200'
            }`}>
              {languages.slice(0, 6).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setSelectedLanguage(lang || 'All')}
                  className={`px-2.5 py-1 rounded-md text-xs transition cursor-pointer ${
                    selectedLanguage === (lang || 'All')
                      ? isDark
                        ? 'bg-cyan-500 text-slate-950 font-bold'
                        : 'bg-white text-slate-900 font-bold shadow-xs'
                      : isDark
                      ? 'text-slate-400 hover:text-slate-200'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>

            <label className={`flex items-center gap-1.5 text-xs cursor-pointer select-none px-2 py-1 rounded-lg border ${
              isDark ? 'bg-slate-950 border-slate-800 text-slate-400' : 'bg-white border-slate-200 text-slate-600 shadow-2xs'
            }`}>
              <input
                type="checkbox"
                checked={includeForks}
                onChange={(e) => setIncludeForks(e.target.checked)}
                className="rounded border-slate-400 text-blue-600 focus:ring-0"
              />
              <span>Forks</span>
            </label>
          </div>
        </div>
      </div>

      {/* Repositories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredRepos.map((repo) => {
          const isCopied = copiedCloneId === String(repo.id);
          return (
            <div
              key={repo.id}
              className={`p-5 rounded-2xl border transition flex flex-col justify-between space-y-4 ${
                isDark 
                  ? 'bg-slate-900/70 border-slate-800 hover:border-slate-700' 
                  : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs hover:shadow-md'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Code2 className={`w-4 h-4 flex-shrink-0 ${isDark ? 'text-cyan-400' : 'text-[#0A66C2]'}`} />
                    <a
                      href={repo.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`text-base font-bold transition flex items-center gap-1.5 group ${
                        isDark ? 'text-white hover:text-cyan-300' : 'text-slate-900 hover:text-[#0A66C2]'
                      }`}
                    >
                      <span>{repo.name}</span>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-cyan-400 transition" />
                    </a>
                  </div>
                  {repo.fork && (
                    <span className="text-[10px] font-mono text-slate-400">fork</span>
                  )}
                </div>

                <p className={`text-xs mt-2 line-clamp-3 leading-relaxed ${
                  isDark ? 'text-slate-300' : 'text-slate-600'
                }`}>
                  {repo.description || 'No description provided.'}
                </p>

                {repo.topics && repo.topics.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {repo.topics.slice(0, 4).map((topic) => (
                      <span
                        key={topic}
                        className={`text-[11px] font-mono transition ${
                          isDark ? 'text-slate-400 hover:text-cyan-300' : 'text-slate-500 hover:text-[#0A66C2]'
                        }`}
                      >
                        #{topic}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Repo Metadata & Clone Bar */}
              <div className={`pt-3 border-t flex items-center justify-between text-xs font-mono ${
                isDark ? 'border-slate-800 text-slate-400' : 'border-slate-100 text-slate-500'
              }`}>
                <div className="flex items-center gap-3">
                  {repo.language && (
                    <span className="flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full ${isDark ? 'bg-cyan-400' : 'bg-[#0A66C2]'}`} />
                      <span>{repo.language}</span>
                    </span>
                  )}
                  <span className="flex items-center gap-1 text-amber-500">
                    <Star className="w-3.5 h-3.5" />
                    <span>{repo.stargazers_count}</span>
                  </span>
                  <span className="flex items-center gap-1 text-slate-400">
                    <GitFork className="w-3.5 h-3.5" />
                    <span>{repo.forks_count}</span>
                  </span>
                </div>

                <button
                  onClick={() => handleCopyClone(repo)}
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded text-[11px] transition cursor-pointer border ${
                    isDark ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700' : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                  }`}
                  title="Copy git clone command"
                >
                  {isCopied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                  <span>{isCopied ? 'Copied' : 'Clone'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
