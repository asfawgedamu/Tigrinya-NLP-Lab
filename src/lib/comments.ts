import {
  collection, deleteDoc, doc, onSnapshot, query, limit, serverTimestamp, setDoc, Timestamp, updateDoc, writeBatch,
  increment,
} from 'firebase/firestore';
import { cleanText, confirmed, db, ensureVisitor } from './firebase';

export const OWNER_NAME = 'Asfaw Gedamu';
const MAX_COMMENTS = 500;
const MAX_REPLIES = 2000;

export type CommentCategory = 'General Feedback' | 'Dialect Inquiry' | 'Research Discussion' | 'Feature Request';

export interface LegacyReply { id: string; author: string; text: string; timestamp: string }

export interface CommentItem {
  id: string;
  author: string;
  affiliation?: string;
  category: CommentCategory;
  text: string;
  upvotes: number;
  authorUid?: string;
  createdAtMs: number;      // 0 for older comments that only stored a time of day
  timestampLabel: string;   // that older time-of-day string, if any
  legacyReplies: LegacyReply[];
}

export interface ReplyItem {
  id: string;
  commentId: string;
  parentReplyId?: string;
  replyToName?: string;
  author: string;
  text: string;
  isOwner: boolean;
  authorUid?: string;
  createdAtMs: number;
  timestampLabel: string;
}

export interface Settings { commentsOpen: boolean }

const toMs = (v: unknown): number => (v instanceof Timestamp ? v.toMillis() : 0);

export function formatRelative(ms: number): string {
  const min = Math.floor((Date.now() - ms) / 60000);
  if (min < 1) return 'just now';
  if (min < 60) return `${min} min ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr} hour${hr === 1 ? '' : 's'} ago`;
  const day = Math.floor(hr / 24);
  if (day < 7) return `${day} day${day === 1 ? '' : 's'} ago`;
  return '';
}

export function formatAbsolute(ms: number): string {
  return new Date(ms).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });
}

export function subscribeComments(onData: (items: CommentItem[]) => void, onError: (e: unknown) => void) {
  return onSnapshot(query(collection(db, 'comments'), limit(MAX_COMMENTS)), (snap) => {
    const items: CommentItem[] = snap.docs.map((d) => {
      const x = d.data({ serverTimestamps: 'estimate' }) as Record<string, any>;
      return {
        id: d.id,
        author: x.author ?? 'Anonymous',
        affiliation: x.affiliation || undefined,
        category: x.category ?? 'General Feedback',
        text: x.text ?? '',
        upvotes: Number(x.upvotes ?? 0),
        authorUid: x.authorUid,
        createdAtMs: toMs(x.createdAt),
        timestampLabel: x.timestamp ?? '',
        legacyReplies: Array.isArray(x.replies) ? x.replies : [],
      };
    });
    // Newest first; comments without a recorded date go last.
    items.sort((a, b) => b.createdAtMs - a.createdAtMs);
    onData(items);
  }, onError);
}

export function subscribeReplies(onData: (items: ReplyItem[]) => void, onError: (e: unknown) => void) {
  return onSnapshot(query(collection(db, 'replies'), limit(MAX_REPLIES)), (snap) => {
    const items: ReplyItem[] = snap.docs.map((d) => {
      const x = d.data({ serverTimestamps: 'estimate' }) as Record<string, any>;
      return {
        id: d.id,
        commentId: x.commentId,
        parentReplyId: x.parentReplyId || undefined,
        replyToName: x.replyToName || undefined,
        author: x.author ?? 'Anonymous',
        text: x.text ?? '',
        isOwner: x.isOwner === true,
        authorUid: x.authorUid,
        createdAtMs: toMs(x.createdAt),
        timestampLabel: x.timestamp ?? '',
      };
    });
    items.sort((a, b) => a.createdAtMs - b.createdAtMs);
    onData(items);
  }, onError);
}

export function subscribeSettings(onData: (s: Settings) => void) {
  return onSnapshot(doc(db, 'settings', 'public'), (snap) => {
    onData({ commentsOpen: snap.exists() ? snap.data().commentsOpen !== false : true });
  }, () => onData({ commentsOpen: true }));
}

/** A batch that also stamps the per-browser rate-limit document (skipped for the admin). */
async function throttledBatch(isAdmin: boolean) {
  const user = await ensureVisitor();
  const batch = writeBatch(db);
  if (!isAdmin) batch.set(doc(db, 'limits', user.uid), { lastWriteAt: serverTimestamp() });
  return { batch, uid: user.uid };
}

export async function addComment(
  input: { author: string; affiliation: string; category: CommentCategory; text: string },
  isAdmin: boolean,
) {
  const { batch, uid } = await throttledBatch(isAdmin);
  const data: Record<string, unknown> = {
    author: cleanText(input.author),
    category: input.category,
    text: cleanText(input.text),
    upvotes: 0,
    authorUid: uid,
    createdAt: serverTimestamp(),
  };
  const affiliation = cleanText(input.affiliation);
  if (affiliation) data.affiliation = affiliation;
  batch.set(doc(collection(db, 'comments')), data);
  await confirmed(batch.commit());
}

export async function addReply(
  input: { commentId: string; parentReplyId?: string; replyToName?: string; author: string; text: string; isOwner: boolean },
  isAdmin: boolean,
) {
  const { batch, uid } = await throttledBatch(isAdmin);
  const data: Record<string, unknown> = {
    commentId: input.commentId,
    author: cleanText(input.author),
    text: cleanText(input.text),
    isOwner: input.isOwner,
    authorUid: uid,
    createdAt: serverTimestamp(),
  };
  if (input.parentReplyId) data.parentReplyId = input.parentReplyId;
  if (input.replyToName) data.replyToName = cleanText(input.replyToName).slice(0, 100);
  batch.set(doc(collection(db, 'replies')), data);
  await confirmed(batch.commit());
}

/** One vote per browser: the vote marker and the counter change together or not at all. */
export async function upvoteComment(id: string) {
  const user = await ensureVisitor();
  const batch = writeBatch(db);
  batch.set(doc(db, 'comments', id, 'votes', user.uid), { createdAt: serverTimestamp() });
  batch.update(doc(db, 'comments', id), { upvotes: increment(1) });
  await confirmed(batch.commit());
}

export const deleteComment = (id: string) => confirmed(deleteDoc(doc(db, 'comments', id)));
export const deleteReply = (id: string) => confirmed(deleteDoc(doc(db, 'replies', id)));

/** Admin: block a browser identity from posting. */
export const blockAuthor = (uid: string) => confirmed(setDoc(doc(db, 'blocked', uid), { createdAt: serverTimestamp() }));

/** Admin: pause or resume new comments, replies and reports for everyone. */
export const setCommentsOpen = (open: boolean) =>
  confirmed(setDoc(doc(db, 'settings', 'public'), { commentsOpen: open }));

/** Admin: record the real date for a comment that was saved before dates were stored. */
export const setCommentDate = (id: string, ms: number) =>
  confirmed(updateDoc(doc(db, 'comments', id), { createdAt: Timestamp.fromMillis(ms) }));
