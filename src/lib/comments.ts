import {
  addDoc, collection, deleteDoc, doc, increment, onSnapshot,
  query, serverTimestamp, setDoc, Timestamp, updateDoc, where, getDocs, writeBatch,
} from 'firebase/firestore';
import { confirmed, db } from './firebase';

export const OWNER_NAME = 'Asfaw Gedamu';

export type CommentCategory = 'General Feedback' | 'Dialect Inquiry' | 'Research Discussion' | 'Feature Request';

export interface LegacyReply { id: string; author: string; text: string; timestamp: string }

export interface CommentItem {
  id: string;
  author: string;
  affiliation?: string;
  category: CommentCategory;
  text: string;
  upvotes: number;
  createdAtMs: number;      // 0 when the document predates createdAt
  timestampLabel: string;   // legacy display string
  legacyReplies: LegacyReply[];
}

export interface ReplyItem {
  id: string;
  commentId: string;
  author: string;
  text: string;
  isOwner: boolean;
  createdAtMs: number;
  timestampLabel: string;
}

const toMs = (v: unknown): number => (v instanceof Timestamp ? v.toMillis() : 0);

export function formatWhen(ms: number, fallback: string): string {
  if (!ms) return fallback;
  const diff = Date.now() - ms;
  const min = Math.floor(diff / 60000);
  if (min < 1) return 'just now';
  if (min < 60) return `${min} min ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr} hour${hr === 1 ? '' : 's'} ago`;
  const day = Math.floor(hr / 24);
  if (day < 7) return `${day} day${day === 1 ? '' : 's'} ago`;
  return new Date(ms).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

export function subscribeComments(onData: (items: CommentItem[]) => void, onError: (e: unknown) => void) {
  return onSnapshot(query(collection(db, 'comments')), (snap) => {
    const items: CommentItem[] = snap.docs.map((d) => {
      const x = d.data() as Record<string, any>;
      return {
        id: d.id,
        author: x.author ?? 'Anonymous',
        affiliation: x.affiliation || undefined,
        category: x.category ?? 'General Feedback',
        text: x.text ?? '',
        upvotes: Number(x.upvotes ?? 0),
        createdAtMs: toMs(x.createdAt),
        timestampLabel: x.timestamp ?? '',
        legacyReplies: Array.isArray(x.replies) ? x.replies : [],
      };
    });
    items.sort((a, b) => b.createdAtMs - a.createdAtMs);
    onData(items);
  }, onError);
}

export function subscribeReplies(onData: (items: ReplyItem[]) => void, onError: (e: unknown) => void) {
  return onSnapshot(query(collection(db, 'replies')), (snap) => {
    const items: ReplyItem[] = snap.docs.map((d) => {
      const x = d.data() as Record<string, any>;
      return {
        id: d.id,
        commentId: x.commentId,
        author: x.author ?? 'Anonymous',
        text: x.text ?? '',
        isOwner: x.isOwner === true,
        createdAtMs: toMs(x.createdAt),
        timestampLabel: x.timestamp ?? '',
      };
    });
    items.sort((a, b) => a.createdAtMs - b.createdAtMs);
    onData(items);
  }, onError);
}

export async function addComment(input: {
  author: string; affiliation: string; category: CommentCategory; text: string;
}) {
  const data: Record<string, unknown> = {
    author: input.author.trim(),
    category: input.category,
    text: input.text.trim(),
    upvotes: 0,
    createdAt: serverTimestamp(),
  };
  if (input.affiliation.trim()) data.affiliation = input.affiliation.trim();
  await confirmed(addDoc(collection(db, 'comments'), data));
}

export async function addReply(input: { commentId: string; author: string; text: string; isOwner: boolean }) {
  await confirmed(addDoc(collection(db, 'replies'), {
    commentId: input.commentId,
    author: input.author.trim(),
    text: input.text.trim(),
    isOwner: input.isOwner,
    createdAt: serverTimestamp(),
  }));
}

export async function upvoteComment(id: string) {
  await confirmed(updateDoc(doc(db, 'comments', id), { upvotes: increment(1) }));
}

export async function deleteComment(id: string) {
  // Remove the comment and every reply attached to it.
  const replies = await getDocs(query(collection(db, 'replies'), where('commentId', '==', id)));
  const batch = writeBatch(db);
  replies.forEach((r) => batch.delete(r.ref));
  batch.delete(doc(db, 'comments', id));
  await confirmed(batch.commit());
}

export async function deleteReply(id: string) {
  await confirmed(deleteDoc(doc(db, 'replies', id)));
}

/** The two example comments that used to be hard-coded in the page. Admin can publish them once. */
export async function importFeaturedComments() {
  const now = Date.now();
  const seeds = [
    {
      id: 'featured-samuel-k',
      author: 'Dr. Samuel K.',
      affiliation: 'Addis Ababa University',
      category: 'Research Discussion',
      text: 'The 92.98% accuracy on Tigrinya dialect identification using character CNNs is very impressive. How does the model handle code-switching between Tigrinya and Amharic in border regions?',
      upvotes: 14,
      createdAt: Timestamp.fromMillis(now - 2 * 3600 * 1000),
    },
    {
      id: 'featured-bethlehem-t',
      author: 'Bethlehem T.',
      affiliation: 'Mekelle Linguistic Researcher',
      category: 'Dialect Inquiry',
      text: 'Great to see Enderta (Variety L) and Rayya (Variety D) explicitly distinguished with prefix rules (ል/ለ vs ድ/ደ). This is extremely helpful for regional NLP corpus curation.',
      upvotes: 9,
      createdAt: Timestamp.fromMillis(now - 26 * 3600 * 1000),
    },
  ];
  for (const { id, ...data } of seeds) {
    await confirmed(setDoc(doc(db, 'comments', id), data));
  }
}
