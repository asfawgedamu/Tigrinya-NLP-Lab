import { useEffect, useState } from 'react';
import {
  collection, deleteDoc, doc, onSnapshot, query, serverTimestamp, Timestamp, updateDoc, writeBatch, limit,
} from 'firebase/firestore';
import { cleanText, confirmed, db, ensureVisitor } from './firebase';

export type ReportStatus = 'Pending Validation' | 'Approved' | 'Rejected';

export interface MisclassificationReport {
  id: string;
  text: string;
  predicted: string;
  errorType: string;
  correct: string;
  notes: string;
  timestamp: string;
  createdAtMs: number;
  status: ReportStatus;
  moderatorComment?: string;
}

export async function submitReport(input: {
  text: string; predicted: string; errorType: string; correct: string; notes: string;
}, isAdmin = false) {
  const user = await ensureVisitor();
  const batch = writeBatch(db);
  if (!isAdmin) batch.set(doc(db, 'limits', user.uid), { lastWriteAt: serverTimestamp() });
  batch.set(doc(collection(db, 'feedbackSubmissions')), {
    text: cleanText(input.text).slice(0, 2000),
    predicted: input.predicted.slice(0, 100),
    errorType: input.errorType.slice(0, 100),
    correct: input.correct.slice(0, 100),
    notes: (cleanText(input.notes) || 'No explanatory notes provided').slice(0, 1000),
    timestamp: new Date().toLocaleString().slice(0, 100),
    createdAt: serverTimestamp(),
    authorUid: user.uid,
    status: 'Pending Validation',
  });
  await confirmed(batch.commit());
}

export async function reviewReport(id: string, status: 'Approved' | 'Rejected', moderatorComment: string) {
  await confirmed(updateDoc(doc(db, 'feedbackSubmissions', id), { status, moderatorComment: moderatorComment.slice(0, 1000) }));
}

export async function deleteReport(id: string) {
  await confirmed(deleteDoc(doc(db, 'feedbackSubmissions', id)));
}

/** Live list of reports. Only the admin account can read them (enforced by firestore.rules). */
export function useReports(enabled: boolean) {
  const [reports, setReports] = useState<MisclassificationReport[]>([]);
  const [error, setError] = useState<unknown>(null);

  useEffect(() => {
    if (!enabled) { setReports([]); setError(null); return; }
    return onSnapshot(query(collection(db, 'feedbackSubmissions'), limit(500)), (snap) => {
      const items = snap.docs.map((d) => {
        const x = d.data() as Record<string, any>;
        return {
          id: d.id,
          text: x.text ?? '',
          predicted: x.predicted ?? '',
          errorType: x.errorType ?? '',
          correct: x.correct ?? '',
          notes: x.notes ?? '',
          timestamp: x.timestamp ?? '',
          createdAtMs: x.createdAt instanceof Timestamp ? x.createdAt.toMillis() : 0,
          status: (x.status ?? 'Pending Validation') as ReportStatus,
          moderatorComment: x.moderatorComment,
        } as MisclassificationReport;
      });
      items.sort((a, b) => b.createdAtMs - a.createdAtMs);
      setReports(items);
      setError(null);
    }, (e) => setError(e));
  }, [enabled]);

  return { reports, error };
}
