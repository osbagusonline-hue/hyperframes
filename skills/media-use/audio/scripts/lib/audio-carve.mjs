// GENERATED — do not hand-edit. Source: packages/core/src/audioCarve.ts and audioFx.ts, bundled
// by scripts/generate-media-use-audio-carve.mjs. Regenerate: node scripts/generate-media-use-audio-carve.mjs
// packages/core/src/audioFx.ts
var HF_AUDIO_FX_ATTR = "data-fx-chain";
var HF_AUDIO_FX_DATA_KEY = HF_AUDIO_FX_ATTR.slice("data-".length);
var HF_AUDIO_FX_CHAIN_VERSION = 1;
var freq = (key = "frequency", label = "Frequency", def = 1e3, min = 20, max = 2e4) => ({
  kind: "number",
  key,
  label,
  unit: "Hz",
  min,
  max,
  step: 1,
  default: def,
  scale: "log",
  automatable: true
});
var qParam = (def = 0.707, hint = "Bandwidth: higher is narrower.") => ({
  kind: "number",
  key: "q",
  label: "Q",
  unit: "",
  min: 0.1,
  max: 20,
  step: 0.01,
  default: def,
  scale: "log",
  automatable: true,
  hint
});
var gainDb = (min = -40, max = 40, def = 0) => ({
  kind: "number",
  key: "gain",
  label: "Gain",
  unit: "dB",
  min,
  max,
  step: 0.1,
  default: def,
  automatable: true
});
var poles = {
  kind: "enum",
  key: "poles",
  label: "Slope",
  options: [
    { value: "1", label: "6 dB/oct" },
    { value: "2", label: "12 dB/oct" }
  ],
  default: "2",
  hint: "Two poles is the usual biquad; one pole is gentler."
};
var HF_AUDIO_FX = [
  {
    id: "gain",
    label: "Gain",
    group: "dynamics",
    description: "Raise or lower the whole signal. Automate it to duck under something else.",
    // Cuts go deep, boosts stay modest: this is a level stage for making room,
    // and a chain that can add 40 dB clips long before it is useful.
    params: [gainDb(-60, 12, 0)],
    web: "gain-node"
  },
  {
    id: "peaking",
    label: "Peaking EQ",
    group: "filter",
    description: "Boost or cut a band, leaving everything either side alone.",
    params: [freq("frequency", "Frequency", 1e3), gainDb(-40, 40, 0), qParam(1)],
    web: "biquad-peaking"
  },
  {
    id: "lowshelf",
    label: "Low Shelf",
    group: "filter",
    description: "Lift or drop everything below the corner frequency.",
    // No Q: the Web Audio spec leaves it unused for shelving filters, so the
    // control moved nothing — and being automatable, a lane drawn on it would
    // have been silently inert.
    params: [freq("frequency", "Frequency", 200, 20, 2e3), gainDb(-40, 40, 0)],
    web: "biquad-lowshelf"
  },
  {
    id: "highshelf",
    label: "High Shelf",
    group: "filter",
    description: "Lift or drop everything above the corner frequency.",
    params: [freq("frequency", "Frequency", 4e3, 500, 2e4), gainDb(-40, 40, 0)],
    web: "biquad-highshelf"
  },
  {
    id: "highpass",
    label: "High-pass",
    group: "filter",
    description: "Remove low frequencies: the usual fix for rumble on a voice.",
    params: [freq("frequency", "Cutoff", 300, 20, 2e4), qParam(0.707), poles],
    web: "biquad-highpass"
  },
  {
    id: "lowpass",
    label: "Low-pass",
    group: "filter",
    description: "Remove high frequencies, which darkens or muffles a track.",
    params: [freq("frequency", "Cutoff", 8e3, 100, 2e4), qParam(0.707), poles],
    web: "biquad-lowpass"
  },
  {
    id: "compressor",
    label: "Compressor",
    group: "dynamics",
    description: "Pull loud parts down so the quiet ones can come up.",
    params: [
      {
        kind: "number",
        key: "threshold",
        label: "Threshold",
        unit: "dB",
        min: -60,
        max: 0,
        step: 0.5,
        default: -24,
        hint: "Level above which the compressor starts working."
      },
      {
        kind: "number",
        key: "ratio",
        label: "Ratio",
        unit: ":1",
        min: 1,
        max: 20,
        step: 0.1,
        default: 4
      },
      {
        kind: "number",
        key: "attack",
        label: "Attack",
        unit: "ms",
        min: 0.01,
        max: 2e3,
        step: 0.1,
        default: 20,
        scale: "log"
      },
      {
        kind: "number",
        key: "release",
        label: "Release",
        unit: "ms",
        min: 0.01,
        max: 9e3,
        step: 1,
        default: 250,
        scale: "log"
      },
      {
        kind: "number",
        key: "knee",
        label: "Knee",
        unit: "",
        min: 1,
        max: 8,
        step: 0.01,
        default: 2.83,
        hint: "1 is a hard corner; higher eases into it."
      },
      {
        kind: "number",
        key: "makeup",
        label: "Makeup",
        unit: "dB",
        min: 0,
        max: 36,
        step: 0.1,
        default: 0
      },
      {
        kind: "number",
        key: "mix",
        label: "Mix",
        unit: "",
        min: 0,
        max: 1,
        step: 0.01,
        default: 1,
        hint: "Below 1 blends the dry signal back in."
      }
    ],
    web: "worklet-compressor"
  },
  {
    id: "limiter",
    label: "Limiter",
    group: "dynamics",
    description: "Peak limiter that follows the signal's level. It has no lookahead, so a fast peak or an inter-sample peak can pass the ceiling; use the true-peak limiter for a delivery limit.",
    params: [
      {
        kind: "number",
        key: "limit",
        label: "Ceiling",
        unit: "dB",
        min: -24,
        max: 0,
        step: 0.1,
        default: -1
      },
      {
        kind: "number",
        key: "attack",
        label: "Attack",
        unit: "ms",
        min: 0.1,
        max: 80,
        step: 0.1,
        default: 5
      },
      {
        kind: "number",
        key: "release",
        label: "Release",
        unit: "ms",
        min: 1,
        max: 8e3,
        step: 1,
        default: 50,
        scale: "log"
      },
      {
        kind: "number",
        key: "level_out",
        label: "Output",
        unit: "dB",
        min: -24,
        max: 24,
        step: 0.1,
        default: 0
      }
    ],
    web: "worklet-limiter"
  },
  {
    id: "truepeak",
    label: "True-peak limiter",
    group: "dynamics",
    description: "Lookahead limiter that holds a 4x estimate of the inter-sample peak at a dBTP ceiling; full-band noise can land up to about 1.7 dB above it. Adds lookahead plus about 0.3 ms of latency.",
    params: [
      {
        kind: "number",
        key: "ceiling",
        label: "Ceiling",
        unit: "dBTP",
        min: -24,
        max: 0,
        step: 0.1,
        default: -1,
        hint: "Target true peak, measured on a 4x oversampled signal. Dense full-band sound can end up to about 1.7 dB above it."
      },
      {
        kind: "number",
        key: "lookahead",
        label: "Lookahead",
        unit: "ms",
        min: 0.5,
        max: 10,
        step: 0.1,
        default: 3,
        hint: "How far ahead the gain starts falling. Longer is smoother and adds the same latency."
      },
      {
        kind: "number",
        key: "release",
        label: "Release",
        unit: "ms",
        min: 10,
        max: 2e3,
        step: 1,
        default: 80,
        scale: "log"
      }
    ],
    web: "worklet-truepeak"
  },
  {
    id: "gate",
    label: "Noise Gate",
    group: "dynamics",
    description: "Silence the track when it drops below the threshold.",
    params: [
      {
        kind: "number",
        key: "threshold",
        label: "Threshold",
        unit: "dB",
        min: -80,
        max: 0,
        step: 0.5,
        default: -35
      },
      {
        kind: "number",
        key: "range",
        label: "Range",
        unit: "dB",
        min: -80,
        max: 0,
        step: 0.5,
        default: -24,
        hint: "How far down the gate pulls when closed."
      },
      {
        kind: "number",
        key: "ratio",
        label: "Ratio",
        unit: ":1",
        min: 1,
        max: 20,
        step: 0.1,
        default: 10
      },
      {
        kind: "number",
        key: "attack",
        label: "Attack",
        unit: "ms",
        min: 0.01,
        max: 9e3,
        step: 0.1,
        default: 1,
        scale: "log"
      },
      {
        kind: "number",
        key: "release",
        label: "Release",
        unit: "ms",
        min: 0.01,
        max: 9e3,
        step: 1,
        default: 100,
        scale: "log"
      },
      {
        kind: "number",
        key: "knee",
        label: "Knee",
        unit: "",
        min: 1,
        max: 8,
        step: 0.01,
        default: 2.83
      }
    ],
    web: "worklet-gate"
  },
  {
    id: "saturate",
    label: "Saturation",
    group: "nonlinear",
    description: "Soft-clip the waveform for warmth or outright distortion.",
    params: [
      {
        kind: "enum",
        key: "type",
        label: "Curve",
        options: [
          { value: "tanh", label: "Tanh" },
          { value: "atan", label: "Arctan" },
          { value: "cubic", label: "Cubic" },
          { value: "exp", label: "Exponential" },
          { value: "alg", label: "Algebraic" },
          { value: "quintic", label: "Quintic" },
          { value: "sin", label: "Sine" },
          { value: "erf", label: "Error function" },
          { value: "hard", label: "Hard clip" }
        ],
        default: "tanh"
      },
      {
        kind: "number",
        key: "threshold",
        label: "Threshold",
        unit: "dB",
        min: -40,
        max: 0,
        step: 0.1,
        default: -6
      },
      {
        kind: "number",
        key: "output",
        automatable: true,
        label: "Output",
        unit: "dB",
        min: -24,
        max: 24,
        step: 0.1,
        default: 0
      },
      {
        kind: "number",
        key: "oversample",
        label: "Oversample",
        unit: "x",
        min: 1,
        max: 8,
        step: 1,
        default: 4,
        hint: "Higher costs more but keeps aliasing down."
      }
    ],
    web: "waveshaper"
  },
  {
    id: "bitcrush",
    label: "Bitcrush",
    group: "nonlinear",
    description: "Drop bit depth and sample rate for a lo-fi, digital sound.",
    params: [
      {
        kind: "number",
        key: "bits",
        label: "Bit depth",
        unit: "bit",
        min: 1,
        max: 32,
        step: 0.1,
        default: 8
      },
      {
        kind: "number",
        key: "samples",
        label: "Sample hold",
        unit: "x",
        min: 1,
        max: 250,
        step: 1,
        default: 1,
        hint: "Repeats each sample N times, a crude downsample."
      },
      {
        kind: "number",
        key: "mix",
        label: "Mix",
        unit: "",
        min: 0,
        max: 1,
        step: 0.01,
        default: 1
      }
    ],
    web: "worklet-bitcrush"
  },
  {
    id: "pitchshift",
    label: "Pitch shift",
    group: "time",
    // The granular algorithm reads from a 100 ms grain, so its output runs a
    // constant ~50 ms behind its input and nothing in the graph subtracts that
    // — there is no latency/pre-roll concept here yet. It is inaudible on its
    // own and audible against picture or against an unshifted track, so it is
    // stated rather than hidden. `semitones: 0` bypasses the node entirely.
    description: "Shifts pitch up or down without changing playback speed. Adds ~50 ms of latency.",
    params: [
      {
        kind: "number",
        key: "semitones",
        label: "Semitones",
        unit: "st",
        min: -12,
        max: 12,
        step: 1,
        default: 0
      },
      {
        kind: "number",
        key: "mix",
        label: "Mix",
        unit: "",
        min: 0,
        max: 1,
        step: 0.01,
        default: 1
      }
    ],
    web: "worklet-pitchshift"
  },
  {
    id: "delay",
    label: "Delay",
    group: "time",
    description: "Repeating echoes behind the dry signal.",
    params: [
      {
        kind: "number",
        key: "time",
        automatable: true,
        label: "Time",
        unit: "ms",
        min: 1,
        max: 5e3,
        step: 1,
        default: 250,
        scale: "log"
      },
      // aecho rejects a decay of exactly 0 ("out of allowed range: (0, 1]"),
      // so the floor is a hair above silence rather than at it.
      {
        kind: "number",
        key: "feedback",
        automatable: true,
        label: "Feedback",
        unit: "",
        min: 0.01,
        max: 0.95,
        step: 0.01,
        default: 0.35
      },
      {
        kind: "number",
        key: "mix",
        automatable: true,
        label: "Mix",
        unit: "",
        min: 0,
        max: 1,
        step: 0.01,
        default: 0.4
      }
    ],
    web: "delay-feedback"
  },
  {
    id: "chorus",
    label: "Chorus",
    group: "time",
    description: "Detuned copies of the signal for width and thickness.",
    params: [
      {
        kind: "number",
        key: "delay",
        automatable: true,
        label: "Delay",
        unit: "ms",
        min: 1,
        max: 100,
        step: 0.1,
        default: 7
      },
      {
        kind: "number",
        key: "depth",
        automatable: true,
        label: "Depth",
        unit: "ms",
        min: 0,
        max: 10,
        step: 0.01,
        default: 2
      },
      {
        kind: "number",
        key: "speed",
        automatable: true,
        label: "Rate",
        unit: "Hz",
        min: 0.01,
        max: 10,
        step: 0.01,
        default: 1
      },
      {
        kind: "number",
        key: "mix",
        automatable: true,
        label: "Mix",
        unit: "",
        min: 0,
        max: 1,
        step: 0.01,
        default: 0.5
      }
    ],
    web: "chorus-lfo"
  },
  {
    id: "phaser",
    label: "Phaser",
    group: "time",
    description: "Sweeping notches moving through the spectrum.",
    params: [
      {
        kind: "number",
        key: "in_gain",
        automatable: true,
        label: "Input",
        unit: "",
        min: 0,
        max: 1,
        step: 0.01,
        default: 0.4
      },
      {
        kind: "number",
        key: "out_gain",
        automatable: true,
        label: "Output",
        unit: "",
        min: 0,
        max: 2,
        step: 0.01,
        default: 0.74
      },
      // aphaser advertises a delay range starting at 0 but rejects it at
      // runtime with "delay is too small"; 0.1 ms is the real floor.
      {
        kind: "number",
        key: "delay",
        label: "Delay",
        unit: "ms",
        min: 0.1,
        max: 5,
        step: 0.1,
        default: 3
      },
      {
        kind: "number",
        key: "decay",
        label: "Decay",
        unit: "",
        min: 0,
        max: 0.99,
        step: 0.01,
        default: 0.4
      },
      {
        kind: "number",
        key: "speed",
        automatable: true,
        label: "Rate",
        unit: "Hz",
        min: 0.1,
        max: 2,
        step: 0.01,
        default: 0.5
      },
      {
        kind: "enum",
        key: "type",
        label: "Waveform",
        options: [
          { value: "0", label: "Triangular" },
          { value: "1", label: "Sinusoidal" }
        ],
        default: "0"
      }
    ],
    web: "allpass-phaser"
  },
  {
    id: "reverb",
    label: "Reverb",
    group: "time",
    description: "Room tail. Both ends convolve the same generated impulse, so preview matches render.",
    params: [
      {
        kind: "number",
        key: "size",
        label: "Room size",
        unit: "",
        min: 0.05,
        max: 1,
        step: 0.01,
        default: 0.7
      },
      {
        kind: "number",
        key: "damping",
        label: "Damping",
        unit: "",
        min: 0,
        max: 1,
        step: 0.01,
        default: 0.5,
        hint: "Higher rolls the top off the tail faster."
      },
      {
        kind: "number",
        key: "wet",
        automatable: true,
        label: "Wet",
        unit: "",
        min: 0,
        max: 1,
        step: 0.01,
        default: 0.35
      },
      {
        kind: "number",
        key: "dry",
        automatable: true,
        label: "Dry",
        unit: "",
        min: 0,
        max: 1,
        step: 0.01,
        default: 0.7
      }
    ],
    web: "convolver"
  }
];
var BY_ID = new Map(HF_AUDIO_FX.map((d) => [d.id, d]));
var HF_AUDIO_FX_IDS = HF_AUDIO_FX.map((d) => d.id);
function defaultAudioFxParams(id) {
  const def = BY_ID.get(id);
  if (!def) return {};
  const out = {};
  for (const p of def.params) out[p.key] = p.default;
  return out;
}
function normalizeAudioFxParams(id, values) {
  const def = BY_ID.get(id);
  if (!def) return {};
  const out = {};
  for (const p of def.params) {
    const raw = values?.[p.key];
    if (p.kind === "enum") {
      const ok = p.options.some((o) => o.value === raw);
      out[p.key] = ok ? raw : p.default;
      continue;
    }
    const n = typeof raw === "number" ? raw : typeof raw === "string" && raw.trim() !== "" ? Number(raw) : Number.NaN;
    out[p.key] = Number.isFinite(n) ? Math.min(p.max, Math.max(p.min, n)) : p.default;
  }
  return out;
}
var AudioFxChainError = class extends Error {
  constructor(message) {
    super(message);
    this.name = "AudioFxChainError";
  }
};
function parseAudioFxChain(json) {
  let raw;
  try {
    raw = JSON.parse(json);
  } catch (err) {
    throw new AudioFxChainError(`Chain file is not valid JSON: ${err.message}`);
  }
  if (typeof raw !== "object" || raw === null) {
    throw new AudioFxChainError("Chain file must be a JSON object.");
  }
  const obj = raw;
  if (obj.version !== HF_AUDIO_FX_CHAIN_VERSION) {
    throw new AudioFxChainError(`Unsupported chain version: ${String(obj.version)}`);
  }
  if (!Array.isArray(obj.nodes)) {
    throw new AudioFxChainError("Chain file is missing a `nodes` array.");
  }
  const nodes = obj.nodes.map(parseAudioFxNode);
  return { version: HF_AUDIO_FX_CHAIN_VERSION, nodes };
}
function serializeAudioFxChain(chain) {
  return JSON.stringify({
    version: HF_AUDIO_FX_CHAIN_VERSION,
    nodes: chain.nodes.map(serializeAudioFxNode)
  });
}
function mintAudioFxNodeId(chain) {
  const taken = new Set(chain.nodes.map((n) => n.id).filter(Boolean));
  for (let i = 1; ; i += 1) {
    const id = `n${i}`;
    if (!taken.has(id)) return id;
  }
}
function parseAudioFxNode(n, i) {
  if (typeof n !== "object" || n === null) {
    throw new AudioFxChainError(`Node ${i} is not an object.`);
  }
  const node = n;
  if (typeof node.type !== "string" || !BY_ID.has(node.type)) {
    throw new AudioFxChainError(`Node ${i} has unknown effect type: ${String(node.type)}`);
  }
  return withoutUndefined({
    type: node.type,
    id: nonEmptyString(node.id),
    fromCarve: onlyTrue(node.fromCarve),
    // fromPreset and label both survive the round trip or a preset stops being
    // able to find its own nodes after a reload: re-applying would stack a
    // second copy and the rack would lose the grouping it braces them with.
    fromPreset: nonEmptyString(node.fromPreset),
    label: nonEmptyString(node.label),
    fromEq: nonEmptyString(node.fromEq),
    fromLeveller: onlyTrue(node.fromLeveller),
    presetAmount: clampedPresetAmount(node.presetAmount),
    enabled: node.enabled !== false,
    params: normalizeAudioFxParams(
      node.type,
      node.params ?? void 0
    )
  });
}
function serializeAudioFxNode(node) {
  return withoutUndefined({
    type: node.type,
    id: nonEmptyString(node.id),
    fromCarve: onlyTrue(node.fromCarve),
    fromPreset: nonEmptyString(node.fromPreset),
    label: nonEmptyString(node.label),
    fromEq: nonEmptyString(node.fromEq),
    fromLeveller: onlyTrue(node.fromLeveller),
    // Omitted when fully applied, so an untouched preset does not grow a field
    // in every chain that carries one.
    presetAmount: node.presetAmount === 1 ? void 0 : clampedPresetAmount(node.presetAmount),
    // Only the non-default is written: a chain of enabled nodes stays plain.
    enabled: node.enabled === false ? false : void 0,
    params: normalizeAudioFxParams(node.type, node.params)
  });
}
function nonEmptyString(value) {
  return typeof value === "string" && value ? value : void 0;
}
function onlyTrue(value) {
  return value === true ? true : void 0;
}
function clampedPresetAmount(value) {
  if (typeof value !== "number" || !Number.isFinite(value)) return void 0;
  return Math.min(1, Math.max(0, value));
}
function withoutUndefined(obj) {
  for (const key of Object.keys(obj)) {
    if (obj[key] === void 0) delete obj[key];
  }
  return obj;
}

// packages/core/src/fft.ts
function fft(re, im) {
  const n = re.length;
  for (let i = 1, j = 0; i < n; i++) {
    let bit = n >> 1;
    for (; j & bit; bit >>= 1) j ^= bit;
    j ^= bit;
    if (i < j) {
      [re[i], re[j]] = [re[j], re[i]];
      [im[i], im[j]] = [im[j], im[i]];
    }
  }
  for (let len = 2; len <= n; len <<= 1) {
    const ang = -2 * Math.PI / len;
    const wr = Math.cos(ang);
    const wi = Math.sin(ang);
    for (let i = 0; i < n; i += len) {
      let cr = 1;
      let ci = 0;
      for (let k = 0; k < len / 2; k++) {
        const ur = re[i + k];
        const ui = im[i + k];
        const vr = re[i + k + len / 2] * cr - im[i + k + len / 2] * ci;
        const vi = re[i + k + len / 2] * ci + im[i + k + len / 2] * cr;
        re[i + k] = ur + vr;
        im[i + k] = ui + vi;
        re[i + k + len / 2] = ur - vr;
        im[i + k + len / 2] = ui - vi;
        const ncr = cr * wr - ci * wi;
        ci = cr * wi + ci * wr;
        cr = ncr;
      }
    }
  }
}

// packages/core/src/audioCarve.ts
var CANDIDATE_CENTERS_HZ = [160, 250, 400, 630, 1e3, 1600, 2500, 4e3, 6e3];
var FRAME = 4096;
var HOP = 2048;
var SFX_NAME = /sfx|foley|whoosh|impact|riser|stinger|swoosh|thud|boom|click|ding|beep|ambien|room[-_ ]?tone/i;
var NOT_WORD = "(?<![a-z0-9])";
var NOT_WORD_END = "(?![a-z0-9])";
var wordish = (term) => `${NOT_WORD}${term}${NOT_WORD_END}`;
var MUSIC_NAME = new RegExp(
  `music|bgm|${wordish("bed")}|soundtrack|score|${wordish("song")}|theme|instrumental|track\\d`,
  "i"
);
var VOICE_NAME = new RegExp(
  `voice|${wordish("vo")}|${wordish("vox")}|narrat|speech|dialog|monolog|announce|${wordish("tts")}|talk|interview|podcast|recap|script`,
  "i"
);
function classifyAudioName(...parts) {
  const text = parts.filter(Boolean).join(" ");
  if (VOICE_NAME.test(text)) return "voice";
  if (SFX_NAME.test(text)) return "sfx";
  if (MUSIC_NAME.test(text)) return "music";
  return "unknown";
}
function clipsOverlap(a, b) {
  const end = (clip) => typeof clip.duration === "number" && Number.isFinite(clip.duration) ? (
    // Negative is clamped to zero-length rather than passed through: a
    // clip cannot un-play time, and letting it through inverts the
    // interval (end before start), which reads as overlapping everything
    // it is nowhere near.
    clip.start + Math.max(0, clip.duration)
  ) : Number.POSITIVE_INFINITY;
  return a.start < end(b) && b.start < end(a);
}
function carveProfile(strength) {
  const s = Number.isFinite(strength) ? Math.min(1, Math.max(0, strength)) : 0.5;
  return {
    // 2 dB is audible-but-subtle. Past about 10 the hole starts being heard as
    // the effect rather than as room for the voice — which is a price worth
    // paying at the top of the knob, and why the range now runs past it.
    maxCutDb: Number((2 + s * 16).toFixed(2)),
    // One band carves the single worst collision; six is every candidate band
    // speech meaningfully occupies.
    bands: Math.max(1, Math.min(6, Math.round(1 + s * 6))),
    // Wider at low strength so a gentle carve is a tilt rather than a notch.
    q: Number((1.1 + s * 1.2).toFixed(2)),
    // Always weighted toward where masking hurts; at the top, entirely.
    intelligibilityBias: Number(Math.min(1, 0.6 + s * 0.4).toFixed(2)),
    // No level ducking at all at zero: the carve is then purely spectral.
    duckDb: Number((s * 24).toFixed(2)),
    // How far under the voice to aim. Deeper targets at higher strength.
    headroomDb: Number((6 + s * 12).toFixed(2))
  };
}
function mixCarveSources(parts, sampleRate) {
  const placed = parts.map((part) => ({
    samples: part.samples,
    at: Math.round(part.offsetSeconds * sampleRate)
  }));
  const length = placed.reduce((max, p) => Math.max(max, p.at + p.samples.length), 0);
  if (length <= 0) return new Float32Array(0);
  const mixed = new Float32Array(length);
  for (const { samples, at } of placed) {
    const from = at < 0 ? -at : 0;
    for (let i = from; i < samples.length; i += 1) {
      const target = at + i;
      if (target < 0 || target >= length) continue;
      mixed[target] = (mixed[target] ?? 0) + (samples[i] ?? 0);
    }
  }
  return mixed;
}
function powerSpectrum(mono, sampleRate) {
  const n = Math.max(mono.length, FRAME);
  const padded = mono.length >= FRAME ? mono : (() => {
    const p = new Float32Array(FRAME);
    p.set(mono);
    return p;
  })();
  const window = new Float32Array(FRAME);
  for (let i = 0; i < FRAME; i++) window[i] = 0.5 - 0.5 * Math.cos(2 * Math.PI * i / (FRAME - 1));
  const bins = FRAME / 2 + 1;
  const acc = new Float64Array(bins);
  const re = new Float64Array(FRAME);
  const im = new Float64Array(FRAME);
  let frames = 0;
  for (let start = 0; start + FRAME <= n; start += HOP) {
    im.fill(0);
    for (let i = 0; i < FRAME; i++) re[i] = (padded[start + i] ?? 0) * window[i];
    fft(re, im);
    for (let k = 0; k < bins; k++) acc[k] += re[k] * re[k] + im[k] * im[k];
    frames++;
  }
  if (frames === 0) frames = 1;
  const freqs = [];
  const power = [];
  for (let k = 0; k < bins; k++) {
    freqs.push(k * sampleRate / FRAME);
    power.push(acc[k] / frames);
  }
  return { freqs, power };
}
function bandPower(freqs, power, center) {
  const lo = center / Math.pow(2, 1 / 6);
  const hi = center * Math.pow(2, 1 / 6);
  let sum = 0;
  let count = 0;
  for (let i = 0; i < freqs.length; i++) {
    if (freqs[i] >= lo && freqs[i] < hi) {
      sum += power[i];
      count++;
    }
  }
  return count > 0 ? sum / count : 0;
}
var BIAS_AUTHORITY_DB = 30;
function intelligibilityPenaltyDb(center, bias) {
  const octavesFrom2k = Math.log2(center / 2e3);
  const shaped = Math.exp(-(octavesFrom2k * octavesFrom2k) / 2);
  return bias * BIAS_AUTHORITY_DB * (1 - shaped);
}
function analyseCarveBands(voice, sampleRate, profile) {
  if (voice.length === 0) return [];
  const { freqs, power } = powerSpectrum(voice, sampleRate);
  const scored = CANDIDATE_CENTERS_HZ.map((center) => {
    const bandPowerAt = bandPower(freqs, power, center);
    return {
      center,
      hasEnergy: bandPowerAt > 0,
      // A band with no energy scores -Infinity rather than a large negative
      // number, so it can never outrank a real band however favourably the bias
      // views its frequency.
      scoreDb: bandPowerAt > 0 ? 10 * Math.log10(bandPowerAt) - intelligibilityPenaltyDb(center, profile.intelligibilityBias) : Number.NEGATIVE_INFINITY
    };
  }).sort((a, b) => b.scoreDb - a.scoreDb);
  const selected = scored.slice(0, Math.max(1, profile.bands)).filter((b) => b.hasEnergy);
  if (selected.length === 0) return [];
  const topDb = selected[0].scoreDb;
  return selected.map(({ center, scoreDb }) => {
    const relative = Math.pow(10, (scoreDb - topDb) / 10);
    const depth = Math.min(
      profile.maxCutDb,
      Math.max(profile.maxCutDb / 2, profile.maxCutDb * relative)
    );
    return { freq: center, gainDb: -Number(depth.toFixed(2)), q: profile.q };
  }).sort((a, b) => a.freq - b.freq);
}
var DYNAMIC_RANGE_DB = 30;
var ATTACK_S = 0.05;
var RELEASE_S = 0.25;
var DUCK_RELEASE_S = 2.4;
var POINT_BUDGET = 400;
var SNAP_DB = 0.2;
var STEP_DB = 0.5;
function simplifyStepPoints(raw, stepDb) {
  const points = [{ t: 0, v: 0 }];
  let lastKept = 0;
  let keptIndex = -1;
  raw.forEach((pt, i) => {
    if (i !== raw.length - 1 && Math.abs(pt.v - lastKept) < stepDb) return;
    if (i > 0 && keptIndex !== i - 1) points.push(raw[i - 1]);
    points.push(pt);
    lastKept = pt.v;
    keptIndex = i;
  });
  return points;
}
function analyseCarveDynamics(voice, sampleRate, bands) {
  if (voice.length === 0 || bands.length === 0) return [];
  const window = new Float32Array(FRAME);
  for (let i = 0; i < FRAME; i++) window[i] = 0.5 - 0.5 * Math.cos(2 * Math.PI * i / (FRAME - 1));
  const hop = Math.max(FRAME, Math.ceil(voice.length / POINT_BUDGET));
  const bins = FRAME / 2 + 1;
  const freqs = [];
  for (let k = 0; k < bins; k++) freqs.push(k * sampleRate / FRAME);
  const times = [];
  const perBand = bands.map(() => []);
  const re = new Float64Array(FRAME);
  const im = new Float64Array(FRAME);
  for (let start = 0; start < voice.length; start += hop) {
    im.fill(0);
    for (let i = 0; i < FRAME; i++) re[i] = (voice[start + i] ?? 0) * window[i];
    fft(re, im);
    const power = [];
    for (let k = 0; k < bins; k++) power.push(re[k] * re[k] + im[k] * im[k]);
    times.push((start + FRAME / 2) / sampleRate);
    bands.forEach((band, b) => perBand[b].push(bandPower(freqs, power, band.freq)));
  }
  const duration = voice.length / sampleRate;
  const attack = 1 - Math.exp(-(hop / sampleRate) / ATTACK_S);
  const release = 1 - Math.exp(-(hop / sampleRate) / RELEASE_S);
  return bands.map((band, b) => {
    const powers = perBand[b];
    const peak = Math.max(...powers);
    let level = 0;
    const raw = [];
    powers.forEach((p, i) => {
      const target = p > 0 && peak > 0 ? Math.max(0, 1 + 10 * Math.log10(p / peak) / DYNAMIC_RANGE_DB) : 0;
      level += (target > level ? attack : release) * (target - level);
      const scaled = band.gainDb * level;
      const v = Math.abs(scaled) < SNAP_DB ? 0 : Number(scaled.toFixed(1));
      raw.push({ t: Number(times[i].toFixed(3)), v });
    });
    const points = simplifyStepPoints(raw, STEP_DB);
    points.push({ t: Number(Math.max(duration, points.at(-1).t).toFixed(3)), v: 0 });
    return { freq: band.freq, points };
  });
}
function windowDb(samples, from, count) {
  let sum = 0;
  let n = 0;
  for (let i = from; i < from + count; i++) {
    const s = samples[i];
    if (s === void 0) break;
    sum += s * s;
    n += 1;
  }
  if (n === 0) return Number.NEGATIVE_INFINITY;
  const rms = Math.sqrt(sum / n);
  return rms > 0 ? 20 * Math.log10(rms) : Number.NEGATIVE_INFINITY;
}
function analyseCarveDuck(voice, bed, sampleRate, profile, offsetSeconds) {
  if (voice.length === 0 || profile.duckDb <= 0) return [];
  const hop = Math.max(FRAME, Math.ceil(voice.length / POINT_BUDGET));
  const bedOffset = Math.round(offsetSeconds * sampleRate);
  const voiceDbs = [];
  const bedDbs = [];
  const times = [];
  for (let start = 0; start < voice.length; start += hop) {
    voiceDbs.push(windowDb(voice, start, FRAME));
    bedDbs.push(windowDb(bed, start + bedOffset, FRAME));
    times.push((start + FRAME / 2) / sampleRate);
  }
  const voicePeak = Math.max(...voiceDbs);
  const speakingFloor = voicePeak - DYNAMIC_RANGE_DB;
  const attack = 1 - Math.exp(-(hop / sampleRate) / ATTACK_S);
  const release = 1 - Math.exp(-(hop / sampleRate) / DUCK_RELEASE_S);
  let level = 0;
  const raw = [];
  voiceDbs.forEach((vDb, i) => {
    const bDb = bedDbs[i] ?? Number.NEGATIVE_INFINITY;
    const over = vDb > speakingFloor && Number.isFinite(bDb) ? bDb - (vDb - profile.headroomDb) : 0;
    const target = Math.min(profile.duckDb, Math.max(0, over));
    level += (target > level ? attack : release) * (target - level);
    const v = level < SNAP_DB ? 0 : -Number(level.toFixed(1));
    raw.push({ t: Number(times[i].toFixed(3)), v });
  });
  const hopSeconds = hop / sampleRate;
  let tailTime = times.at(-1) ?? 0;
  while (level >= SNAP_DB) {
    level += release * -level;
    tailTime += hopSeconds;
    raw.push({
      t: Number(tailTime.toFixed(3)),
      v: level < SNAP_DB ? 0 : -Number(level.toFixed(1))
    });
  }
  const points = simplifyStepPoints(raw, STEP_DB);
  const duration = voice.length / sampleRate;
  const last = points.at(-1);
  const endTime = Number(Math.max(duration, last.t).toFixed(3));
  if (!(last.v === 0 && last.t >= endTime)) points.push({ t: endTime, v: 0 });
  return points;
}
function carveBandsToChain(bands) {
  const nodes = bands.map((b) => ({
    type: "peaking",
    enabled: true,
    params: {
      ...defaultAudioFxParams("peaking"),
      frequency: b.freq,
      gain: b.gainDb,
      q: b.q
    }
  }));
  return { version: HF_AUDIO_FX_CHAIN_VERSION, nodes };
}
export {
  analyseCarveBands,
  analyseCarveDuck,
  analyseCarveDynamics,
  carveBandsToChain,
  carveProfile,
  classifyAudioName,
  clipsOverlap,
  defaultAudioFxParams,
  mintAudioFxNodeId,
  mixCarveSources,
  parseAudioFxChain,
  serializeAudioFxChain
};
