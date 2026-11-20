import React, { useEffect, useMemo, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { CornerDownRight, MessageSquare, ShieldAlert, ThumbsUp, Trash2 } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import { AdminChip } from './AdminSignIn';
import { auth, cleanText, describeFirebaseError } from '../lib/firebase';
import {
  addComment, addReply, blockAuthor, CommentCategory, CommentItem, deleteComment, deleteReply,
  formatAbsolute, formatRelative, OWNER_NAME, ReplyItem, setCommentDate, setCommentsOpen,
  Settings, subscribeComments, subscribeReplies, subscribeSettings, upvoteComment,
} from '../lib/comments';

const NAME_KEY = 'tdi-visitor-name';
const VOTES_KEY = 'tdi-upvoted-comments';
const COOLDOWN_MS = 15000; // matches the 15 s rule in firestore.rules
const VISIBLE_REPLIES = 3;

const readStore = (key: string): string => { try { return localStorage.getItem(key) ?? ''; } catch { return ''; } };
const writeStore = (key: string, value: string) => { try { localStorage.setItem(key, value); } catch { /* private mode */ } };

const CATEGORY_STYLE: Record<CommentCategory, string> = {
  'Research Discussion': 'bg-purple-500/20 text-purple-500 border border-purple-500/30',
  'Dialect Inquiry': 'bg-cyan-500/20 text-cyan-600 border border-cyan-500/30',
  'Feature Request': 'bg-amber-500/20 text-amber-600 border border-amber-500/30',
  'General Feedback': 'bg-emerald-500/20 text-emerald-600 border border-emerald-500/30',
};

/** "14 Nov 2026, 9:27 PM · 5 hours ago", or the old time-of-day label when no date was recorded. */
const When: React.FC<{ ms: number; legacy: string; className?: string }> = ({ ms, legacy, className }) => {
  if (!ms) return <span className={className}>{legacy ? `${legacy} · date not recorded` : ''}</span>;
  const rel = formatRelative(ms);
  return (
    <time className={className} dateTime={new Date(ms).toISOString()} title={new Date(ms).toISOString()}>
      {formatAbsolute(ms)}{rel ? ` · ${rel}` : ''}
    </time>
  );
};

interface Target { commentId: string; replyId?: string; replyToName: string }

export const CommentsPanel: React.FC<{ isDark: boolean }> = ({ isDark }) => {
  const { isAdmin } = useAdmin();
  const [comments, setComments] = useState<CommentItem[] | null>(null);
  const [replies, setReplies] = useState<ReplyItem[]>([]);
  const [settings, setSettings] = useState<Settings>({ commentsOpen: true });
  const [loadError, setLoadError] = useState<string | null>(null);
  const [notice, setNotice] = useState<{ kind: 'ok' | 'error'; text: string } | null>(null);
  const [upvoted, setUpvoted] = useState<Set<string>>(() => new Set(readStore(VOTES_KEY).split(',').filter(Boolean)));
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [lastPostAt, setLastPostAt] = useState(0);

  useEffect(() => {
    const offC = subscribeComments((items) => { setComments(items); setLoadError(null); }, (e) => setLoadError(describeFirebaseError(e)));
    const offR = subscribeReplies(setReplies, (e) => setLoadError(describeFirebaseError(e)));
    const offS = subscribeSettings(setSettings);
    return () => { offC(); offR(); offS(); };
  }, []);

  const [myUid, setMyUid] = useState<string | undefined>(auth.currentUser?.uid);
  useEffect(() => onAuthStateChanged(auth, (u) => setMyUid(u?.uid)), []);
  const repliesByComment = useMemo(() => {
    const map = new Map<string, ReplyItem[]>();
    replies.forEach((r) => map.set(r.commentId, [...(map.get(r.commentId) ?? []), r]));
    return map;
  }, [replies]);

  const flash = (kind: 'ok' | 'error', text: string) => {
    setNotice({ kind, text });
    window.setTimeout(() => setNotice(null), 6000);
  };

  const waitMessage = (): string | null => {
    const left = COOLDOWN_MS - (Date.now() - lastPostAt);
    return left > 0 && !isAdmin ? `Please wait ${Math.ceil(left / 1000)} seconds before posting again.` : null;
  };

  const card = isDark ? 'bg-slate-950 border-slate-800' : 'bg-[#F2F5F0] border-[#C5CEC8]';
  const inner = isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-[#C5CEC8]';
  const field = `w-full min-w-0 p-2.5 rounded-[4px] border font-mono text-xs ${isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-[#C5CEC8] text-[#17262A]'}`;
  const muted = isDark ? 'text-[#9DB0AE]' : 'text-[#516064]';
  const ghostBtn = `px-3 py-1.5 rounded-[4px] font-mono text-xs transition cursor-pointer border ${isDark ? 'bg-slate-900 border-slate-800 hover:bg-slate-800 text-cyan-400' : 'bg-white border-[#C5CEC8] hover:bg-[#E1E6E0] text-cyan-700'}`;
  const paused = !settings.commentsOpen && !isAdmin;

  // ---- new comment ------------------------------------------------------
  const [author, setAuthor] = useState(() => readStore(NAME_KEY));
  const [affiliation, setAffiliation] = useState('');
  const [category, setCategory] = useState<CommentCategory>('General Feedback');
  const [text, setText] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [posting, setPosting] = useState(false);

  const submitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (honeypot) return;
    if (!cleanText(author) || !cleanText(text)) return;
    const wait = waitMessage();
    if (wait) { flash('error', wait); return; }
    setPosting(true);
    try {
      await addComment({ author, affiliation, category, text }, isAdmin);
      writeStore(NAME_KEY, cleanText(author));
      setLastPostAt(Date.now());
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
  const [target, setTarget] = useState<Target | null>(null);
  const [replyName, setReplyName] = useState(() => readStore(NAME_KEY));
  const [replyText, setReplyText] = useState('');
  const [replyBusy, setReplyBusy] = useState(false);
  const [replyError, setReplyError] = useState<string | null>(null);

  const openReply = (t: Target) => {
    const same = target && target.commentId === t.commentId && target.replyId === t.replyId;
    setTarget(same ? null : t);
    setReplyText('');
    setReplyError(null);
  };

  const submitReply = async () => {
    if (!target) return;
    const name = isAdmin ? OWNER_NAME : cleanText(replyName);
    if (!name) { setReplyError('Please enter your name.'); return; }
    if (!cleanText(replyText)) { setReplyError('Please write a reply first.'); return; }
    const wait = waitMessage();
    if (wait) { setReplyError(wait); return; }
    setReplyBusy(true);
    setReplyError(null);
    try {
      await addReply({
        commentId: target.commentId,
        parentReplyId: target.replyId,
        replyToName: target.replyId ? target.replyToName : undefined,
        author: name, text: replyText, isOwner: isAdmin,
      }, isAdmin);
      if (!isAdmin) writeStore(NAME_KEY, name);
      setLastPostAt(Date.now());
      setExpanded((p) => new Set(p).add(target.commentId));
      setReplyText('');
      setTarget(null);
      flash('ok', 'Reply posted.');
    } catch (err) {
      setReplyError(`Could not post the reply. ${describeFirebaseError(err)}`);
    } finally {
      setReplyBusy(false);
    }
  };

  // ---- delete / moderation ---------------------------------------------
  const [confirm, setConfirm] = useState<string | null>(null);
  const guarded = (key: string, run: () => Promise<unknown>, done: string) => async () => {
    if (confirm !== key) { setConfirm(key); return; }
    try { await run(); flash('ok', done); } catch (err) { flash('error', describeFirebaseError(err)); }
    setConfirm(null);
  };
  const canDelete = (uid?: string) => isAdmin || (!!uid && uid === myUid);
  const [dateDraft, setDateDraft] = useState<Record<string, string>>({});

  const composer = (commentId: string, replyId?: string) => {
    if (!target || target.commentId !== commentId || target.replyId !== replyId) return null;
    const idBase = `${commentId}-${replyId ?? 'root'}`;
    return (
      <div className={`p-4 rounded-[6px] border space-y-3 ${inner}`}>
        <h5 className="font-mono text-xs font-bold text-cyan-500 break-words">
          {isAdmin ? `Replying to ${target.replyToName} as ${OWNER_NAME} (Author)` : `Replying to ${target.replyToName}`}
        </h5>
        {!isAdmin && (
          <div>
            <label htmlFor={`rn-${idBase}`} className="block text-xs font-mono mb-1">Your name *</label>
            <input id={`rn-${idBase}`} className={field} maxLength={100} value={replyName} onChange={(e) => setReplyName(e.target.value)} placeholder="Your name" />
          </div>
        )}
        <div>
          <label htmlFor={`rt-${idBase}`} className="block text-xs font-mono mb-1">Your reply *</label>
          <textarea id={`rt-${idBase}`} className={`${field} font-serif text-sm`} rows={3} maxLength={2000} autoFocus value={replyText} onChange={(e) => setReplyText(e.target.value)} placeholder="Write your reply…" />
        </div>
        {replyError && <div role="alert" className="text-xs font-mono text-red-500">{replyError}</div>}
        <div className="flex flex-wrap justify-end gap-2">
          <button type="button" onClick={() => setTarget(null)} className="px-3 py-1.5 rounded-[4px] font-mono text-xs text-slate-400 hover:text-slate-200 transition cursor-pointer">Cancel</button>
          <button type="button" disabled={replyBusy} onClick={submitReply} className="px-4 py-1.5 rounded-[4px] bg-cyan-400 hover:bg-cyan-500 disabled:opacity-60 text-slate-950 font-mono text-xs font-bold transition cursor-pointer">
            {replyBusy ? 'Posting…' : 'Post reply →'}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className={`p-4 sm:p-8 rounded-[8px] border space-y-6 min-w-0 ${isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-[#C5CEC8] shadow-sm'}`}>
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-inherit">
        <div className="min-w-0">
          <h3 className="font-serif text-2xl font-semibold">Community Comments &amp; Research Discussion</h3>
          <p className={`text-xs mt-1 ${muted}`}>
            Ask questions about the Tigrinya Dialect Identification benchmark or share observations. Anyone can comment, reply to a comment, or reply to another reply.
          </p>
        </div>
        <AdminChip isDark={isDark} />
      </div>

      {isAdmin && (
        <div className={`p-3 rounded-[6px] border flex flex-col sm:flex-row sm:items-center justify-between gap-2 ${card}`}>
          <span className="font-mono text-xs flex items-center gap-2"><ShieldAlert className="w-4 h-4 text-amber-500 shrink-0" />
            {settings.commentsOpen ? 'Posting is open to visitors.' : 'Posting is paused for visitors.'}
          </span>
          <button type="button" className={ghostBtn}
            onClick={async () => { try { await setCommentsOpen(!settings.commentsOpen); } catch (e) { flash('error', describeFirebaseError(e)); } }}>
            {settings.commentsOpen ? 'Pause all new comments, replies and reports' : 'Resume posting'}
          </button>
        </div>
      )}

      {paused && (
        <div role="status" className="p-3 rounded-[4px] border border-amber-500/40 bg-amber-500/10 text-amber-600 font-mono text-xs">
          New comments and replies are temporarily paused. You can still read the discussion.
        </div>
      )}
      {notice && (
        <div role="status" className={`p-3 rounded-[4px] border font-mono text-xs break-words ${notice.kind === 'ok' ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-600' : 'bg-red-500/15 border-red-500/40 text-red-500'}`}>{notice.text}</div>
      )}
      {loadError && (
        <div role="alert" className="p-3 rounded-[4px] border border-red-500/40 bg-red-500/10 text-red-500 font-mono text-xs">Comments could not be loaded. {loadError}</div>
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
        <input tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} name="website" />
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className={`text-[11px] font-mono ${muted}`}>Links are shown as plain text. Please keep the discussion respectful.</span>
          <button type="submit" disabled={posting || paused} className="px-5 py-2.5 rounded-[4px] bg-cyan-400 hover:bg-cyan-500 disabled:opacity-60 text-slate-950 font-mono text-xs font-bold transition cursor-pointer">
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
          <div className={`p-6 rounded-[6px] border text-center space-y-2 ${card}`}>
            <MessageSquare className="w-6 h-6 mx-auto text-cyan-400" />
            <p className={`font-mono text-xs ${muted}`}>No comments yet. Be the first to start the discussion.</p>
          </div>
        )}

        {comments?.map((c) => {
          const thread = [
            ...c.legacyReplies.map((r) => ({ id: `legacy-${r.id}`, author: r.author, text: r.text, isOwner: /asfaw/i.test(r.author), ms: 0, legacy: r.timestamp, replyToName: undefined as string | undefined, authorUid: undefined as string | undefined, real: false })),
            ...(repliesByComment.get(c.id) ?? []).map((r) => ({ id: r.id, author: r.author, text: r.text, isOwner: r.isOwner, ms: r.createdAtMs, legacy: r.timestampLabel, replyToName: r.replyToName, authorUid: r.authorUid, real: true })),
          ];
          const showAll = expanded.has(c.id) || thread.length <= VISIBLE_REPLIES;
          const shown = showAll ? thread : thread.slice(-VISIBLE_REPLIES);

          return (
            <article key={c.id} className={`p-4 sm:p-5 rounded-[6px] border space-y-3 min-w-0 ${card}`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono">
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1 min-w-0">
                  <span className="font-bold text-cyan-500 text-sm break-words">{c.author}</span>
                  {c.affiliation && <span className={`px-2 py-0.5 rounded-[3px] text-[10px] ${isDark ? 'bg-white/5 text-[#9DB0AE]' : 'bg-black/5 text-[#516064]'}`}>{c.affiliation}</span>}
                  <When ms={c.createdAtMs} legacy={c.timestampLabel} className={muted} />
                </div>
                <span className={`self-start sm:self-auto px-2.5 py-0.5 rounded-[4px] font-bold text-[10px] ${CATEGORY_STYLE[c.category] ?? CATEGORY_STYLE['General Feedback']}`}>{c.category}</span>
              </div>

              {isAdmin && !c.createdAtMs && (
                <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono">
                  <label htmlFor={`dt-${c.id}`} className={muted}>Set the real date:</label>
                  <input id={`dt-${c.id}`} type="datetime-local" className={`${field} !w-auto`} value={dateDraft[c.id] ?? ''} onChange={(e) => setDateDraft((p) => ({ ...p, [c.id]: e.target.value }))} />
                  <button type="button" className={ghostBtn} disabled={!dateDraft[c.id]}
                    onClick={async () => { try { await setCommentDate(c.id, new Date(dateDraft[c.id]).getTime()); flash('ok', 'Date saved.'); } catch (e) { flash('error', describeFirebaseError(e)); } }}>Save date</button>
                </div>
              )}

              <p className={`font-serif text-sm leading-relaxed break-words whitespace-pre-wrap ${isDark ? 'text-[#E6ECE8]' : 'text-[#17262A]'}`}>{c.text}</p>

              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-inherit">
                <button type="button" disabled={paused} onClick={() => openReply({ commentId: c.id, replyToName: c.author })} className={`${ghostBtn} disabled:opacity-60`}>
                  {target?.commentId === c.id && !target.replyId ? 'Cancel reply' : '💬 Reply'}
                </button>
                <div className="flex flex-wrap items-center gap-2">
                  {isAdmin && c.authorUid && (
                    <button type="button" onClick={guarded(`b:${c.id}`, () => blockAuthor(c.authorUid!), 'This browser can no longer post.')} className="px-3 py-1.5 rounded-[4px] border border-amber-500/40 text-amber-600 font-mono text-xs cursor-pointer">
                      {confirm === `b:${c.id}` ? 'Confirm block' : 'Block author'}
                    </button>
                  )}
                  {canDelete(c.authorUid) && (
                    <button type="button" onClick={guarded(`c:${c.id}`, () => deleteComment(c.id), 'Comment deleted.')} className="px-3 py-1.5 rounded-[4px] border border-red-500/40 text-red-500 font-mono text-xs cursor-pointer inline-flex items-center gap-1">
                      <Trash2 className="w-3 h-3" />{confirm === `c:${c.id}` ? 'Confirm delete' : 'Delete'}
                    </button>
                  )}
                  <button type="button" onClick={() => vote(c.id)} disabled={upvoted.has(c.id)} className={`${ghostBtn} inline-flex items-center gap-1.5 disabled:opacity-60 disabled:cursor-default`}>
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span>{upvoted.has(c.id) ? 'Thanks' : 'Helpful'}</span>
                    <span className="font-bold">{c.upvotes}</span>
                  </button>
                </div>
              </div>

              {composer(c.id, undefined)}

              {thread.length > 0 && (
                <div className="pl-3 sm:pl-5 border-l-2 border-cyan-500/40 space-y-2 pt-1">
                  {!showAll && (
                    <button type="button" className="text-[11px] font-mono text-cyan-500 hover:underline cursor-pointer"
                      onClick={() => setExpanded((p) => new Set(p).add(c.id))}>
                      View all {thread.length} replies
                    </button>
                  )}
                  {shown.map((r) => (
                    <div key={r.id} className="space-y-2">
                      <div className={`p-3 rounded-[4px] border text-xs space-y-1 ${inner}`}>
                        <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1 font-mono">
                          <span className="flex flex-wrap items-center gap-2 min-w-0">
                            <span className="font-bold text-cyan-500 break-words">{r.author}</span>
                            {r.isOwner && <span className="px-1.5 py-0.5 rounded bg-cyan-400 text-slate-950 text-[10px] font-bold">Author</span>}
                            {r.replyToName && <span className={`inline-flex items-center gap-1 ${muted}`}><CornerDownRight className="w-3 h-3" />{r.replyToName}</span>}
                          </span>
                          <When ms={r.ms} legacy={r.legacy} className={muted} />
                        </div>
                        <div className="font-serif text-sm break-words whitespace-pre-wrap">{r.text}</div>
                        {r.real && (
                          <div className="flex flex-wrap items-center gap-3 pt-1 font-mono text-[11px]">
                            <button type="button" disabled={paused} className="text-cyan-500 hover:underline cursor-pointer disabled:opacity-60"
                              onClick={() => openReply({ commentId: c.id, replyId: r.id, replyToName: r.author })}>
                              {target?.replyId === r.id ? 'Cancel' : 'Reply'}
                            </button>
                            {canDelete(r.authorUid) && (
                              <button type="button" className="text-red-500 hover:underline cursor-pointer inline-flex items-center gap-1"
                                onClick={guarded(`r:${r.id}`, () => deleteReply(r.id), 'Reply deleted.')}>
                                <Trash2 className="w-3 h-3" />{confirm === `r:${r.id}` ? 'Confirm delete' : 'Delete'}
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                      {composer(c.id, r.id)}
                    </div>
                  ))}
                </div>
              )}
            </article>
          );
        })}
      </div>
    </div>
  );
};
