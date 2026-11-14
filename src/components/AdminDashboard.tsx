import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { ShieldCheck, CheckCircle2, XCircle, Clock, FileText, AlertCircle, Search } from 'lucide-react';

export interface FeedbackSubmission {
  id: string;
  text: string;
  predicted: string;
  errorType: string;
  correct: string;
  notes: string;
  timestamp: string;
  status: 'Pending Validation' | 'Approved' | 'Rejected';
  moderatorComment?: string;
}

interface AdminDashboardProps {
  feedbackQueue: FeedbackSubmission[];
  onApprove: (id: string, comment: string) => void;
  onReject: (id: string, comment: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  feedbackQueue,
  onApprove,
  onReject
}) => {
  const { isDark } = useTheme();
  const [filter, setFilter] = useState<'All' | 'Pending Validation' | 'Approved' | 'Rejected'>('Pending Validation');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [comments, setComments] = useState<{ [id: string]: string }>({});

  const filteredItems = feedbackQueue.filter(item => {
    const matchesFilter = filter === 'All' || item.status === filter;
    const matchesSearch = item.text.includes(searchQuery) || item.notes.toLowerCase().includes(searchQuery.toLowerCase()) || item.id.includes(searchQuery);
    return matchesFilter && matchesSearch;
  });

  const stats = {
    total: feedbackQueue.length,
    pending: feedbackQueue.filter(f => f.status === 'Pending Validation').length,
    approved: feedbackQueue.filter(f => f.status === 'Approved').length,
    rejected: feedbackQueue.filter(f => f.status === 'Rejected').length
  };

  return (
    <div className={`max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8 ${
      isDark ? 'text-[#E6ECE8]' : 'text-[#17262A]'
    }`}>
      
      {/* Header Banner */}
      <div className={`p-6 sm:p-8 rounded-[8px] border ${
        isDark ? 'bg-[slate-900/80] border-[slate-800]' : 'bg-white border-[#C5CEC8] shadow-2xs'
      }`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 font-mono text-xs">
              <span className="px-2.5 py-0.5 rounded-[4px] bg-[cyan-400] text-white font-bold flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Secure Admin Portal</span>
              </span>
              <span className={isDark ? 'text-[#9DB0AE]' : 'text-[#516064]'}>
                Active Learning Moderation Engine v2.5
              </span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-semibold tracking-tight">
              Admin Moderation Dashboard
            </h1>
            <p className={`text-sm sm:text-base max-w-2xl leading-relaxed ${
              isDark ? 'text-[#9DB0AE]' : 'text-[#516064]'
            }`}>
              Secure review portal for author and domain experts to validate, comment on, and approve or reject incoming dialect misclassification reports and expert corrections before dataset retraining.
            </p>
          </div>

          {/* Stat Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 shrink-0">
            <div className={`p-3.5 rounded-[6px] border text-center ${
              isDark ? 'bg-[slate-950] border-[slate-800]' : 'bg-[#F2F5F0] border-[#C5CEC8]'
            }`}>
              <div className="font-mono text-xl font-bold">{stats.total}</div>
              <div className={`text-[11px] font-mono mt-0.5 ${isDark ? 'text-[#9DB0AE]' : 'text-[#516064]'}`}>Total Submissions</div>
            </div>
            <div className={`p-3.5 rounded-[6px] border text-center ${
              isDark ? 'bg-[slate-950] border-[slate-800]' : 'bg-[#F2F5F0] border-[#C5CEC8]'
            }`}>
              <div className="font-mono text-xl font-bold text-amber-500">{stats.pending}</div>
              <div className={`text-[11px] font-mono mt-0.5 ${isDark ? 'text-[#9DB0AE]' : 'text-[#516064]'}`}>Pending Review</div>
            </div>
            <div className={`p-3.5 rounded-[6px] border text-center ${
              isDark ? 'bg-[slate-950] border-[slate-800]' : 'bg-[#F2F5F0] border-[#C5CEC8]'
            }`}>
              <div className="font-mono text-xl font-bold text-emerald-500">{stats.approved}</div>
              <div className={`text-[11px] font-mono mt-0.5 ${isDark ? 'text-[#9DB0AE]' : 'text-[#516064]'}`}>Approved</div>
            </div>
            <div className={`p-3.5 rounded-[6px] border text-center ${
              isDark ? 'bg-[slate-950] border-[slate-800]' : 'bg-[#F2F5F0] border-[#C5CEC8]'
            }`}>
              <div className="font-mono text-xl font-bold text-red-500">{stats.rejected}</div>
              <div className={`text-[11px] font-mono mt-0.5 ${isDark ? 'text-[#9DB0AE]' : 'text-[#516064]'}`}>Rejected</div>
            </div>
          </div>
        </div>
      </div>

      {/* Controls Bar: Filter & Search */}
      <div className={`p-4 rounded-[6px] border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
        isDark ? 'bg-[slate-900/80] border-[slate-800]' : 'bg-white border-[#C5CEC8]'
      }`}>
        <div className="flex flex-wrap items-center gap-1.5 font-mono text-xs">
          {(['Pending Validation', 'Approved', 'Rejected', 'All'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3.5 py-2 rounded-[4px] border font-semibold transition cursor-pointer ${
                filter === tab
                  ? 'bg-[cyan-400] text-white border-[cyan-400]'
                  : isDark ? 'bg-[slate-950] border-[slate-800] text-[#9DB0AE]' : 'bg-[#F2F5F0] border-[#C5CEC8] text-[#516064]'
              }`}
            >
              {tab} ({tab === 'All' ? feedbackQueue.length : feedbackQueue.filter(f => f.status === tab).length})
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className={`absolute left-3 top-2.5 w-4 h-4 ${isDark ? 'text-[#9DB0AE]' : 'text-[#516064]'}`} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search sentence or notes..."
            className={`w-full pl-9 pr-3 py-2 rounded-[4px] border font-mono text-xs focus:outline-none ${
              isDark ? 'bg-[slate-950] border-[slate-800] text-white' : 'bg-[#F2F5F0] border-[#C5CEC8] text-[#17262A]'
            }`}
          />
        </div>
      </div>

      {/* Submissions List */}
      <div className="space-y-4">
        {filteredItems.length === 0 ? (
          <div className={`p-12 text-center rounded-[8px] border font-mono text-xs ${
            isDark ? 'bg-[slate-900/80] border-[slate-800] text-[#9DB0AE]' : 'bg-white border-[#C5CEC8] text-[#516064]'
          }`}>
            <AlertCircle className="w-8 h-8 mx-auto mb-2 opacity-50 text-[cyan-400]" />
            No misclassification reports match the current filter &ldquo;{filter}&rdquo;.
          </div>
        ) : (
          filteredItems.map((item) => (
            <div
              key={item.id}
              className={`p-6 rounded-[8px] border space-y-4 transition ${
                isDark ? 'bg-[slate-900/80] border-[slate-800]' : 'bg-white border-[#C5CEC8] shadow-2xs'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono">
                <div className="flex items-center gap-2.5">
                  <span className="font-bold text-[cyan-400] px-2 py-0.5 rounded bg-[cyan-400]/10">
                    ID: {item.id}
                  </span>
                  <span className={isDark ? 'text-[#9DB0AE]' : 'text-[#516064]'}>
                    Submitted at {item.timestamp}
                  </span>
                </div>
                <div>
                  <span className={`px-3 py-1 rounded-[4px] font-bold text-xs inline-flex items-center gap-1.5 ${
                    item.status === 'Pending Validation'
                      ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/40'
                      : item.status === 'Approved'
                      ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/40'
                      : 'bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/40'
                  }`}>
                    {item.status === 'Pending Validation' && <Clock className="w-3.5 h-3.5" />}
                    {item.status === 'Approved' && <CheckCircle2 className="w-3.5 h-3.5" />}
                    {item.status === 'Rejected' && <XCircle className="w-3.5 h-3.5" />}
                    <span>{item.status}</span>
                  </span>
                </div>
              </div>

              {/* Text Sample */}
              <div className={`p-4 rounded-[6px] font-serif text-base leading-relaxed border ${
                isDark ? 'bg-[slate-950] border-[slate-800]' : 'bg-[#F2F5F0] border-[#C5CEC8]'
              }`}>
                &ldquo;{item.text}&rdquo;
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
                <div className={`p-3 rounded-[4px] border ${isDark ? 'bg-[slate-950]/50 border-[slate-800]' : 'bg-[#F2F5F0]/60 border-[#C5CEC8]'}`}>
                  <span className={isDark ? 'text-[#9DB0AE]' : 'text-[#516064]'}>Classification Error Type:</span>
                  <div className="font-bold mt-1 text-sm text-[cyan-400]">{item.errorType}</div>
                </div>
                <div className={`p-3 rounded-[4px] border ${isDark ? 'bg-[slate-950]/50 border-[slate-800]' : 'bg-[#F2F5F0]/60 border-[#C5CEC8]'}`}>
                  <span className={isDark ? 'text-[#9DB0AE]' : 'text-[#516064]'}>Predicted → Expert Correction:</span>
                  <div className="font-bold mt-1 text-sm">{item.predicted} → <span className="text-emerald-500">{item.correct}</span></div>
                </div>
                <div className={`p-3 rounded-[4px] border ${isDark ? 'bg-[slate-950]/50 border-[slate-800]' : 'bg-[#F2F5F0]/60 border-[#C5CEC8]'}`}>
                  <span className={isDark ? 'text-[#9DB0AE]' : 'text-[#516064]'}>Expert Explanation Notes:</span>
                  <div className="font-medium mt-1 italic text-slate-300">{item.notes}</div>
                </div>
              </div>

              {/* Moderator Comment Display */}
              {item.moderatorComment && (
                <div className={`p-3 rounded-[4px] text-xs font-mono border ${
                  item.status === 'Approved'
                    ? isDark ? 'bg-emerald-950/40 border-emerald-800 text-emerald-200' : 'bg-emerald-50 border-emerald-200 text-emerald-800'
                    : isDark ? 'bg-red-950/40 border-red-800 text-red-200' : 'bg-red-50 border-red-200 text-red-800'
                }`}>
                  <strong>Reviewer Moderation Comment:</strong> {item.moderatorComment}
                </div>
              )}

              {/* Approval / Rejection Action Bar */}
              {item.status === 'Pending Validation' && (
                <div className="pt-3 border-t border-inherit space-y-3">
                  <input
                    type="text"
                    value={comments[item.id] || ''}
                    onChange={(e) => setComments(prev => ({ ...prev, [item.id]: e.target.value }))}
                    placeholder="Enter reviewer comment (e.g. Verified morpheme shift and L-connector rule)..."
                    className={`w-full p-2.5 rounded-[4px] border font-mono text-xs focus:outline-none ${
                      isDark ? 'bg-[slate-950] border-[slate-800] text-white' : 'bg-[#F2F5F0] border-[#C5CEC8] text-[#17262A]'
                    }`}
                  />
                  <div className="flex items-center justify-end gap-2.5">
                    <button
                      onClick={() => onReject(item.id, comments[item.id] || '')}
                      className="px-4 py-2 rounded-[4px] bg-red-600 hover:bg-red-700 text-white font-mono text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 shadow-sm"
                    >
                      <XCircle className="w-4 h-4" />
                      <span>Reject with Comments</span>
                    </button>
                    <button
                      onClick={() => onApprove(item.id, comments[item.id] || '')}
                      className="px-4 py-2 rounded-[4px] bg-emerald-600 hover:bg-emerald-700 text-white font-mono text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 shadow-sm"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Approve &amp; Add to Retraining Buffer</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

    </div>
  );
};
