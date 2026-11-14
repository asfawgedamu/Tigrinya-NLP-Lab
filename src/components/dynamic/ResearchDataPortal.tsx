import React, { useState, useMemo } from 'react';
import { useTheme } from '../../context/ThemeContext';
import {
  TIGRINYA_CORPUS,
  CORPUS_CATEGORIES,
  LINGUISTIC_MARKER_RULES,
  RAW_DATASET_ASSETS,
  CorpusUnit
} from '../../data/tigrinyaCorpus';
import {
  Download,
  Search,
  BookOpen,
  Filter,
  Copy,
  Check,
  ExternalLink,
  Layers,
  Sparkles,
  FileText,
  FileSpreadsheet,
  FileCode,
  ArrowRight,
  Database,
  Sliders,
  CheckCircle2,
  Table,
  Info
} from 'lucide-react';

interface ResearchDataPortalProps {
  onSendToDialectLab?: (text: string) => void;
}

export const ResearchDataPortal: React.FC<ResearchDataPortalProps> = ({ onSendToDialectLab }) => {
  const { isDark } = useTheme();

  // Navigation states within the portal
  const [activeTab, setActiveTab] = useState<'browser' | 'matrix' | 'downloads'>('browser');
  const [selectedCategory, setSelectedCategory] = useState<string>('All Categories');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<'parallel' | 'stacked' | 'cards'>('parallel');
  const [expandedUnitId, setExpandedUnitId] = useState<string | null>('michale-kiros');

  // Copy states
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copiedBibtex, setCopiedBibtex] = useState<boolean>(false);

  // Filtered dataset
  const filteredCorpus = useMemo(() => {
    return TIGRINYA_CORPUS.filter((unit) => {
      const matchCategory =
        selectedCategory === 'All Categories' || unit.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      if (!q) return matchCategory;

      const matchText =
        unit.title.toLowerCase().includes(q) ||
        unit.varietyZ.includes(q) ||
        unit.varietyL.includes(q) ||
        unit.varietyD.includes(q);

      return matchCategory && matchText;
    });
  }, [selectedCategory, searchQuery]);

  // Aggregate stats
  const totalWords = useMemo(() => {
    return TIGRINYA_CORPUS.reduce((acc, u) => acc + u.wordCountZ + u.wordCountL + u.wordCountD, 0);
  }, []);

  const totalChars = useMemo(() => {
    return TIGRINYA_CORPUS.reduce((acc, u) => acc + u.charCountZ + u.charCountL + u.charCountD, 0);
  }, []);

  const handleCopyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDownloadCSV = () => {
    const headers = ['ID', 'Index', 'Topic', 'Category', 'Variety Z (Standard/Central)', 'Variety L (Southern/Raya)', 'Variety D (Variant D)', 'Words_Z', 'Words_L', 'Words_D'];
    const rows = TIGRINYA_CORPUS.map((u) => [
      u.id,
      u.index,
      `"${u.title.replace(/"/g, '""')}"`,
      `"${u.category.replace(/"/g, '""')}"`,
      `"${u.varietyZ.replace(/"/g, '""').replace(/\n/g, ' ')}"`,
      `"${u.varietyL.replace(/"/g, '""').replace(/\n/g, ' ')}"`,
      `"${u.varietyD.replace(/"/g, '""').replace(/\n/g, ' ')}"`,
      u.wordCountZ,
      u.wordCountL,
      u.wordCountD
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `tigrinya_dialect_parallel_corpus_52.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadJSON = () => {
    const blob = new Blob([JSON.stringify(TIGRINYA_CORPUS, null, 2)], {
      type: 'application/json;charset=utf-8;'
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `tigrinya_dialect_parallel_corpus_52.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const bibtexCitation = `@dataset{gedamu_tigrinya_dialect_corpus_2024,
  author    = {Gedamu Haileslasie, Asfaw and Hadgu, Asmelash Teka and Abate, Solomon Teferra},
  title     = {Tigrinya Dialect Annotated Corpus: Variety Z, Variety L, and Variety D Parallel Benchmarks},
  year      = {2024},
  publisher = {OpenReview},
  url       = {https://openreview.net/forum?id=kiG8qiUFm2u},
  note      = {52 parallel thematic stories with 19,245 tokens and systematic morpho-syntactic annotations}
}`;

  const copyBibtex = () => {
    navigator.clipboard.writeText(bibtexCitation);
    setCopiedBibtex(true);
    setTimeout(() => setCopiedBibtex(false), 2000);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Research Header */}
      <div className={`p-6 sm:p-8 rounded-[8px] border transition-colors ${
        isDark 
          ? 'bg-[slate-900/80] border-[slate-800] text-[#E6ECE8]' 
          : 'bg-[#F2F5F0] border-[#C5CEC8] text-[#17262A]'
      }`}>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono">
              <span className="px-2 py-0.5 rounded-[4px] bg-[cyan-400] text-white font-bold">
                Research Data Portal
              </span>
              <span className={isDark ? 'text-[#9DB0AE]' : 'text-[#516064]'}>
                Corpus Repository
              </span>
              <span>·</span>
              <span className={isDark ? 'text-[cyan-300]' : 'text-[cyan-400] font-medium'}>
                OpenReview: kiG8qiUFm2u
              </span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-semibold tracking-tight">
              Tigrinya Dialect Research Data Portal
            </h2>
            <p className={`text-sm sm:text-base max-w-3xl leading-relaxed ${
              isDark ? 'text-[#9DB0AE]' : 'text-[#516064]'
            }`}>
              Browse, inspect, and download the complete 3-way parallel annotated Tigrinya dialect dataset. 
              Featuring 52 aligned thematic texts across Variety Z (Standard / Central), Variety L (Southern / Raya), 
              and Variety D (Colloquial Rayan Variant) with systematic morphological variance.
            </p>
          </div>

          {/* Quick Download Action Button */}
          <div className="flex flex-wrap items-center gap-2.5 self-start lg:self-center">
            <button
              onClick={handleDownloadCSV}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-[4px] bg-[cyan-400] hover:bg-[#8F1E18] text-white font-mono text-xs font-medium transition cursor-pointer shadow-2xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV (52 Texts)</span>
            </button>
            <button
              onClick={handleDownloadJSON}
              className={`inline-flex items-center gap-2 px-3.5 py-2.5 rounded-[4px] border font-mono text-xs transition cursor-pointer ${
                isDark 
                  ? 'border-[slate-800] text-[#E6ECE8] hover:bg-[slate-950]' 
                  : 'border-[#C5CEC8] text-[#17262A] hover:bg-[#E1E6E0]'
              }`}
            >
              <FileCode className="w-3.5 h-3.5" />
              <span>JSON Bundle</span>
            </button>
          </div>
        </div>

        {/* Aggregate Stats Cards */}
        <div className={`grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t ${
          isDark ? 'border-[slate-800]' : 'border-[#C5CEC8]'
        }`}>
          <div>
            <div className="font-mono text-2xl sm:text-3xl font-bold text-[cyan-400]">
              {TIGRINYA_CORPUS.length}
            </div>
            <div className={`text-xs mt-0.5 ${isDark ? 'text-[#9DB0AE]' : 'text-[#516064]'}`}>
              Parallel Thematic Units
            </div>
          </div>
          <div>
            <div className="font-mono text-2xl sm:text-3xl font-bold">
              {totalWords.toLocaleString()}
            </div>
            <div className={`text-xs mt-0.5 ${isDark ? 'text-[#9DB0AE]' : 'text-[#516064]'}`}>
              Total Aligned Words
            </div>
          </div>
          <div>
            <div className="font-mono text-2xl sm:text-3xl font-bold">
              {totalChars.toLocaleString()}
            </div>
            <div className={`text-xs mt-0.5 ${isDark ? 'text-[#9DB0AE]' : 'text-[#516064]'}`}>
              Ge&apos;ez Characters Annotated
            </div>
          </div>
          <div>
            <div className="font-mono text-2xl sm:text-3xl font-bold text-amber-600 dark:text-amber-400">
              3 Varieties
            </div>
            <div className={`text-xs mt-0.5 ${isDark ? 'text-[#9DB0AE]' : 'text-[#516064]'}`}>
              Variety Z · Variety L · Variety D
            </div>
          </div>
        </div>
      </div>

      {/* Internal Navigation Tabs */}
      <div className={`flex flex-wrap items-center gap-2 p-1.5 rounded-[6px] border ${
        isDark ? 'bg-[slate-900/80] border-[slate-800]' : 'bg-[#E1E6E0] border-[#C5CEC8]'
      }`}>
        <button
          onClick={() => setActiveTab('browser')}
          className={`px-4 py-2 rounded-[4px] text-xs font-mono font-medium flex items-center gap-2 transition cursor-pointer ${
            activeTab === 'browser'
              ? 'bg-[cyan-400] text-white font-semibold shadow-2xs'
              : isDark ? 'text-[#9DB0AE] hover:text-[#E6ECE8]' : 'text-[#516064] hover:text-[#17262A]'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Parallel Corpus Browser ({filteredCorpus.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('matrix')}
          className={`px-4 py-2 rounded-[4px] text-xs font-mono font-medium flex items-center gap-2 transition cursor-pointer ${
            activeTab === 'matrix'
              ? 'bg-[cyan-400] text-white font-semibold shadow-2xs'
              : isDark ? 'text-[#9DB0AE] hover:text-[#E6ECE8]' : 'text-[#516064] hover:text-[#17262A]'
          }`}
        >
          <Table className="w-3.5 h-3.5" />
          <span>Morphological Concordance Rules</span>
        </button>

        <button
          onClick={() => setActiveTab('downloads')}
          className={`px-4 py-2 rounded-[4px] text-xs font-mono font-medium flex items-center gap-2 transition cursor-pointer ${
            activeTab === 'downloads'
              ? 'bg-[cyan-400] text-white font-semibold shadow-2xs'
              : isDark ? 'text-[#9DB0AE] hover:text-[#E6ECE8]' : 'text-[#516064] hover:text-[#17262A]'
          }`}
        >
          <Download className="w-3.5 h-3.5" />
          <span>Raw Files & Downloads (3 TXT + CSV + JSON)</span>
        </button>
      </div>

      {/* TAB 1: PARALLEL CORPUS BROWSER */}
      {activeTab === 'browser' && (
        <div className="space-y-4">
          
          {/* Controls: Filter by Category, Search, and View Mode */}
          <div className={`p-4 rounded-[6px] border flex flex-col md:flex-row md:items-center justify-between gap-3 ${
            isDark ? 'bg-[slate-900/80] border-[slate-800]' : 'bg-white border-[#C5CEC8] shadow-2xs'
          }`}>
            <div className="flex flex-wrap items-center gap-2">
              <span className={`text-xs font-mono ${isDark ? 'text-[#9DB0AE]' : 'text-[#516064]'}`}>
                Category:
              </span>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className={`text-xs font-mono py-1.5 px-2.5 rounded-[4px] border focus:outline-none ${
                  isDark
                    ? 'bg-[slate-950] border-[slate-800] text-[#E6ECE8]'
                    : 'bg-white border-[#C5CEC8] text-[#17262A]'
                }`}
              >
                {CORPUS_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>

              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-[#516064] dark:text-[#9DB0AE]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search Ge'ez or English keywords..."
                  className={`text-xs py-1.5 pl-8 pr-3 rounded-[4px] border font-serif focus:outline-none w-56 sm:w-64 ${
                    isDark
                      ? 'bg-[slate-950] border-[slate-800] text-[#E6ECE8] focus:border-[cyan-300]'
                      : 'bg-white border-[#C5CEC8] text-[#17262A] focus:border-[cyan-400]'
                  }`}
                />
              </div>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-1 text-xs font-mono">
              <span className={`mr-1 ${isDark ? 'text-[#9DB0AE]' : 'text-[#516064]'}`}>View:</span>
              <button
                onClick={() => setViewMode('parallel')}
                className={`px-2.5 py-1 rounded-[3px] border cursor-pointer ${
                  viewMode === 'parallel'
                    ? 'bg-[cyan-400] text-white border-[cyan-400]'
                    : isDark
                    ? 'bg-[slate-950] border-[slate-800] text-[#9DB0AE]'
                    : 'bg-[#ECEFEA] border-[#C5CEC8] text-[#516064]'
                }`}
              >
                3-Way Parallel
              </button>
              <button
                onClick={() => setViewMode('stacked')}
                className={`px-2.5 py-1 rounded-[3px] border cursor-pointer ${
                  viewMode === 'stacked'
                    ? 'bg-[cyan-400] text-white border-[cyan-400]'
                    : isDark
                    ? 'bg-[slate-950] border-[slate-800] text-[#9DB0AE]'
                    : 'bg-[#ECEFEA] border-[#C5CEC8] text-[#516064]'
                }`}
              >
                Stacked Cards
              </button>
            </div>
          </div>

          {/* Results List */}
          {filteredCorpus.length === 0 ? (
            <div className={`p-12 text-center rounded-[6px] border ${
              isDark ? 'bg-[slate-900/80] border-[slate-800]' : 'bg-white border-[#C5CEC8]'
            }`}>
              <BookOpen className="w-8 h-8 mx-auto text-[cyan-400] mb-2" />
              <div className="font-serif text-base font-semibold">No corpus units matched</div>
              <p className={`text-xs mt-1 ${isDark ? 'text-[#9DB0AE]' : 'text-[#516064]'}`}>
                Try adjusting your search query or reset the category filter.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredCorpus.map((unit) => {
                const isExpanded = expandedUnitId === unit.id;
                return (
                  <div
                    key={unit.id}
                    className={`rounded-[6px] border transition-colors overflow-hidden ${
                      isDark ? 'bg-[slate-900/80] border-[slate-800]' : 'bg-white border-[#C5CEC8] shadow-2xs'
                    }`}
                  >
                    {/* Unit Header Bar */}
                    <div className={`p-4 border-b flex flex-wrap items-center justify-between gap-3 ${
                      isDark ? 'bg-[slate-950]/50 border-[slate-800]' : 'bg-[#F2F5F0] border-[#C5CEC8]'
                    }`}>
                      <div className="flex items-center gap-2.5">
                        <span className="font-mono text-xs font-bold text-[cyan-400] px-2 py-0.5 rounded-[3px] bg-[cyan-400]/10">
                          #{unit.index}
                        </span>
                        <div>
                          <h3 className="font-serif text-base font-semibold">
                            {unit.title}
                          </h3>
                          <div className="flex items-center gap-2 text-[11px] font-mono text-[#516064] dark:text-[#9DB0AE] mt-0.5">
                            <span>{unit.category}</span>
                            <span>·</span>
                            <span>{unit.wordCountZ} / {unit.wordCountL} / {unit.wordCountD} words</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {onSendToDialectLab && (
                          <button
                            onClick={() => onSendToDialectLab(unit.varietyZ)}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[3px] font-mono text-xs bg-[cyan-400] hover:bg-[#8F1E18] text-white transition cursor-pointer"
                            title="Send this text to the Tigrinya Dialect Lab simulator"
                          >
                            <Sparkles className="w-3 h-3" />
                            <span>Test in Lab &rarr;</span>
                          </button>
                        )}
                        <button
                          onClick={() => setExpandedUnitId(isExpanded ? null : unit.id)}
                          className={`px-2.5 py-1 rounded-[3px] font-mono text-xs border transition cursor-pointer ${
                            isDark
                              ? 'border-[slate-800] text-[#9DB0AE] hover:text-[#E6ECE8]'
                              : 'border-[#C5CEC8] text-[#516064] hover:text-[#17262A]'
                          }`}
                        >
                          {isExpanded ? 'Collapse' : 'Expand View'}
                        </button>
                      </div>
                    </div>

                    {/* Unit Content Body */}
                    {viewMode === 'parallel' ? (
                      /* 3-Column Parallel Comparison */
                      <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-inherit">
                        
                        {/* Variety Z Column */}
                        <div className="p-4 space-y-2">
                          <div className="flex items-center justify-between pb-2 border-b border-inherit">
                            <span className="font-mono text-xs font-bold text-[cyan-400]">
                              Variety Z (Standard)
                            </span>
                            <button
                              onClick={() => handleCopyText(unit.varietyZ, `${unit.id}-z`)}
                              className="text-[11px] font-mono flex items-center gap-1 text-[#516064] dark:text-[#9DB0AE] hover:text-[cyan-400] cursor-pointer"
                            >
                              {copiedId === `${unit.id}-z` ? (
                                <Check className="w-3 h-3 text-emerald-500" />
                              ) : (
                                <Copy className="w-3 h-3" />
                              )}
                              <span>Copy</span>
                            </button>
                          </div>
                          <div className={`font-serif text-sm leading-relaxed whitespace-pre-wrap ${
                            !isExpanded ? 'line-clamp-6' : ''
                          }`}>
                            {unit.varietyZ}
                          </div>
                        </div>

                        {/* Variety L Column */}
                        <div className="p-4 space-y-2">
                          <div className="flex items-center justify-between pb-2 border-b border-inherit">
                            <span className="font-mono text-xs font-bold text-amber-600 dark:text-amber-400">
                              Variety L (Southern / Raya)
                            </span>
                            <button
                              onClick={() => handleCopyText(unit.varietyL, `${unit.id}-l`)}
                              className="text-[11px] font-mono flex items-center gap-1 text-[#516064] dark:text-[#9DB0AE] hover:text-amber-600 cursor-pointer"
                            >
                              {copiedId === `${unit.id}-l` ? (
                                <Check className="w-3 h-3 text-emerald-500" />
                              ) : (
                                <Copy className="w-3 h-3" />
                              )}
                              <span>Copy</span>
                            </button>
                          </div>
                          <div className={`font-serif text-sm leading-relaxed whitespace-pre-wrap ${
                            !isExpanded ? 'line-clamp-6' : ''
                          }`}>
                            {unit.varietyL}
                          </div>
                        </div>

                        {/* Variety D Column */}
                        <div className="p-4 space-y-2">
                          <div className="flex items-center justify-between pb-2 border-b border-inherit">
                            <span className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400">
                              Variety D (Colloquial Rayan)
                            </span>
                            <button
                              onClick={() => handleCopyText(unit.varietyD, `${unit.id}-d`)}
                              className="text-[11px] font-mono flex items-center gap-1 text-[#516064] dark:text-[#9DB0AE] hover:text-blue-600 cursor-pointer"
                            >
                              {copiedId === `${unit.id}-d` ? (
                                <Check className="w-3 h-3 text-emerald-500" />
                              ) : (
                                <Copy className="w-3 h-3" />
                              )}
                              <span>Copy</span>
                            </button>
                          </div>
                          <div className={`font-serif text-sm leading-relaxed whitespace-pre-wrap ${
                            !isExpanded ? 'line-clamp-6' : ''
                          }`}>
                            {unit.varietyD}
                          </div>
                        </div>

                      </div>
                    ) : (
                      /* Stacked View */
                      <div className="p-4 space-y-4 divide-y divide-inherit">
                        
                        <div className="space-y-1">
                          <span className="font-mono text-xs font-bold text-[cyan-400] block">
                            Variety Z (Standard / Central Tigray):
                          </span>
                          <p className="font-serif text-sm leading-relaxed whitespace-pre-wrap">
                            {unit.varietyZ}
                          </p>
                        </div>

                        <div className="pt-3 space-y-1">
                          <span className="font-mono text-xs font-bold text-amber-600 dark:text-amber-400 block">
                            Variety L (Southern / Eastern Tigray / Raya):
                          </span>
                          <p className="font-serif text-sm leading-relaxed whitespace-pre-wrap">
                            {unit.varietyL}
                          </p>
                        </div>

                        <div className="pt-3 space-y-1">
                          <span className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400 block">
                            Variety D (Colloquial Rayan Variant):
                          </span>
                          <p className="font-serif text-sm leading-relaxed whitespace-pre-wrap">
                            {unit.varietyD}
                          </p>
                        </div>

                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

        </div>
      )}

      {/* TAB 2: MORPHOLOGICAL CONCORDANCE RULES */}
      {activeTab === 'matrix' && (
        <div className="space-y-6">
          <div className={`p-5 rounded-[6px] border ${
            isDark ? 'bg-[slate-900/80] border-[slate-800]' : 'bg-white border-[#C5CEC8] shadow-2xs'
          }`}>
            <h3 className="font-serif text-xl font-semibold mb-1">
              Systematic Morpho-Syntactic Dialect Transformations
            </h3>
            <p className={`text-xs max-w-2xl leading-relaxed ${isDark ? 'text-[#9DB0AE]' : 'text-[#516064]'}`}>
              Derived directly from the comparative analysis of the 52 parallel texts. These rules govern 
              phonological shift, verbal inflection, and clitic substitution across the 3 varieties.
            </p>

            <div className="mt-5 overflow-x-auto">
              <table className="w-full text-left text-xs font-mono border-collapse">
                <thead className={`border-b ${
                  isDark ? 'border-[slate-800] bg-[slate-950] text-[#9DB0AE]' : 'border-[#C5CEC8] bg-[#F2F5F0] text-[#516064]'
                }`}>
                  <tr>
                    <th className="py-3 px-3 font-semibold">Linguistic Feature</th>
                    <th className="py-3 px-3 font-semibold text-[cyan-400]">Variety Z (Standard)</th>
                    <th className="py-3 px-3 font-semibold text-amber-600 dark:text-amber-400">Variety L (Southern)</th>
                    <th className="py-3 px-3 font-semibold text-blue-600 dark:text-blue-400">Variety D (Rayan)</th>
                    <th className="py-3 px-3 font-semibold">Corpus Examples</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-inherit">
                  {LINGUISTIC_MARKER_RULES.map((rule, idx) => (
                    <tr key={idx} className={isDark ? 'hover:bg-[slate-950]/40' : 'hover:bg-[#F2F5F0]'}>
                      <td className="py-3 px-3 font-sans font-medium">
                        <div className="font-semibold text-xs">{rule.featureName}</div>
                        <div className={`text-[11px] mt-0.5 line-clamp-2 ${isDark ? 'text-[#9DB0AE]' : 'text-[#516064]'}`}>
                          {rule.description}
                        </div>
                      </td>
                      <td className="py-3 px-3 font-serif text-sm font-semibold text-[cyan-400] whitespace-nowrap">
                        {rule.varietyZPattern}
                      </td>
                      <td className="py-3 px-3 font-serif text-sm font-semibold text-amber-600 dark:text-amber-400 whitespace-nowrap">
                        {rule.varietyLPattern}
                      </td>
                      <td className="py-3 px-3 font-serif text-sm font-semibold text-blue-600 dark:text-blue-400 whitespace-nowrap">
                        {rule.varietyDPattern}
                      </td>
                      <td className="py-3 px-3 text-[11px]">
                        <div className="font-serif">{rule.examples.z} &rarr; {rule.examples.l} &rarr; {rule.examples.d}</div>
                        <div className="text-[#516064] dark:text-[#9DB0AE] italic mt-0.5">({rule.examples.meaning})</div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: RAW FILES & DOWNLOADS */}
      {activeTab === 'downloads' && (
        <div className="space-y-6">
          
          {/* Download Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {RAW_DATASET_ASSETS.map((asset) => (
              <div
                key={asset.id}
                className={`p-5 rounded-[6px] border flex flex-col justify-between space-y-4 ${
                  isDark ? 'bg-[slate-900/80] border-[slate-800]' : 'bg-white border-[#C5CEC8] shadow-2xs'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-[cyan-400] px-2 py-0.5 rounded-[3px] bg-[cyan-400]/10">
                      {asset.variety}
                    </span>
                    <span className="font-mono text-xs text-[#516064] dark:text-[#9DB0AE]">
                      {asset.fileSize}
                    </span>
                  </div>
                  <h4 className="font-serif text-base font-semibold">
                    {asset.name}
                  </h4>
                  <p className={`text-xs leading-relaxed ${isDark ? 'text-[#9DB0AE]' : 'text-[#516064]'}`}>
                    {asset.description}
                  </p>
                  <div className="flex items-center gap-3 pt-2 text-[11px] font-mono text-[#516064] dark:text-[#9DB0AE]">
                    <span>{asset.linesCount} lines</span>
                    <span>·</span>
                    <span>{asset.wordCount.toLocaleString()} words</span>
                  </div>
                </div>

                <a
                  href={asset.filePath}
                  download={asset.fileName}
                  className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-[4px] bg-[cyan-400] hover:bg-[#8F1E18] text-white font-mono text-xs font-semibold uppercase tracking-wider transition cursor-pointer shadow-2xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download .TXT File</span>
                </a>
              </div>
            ))}
          </div>

          {/* Combined Parallel Bundles */}
          <div className={`p-6 rounded-[6px] border space-y-4 ${
            isDark ? 'bg-[slate-900/80] border-[slate-800]' : 'bg-white border-[#C5CEC8] shadow-2xs'
          }`}>
            <h4 className="font-serif text-lg font-semibold">
              Aligned Machine Learning Corpora & Formats
            </h4>
            <p className={`text-xs max-w-2xl leading-relaxed ${isDark ? 'text-[#9DB0AE]' : 'text-[#516064]'}`}>
              Formatted for direct input into character-level CNNs, transformers (BERT/RoBERTa), 
              or sequence-to-sequence dialect translation models.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div className={`p-4 rounded-[4px] border flex items-center justify-between ${
                isDark ? 'bg-[slate-950] border-[slate-800]' : 'bg-[#F2F5F0] border-[#C5CEC8]'
              }`}>
                <div>
                  <div className="font-mono text-xs font-bold flex items-center gap-1.5">
                    <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                    <span>Parallel Corpus (.CSV)</span>
                  </div>
                  <div className="text-[11px] text-[#516064] dark:text-[#9DB0AE] mt-0.5">
                    52 aligned rows with columns for all 3 varieties
                  </div>
                </div>
                <button
                  onClick={handleDownloadCSV}
                  className="px-3 py-1.5 rounded-[3px] bg-[cyan-400] text-white font-mono text-xs font-medium hover:bg-[#8F1E18] cursor-pointer"
                >
                  Download CSV
                </button>
              </div>

              <div className={`p-4 rounded-[4px] border flex items-center justify-between ${
                isDark ? 'bg-[slate-950] border-[slate-800]' : 'bg-[#F2F5F0] border-[#C5CEC8]'
              }`}>
                <div>
                  <div className="font-mono text-xs font-bold flex items-center gap-1.5">
                    <FileCode className="w-4 h-4 text-blue-600" />
                    <span>Complete JSON Bundle (.JSON)</span>
                  </div>
                  <div className="text-[11px] text-[#516064] dark:text-[#9DB0AE] mt-0.5">
                    Structured array with token metrics and categories
                  </div>
                </div>
                <button
                  onClick={handleDownloadJSON}
                  className="px-3 py-1.5 rounded-[3px] bg-[cyan-400] text-white font-mono text-xs font-medium hover:bg-[#8F1E18] cursor-pointer"
                >
                  Download JSON
                </button>
              </div>
            </div>
          </div>

          {/* BibTeX Citation Block */}
          <div className={`p-5 rounded-[6px] border space-y-3 ${
            isDark ? 'bg-[slate-950] border-[slate-800]' : 'bg-[#F2F5F0] border-[#C5CEC8]'
          }`}>
            <div className="flex items-center justify-between">
              <span className={`text-xs font-mono uppercase tracking-wider ${
                isDark ? 'text-[#9DB0AE]' : 'text-[#516064]'
              }`}>
                BibTeX Citation
              </span>
              <button
                onClick={copyBibtex}
                className="inline-flex items-center gap-1 text-xs font-mono text-[cyan-400] hover:underline cursor-pointer"
              >
                {copiedBibtex ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedBibtex ? 'Copied' : 'Copy BibTeX'}</span>
              </button>
            </div>
            <pre className={`p-3 rounded-[4px] text-[11px] font-mono overflow-x-auto border ${
              isDark ? 'bg-[slate-900/80] border-[slate-800] text-[#E6ECE8]' : 'bg-white border-[#C5CEC8] text-[#17262A]'
            }`}>
              {bibtexCitation}
            </pre>
          </div>

        </div>
      )}

      {/* Attribution footer card */}
      <div className={`p-4 rounded-[6px] border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs ${
        isDark ? 'bg-[slate-950] border-[slate-800]' : 'bg-[#ECEFEA] border-[#C5CEC8]'
      }`}>
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-[cyan-400] flex-shrink-0" />
          <span className={isDark ? 'text-[#9DB0AE]' : 'text-[#516064]'}>
            These corpora were collected and annotated by <strong className="font-semibold">Asfaw Gedamu Haileslasie</strong> for research in low-resource African NLP.
          </span>
        </div>
        <a
          href="https://openreview.net/forum?id=kiG8qiUFm2u"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 font-mono text-[cyan-400] hover:underline"
        >
          <span>OpenReview Forum</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

    </div>
  );
};
