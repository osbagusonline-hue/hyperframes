#!/usr/bin/env node
// Bundles the parts of packages/core's audioCarve.ts and audioFx.ts that carve.mjs calls into one
// import-free .mjs inside the skill, so carve.mjs needs no @hyperframes/core install.
import { realpathSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const CORE = resolve(here, "../packages/core/src");
const OUTFILE = resolve(here, "../skills/media-use/audio/scripts/lib/audio-carve.mjs");
// scripts/ has no node_modules of its own (bun's per-consumer linking); reach into the one
// package that already depends on esbuild rather than adding a root-level dependency.
const { build } = await import(resolve(here, "../packages/core/node_modules/esbuild/lib/main.js"));

const ENTRY = `
export {
  analyseCarveBands,
  analyseCarveDuck,
  analyseCarveDynamics,
  carveBandsToChain,
  carveProfile,
  classifyAudioName,
  clipsOverlap,
  mixCarveSources,
} from "./audioCarve.ts";
export {
  defaultAudioFxParams,
  mintAudioFxNodeId,
  parseAudioFxChain,
  serializeAudioFxChain,
} from "./audioFx.ts";
`;

const HEADER = `// GENERATED — do not hand-edit. Source: packages/core/src/audioCarve.ts and audioFx.ts, bundled
// by scripts/generate-media-use-audio-carve.mjs. Regenerate: node scripts/generate-media-use-audio-carve.mjs
`;

export async function generate() {
  const result = await build({
    stdin: { contents: ENTRY, resolveDir: CORE, sourcefile: "audio-carve-entry.ts", loader: "ts" },
    bundle: true,
    format: "esm",
    platform: "neutral",
    write: false,
    legalComments: "none",
  });
  return HEADER + result.outputFiles[0].text;
}

if (process.argv[1] && pathToFileURL(realpathSync(process.argv[1])).href === import.meta.url) {
  const code = await generate();
  writeFileSync(OUTFILE, code);
  console.log(`wrote ${OUTFILE} (${code.length} bytes)`);
}
