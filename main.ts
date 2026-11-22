// bring-the-humans-03: TikTok ad entry program (Node 22, standard library only).
//
// The entry is the TikTok video itself. This program only hands the house
// the video's address: it reads VIDEO.json from the repository root, checks
// the address is a real TikTok video URL, and writes it into the output
// directory, where the gate reads it. It touches no network, no clock and
// no file outside the repository, so repeated runs write the same bytes
// every time.
//
// Local run: mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const BOT_DIR = process.env.MAKEFUN_BOT_DIR ?? "/bot";
const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";

// A video's address as TikTok shows it in a browser, id digits only:
// https://www.tiktok.com/@<handle>/video/<id> (tiktok.com or m.tiktok.com).
const VIDEO_URL = /^https:\/\/(?:www\.|m\.)?tiktok\.com\/@[^/]+\/video\/\d+$/;

const raw = readFileSync(join(BOT_DIR, "VIDEO.json"), "utf8");
let url: unknown;
try {
  url = (JSON.parse(raw) as { url?: unknown }).url;
} catch {
  console.error("VIDEO.json is not valid JSON");
  process.exit(1);
}
if (typeof url !== "string" || !VIDEO_URL.test(url)) {
  console.error(
    "VIDEO.json does not name a TikTok video: expected " +
      "https://www.tiktok.com/@<handle>/video/<id>",
  );
  process.exit(1);
}

mkdirSync(OUTPUT_DIR, { recursive: true });
writeFileSync(join(OUTPUT_DIR, "VIDEO.json"), JSON.stringify({ url }) + "\n");
