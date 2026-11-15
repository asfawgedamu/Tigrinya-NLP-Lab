import React, { useEffect, useMemo, useState } from 'react';
import { MessageSquare, ThumbsUp, Trash2 } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import { AdminChip } from './AdminSignIn';
import { describeFirebaseError } from '../lib/firebase';
import {
  addComment, addReply, CommentCategory, CommentItem, deleteComment, deleteReply, formatWhen,
  importFeaturedComments, OWNER_NAME, ReplyItem, subscribeComments, subscribeReplies, upvoteComment,
} from '../lib/comments';

const NAME_KEY = 'tdi-visitor-name';
const VOTES_KEY = 'tdi-upvoted-comments';

const readStore = (key: string): string => { try { return localStorage.getItem(key) ?? ''; } catch { return ''; } };
const writeStore = (key: string, value: string) => { try { localStorage.setItem(key, value); } catch { /* private mode */ } };

const CATEGORY_STYLE: Record<CommentCategory, string> = {
  'Research Discussion': 'bg-purple-500/20 text-purple-500 border border-purple-500/30',
  'Dialect Inquiry': 'bg-cyan-500/20 text-cyan-600 border border-cyan-500/30',
  'Feature Request': 'bg-amber-500/20 text-amber-600 border border-amber-500/30',
  'General Feedback': 'bg-emerald-500/20 text-emerald-600 border border-emerald-500/30',
};

export const CommentsPanel: React.FC<{ isDark: boolean }> = ({ isDark }) => {
  const { isAdmin } = useAdmin();
  const [comments, setComments] = useState<CommentItem[] | null>(null);
  const [replies, setReplies] = useState<ReplyItem[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [notice, setNotice] = useState<{ kind: 'ok' | 'error'; text: string } | null>(null);
  const [upvoted, setUpvoted] = useState<Set<string>>(() => new Set(readStore(VOTES_KEY).split(',').filter(Boolean)));

  useEffect(() => {
    const offC = subscribeComments((items) => { setComments(items); setLoadError(null); }, (e) => setLoadError(describeFirebaseError(e)));
    const offR = subscribeReplies(setReplies, (e) => setLoadError(describeFirebaseError(e)));
    return () => { offC(); offR(); };
  }, []);

  const repliesByComment = useMemo(() => {
    const map = new Map<string, ReplyItem[]>();
    replies.forEach((r) => map.set(r.commentId, [...(map.get(r.commentId) ?? []), r]));
    return map;
  }, [replies]);

  const flash = (kind: 'ok' | 'error', text: string) => {
    setNotice({ kind, text });
    window.setTimeout(() => setNotice(null), 5000);
  };

  const card = isDark ? 'bg-slate-950 border-slate-800' : 'bg-[#F2F5F0] border-[#C5CEC8]';
  const field = `w-full min-w-0 p-2.5 rounded-[4px] border font-mono text-xs ${isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-[#C5CEC8] text-[#17262A]'}`;
  const muted = isDark ? 'text-[#9DB0AE]' : 'text-[#516064]';
  const ghostBtn = `px-3 py-1.5 rounded-[4px] font-mono text-xs transition cursor-pointer border ${isDark ? 'bg-slate-900 border-slate-800 hover:bg-slate-800 text-cyan-400' : 'bg-white border-[#C5CEC8] hover:bg-[#E1E6E0] text-cyan-700'}`;

  // ---- new comment form -------------------------------------------------
  const [author, setAuthor] = useState(() => readStore(NAME_KEY));
  const [affiliation, setAffiliation] = useState('');
  const [category, setCategory] = useState<CommentCategory>('General Feedback');
  const [text, setText] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [posting, setPosting] = useState(false);

  const submitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (honeypot) return; // bots fill hidden fields
    if (!author.trim() || !text.trim()) return;
    setPosting(true);
    try {
      await addComment({ author, affiliation, category, text });
      writeStore(NAME_KEY, author.trim());
      setText('');
      flash('ok', 'Your comment is now public.');
    } catch (err) {
      flash('error', `Could not post your comment. ${describeFirebaseError(err)}`);
    } finally {
      setPosting(false);
    }
  };

  // ---- upvotes ----------------------------------------------------------
  const vote = async (id: string) => {
    if (upvoted.has(id)) return;
    try {
      await upvoteComment(id);
      const next = new Set(upvoted).add(id);
      setUpvoted(next);
      writeStore(VOTES_KEY, [...next].join(','));
    } catch (err) {
      flash('error', `Could not record your vote. ${describeFirebaseError(err)}`);
    }
  };

  // ---- replies ----------------------------------------------------------
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyName, setReplyName] = useState(() => readStore(NAME_KEY));
  const [replyText, setReplyText] = useState('');
  const [replyBusy, setReplyBusy] = useState(false);
  const [replyError, setReplyError] = useState<string | null>(null);

  const openReply = (id: string) => {
    setReplyingTo(replyingTo === id ? null : id);
    setReplyText('');
    setReplyError(null);
  };

  const submitReply = async (commentId: string) => {
    const name = isAdmin ? OWNER_NAME : replyName;
    if (!name.trim()) { setReplyError('Please enter your name.'); return; }
    if (!replyText.trim()) { setReplyError('Please write a reply first.'); return; }
    setReplyBusy(true);
    setReplyError(null);
    try {
      await addReply({ commentId, author: name, text: replyText, isOwner: isAdmin });
      if (!isAdmin) writeStore(NAME_KEY, name.trim());
      setReplyText('');
      setReplyingTo(null);
      flash('ok', 'Reply posted.');
    } catch (err) {
      setReplyError(`Could not post the reply. ${describeFirebaseError(err)}`);
    } finally {
      setReplyBusy(false);
    }
  };

  // ---- admin-only actions ----------------------------------------------
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const removeComment = async (id: string) => {
    if (confirmDelete !== `c:${id}`) { setConfirmDelete(`c:${id}`); return; }
    try { await deleteComment(id); flash('ok', 'Comment deleted.'); } catch (err) { flash('error', describeFirebaseError(err)); }
    setConfirmDelete(null);
  };
  const removeReply = async (id: string) => {
    if (confirmDelete !== `r:${id}`) { setConfirmDelete(`r:${id}`); return; }
    try { await deleteReply(id); flash('ok', 'Reply deleted.'); } catch (err) { flash('error', describeFirebaseError(err)); }
    setConfirmDelete(null);
  };
  const importSamples = async () => {
    try { await importFeaturedComments(); flash('ok', 'Published the two featured comments.'); } catch (err) { flash('error', describeFirebaseError(err)); }
  };

  return (
    <div className={`p-4 sm:p-8 rounded-[8px] border space-y-6 min-w-0 ${isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-[#C5CEC8] shadow-sm'}`}>
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-inherit">
        <div className="min-w-0">
          <h3 className="font-serif text-2xl font-semibold">Community Comments &amp; Research Discussion</h3>
          <p className={`text-xs mt-1 ${muted}`}>
            Ask questions about the Tigrinya Dialect Identification benchmark or share observations. Anyone can comment and reply.
          </p>
        </div>
        <AdminChip isDark={isDark} />
      </div>

      {notice && (
        <div role="status" className={`p-3 rounded-[4px] border font-mono text-xs ${
          notice.kind === 'ok' ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-600' : 'bg-red-500/15 border-red-500/40 text-red-500'
        }`}>{notice.text}</div>
      )}
      {loadError && (
        <div role="alert" className="p-3 rounded-[4px] border border-red-500/40 bg-red-500/10 text-red-500 font-mono text-xs">
          Comments could not be loaded. {loadError}
        </div>
      )}

      <form onSubmit={submitComment} className={`p-4 sm:p-5 rounded-[6px] border space-y-4 ${card}`}>
        <h4 className="font-serif text-base font-semibold">Leave a comment or question</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="min-w-0">
            <label htmlFor="cm-author" className="block text-xs font-mono mb-1">Your name *</label>
            <input id="cm-author" className={field} required maxLength={100} value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="e.g. Dr. Meron K." />
          </div>
          <div className="min-w-0">
            <label htmlFor="cm-aff" className="block text-xs font-mono mb-1">Affiliation (optional)</label>
            <input id="cm-aff" className={field} maxLength={150} value={affiliation} onChange={(e) => setAffiliation(e.target.value)} placeholder="e.g. Mekelle University" />
          </div>
        </div>
        <div className="min-w-0 sm:max-w-xs">
          <label htmlFor="cm-cat" className="block text-xs font-mono mb-1">Topic</label>
          <select id="cm-cat" className={field} value={category} onChange={(e) => setCategory(e.target.value as CommentCategory)}>
            <option value="General Feedback">General Feedback</option>
            <option value="Dialect Inquiry">Dialect Inquiry (Variety Z/L/D)</option>
            <option value="Research Discussion">Research Discussion (CNN/Metrics)</option>
            <option value="Feature Request">Feature Request</option>
          </select>
        </div>
        <div>
          <label htmlFor="cm-text" className="block text-xs font-mono mb-1">Your comment *</label>
          <textarea id="cm-text" className={`${field} font-serif text-sm`} required rows={3} maxLength={2000} value={text} onChange={(e) => setText(e.target.value)} placeholder="Share your thoughts on the benchmark, the dataset, or the varieties…" />
        </div>
        {/* Honeypot: invisible to people, filled in by bots */}
        <input tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} name="website" />
        <div className="flex justify-end">
          <button type="submit" disabled={posting} className="px-5 py-2.5 rounded-[4px] bg-cyan-400 hover:bg-cyan-500 disabled:opacity-60 text-slate-950 font-mono text-xs font-bold transition cursor-pointer">
            {posting ? 'Posting…' : 'Post comment →'}
          </button>
        </div>
      </form>

      <div className="space-y-4">
        <div className="flex items-center justify-between gap-2">
          <h4 className="font-serif text-lg font-semibold">Recent comments</h4>
          {comments && <span className={`font-mono text-xs ${muted}`}>{comments.length} published</span>}
        </div>

        {comments === null && !loadError && <div className={`p-6 text-center font-mono text-xs ${muted}`}>Loading comments…</div>}

        {comments !== null && comments.length === 0 && (
          <div className={`p-6 rounded-[6px] border text-center space-y-3 ${card}`}>
            <MessageSquare className="w-6 h-6 mx-auto text-cyan-400" />
            <p className={`font-mono text-xs ${muted}`}>No comments yet. Be the first to start the discussion.</p>
            {isAdmin && (
              <button type="button" onClick={importSamples} className={ghostBtn}>Publish the two featured comments</button>
            )}
          </div>
        )}

        {comments?.map((c) => {
          const thread = [
            ...c.legacyReplies.map((r) => ({ id: `legacy-${r.id}`, author: r.author, text: r.text, isOwner: /asfaw/i.test(r.author), when: r.timestamp, legacy: true })),
            ...(repliesByComment.get(c.id) ?? []).map((r) => ({ id: r.id, author: r.author, text: r.text, isOwner: r.isOwner, when: formatWhen(r.createdAtMs, r.timestampLabel), legacy: false })),
          ];
          return (
            <article key={c.id} className={`p-4 sm:p-5 rounded-[6px] border space-y-3 min-w-0 ${card}`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono">
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1 min-w-0">
                  <span className="font-bold text-cyan-500 text-sm break-words">{c.author}</span>
                  {c.affiliation && <span className={`px-2 py-0.5 rounded-[3px] text-[10px] ${isDark ? 'bg-white/5 text-[#9DB0AE]' : 'bg-black/5 text-[#516064]'}`}>{c.affiliation}</span>}
                  <span className={muted}>· {formatWhen(c.createdAtMs, c.timestampLabel)}</span>
                </div>
                <span className={`self-start sm:self-auto px-2.5 py-0.5 rounded-[4px] font-bold text-[10px] ${CATEGORY_STYLE[c.category] ?? CATEGORY_STYLE['General Feedback']}`}>{c.category}</span>
              </div>

              <p className={`font-serif text-sm leading-relaxed break-words ${isDark ? 'text-[#E6ECE8]' : 'text-[#17262A]'}`}>{c.text}</p>

              {thread.length > 0 && (
                <div className="pl-3 sm:pl-5 border-l-2 border-cyan-500/40 space-y-2 pt-1">
                  <div className="text-[11px] font-mono text-cyan-500 font-semibold">Replies ({thread.length})</div>
                  {thread.map((r) => (
                    <div key={r.id} className={`p-3 rounded-[4px] border text-xs space-y-1 ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-[#C5CEC8]'}`}>
                      <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1 font-mono">
                        <span className="flex items-center gap-2 min-w-0">
                          <span className="font-bold text-cyan-500 break-words">{r.author}</span>
                          {r.isOwner && <span className="px-1.5 py-0.5 rounded bg-cyan-400 text-slate-950 text-[10px] font-bold">Author</span>}
                        </span>
                        <span className="flex items-center gap-2">
                          <span className={muted}>{r.when}</span>
                          {isAdmin && !r.legacy && (
                            <button type="button" onClick={() => removeReply(r.id)} className="text-red-500 hover:underline cursor-pointer inline-flex items-center gap-1" aria-label="Delete reply">
                              <Trash2 className="w-3 h-3" />{confirmDelete === `r:${r.id}` ? 'Confirm?' : ''}
                            </button>
                          )}
                        </span>
                      </div>
                      <div className="font-serif text-sm break-words whitespace-pre-wrap">{r.text}</div>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-inherit">
                <button type="button" onClick={() => openReply(c.id)} className={ghostBtn}>
                  {replyingTo === c.id ? 'Cancel reply' : '💬 Reply'}
                </button>
                <div className="flex items-center gap-2">
                  {isAdmin && (
                    <button type="button" onClick={() => removeComment(c.id)} className="px-3 py-1.5 rounded-[4px] border border-red-500/40 text-red-500 font-mono text-xs cursor-pointer inline-flex items-center gap-1">
                      <Trash2 className="w-3 h-3" />{confirmDelete === `c:${c.id}` ? 'Confirm delete' : 'Delete'}
                    </button>
                  )}
                  <button type="button" onClick={() => vote(c.id)} disabled={upvoted.has(c.id)} className={`${ghostBtn} inline-flex items-center gap-1.5 disabled:opacity-60 disabled:cursor-default`}>
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span>{upvoted.has(c.id) ? 'Thanks' : 'Helpful'}</span>
                    <span className="font-bold">{c.upvotes}</span>
                  </button>
                </div>
              </div>

              {replyingTo === c.id && (
                <div className={`p-4 rounded-[6px] border space-y-3 ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-[#C5CEC8]'}`}>
                  <h5 className="font-mono text-xs font-bold text-cyan-500 break-words">
                    {isAdmin ? `Replying to ${c.author} as ${OWNER_NAME} (Author)` : `Reply to ${c.author}`}
                  </h5>
                  {!isAdmin && (
                    <div>
                      <label htmlFor={`rn-${c.id}`} className="block text-xs font-mono mb-1">Your name *</label>
                      <input id={`rn-${c.id}`} className={field} maxLength={100} value={replyName} onChange={(e) => setReplyName(e.target.value)} placeholder="Your name" />
                    </div>
                  )}
                  <div>
                    <label htmlFor={`rt-${c.id}`} className="block text-xs font-mono mb-1">Your reply *</label>
                    <textarea id={`rt-${c.id}`} className={`${field} font-serif text-sm`} rows={4} maxLength={2000} value={replyText} onChange={(e) => setReplyText(e.target.value)} placeholder="Write your reply…" />
                  </div>
                  {replyError && <div role="alert" className="text-xs font-mono text-red-500">{replyError}</div>}
                  <div className="flex flex-wrap justify-end gap-2">
                    <button type="button" onClick={() => setReplyingTo(null)} className="px-3 py-1.5 rounded-[4px] font-mono text-xs text-slate-400 hover:text-slate-200 transition cursor-pointer">Cancel</button>
                    <button type="button" disabled={replyBusy} onClick={() => submitReply(c.id)} className="px-4 py-1.5 rounded-[4px] bg-cyan-400 hover:bg-cyan-500 disabled:opacity-60 text-slate-950 font-mono text-xs font-bold transition cursor-pointer">
                      {replyBusy ? 'Posting…' : 'Post reply →'}
                    </button>
                  </div>
                </div>
              )}
            </article>
          );
        })}
      </div>
    </div>
  );
};
