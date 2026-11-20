import React from 'react';
import { USER_INFO, PUBLICATIONS } from '../../data/portfolioData';
import { useTheme } from '../../context/ThemeContext';
import { ArrowRight, BookOpen, Database, ExternalLink, FileText, GitBranch, Mail, Sparkles } from 'lucide-react';

interface OverviewHeroProps {
  onNavigate: (tabId: string) => void;
}

const VARIETIES = [
  {
    key: 'Z',
    name: 'Variety Z',
    sub: 'Standard',
    prefix: 'ዝ- / ዘ-',
    marker: 'ዘሎ · ዘለው',
    connector: 'ን  (ስብኣይን ሰበይትን)',
    count: '1,041'
  },
  {
    key: 'L',
    name: 'Variety L',
    sub: 'Enderta / Mekelle',
    prefix: 'ል- / ለ-',
    marker: 'ለሎ · ለለው',
    connector: 'ይ  (ስብኣይይ ሰበትይ)',
    count: '1,169'
  },
  {
    key: 'D',
    name: 'Variety D',
    sub: 'Rayya',
    prefix: 'ድ- / ደ-',
    marker: 'ድንሆ · ድንሀው',
    connector: 'ይ  (ስብኣይይ ሰበትይ)',
    count: '754'
  }
];

export const OverviewHero: React.FC<OverviewHeroProps> = ({ onNavigate }) => {
  const { isDark } = useTheme();
  const paper = PUBLICATIONS[0];

  const card = isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-300 shadow-sm';
  const muted = isDark ? 'text-slate-300' : 'text-slate-700';
  const faint = isDark ? 'text-slate-400' : 'text-slate-600';
  const accent = isDark ? 'text-cyan-300' : 'text-cyan-700';
  const primaryBtn = 'inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold cursor-pointer transition-colors bg-cyan-700 hover:bg-cyan-800 text-white';
  const ghostBtn = `inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold border cursor-pointer transition-colors ${
    isDark ? 'border-slate-600 text-slate-100 hover:bg-slate-800' : 'border-slate-400 text-slate-900 hover:bg-slate-100'
  }`;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-12 min-w-0">
      {/* Intro */}
      <section className="space-y-5 max-w-3xl">
        <p className={`text-xs font-mono font-semibold uppercase tracking-widest ${accent}`}>
          {USER_INFO.companyName}
        </p>
        <h1 className="font-serif text-4xl sm:text-5xl font-extrabold tracking-tight leading-tight">
          {USER_INFO.name}
        </h1>
        <p className={`text-lg sm:text-xl leading-relaxed ${muted}`}>{USER_INFO.roleShort}.</p>
        <p className={`text-base leading-relaxed ${muted}`}>
          I build language technology for Tigrinya and train engineers at scale. This site hosts the working tools from my
          MSc research on identifying Tigrinya varieties from text, alongside my résumé and code.
        </p>
        <div className="flex flex-wrap gap-3 pt-1">
          <button onClick={() => onNavigate('projects')} className={primaryBtn}>
            <Sparkles className="w-4 h-4" /> Try the Dialect Lab
          </button>
          <button onClick={() => onNavigate('resume')} className={ghostBtn}>
            <FileText className="w-4 h-4" /> Résumé
          </button>
        </div>
      </section>

      {/* Flagship research */}
      <section className={`p-5 sm:p-8 rounded-2xl border space-y-6 ${card}`}>
        <div className="space-y-2 max-w-3xl">
          <p className={`text-xs font-mono font-semibold uppercase tracking-widest ${accent}`}>Featured research</p>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold">Tigrinya Dialect Identification</h2>
          <p className={`leading-relaxed ${muted}`}>
            Tigrinya varieties are defined by their linguistic markers, not by where people live. The study groups them as
            Z, L and D, built the first annotated dataset for the task, and compared classical and deep learning models.
            Character-level CNNs reached {USER_INFO.stats.accuracyNlp} accuracy.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {VARIETIES.map((v) => (
            <div key={v.key} className={`p-4 rounded-xl border space-y-3 ${isDark ? 'bg-slate-950 border-slate-700' : 'bg-slate-50 border-slate-300'}`}>
              <div className="flex items-baseline justify-between gap-2">
                <div>
                  <div className="font-serif text-lg font-bold">{v.name}</div>
                  <div className={`text-sm ${faint}`}>{v.sub}</div>
                </div>
                <div className={`text-sm font-mono ${faint}`}>{v.count} sentences</div>
              </div>
              <dl className="text-sm space-y-1.5">
                <div className="flex gap-2"><dt className={`w-20 shrink-0 ${faint}`}>Prefix</dt><dd className="font-semibold">{v.prefix}</dd></div>
                <div className="flex gap-2"><dt className={`w-20 shrink-0 ${faint}`}>Existential</dt><dd className="font-semibold">{v.marker}</dd></div>
                <div className="flex gap-2"><dt className={`w-20 shrink-0 ${faint}`}>Connector</dt><dd className="font-semibold min-w-0 break-words">{v.connector}</dd></div>
              </dl>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            [USER_INFO.stats.datasetSentences, 'annotated sentences'],
            ['3', 'varieties: Z, L, D'],
            [USER_INFO.stats.accuracyNlp, 'peak accuracy (Char-CNN)'],
            ['52', 'parallel texts in the Sample Corpus']
          ].map(([n, l]) => (
            <div key={l}>
              <div className="font-serif text-2xl sm:text-3xl font-bold">{n}</div>
              <div className={`text-sm ${faint}`}>{l}</div>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-3">
          <button onClick={() => onNavigate('projects')} className={primaryBtn}>
            Open the Lab <ArrowRight className="w-4 h-4" />
          </button>
          <button onClick={() => onNavigate('projects')} className={ghostBtn}>
            <Database className="w-4 h-4" /> Browse the Sample Corpus
          </button>
          <a href={paper.url} target="_blank" rel="noopener noreferrer" className={ghostBtn}>
            <BookOpen className="w-4 h-4" /> Read the paper <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </section>

      {/* About + elsewhere */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button onClick={() => onNavigate('resume')} className={`text-left p-5 rounded-2xl border cursor-pointer transition-colors ${card} ${isDark ? 'hover:border-cyan-400' : 'hover:border-cyan-700'}`}>
          <FileText className={`w-5 h-5 mb-3 ${accent}`} />
          <div className="font-serif text-lg font-bold">Experience</div>
          <p className={`text-sm mt-1 leading-relaxed ${muted}`}>
            {USER_INFO.stats.yearsAtEthioTelecom} years in telecom, {USER_INFO.stats.engineersUpskilled} professionals trained in AI, ML, cybersecurity and FinTech.
          </p>
        </button>
        <button onClick={() => onNavigate('code')} className={`text-left p-5 rounded-2xl border cursor-pointer transition-colors ${card} ${isDark ? 'hover:border-cyan-400' : 'hover:border-cyan-700'}`}>
          <GitBranch className={`w-5 h-5 mb-3 ${accent}`} />
          <div className="font-serif text-lg font-bold">Code</div>
          <p className={`text-sm mt-1 leading-relaxed ${muted}`}>
            Public repositories on GitHub, including the source of this site.
          </p>
        </button>
        <button onClick={() => onNavigate('contact')} className={`text-left p-5 rounded-2xl border cursor-pointer transition-colors ${card} ${isDark ? 'hover:border-cyan-400' : 'hover:border-cyan-700'}`}>
          <Mail className={`w-5 h-5 mb-3 ${accent}`} />
          <div className="font-serif text-lg font-bold">Contact</div>
          <p className={`text-sm mt-1 leading-relaxed ${muted}`}>
            Research collaboration, Tigrinya NLP and training enquiries are welcome.
          </p>
        </button>
      </section>
    </div>
  );
};
