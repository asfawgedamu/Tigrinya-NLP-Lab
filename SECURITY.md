# Security

## Reporting a problem
Please report vulnerabilities privately through GitHub: **Security → Report a vulnerability** on this repository.
Do not post them as public issues or comments.

## What protects this site
| Risk | Protection |
| --- | --- |
| Someone edits or deletes other people's comments | Firestore rules allow only: new posts, +1 vote, deleting your own post. Everything else is admin-only. |
| Someone pretends to be the author | Only your verified Google account can create "Author" replies. Visitors cannot use the names "Asfaw Gedamu", "Author", "Admin", "Owner" or "Moderator". |
| Flooding with comments, replies or reports | One post per 15 seconds per browser (enforced by the database, not the page), length limits, hidden honeypot field, and an emergency **Pause posting** switch. |
| A specific abuser keeps coming back | **Block author** stops that browser identity from posting. |
| Vote stuffing | One vote per browser identity, written together with the counter so it cannot be skipped. |
| Scripts posting directly to the database | Firebase App Check (reCAPTCHA v3) once enabled; see README → Security setup. |
| Reading private reports | Reports are readable only by the admin account. |
| Script injection (XSS) | User text is always rendered as plain text. A Content-Security-Policy limits scripts to this site and Google sign-in. Control and direction-override characters are stripped. |
| Stolen admin session | Admin access needs a Google account with 2-Step Verification. No passcodes exist in the code. |
| Vulnerable packages | Dependabot weekly updates and `npm audit` in CI. |

## Known limits
- GitHub Pages cannot send HTTP security headers, so clickjacking protection (`frame-ancestors`) is not available there.
- A determined attacker can create many anonymous identities. App Check, the Pause switch and Block are the countermeasures.
