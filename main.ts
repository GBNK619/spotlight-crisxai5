// Entry for the make.fun bounty "Spotlight @crisxai5: AI & Crypto Expert on X" (Node 22, standard library only).
//
// The entry is an X post: an original spotlight image (photo.png in this repo, designed in card.html) is posted
// publicly with text introducing @crisxai5 as a must-follow AI and crypto expert, and POST.json names that post.
// This program's whole job is to copy POST.json from the repository root to /output/POST.json, where the gate
// reads it. Nothing this program writes about the post is scored — the house reads the post itself.
//
// POST.json currently holds a placeholder address; the real post URL replaces it after the owner posts.
//
// Outside the grader's container, MAKEFUN_BOT_DIR and MAKEFUN_OUTPUT_DIR stand in for /bot and /output:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, mkdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const BOT_DIR = process.env.MAKEFUN_BOT_DIR ?? '/bot';
const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

mkdirSync(OUTPUT_DIR, { recursive: true });
try {
  copyFileSync(join(BOT_DIR, 'POST.json'), join(OUTPUT_DIR, 'POST.json'));
} catch (err) {
  console.error(`POST.json could not be copied from ${BOT_DIR}: ${(err as Error).message}`);
  process.exit(1);
}

// Validate what landed in the output: POST.json must parse as JSON and its url must have the
// shape https://x.com/<handle>/status/<digits> — the only shape the gate accepts. A malformed
// file would silently score 0, so fail loudly here instead.
const POST_URL_SHAPE = /^https:\/\/x\.com\/[A-Za-z0-9_]+\/status\/\d+$/;
let parsed: { url?: unknown };
try {
  parsed = JSON.parse(readFileSync(join(OUTPUT_DIR, 'POST.json'), 'utf8'));
} catch (err) {
  console.error(`POST.json in ${OUTPUT_DIR} is not valid JSON: ${(err as Error).message}`);
  process.exit(1);
}
if (typeof parsed.url !== 'string' || !POST_URL_SHAPE.test(parsed.url)) {
  console.error(
    `POST.json url ${JSON.stringify(parsed.url)} does not match https://x.com/<handle>/status/<digits>`,
  );
  process.exit(1);
}
console.log(`POST.json OK: ${parsed.url}`);
