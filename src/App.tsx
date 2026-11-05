import React, { useState } from 'react';
import { Activity, BookOpen, ChartNoAxesCombined, Database, Github, Languages, Menu, Moon, Sun, X } from 'lucide-react';
import { useTheme } from './context/ThemeContext';
import { TigrinyaDialectLab } from './components/TigrinyaDialectLab';
import { FidelMatrix } from './components/research/FidelMatrix';
import { BenchmarkDashboard } from './components/research/BenchmarkDashboard';

type Section = 'workbench' | 'fidel' | 'benchmarks' | 'research';

const navigation: { id: Section; label: string; icon: React.ElementType }[] = [
  { id: 'workbench', label: 'Inference & Corpus', icon: Activity },
  { id: 'fidel', label: 'Fidel Matrix', icon: Languages },
  { id: 'benchmarks', label: 'Benchmark Metrics', icon: ChartNoAxesCombined },
  { id: 'research', label: 'Research & Data', icon: BookOpen },
];

export default function App() {
  const [section, setSection] = useState<Section>('workbench');
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isDark, toggleTheme } = useTheme();

  const navigate = (next: Section) => {
    setSection(next);
    setMobileOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[var(--paper)] text-[var(--ink)] transition-colors">
      <header className="sticky top-0 z-40 border-b border-[var(--rule)] bg-[var(--paper)]/95 backdrop-blur">
        <div className="mx-auto flex h-[72px] max-w-[1440px] items-center justify-between px-4 sm:px-6 lg:px-8">
          <button onClick={() => navigate('workbench')} className="flex items-center gap-3 text-left" aria-label="Tigrinya NLP Lab home">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-[var(--accent)] text-white"><Languages size={21} /></span>
            <span>
              <span className="block font-serif text-lg font-semibold tracking-tight">Tigrinya NLP Lab</span>
              <span className="block font-mono text-[10px] uppercase tracking-[.18em] text-[var(--muted)]">Dialect Identification Research</span>
            </span>
          </button>

          <nav className="hidden items-center gap-1 lg:flex" aria-label="Research navigation">
            {navigation.map(({ id, label, icon: Icon }) => (
              <button key={id} onClick={() => navigate(id)} className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition ${section === id ? 'bg-[var(--panel)] font-semibold text-[var(--accent)]' : 'text-[var(--muted)] hover:bg-[var(--panel)] hover:text-[var(--ink)]'}`}>
                <Icon size={16} />{label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <a href="https://openreview.net/forum?id=kiG8qiUFm2u" target="_blank" rel="noreferrer" className="hidden items-center gap-1.5 rounded-lg border border-[var(--rule)] px-3 py-2 text-xs font-medium text-[var(--muted)] hover:text-[var(--ink)] sm:inline-flex"><BookOpen size={14} /> Paper</a>
            <button onClick={toggleTheme} className="rounded-lg border border-[var(--rule)] p-2.5 text-[var(--muted)] hover:text-[var(--ink)]" aria-label="Toggle color theme">{isDark ? <Sun size={17} /> : <Moon size={17} />}</button>
            <button onClick={() => setMobileOpen(!mobileOpen)} className="rounded-lg border border-[var(--rule)] p-2.5 lg:hidden" aria-label="Toggle navigation">{mobileOpen ? <X size={17} /> : <Menu size={17} />}</button>
          </div>
        </div>
        {mobileOpen && <nav className="grid gap-1 border-t border-[var(--rule)] p-3 lg:hidden" aria-label="Mobile research navigation">{navigation.map(({ id, label, icon: Icon }) => <button key={id} onClick={() => navigate(id)} className={`flex items-center gap-3 rounded-lg px-3 py-3 text-left text-sm ${section === id ? 'bg-[var(--panel)] font-semibold text-[var(--accent)]' : 'text-[var(--muted)]'}`}><Icon size={17} />{label}</button>)}</nav>}
      </header>

      <main className="mx-auto max-w-[1440px] px-4 py-7 sm:px-6 sm:py-10 lg:px-8">
        {section === 'workbench' && <TigrinyaDialectLab />}
        {section === 'fidel' && <FidelMatrix />}
        {section === 'benchmarks' && <BenchmarkDashboard />}
        {section === 'research' && <ResearchOverview />}
      </main>

      <footer className="border-t border-[var(--rule)]">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-3 px-4 py-6 text-xs text-[var(--muted)] sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>Tigrinya NLP Dialect Identification Lab · Research software prototype</p>
          <div className="flex items-center gap-4"><a className="inline-flex items-center gap-1.5 hover:text-[var(--ink)]" href="https://openreview.net/forum?id=kiG8qiUFm2u" target="_blank" rel="noreferrer"><BookOpen size={13} /> Research paper</a><a className="inline-flex items-center gap-1.5 hover:text-[var(--ink)]" href="https://github.com/asfawgedamu/Tigrinya-lab" target="_blank" rel="noreferrer"><Github size={13} /> Source repository</a></div>
        </div>
      </footer>
    </div>
  );
}

function PageHeading({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return <div className="mb-7 max-w-4xl"><p className="mb-2 font-mono text-[11px] uppercase tracking-[.2em] text-[var(--accent)]">{eyebrow}</p><h1 className="font-serif text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h1><p className="mt-3 max-w-3xl text-sm leading-7 text-[var(--muted)] sm:text-base">{description}</p></div>;
}

function ResearchOverview() {
  return <>
    <PageHeading eyebrow="Research workspace / 04" title="Research, corpus and methodology" description="A research-oriented overview of the Tigrinya dialect identification work, its data assets, and the current implementation boundary." />
    <div className="grid gap-5 lg:grid-cols-[1.2fr_.8fr]">
      <section className="rounded-2xl border border-[var(--rule)] bg-[var(--panel)] p-6 sm:p-8">
        <p className="font-mono text-[10px] uppercase tracking-[.18em] text-[var(--accent)]">Project overview</p>
        <h2 className="mt-3 font-serif text-2xl font-semibold">Tigrinya Dialect Identification</h2>
        <p className="mt-4 text-sm leading-7 text-[var(--muted)]">This lab organizes an interactive research interface around the dialect-identification study and its three variety labels: Variety Z, Variety L and Variety D. It includes an inference demonstration, corpus-file workflow, Ethiopic Fidel reference and benchmark figures recorded in the project dataset.</p>
        <a href="./research/tigrinya-dialect-identification-paper.pdf" target="_blank" rel="noreferrer" className="mt-6 inline-flex rounded-lg bg-[var(--accent)] px-4 py-2.5 text-sm font-semibold text-white hover:opacity-90">Read research paper</a>
      </section>
      <section className="rounded-2xl border border-[var(--rule)] p-6 sm:p-8">
        <h2 className="font-serif text-xl font-semibold">Current implementation status</h2>
        <ul className="mt-4 space-y-3 text-sm leading-6 text-[var(--muted)]">
          <li><strong className="text-[var(--ink)]">Available:</strong> React workbench, heuristic dialect rules, sample sentences, browser-side batch processing, Fidel reference matrix and paper-reported benchmark data.</li>
          <li><strong className="text-[var(--ink)]">Not connected:</strong> trained model weights, a model-serving API, persistent corpus storage or server-side moderation.</li>
          <li><strong className="text-[var(--ink)]">Next engineering phase:</strong> implement and validate a backend inference service, dataset versioning, evaluation scripts and authenticated moderation.</li>
        </ul>
      </section>
    </div>
    <section className="mt-5 rounded-2xl border border-[var(--rule)] p-6">
      <div className="flex items-center gap-2"><Database size={18} className="text-[var(--accent)]"/><h2 className="font-serif text-xl font-semibold">Research assets included</h2></div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <AssetCard title="Research paper" detail="PDF copy of the supplied dialect-identification paper." href="./research/tigrinya-dialect-identification-paper.pdf" />
        <AssetCard title="Dialect sample files" detail="Variety Z, L and D text samples retained from the source archive." href="./research/z-variety_f75533ae.txt" />
        <AssetCard title="Source benchmark data" detail="Sample sentences, Fidel rows, and model metric records in src/data/nlpData.ts." />
      </div>
    </section>
  </>;
}

function AssetCard({ title, detail, href }: { title: string; detail: string; href?: string }) {
  return <div className="rounded-xl border border-[var(--rule)] bg-[var(--panel)] p-4"><h3 className="font-semibold">{title}</h3><p className="mt-1 text-xs leading-5 text-[var(--muted)]">{detail}</p>{href && <a className="mt-3 inline-block text-xs font-semibold text-[var(--accent)] hover:underline" href={href} target="_blank" rel="noreferrer">Open asset ↗</a>}</div>;
}
