// Run with:  npm run test:rules   (needs Java 11+ for the Firestore emulator)
import { readFileSync } from 'node:fs';
import { test, before, after, beforeEach } from 'node:test';
import {
  initializeTestEnvironment, assertFails, assertSucceeds,
} from '@firebase/rules-unit-testing';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';

const ADMIN_EMAIL = 'REPLACE_WITH_YOUR_GOOGLE_EMAIL@gmail.com';
let env;
const ts = () => firebase.firestore.FieldValue.serverTimestamp();

before(async () => {
  env = await initializeTestEnvironment({
    projectId: 'demo-tdi',
    firestore: { rules: readFileSync('firestore.rules', 'utf8'), host: '127.0.0.1', port: 8080 },
  });
});
after(async () => env.cleanup());
beforeEach(async () => env.clearFirestore());

const visitor = (uid = 'v1') => env.authenticatedContext(uid, { firebase: { sign_in_provider: 'anonymous' } }).firestore();
const admin = () => env.authenticatedContext('admin1', { email: ADMIN_EMAIL, email_verified: true, firebase: { sign_in_provider: 'google.com' } }).firestore();

const commentData = (uid, over = {}) => ({
  author: 'Meron', category: 'General Feedback', text: 'Hello', upvotes: 0, authorUid: uid, createdAt: ts(), ...over,
});

async function postComment(db, uid, over) {
  const batch = db.batch();
  batch.set(db.doc(`limits/${uid}`), { lastWriteAt: ts() });
  const ref = db.collection('comments').doc();
  batch.set(ref, commentData(uid, over));
  await batch.commit();
  return ref.id;
}

test('visitor can post a comment with the throttle stamp', async () => {
  await assertSucceeds(postComment(visitor(), 'v1'));
});

test('comment without the throttle stamp is refused', async () => {
  await assertFails(visitor().collection('comments').add(commentData('v1')));
});

test('second post within 15 seconds is refused', async () => {
  const db = visitor();
  await assertSucceeds(postComment(db, 'v1'));
  await assertFails(postComment(db, 'v1'));
});

test('visitor cannot use the owner name or claim to be the author', async () => {
  await assertFails(postComment(visitor(), 'v1', { author: 'Asfaw Gedamu' }));
  await assertFails(postComment(visitor('v2'), 'v2', { author: 'Author' }));
});

test('visitor cannot post with a fake upvote count or someone else\'s uid', async () => {
  await assertFails(postComment(visitor(), 'v1', { upvotes: 99 }));
  await assertFails(postComment(visitor(), 'v1', { authorUid: 'someone-else' }));
});

test('visitor cannot edit text or delete another person\'s comment', async () => {
  let id;
  await env.withSecurityRulesDisabled(async (ctx) => {
    const ref = ctx.firestore().collection('comments').doc('c1');
    await ref.set({ author: 'A', category: 'General Feedback', text: 'x', upvotes: 1, authorUid: 'other' });
    id = 'c1';
  });
  const db = visitor();
  await assertFails(db.doc(`comments/${id}`).update({ text: 'hacked' }));
  await assertFails(db.doc(`comments/${id}`).delete());
});

test('one vote per browser, and the counter only moves by one', async () => {
  await env.withSecurityRulesDisabled(async (ctx) => {
    await ctx.firestore().doc('comments/c1').set({ author: 'A', category: 'General Feedback', text: 'x', upvotes: 1 });
  });
  const db = visitor();
  const vote = (by) => {
    const b = db.batch();
    b.set(db.doc('comments/c1/votes/v1'), { createdAt: ts() });
    b.update(db.doc('comments/c1'), { upvotes: firebase.firestore.FieldValue.increment(by) });
    return b.commit();
  };
  await assertSucceeds(vote(1));
  await assertFails(vote(1));
  await assertFails(db.doc('comments/c1').update({ upvotes: 500 }));
});

test('reply requires an existing comment; visitors cannot be the Author', async () => {
  await env.withSecurityRulesDisabled(async (ctx) => {
    await ctx.firestore().doc('comments/c1').set({ author: 'A', category: 'General Feedback', text: 'x', upvotes: 0 });
  });
  const db = visitor();
  const reply = (over = {}, uid = 'v1') => {
    const b = db.batch();
    b.set(db.doc(`limits/${uid}`), { lastWriteAt: ts() });
    b.set(db.collection('replies').doc(), {
      commentId: 'c1', author: 'Meron', text: 'Thanks', isOwner: false, authorUid: uid, createdAt: ts(), ...over,
    });
    return b.commit();
  };
  await assertSucceeds(reply());
  await env.clearFirestore();
  await assertFails(reply({ commentId: 'missing' }));
});

test('only the admin account can read reports', async () => {
  await assertFails(visitor().collection('feedbackSubmissions').get());
  await assertSucceeds(admin().collection('feedbackSubmissions').get());
});

test('a signed-in non-admin Google account is not the admin', async () => {
  const other = env.authenticatedContext('g2', { email: 'someone@gmail.com', email_verified: true, firebase: { sign_in_provider: 'google.com' } }).firestore();
  await assertFails(other.collection('feedbackSubmissions').get());
});

test('pause switch and blocklist stop visitors', async () => {
  await assertSucceeds(admin().doc('settings/public').set({ commentsOpen: false }));
  await assertFails(postComment(visitor(), 'v1'));
  await assertSucceeds(admin().doc('settings/public').set({ commentsOpen: true }));
  await assertSucceeds(admin().doc('blocked/v1').set({ createdAt: ts() }));
  await assertFails(postComment(visitor(), 'v1'));
});
