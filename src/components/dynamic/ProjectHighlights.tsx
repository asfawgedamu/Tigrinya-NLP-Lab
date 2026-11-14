import React, { useState, useEffect } from 'react';
import { USER_INFO, PROJECTS } from '../../data/portfolioData';
import { BENCHMARK_MODELS, SAMPLE_SENTENCES } from '../../data/nlpData';
import { DATABASE_SCRIPTS } from '../../data/databaseScripts';
import { useTheme } from '../../context/ThemeContext';
import {
  Brain,
  Award,
  GitBranch,
  Users,
  Database,
  Sparkles,
  ArrowUpRight,
  Filter,
  CheckCircle2,
  TrendingUp,
  FileCode2,
  Cpu
} from 'lucide-react';

interface ProjectHighlightsProps {
  onNavigate: (tabId: string) => void;
}

type CategoryFilter = 'all' | 'ai-nlp' | 'systems' | 'leadership';

interface HighlightMetric {
  id: string;
  category: 'ai-nlp' | 'systems' | 'leadership';
  label: string;
  value: string;
  numericTarget: number;
  suffix?: string;
  prefix?: string;
  isDecimal?: boolean;
  context: string;
  sourceLabel: string;
  actionText: string;
  targetTab: string;
  icon: React.ElementType;
  accentColor: {
    lightBg: string;
    lightText: string;
    lightBorder: string;
    darkBg: string;
    darkText: string;
    darkBorder: string;
  };
}

export const ProjectHighlights: React.FC<ProjectHighlightsProps> = ({ onNavigate }) => {
  const { isDark } = useTheme();
  const [activeFilter, setActiveFilter] = useState<CategoryFilter>('all');
  const [hasAnimated, setHasAnimated] = useState(false);
  const [progress, setProgress] = useState(0);

  // Trigger smooth count-up animation on mount
  useEffect(() => {
    let start = 0;
    const duration = 1200; // ms
    const startTime = performance.now();

    const frame = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const t = Math.min(1, elapsed / duration);
      // easeOutExpo
      const ease = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
      setProgress(ease);

      if (t < 1) {
        requestAnimationFrame(frame);
      } else {
        setHasAnimated(true);
      }
    };

    const animId = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(animId);
  }, []);

  // Dynamically constructed metrics pulled straight from portfolio datasets
  const metrics: HighlightMetric[] = [
    {
      id: 'models-built',
      category: 'ai-nlp',
      label: 'Models Built & Benchmarked',
      value: `${BENCHMARK_MODELS.length}+`,
      numericTarget: BENCHMARK_MODELS.length,
      suffix: '+',
      context: 'Char-CNN, BiLSTM+Attn, Linear SVM & Naive Bayes evaluated on Ge’ez script',
      sourceLabel: 'TDI Research Benchmark',
      actionText: 'Explore NLP Lab',
      targetTab: 'nlp-lab',
      icon: Brain,
      accentColor: {
        lightBg: 'bg-emerald-50',
        lightText: 'text-emerald-700',
        lightBorder: 'border-emerald-200',
        darkBg: 'bg-emerald-950/40',
        darkText: 'text-emerald-400',
        darkBorder: 'border-emerald-800/60'
      }
    },
    {
      id: 'years-experience',
      category: 'leadership',
      label: 'Years Experience',
      value: USER_INFO.stats.yearsAtEthioTelecom,
      numericTarget: 19,
      suffix: '+',
      context: 'Telecom enterprise operations, architecture & Tech Horizon CoE training leadership',
      sourceLabel: 'Ethio Telecom (19+ yrs)',
      actionText: 'View Executive CV',
      targetTab: 'resume-cv',
      icon: Award,
      accentColor: {
        lightBg: 'bg-blue-50',
        lightText: 'text-[#0A66C2]',
        lightBorder: 'border-blue-200',
        darkBg: 'bg-blue-950/40',
        darkText: 'text-blue-400',
        darkBorder: 'border-blue-800/60'
      }
    },
    {
      id: 'repositories',
      category: 'systems',
      label: 'Public Repositories',
      value: `${USER_INFO.stats.publicRepos}`,
      numericTarget: USER_INFO.stats.publicRepos,
      context: 'Open-source Tigrinya NLP, FastAPI 3-tier architectures & SQL tuning diagnostics',
      sourceLabel: `GitHub @${USER_INFO.username}`,
      actionText: 'Browse Code Hub',
      targetTab: 'github-hub',
      icon: GitBranch,
      accentColor: {
        lightBg: 'bg-purple-50',
        lightText: 'text-purple-700',
        lightBorder: 'border-purple-200',
        darkBg: 'bg-purple-950/40',
        darkText: 'text-purple-400',
        darkBorder: 'border-purple-800/60'
      }
    },
    {
      id: 'engineers-upskilled',
      category: 'leadership',
      label: 'Engineers Upskilled',
      value: USER_INFO.stats.engineersUpskilled,
      numericTarget: 500,
      suffix: '+',
      context: 'Hands-on operational training in AI/ML, Cybersecurity, Cloud DBs & FinTech',
      sourceLabel: 'Tech Horizon CoE (TExA)',
      actionText: 'View Training Impact',
      targetTab: 'resume-cv',
      icon: Users,
      accentColor: {
        lightBg: 'bg-teal-50',
        lightText: 'text-teal-700',
        lightBorder: 'border-teal-200',
        darkBg: 'bg-teal-950/40',
        darkText: 'text-teal-400',
        darkBorder: 'border-teal-800/60'
      }
    },
    {
      id: 'db-scripts',
      category: 'systems',
      label: 'Database Diagnostic Suites',
      value: `${DATABASE_SCRIPTS.length}`,
      numericTarget: DATABASE_SCRIPTS.length,
      context: 'Production-hardened AWR/ASH queries, lock analyzers & buffer tuning recipes',
      sourceLabel: 'Oracle 19c & PostgreSQL',
      actionText: 'Run DB Console',
      targetTab: 'database-console',
      icon: Database,
      accentColor: {
        lightBg: 'bg-amber-50',
        lightText: 'text-amber-800',
        lightBorder: 'border-amber-200',
        darkBg: 'bg-amber-950/40',
        darkText: 'text-amber-400',
        darkBorder: 'border-amber-800/60'
      }
    },
    {
      id: 'nlp-accuracy',
      category: 'ai-nlp',
      label: 'Peak NLP Accuracy',
      value: USER_INFO.stats.accuracyNlp,
      numericTarget: 92.98,
      suffix: '%',
      isDecimal: true,
      context: `Character-level CNN benchmarked on ${USER_INFO.stats.datasetSentences} Tigrinya dialect sentences`,
      sourceLabel: 'OpenReview (kiG8qiUFm2u)',
      actionText: 'Review Paper & Data',
      targetTab: 'nlp-lab',
      icon: Sparkles,
      accentColor: {
        lightBg: 'bg-rose-50',
        lightText: 'text-rose-700',
        lightBorder: 'border-rose-200',
        darkBg: 'bg-rose-950/40',
        darkText: 'text-rose-400',
        darkBorder: 'border-rose-800/60'
      }
    }
  ];

  const filteredMetrics = activeFilter === 'all' 
    ? metrics 
    : metrics.filter(m => m.category === activeFilter);

  // Compute animated displayed value
  const getAnimatedValue = (item: HighlightMetric) => {
    if (hasAnimated) return item.value;
    if (item.isDecimal) {
      const current = (item.numericTarget * progress).toFixed(2);
      return `${current}${item.suffix || ''}`;
    }
    const current = Math.round(item.numericTarget * progress);
    return `${current}${item.suffix || ''}`;
  };

  return (
    <section className={`p-6 sm:p-8 rounded-2xl border transition-all ${
      isDark 
        ? 'bg-slate-900/80 border-slate-800 text-slate-100 shadow-xl' 
        : 'bg-white border-slate-200 text-slate-900 shadow-sm'
    }`}>
      {/* Header & Category Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-inherit">
        <div>
          <div className="flex items-center gap-2">
            <TrendingUp className={`w-5 h-5 ${isDark ? 'text-teal-400' : 'text-[#0A66C2]'}`} />
            <h2 className="text-lg sm:text-xl font-extrabold tracking-tight">
              Project &amp; Career Highlights
            </h2>
          </div>
          <p className={`text-xs sm:text-sm mt-1 leading-relaxed ${
            isDark ? 'text-slate-400' : 'text-slate-600'
          }`}>
            Live quantitative metrics aggregated from evaluated ML benchmarks, GitHub repositories, and 19+ years of telecom systems engineering.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className={`inline-flex items-center p-1 rounded-xl border text-xs font-mono self-start md:self-auto ${
          isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
        }`}>
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-3 py-1.5 rounded-lg transition font-medium ${
              activeFilter === 'all'
                ? isDark
                  ? 'bg-teal-500/20 text-teal-300 font-bold border border-teal-500/30'
                  : 'bg-white text-[#0A66C2] font-bold shadow-xs border border-slate-200'
                : isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Stats ({metrics.length})
          </button>
          <button
            onClick={() => setActiveFilter('ai-nlp')}
            className={`px-3 py-1.5 rounded-lg transition font-medium ${
              activeFilter === 'ai-nlp'
                ? isDark
                  ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30'
                  : 'bg-white text-emerald-700 font-bold shadow-xs border border-slate-200'
                : isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            AI &amp; NLP
          </button>
          <button
            onClick={() => setActiveFilter('systems')}
            className={`px-3 py-1.5 rounded-lg transition font-medium ${
              activeFilter === 'systems'
                ? isDark
                  ? 'bg-purple-500/20 text-purple-300 font-bold border border-purple-500/30'
                  : 'bg-white text-purple-700 font-bold shadow-xs border border-slate-200'
                : isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Systems &amp; DB
          </button>
          <button
            onClick={() => setActiveFilter('leadership')}
            className={`px-3 py-1.5 rounded-lg transition font-medium ${
              activeFilter === 'leadership'
                ? isDark
                  ? 'bg-blue-500/20 text-blue-300 font-bold border border-blue-500/30'
                  : 'bg-white text-[#0A66C2] font-bold shadow-xs border border-slate-200'
                : isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Leadership
          </button>
        </div>
      </div>

      {/* Animated Grid Format */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-6">
        {filteredMetrics.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              onClick={() => onNavigate(item.targetTab)}
              className={`group relative p-5 rounded-2xl border transition-all duration-300 cursor-pointer flex flex-col justify-between hover:-translate-y-1 ${
                isDark
                  ? 'bg-slate-950/70 border-slate-800 hover:border-slate-700 hover:shadow-lg hover:shadow-teal-950/20'
                  : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-md'
              }`}
            >
              <div>
                {/* Top Row: Source Chip */}
                <div className="flex items-center justify-end gap-2 mb-3.5">
                  <span className={`text-[11px] font-mono px-2 py-0.5 rounded border transition-colors ${
                    isDark
                      ? 'bg-slate-900 border-slate-800 text-slate-400'
                      : 'bg-slate-50 border-slate-200 text-slate-600'
                  }`}>
                    {item.sourceLabel}
                  </span>
                </div>

                {/* Big Animated Stat Value */}
                <div className="space-y-1">
                  <div className={`text-3xl sm:text-4xl font-extrabold font-mono tracking-tight transition-colors ${
                    isDark ? 'text-white group-hover:text-teal-300' : 'text-slate-900 group-hover:text-[#0A66C2]'
                  }`}>
                    {getAnimatedValue(item)}
                  </div>
                  <h3 className={`text-sm font-bold tracking-tight ${
                    isDark ? 'text-slate-200' : 'text-slate-800'
                  }`}>
                    {item.label}
                  </h3>
                </div>

                {/* Context Description */}
                <p className={`text-xs mt-2.5 leading-relaxed ${
                  isDark ? 'text-slate-400' : 'text-slate-600'
                }`}>
                  {item.context}
                </p>
              </div>

              {/* Bottom Interactive Jump Link */}
              <div className={`mt-5 pt-3.5 border-t flex items-center justify-between text-xs font-mono transition-colors ${
                isDark 
                  ? 'border-slate-800/80 text-slate-400 group-hover:text-teal-300' 
                  : 'border-slate-100 text-slate-500 group-hover:text-[#0A66C2]'
              }`}>
                <span className="font-medium flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 opacity-70" />
                  <span>{item.actionText}</span>
                </span>
                <span className="transform transition-transform group-hover:translate-x-1 group-hover:-translate-y-0.5 flex items-center">
                  <ArrowUpRight className="w-4 h-4" />
                </span>
              </div>

              {/* Visual Bottom Accent Line on Hover */}
              <div 
                className={`absolute bottom-0 left-4 right-4 h-[2px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                  isDark ? 'bg-teal-400' : 'bg-[#0A66C2]'
                }`}
              />
            </div>
          );
        })}
      </div>

      {/* Supplementary Summary Footer with Quick Actions */}
      <div className={`mt-6 pt-4 border-t flex flex-wrap items-center justify-between gap-3 text-xs ${
        isDark ? 'border-slate-800 text-slate-400' : 'border-slate-200 text-slate-600'
      }`}>
        <div className="flex items-center gap-2 font-mono">
          <span className={`w-2 h-2 rounded-full ${isDark ? 'bg-teal-400' : 'bg-[#0A66C2]'}`} />
          <span>Verified against OpenReview paper, live GitHub API &amp; Ethio Telecom technical records</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('nlp-lab')}
            className={`font-semibold hover:underline flex items-center gap-1 ${
              isDark ? 'text-teal-400' : 'text-[#0A66C2]'
            }`}
          >
            <span>Dialect Classifier</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
          <span>·</span>
          <button
            onClick={() => onNavigate('fastapi-arch')}
            className={`font-semibold hover:underline flex items-center gap-1 ${
              isDark ? 'text-indigo-400' : 'text-[#0A66C2]'
            }`}
          >
            <span>FastAPI Architecture</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
          <span>·</span>
          <button
            onClick={() => onNavigate('database-console')}
            className={`font-semibold hover:underline flex items-center gap-1 ${
              isDark ? 'text-amber-400' : 'text-[#0A66C2]'
            }`}
          >
            <span>SQL Diagnostics</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </section>
  );
};
