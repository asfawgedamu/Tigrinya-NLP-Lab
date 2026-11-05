import React, { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { FIDEL_ALPHABET, VOWEL_ORDERS } from '../../data/nlpData';

export function FidelMatrix() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [selected, setSelected] = useState<string | null>(null);
  const categories = ['All', ...Array.from(new Set(FIDEL_ALPHABET.map((row) => row.category)))];
  const rows = useMemo(() => FIDEL_ALPHABET.filter((row) => {
    const matchesCategory = category === 'All' || row.category === category;
    const matchesQuery = `${row.consonantName} ${row.translit} ${row.order.join('')}`.toLowerCase().includes(query.toLowerCase());
    return matchesCategory && matchesQuery;
  }), [category, query]);
  const selectedRow = FIDEL_ALPHABET.find((row) => row.consonantName === selected);

  return <>
    <div className="mb-7 max-w-4xl"><p className="mb-2 font-mono text-[11px] uppercase tracking-[.2em] text-[var(--accent)]">Research workspace / 02</p><h1 className="font-serif text-3xl font-semibold tracking-tight sm:text-4xl">Fidel morpho-syntactic reference</h1><p className="mt-3 text-sm leading-7 text-[var(--muted)]">Explore the Ethiopic Fidel rows represented in the supplied project data. Select a character family to inspect its seven listed forms.</p></div>
    <div className="mb-5 flex flex-col gap-3 rounded-xl border border-[var(--rule)] bg-[var(--panel)] p-4 sm:flex-row sm:items-center">
      <label className="relative flex-1"><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]"/><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search transliteration or Fidel form" className="w-full rounded-lg border border-[var(--rule)] bg-[var(--paper)] py-2.5 pl-9 pr-3 text-sm outline-none focus:border-[var(--accent)]"/></label>
      <select value={category} onChange={(e) => setCategory(e.target.value)} className="rounded-lg border border-[var(--rule)] bg-[var(--paper)] px-3 py-2.5 text-sm">{categories.map((item) => <option key={item}>{item}</option>)}</select>
      <span className="font-mono text-xs text-[var(--muted)]">{rows.length} character families</span>
    </div>
    <div className="overflow-hidden rounded-2xl border border-[var(--rule)]">
      <div className="overflow-x-auto"><table className="w-full min-w-[760px] border-collapse text-center"><thead className="bg-[var(--panel)]"><tr><th className="px-3 py-3 text-left text-xs font-semibold">Character family</th>{VOWEL_ORDERS.map((v) => <th key={v.index} className="px-2 py-3 text-xs font-medium"><span className="block">{v.index + 1}</span><span className="text-[var(--muted)]">{v.vowel}</span></th>)}</tr></thead><tbody>{rows.map((row) => <tr key={row.consonantName} className={`border-t border-[var(--rule)] ${selected === row.consonantName ? 'bg-[var(--panel)]' : 'hover:bg-[var(--panel)]/60'}`}><td className="px-3 py-2 text-left"><button onClick={() => setSelected(row.consonantName)} className="flex min-w-[145px] items-center gap-3 text-left"><span className="font-geez text-lg font-semibold">{row.order[0]}</span><span><span className="block text-xs font-semibold">{row.consonantName}</span><span className="block text-[10px] text-[var(--muted)]">{row.translit} · {row.category}</span></span></button></td>{row.order.map((form, index) => <td key={`${row.consonantName}-${index}`} className="px-2 py-2"><button onClick={() => setSelected(row.consonantName)} className="font-geez rounded-md px-3 py-2 text-xl hover:bg-[var(--accent)] hover:text-white">{form}</button></td>)}</tr>)}</tbody></table></div>
    </div>
    {selectedRow && <div className="mt-4 rounded-xl border border-[var(--rule)] bg-[var(--panel)] p-5"><div className="flex flex-wrap items-center justify-between gap-3"><div><p className="text-xs text-[var(--muted)]">Selected character family</p><h2 className="mt-1 font-serif text-xl font-semibold">{selectedRow.consonantName} <span className="font-sans text-sm font-normal text-[var(--muted)]">/{selectedRow.translit}/</span></h2></div><button onClick={() => setSelected(null)} className="text-xs text-[var(--accent)] hover:underline">Clear selection</button></div><div className="mt-4 grid grid-cols-7 gap-2">{selectedRow.order.map((form, i) => <div key={form} className="rounded-lg border border-[var(--rule)] bg-[var(--paper)] p-3 text-center"><div className="font-geez text-2xl">{form}</div><div className="mt-1 text-[10px] text-[var(--muted)]">{VOWEL_ORDERS[i].name}</div></div>)}</div></div>}
    <p className="mt-4 text-xs leading-5 text-[var(--muted)]">This is a character reference based on the project’s current data file. It is not a complete Unicode inventory or a substitute for a validated linguistic orthography specification.</p>
  </>;
}
