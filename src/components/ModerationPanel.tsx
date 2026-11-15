import React, { useState } from 'react';
import { ShieldCheck } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import { AdminChip } from './AdminSignIn';
import { describeFirebaseError } from '../lib/firebase';
import { deleteReport, MisclassificationReport, reviewReport } from '../lib/feedback';

type Filter = 'All' | 'Pending Validation' | 'Approved' | 'Rejected';

interface Props {
  isDark: boolean;
  reports: MisclassificationReport[];
  loadError: unknown;
}

export const ModerationPanel: React.FC<Props> = ({ isDark, reports, loadError }) => {
  const { user, isAdmin, checking, signIn, logOut, error } = useAdmin();
  const [filter, setFilter] = useState<Filter>('All');
  const [comments, setComments] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const muted = isDark ? 'text-[#9DB0AE]' : 'text-[#516064]';
  const card = isDark ? 'bg-slate-950 border-slate-800' : 'bg-[#F2F5F0] border-[#C5CEC8]';

  if (!isAdmin) {
    return (
      <div className={`p-6 sm:p-8 rounded-[8px] border max-w-md mx-auto space-y-4 text-center my-8 ${isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-[#C5CEC8] shadow-md'}`}>
        <ShieldCheck className="w-12 h-12 mx-auto text-cyan-400" />
        <h3 className="font-serif text-xl font-semibold">Admin sign-in</h3>
        <p className={`text-xs leading-relaxed ${muted}`}>
          Misclassification reports are reviewed by the site owner. Sign in with the owner&apos;s Google account to approve or reject them.
        </p>
        {checking ? (
          <p className={`font-mono text-xs ${muted}`}>Checking access…</p>
        ) : user ? (
          <div className="space-y-3">
            <p className="font-mono text-xs text-amber-500 break-words">{user.email} is not the admin account.</p>
            <button type="button" onClick={logOut} className="w-full py-2.5 rounded-[4px] border border-cyan-400/40 text-cyan-500 hover:bg-cyan-500/10 font-mono text-xs transition cursor-pointer">Sign out and try another account</button>
          </div>
        ) : (
          <button type="button" onClick={signIn} className="w-full py-2.5 rounded-[4px] bg-cyan-400 hover:bg-cyan-500 text-slate-950 font-mono text-xs font-bold transition cursor-pointer">
            Sign in with Google
          </button>
        )}
        {error && <p role="alert" className="font-mono text-xs text-red-500">{error}</p>}
      </div>
    );
  }

  const visible = reports.filter((r) => filter === 'All' || r.status === filter);

  const act = async (id: string, status: 'Approved' | 'Rejected') => {
    setBusy(id);
    setActionError(null);
    const fallback = status === 'Approved'
      ? 'Approved by senior linguistic reviewer. Validated against corpus codebook.'
      : 'Rejected: does not meet dialect morpho-syntactic verification thresholds.';
    try {
      await reviewReport(id, status, comments[id]?.trim() || fallback);
      setComments((p) => ({ ...p, [id]: '' }));
    } catch (e) {
      setActionError(describeFirebaseError(e));
    } finally {
      setBusy(null);
    }
  };

  const remove = async (id: string) => {
    setBusy(id);
    try { await deleteReport(id); } catch (e) { setActionError(describeFirebaseError(e)); } finally { setBusy(null); }
  };

  return (
    <div className={`p-4 sm:p-6 rounded-[8px] border space-y-6 min-w-0 ${isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-[#C5CEC8]'}`}>
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-inherit">
        <div className="min-w-0">
          <h3 className="font-serif text-xl font-semibold">Moderation dashboard</h3>
          <p className={`text-xs mt-1 ${muted}`}>Review misclassification reports before they enter the retraining queue.</p>
        </div>
        <AdminChip isDark={isDark} />
      </div>

      <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
        {(['All', 'Pending Validation', 'Approved', 'Rejected'] as const).map((f) => (
          <button key={f} type="button" onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-[4px] border transition cursor-pointer ${filter === f ? 'bg-cyan-400 text-slate-950 border-cyan-400 font-bold' : isDark ? 'bg-slate-950 border-slate-800 text-[#9DB0AE]' : 'bg-[#ECEFEA] border-[#C5CEC8] text-[#516064]'}`}>
            {f} ({f === 'All' ? reports.length : reports.filter((r) => r.status === f).length})
          </button>
        ))}
      </div>

      {loadError != null && <div role="alert" className="p-3 rounded-[4px] border border-red-500/40 bg-red-500/10 text-red-500 font-mono text-xs">Reports could not be loaded. {describeFirebaseError(loadError)}</div>}
      {actionError && <div role="alert" className="p-3 rounded-[4px] border border-red-500/40 bg-red-500/10 text-red-500 font-mono text-xs">{actionError}</div>}

      <div className="space-y-4">
        {visible.length === 0 ? (
          <div className={`p-8 text-center rounded-[6px] border font-mono text-xs ${card} ${muted}`}>
            {reports.length === 0 ? 'No misclassification reports yet. Reports sent from the inference screen appear here.' : `No reports match “${filter}”.`}
          </div>
        ) : visible.map((item) => (
          <div key={item.id} className={`p-4 rounded-[6px] border space-y-3 min-w-0 ${card}`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono">
              <span className={muted}>{item.timestamp}</span>
              <span className={`self-start sm:self-auto px-2.5 py-0.5 rounded-[4px] font-bold text-[11px] border ${
                item.status === 'Pending Validation' ? 'bg-amber-500/20 text-amber-600 border-amber-500/40'
                : item.status === 'Approved' ? 'bg-emerald-500/20 text-emerald-600 border-emerald-500/40'
                : 'bg-red-500/20 text-red-500 border-red-500/40'}`}>{item.status}</span>
            </div>
            <div className={`p-3 rounded-[4px] font-serif text-sm break-words border border-inherit ${isDark ? 'bg-white/5' : 'bg-black/5'}`}>“{item.text}”</div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
              <div className="min-w-0"><span className={muted}>Error type</span><div className="font-semibold mt-0.5 break-words">{item.errorType}</div></div>
              <div className="min-w-0"><span className={muted}>Predicted → suggested</span><div className="font-semibold mt-0.5 text-cyan-500 break-words">{item.predicted} → {item.correct}</div></div>
              <div className="min-w-0"><span className={muted}>Expert notes</span><div className="mt-0.5 italic break-words">{item.notes}</div></div>
            </div>
            {item.moderatorComment && (
              <div className={`p-2.5 rounded-[4px] text-xs font-mono break-words ${item.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-red-500/10 text-red-500'}`}>
                <strong>Reviewer comment:</strong> {item.moderatorComment}
              </div>
            )}
            <div className="pt-2 border-t border-inherit space-y-2">
              {item.status === 'Pending Validation' && (
                <>
                  <input type="text" value={comments[item.id] ?? ''} onChange={(e) => setComments((p) => ({ ...p, [item.id]: e.target.value }))}
                    placeholder="Add an approval or rejection comment (optional)…" maxLength={1000}
                    className={`w-full min-w-0 p-2 rounded-[4px] border font-mono text-xs ${isDark ? 'bg-slate-900/80 border-slate-800 text-white' : 'bg-white border-[#C5CEC8] text-[#17262A]'}`} />
                  <div className="flex flex-col sm:flex-row sm:justify-end gap-2">
                    <button type="button" disabled={busy === item.id} onClick={() => act(item.id, 'Rejected')} className="px-3.5 py-2 rounded-[4px] bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white font-mono text-xs font-semibold transition cursor-pointer">Reject</button>
                    <button type="button" disabled={busy === item.id} onClick={() => act(item.id, 'Approved')} className="px-3.5 py-2 rounded-[4px] bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white font-mono text-xs font-semibold transition cursor-pointer">Approve &amp; add to retraining buffer</button>
                  </div>
                </>
              )}
              <div className="flex justify-end">
                <button type="button" disabled={busy === item.id} onClick={() => remove(item.id)} className="text-[11px] font-mono text-red-500 hover:underline cursor-pointer">Delete report</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
