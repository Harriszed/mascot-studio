// Authored pixel poses use explicit blocks. Reference-derived gym and walking
// sequences preserve the measured geometry and timing from the public demo.
import { buildFluidStates } from './mascot-fluid-art.mjs';
const CORAL = '#DD775B';
const INK = '#000000';
const PAPER = '#FFFDF5';
const GREEN = '#3AAB7C';
const GOLD = '#D9A441';
const RED = '#B94236';
const VIEW_BOX = [-20, -40, 240, 220];

export const stateDefinitions = [
  ['idle', 'Idle', 'Waiting for you.', 4.8],
  ['thinking', 'Thinking', 'Working out an answer; no tool is running.', 3.2],
  ['using-tool', 'Using a tool', 'Doing work; the same activity animation for every tool.', 5.625],
  ['directing-helpers', 'Directing helpers', 'Helper agents are running.', 2.4],
  ['done', 'Done', 'Just finished. Returns to idle after five seconds.', 5],
  ['greeting', 'Waking up / greeting', 'A new chat has opened.', 2.4],
  ['asleep', 'Asleep', 'Idle for a long time; the cache has gone cold.', 4],
  ['reading', 'Reading', 'Opening and reading files.', 2.4],
  ['writing', 'Writing / editing', 'Changing files.', 1.6],
  ['running-commands', 'Running commands', 'Terminal commands, installs, and builds.', 1.6],
  ['searching-web', 'Searching the web', 'Web searches and fetching pages.', 2.4],
  ['searching-code', 'Searching code', 'Looking through files for something.', 2.4],
  ['testing', 'Testing', 'Running tests.', 2.4],
  ['committing', 'Committing / pushing', 'Saving work to git.', 2.4],
  ['waiting-for-you', 'Waiting for you', 'Needs your permission or an answer to a question.', 4],
  ['error', 'Error', 'A command or tool failed.', 3.2],
  ['compacting', 'Compacting', 'Tidying up memory when the chat gets long.', 2.8],
  ['context-nearly-full', 'Context nearly full', 'Memory is over 80%.', 3.2],
  ['plan-progress', 'Plan progress', 'Ticking off the to-do list.', 3.2],
  ['server-running', 'Server running', 'Your dev server or Expo is on.', 4],
  ['typing', "You're typing", 'You have started writing a message.', 2.4],
  ['walking', 'Walking', 'The reference walk cycle, looping in place for your app to move.', .2],
];

const rect = (x, y, w, h, fill = INK) => ({ x, y, w, h, fill });
const shift = (shapes, x, y) => shapes.map(s => s.points
  ? { ...s, points: s.points.map(p => [p[0] + x, p[1] + y]) }
  : { ...s, x: s.x + x, y: s.y + y });
const glyphs = {
  '?': ['111', '001', '011', '000', '010'],
  '!': ['1', '1', '1', '0', '1'],
  Z: ['111', '001', '010', '100', '111'],
  '>': ['100', '010', '001', '010', '100'],
  '<': ['001', '010', '100', '010', '001'],
  '/': ['001', '001', '010', '100', '100'],
};
function glyph(char, x, y, size = 5, fill = INK) {
  return glyphs[char].flatMap((row, j) => [...row].flatMap((bit, i) => bit === '1' ? [rect(x + i * size, y + j * size, size, size, fill)] : []));
}
function check(x, y, fill = GREEN, size = 5) {
  return [[0, 1], [1, 2], [2, 1], [3, 0]].map(([i, j]) => rect(x + i * size, y + j * size, size, size, fill));
}
function frameBox(x, y, w, h, fill = PAPER) {
  return [rect(x, y, w, h), rect(x + 5, y + 5, w - 10, h - 10, fill)];
}
function happyEyes(x, y) {
  return [rect(x + 6, y, 10, 6), rect(x, y + 6, 6, 6), rect(x + 16, y + 6, 6, 6)];
}

// The resting body is the reference gym sprite at its original scale, relocated
// to a shared canvas. Reusing it avoids drawing an approximation of the mascot.
function actor(reference, options = {}) {
  const { dx = 0, dy = 0, gazeX = 0, gazeY = 0, eyes = 'open', left = 'rest', right = 'rest', lean = 0 } = options;
  const shapes = shift(reference.gymBase, 19 + dx, 28 + dy);
  const body = shapes.find(s => s.x === 55 + dx && s.y === 70 + dy);
  const legs = shapes.slice(0, 4);
  const torso = lean === 0 ? [body] : Array.from({ length: 13 }, (_, i) => rect(55 + dx + (i < 4 ? lean : i < 9 ? Math.sign(lean) * 5 : 0), 70 + dy + i * 5, 85, 5, CORAL));
  // Keep the hip roots underneath the torso even when the torso changes pose.
  for (const leg of legs) { leg.y = 130 + dy; leg.h = 26; }
  const arm = (side, pose) => {
    const x = side === 'left' ? 33 : 140;
    if (pose === 'rest') return [rect(x + dx, 98 + dy, 22, 23, CORAL)];
    if (pose === 'down') return [rect(x + dx, 108 + dy, 22, 23, CORAL)];
    if (pose === 'point') return side === 'right'
      ? [rect(140 + dx, 98 + dy, 15, 15, CORAL), rect(155 + dx, 93 + dy, 15, 10, CORAL)]
      : [rect(40 + dx, 98 + dy, 15, 15, CORAL), rect(25 + dx, 93 + dy, 15, 10, CORAL)];
    if (pose === 'hold') return [rect(x + dx + (side === 'left' ? 5 : -5), 113 + dy, 17, 18, CORAL)];
    if (pose === 'head') return side === 'right'
      ? [rect(140 + dx, 85 + dy, 15, 20, CORAL), rect(135 + dx, 70 + dy, 20, 15, CORAL)]
      : [rect(40 + dx, 85 + dy, 15, 20, CORAL), rect(40 + dx, 70 + dy, 20, 15, CORAL)];
    if (pose === 'half-head' || pose === 'scratch') return side === 'right'
      ? [rect(140 + dx, (pose === 'scratch' ? 80 : 90) + dy, 15, pose === 'scratch' ? 30 : 20, CORAL), rect(135 + dx, (pose === 'scratch' ? 65 : 80) + dy, 20, 15, CORAL)]
      : [rect(40 + dx, (pose === 'scratch' ? 80 : 90) + dy, 15, pose === 'scratch' ? 30 : 20, CORAL), rect(40 + dx, (pose === 'scratch' ? 65 : 80) + dy, 20, 15, CORAL)];
    if (pose === 'half-wave') return side === 'right'
      ? [rect(140 + dx, 90 + dy, 15, 25, CORAL), rect(150 + dx, 80 + dy, 20, 20, CORAL)]
      : [rect(40 + dx, 90 + dy, 15, 25, CORAL), rect(25 + dx, 80 + dy, 20, 20, CORAL)];
    // The raised forearm is a staircase of blocks, rather than a rotated rect.
    return side === 'right'
      ? [rect(140 + dx, 85 + dy, 10, 25, CORAL), rect(145 + dx, 70 + dy, 10, 20, CORAL), rect(145 + dx + (pose === 'wave-out' ? 5 : pose === 'wave-in' ? -5 : 0), 55 + dy, 20, 20, CORAL)]
      : [rect(45 + dx, 85 + dy, 10, 25, CORAL), rect(40 + dx, 70 + dy, 10, 20, CORAL), rect(30 + dx + (pose === 'wave-out' ? -5 : pose === 'wave-in' ? 5 : 0), 55 + dy, 20, 20, CORAL)];
  };
  let eyeShapes;
  const ex = dx + gazeX, ey = dy + gazeY;
  if (eyes === 'happy') eyeShapes = [...happyEyes(60 + ex, 80 + ey), ...happyEyes(114 + ex, 80 + ey)];
  else if (eyes === 'closed') eyeShapes = [rect(65 + ex, 86 + ey, 11, 5), rect(119 + ex, 86 + ey, 11, 5)];
  else eyeShapes = [rect(65 + ex, 81 + ey, 11, 11), rect(119 + ex, 81 + ey, 11, 11)];
  return [...legs, ...torso, ...arm('left', left), ...arm('right', right), ...eyeShapes];
}
function mini(x, y, working = false) {
  return [rect(x + 5, y, 25, 20, CORAL), rect(x, y + 10, 5, 10, CORAL), rect(x + 30, y + (working ? 5 : 10), 5, 10, CORAL),
    ...[5, 12, 20, 27].map(dx => rect(x + dx, y + 20, 3, 7, CORAL)), rect(x + 10, y + 5, 3, 3), rect(x + 23, y + 5, 3, 3)];
}
function book(page) {
  const result = [rect(60, 113, 80, 40), rect(65, 113, 30, 35, PAPER), rect(100, 113, 35, 35, PAPER)];
  for (const x of [70, 105]) for (const y of [123, 133]) result.push(rect(x, y, 20, 5, CORAL));
  if (page % 3 === 1) result.push(rect(90, 113, 15, 35, PAPER), rect(95, 118, 5, 25, INK));
  if (page % 3 === 2) result.push(rect(75, 113, 20, 35, PAPER), rect(90, 118, 5, 25, INK));
  return result;
}
function pencil(x, y) {
  return [rect(x, y + 20, 5, 5), ...[0, 1, 2, 3].map(i => rect(x + 5 + i * 5, y + 15 - i * 5, 5, 10, GOLD)), rect(x + 25, y - 5, 5, 10, CORAL)];
}
function glass(x, y) {
  return [rect(x + 5, y, 15, 5), rect(x, y + 5, 5, 15), rect(x + 20, y + 5, 5, 15), rect(x + 5, y + 20, 15, 5), rect(x + 20, y + 25, 5, 5), rect(x + 25, y + 30, 5, 5)];
}
function globe() {
  return [rect(80, 20, 35, 5), rect(75, 25, 5, 25), rect(115, 25, 5, 25), rect(80, 50, 35, 5), rect(80, 35, 35, 5), rect(95, 25, 5, 25), rect(85, 25, 5, 25), rect(105, 25, 5, 25)];
}
function list(ticks = 0) {
  const result = frameBox(75, 10, 55, 50);
  for (let i = 0; i < 3; i++) {
    result.push(rect(85, 20 + i * 10, 5, 5, i < ticks ? GREEN : GOLD), rect(95, 20 + i * 10, 25, 5));
  }
  return result;
}
function terminal(phase) {
  const result = [...frameBox(50, 113, 100, 40), ...glyph('>', 60, 123, 3), rect(75, 128, 30, 5, CORAL)];
  if (phase % 2 === 0) result.push(rect(110, 128, 5, 5, GREEN));
  result.push(rect(60, 138, 15 + phase % 4 * 15, 5, GREEN));
  return result;
}
const makeFrames = (duration, count, paint) => Array.from({ length: count }, (_, i) => ({ time: duration * i / count, shapes: paint(i, count) }));

function walkingFrames(reference) {
  // One complete two-step cycle from the steady walk (4.03–6.23s), after the
  // gaze settles. The frozen source is sampled at 60Hz: 12 frames per 0.2s.
  const cycle = reference.animations.walking.frames.filter(frame => frame.time >= 4.43 && frame.time < 4.63);
  if (cycle.length !== 12) throw new Error('Expected 12 source frames for the walking cycle');
  return cycle.map((frame, index) => {
    const torso = frame.shapes.find(shape => shape.w === 85 && shape.h === 65);
    if (!torso) throw new Error('Missing source walking torso');
    // Remove only the source's stage translation. The leg motion, face, and
    // overlapping hip roots remain intact; the host controls screen travel.
    const shapes = shift(frame.shapes, 55 - torso.x, 70 - torso.y).map(shape => ({
      ...shape, x: +shape.x.toFixed(4), y: +shape.y.toFixed(4),
    }));
    return { time: index / 60, shapes };
  });
}

export function buildStates(reference) {
  const baseStates = stateDefinitions.map(([name, title, description, duration], number) => {
    let frames;
    const draw = options => actor(reference, options);
    if (name === 'using-tool') frames = reference.animations.gym.frames.map(f => ({ time: f.time, shapes: shift(f.shapes, 19, 28) }));
    else if (name === 'walking') frames = walkingFrames(reference);
    else if (name === 'done') {
      frames = [];
      for (let t = 0; t < 5; t += .125) {
        const index = Math.round(t / .125) % reference.animations.confetti.frames.length;
        frames.push({ time: t, shapes: shift(reference.animations.confetti.frames[index].shapes, 33, 43) });
      }
      // The standalone export settles back into its resting pose at five seconds.
      frames.push({ time: 5, shapes: draw() });
    } else if (name === 'idle') {
      frames = [{ time: 0, shapes: draw() }, { time: 2.05, shapes: draw({ eyes: 'closed' }) }, { time: 2.18, shapes: draw() }];
    } else if (name === 'thinking') {
      frames = makeFrames(duration, 8, i => [...draw({ right: i > 1 && i < 6 ? 'head' : 'rest', gazeX: i < 4 ? -5 : 5, gazeY: -5, lean: i < 4 ? 5 : -5 }), ...[0, 1, 2].map(j => rect(80 + j * 15, 35 - (j === i % 3 ? 5 : 0), 5, 5, CORAL))]);
    } else if (name === 'directing-helpers') {
      frames = makeFrames(duration, 8, i => [...draw({ eyes: 'happy', left: i < 4 ? 'point' : 'rest', right: i >= 4 ? 'point' : 'rest' }), ...mini(-5, 129, i % 2 === 0), ...mini(170, 129, i % 2 === 1), rect(10 + i % 3 * 5, 119, 5, 5, CORAL), rect(175 + (2 - i % 3) * 5, 119, 5, 5, CORAL)]);
    } else if (name === 'greeting') {
      frames = makeFrames(duration, 12, i => draw({ eyes: i < 2 ? 'closed' : i < 4 ? 'open' : 'happy', right: i < 4 ? 'rest' : i % 2 ? 'wave-out' : 'wave', dy: i < 2 ? 5 : 0 }));
    } else if (name === 'asleep') {
      frames = makeFrames(duration, 8, i => [...draw({ eyes: 'closed', left: 'down', right: 'down', dy: i < 4 ? 5 : 0 }), ...glyph('Z', 145 + i % 2 * 5, 40 - i % 3 * 5, 3, CORAL), ...glyph('Z', 170, 15 - i % 3 * 5, 4, CORAL)]);
    } else if (name === 'reading') {
      frames = makeFrames(duration, 8, i => [...draw({ left: 'hold', right: 'hold', gazeY: 15, gazeX: i < 4 ? -5 : 5 }), ...book(Math.floor(i / 2))]);
    } else if (name === 'writing') {
      frames = makeFrames(duration, 8, i => [...draw({ left: 'hold', right: 'hold', gazeY: 15, gazeX: 5 }), ...frameBox(60, 118, 75, 35), rect(70, 128, 15 + i % 4 * 10, 5, CORAL), rect(70, 138, 30, 5, CORAL), ...pencil(112 + i % 3 * 5, 106 + i % 2 * 5)]);
    } else if (name === 'running-commands') {
      frames = makeFrames(duration, 8, i => [...draw({ left: i % 2 ? 'hold' : 'down', right: i % 2 ? 'down' : 'hold', gazeY: 15 }), ...terminal(i)]);
    } else if (name === 'searching-web' || name === 'searching-code') {
      frames = makeFrames(duration, 8, i => [...draw({ right: 'point', gazeX: i < 4 ? -5 : 5 }), ...(name === 'searching-web' ? globe() : [...frameBox(70, 15, 60, 40), ...glyph('<', 80, 25, 3), ...glyph('/', 95, 25, 3), ...glyph('>', 110, 25, 3)]), ...glass(145 + i % 3 * 5, 65 + (i < 4 ? 0 : 5))]);
    } else if (name === 'testing') {
      frames = makeFrames(duration, 8, i => [...draw({ eyes: i > 5 ? 'happy' : 'open', right: i % 2 ? 'point' : 'rest', gazeY: -5 }), ...list(Math.min(3, Math.floor(i / 2))), ...(i > 5 ? check(150, 113) : [rect(150, 118, 5, 5, GOLD)])]);
    } else if (name === 'committing') {
      frames = makeFrames(duration, 8, i => [...draw({ eyes: i > 5 ? 'happy' : 'open', right: 'point' }), rect(95, 15, 5, 40), rect(100, 30, 20, 5), rect(115, 20, 5, 15), ...[[90, 10], [110, 10], [90, 50]].flatMap(([x, y]) => frameBox(x, y, 15, 15)), rect(95, 40 - i % 4 * 5, 5, 5, GREEN), ...(i > 5 ? check(150, 113) : [])]);
    } else if (name === 'waiting-for-you') {
      frames = makeFrames(duration, 8, i => [...draw({ right: 'point', eyes: i === 4 ? 'closed' : 'open', gazeX: 5 }), ...glyph('?', 150, 45, 5, CORAL)]);
    } else if (name === 'error') {
      const times = [0, .16, .25, .34, .43, .52, .68];
      frames = times.map((time, i) => ({ time, shapes: [...draw({ dx: i === 1 || i === 3 ? -5 : i === 2 || i === 4 ? 5 : 0, eyes: 'closed', left: 'down', right: 'down' }), ...glyph('!', 95, 25, 5, RED)] }));
    } else if (name === 'compacting') {
      frames = makeFrames(duration, 8, i => [...draw({ left: 'wave', right: 'wave', gazeY: -5 }), ...Array.from({ length: i < 3 ? 3 : i < 6 ? 2 : 1 }, (_, j) => [...frameBox(75 + j * 5, 15 + j * 10, 50, 25), rect(85 + j * 5, 25 + j * 10, 25, 5, CORAL)]).flat()]);
    } else if (name === 'context-nearly-full') {
      frames = makeFrames(duration, 8, i => [...draw({ gazeY: -5, right: i < 4 ? 'head' : 'rest' }), ...frameBox(65, 20, 75, 25), ...Array.from({ length: 5 }, (_, j) => rect(75 + j * 12, 25, 8, 15, j < 4 ? GOLD : i % 2 ? RED : PAPER))]);
    } else if (name === 'plan-progress') {
      frames = makeFrames(duration, 8, i => [...draw({ right: 'point', eyes: i > 5 ? 'happy' : 'open' }), ...list(Math.min(3, Math.floor(i / 2))), ...(i > 5 ? check(150, 65) : [rect(150, 75, 5, 5, CORAL)])]);
    } else if (name === 'server-running') {
      frames = makeFrames(duration, 8, i => [...draw({ eyes: i === 4 ? 'closed' : 'open' }), ...[0, 1, 2].flatMap(j => [...frameBox(70, 10 + j * 15, 60, 15), rect(80, 15 + j * 15, 5, 5, (i + j) % 3 ? GREEN : CORAL), rect(95, 15 + j * 15, 25, 5)])]);
    } else if (name === 'typing') {
      frames = makeFrames(duration, 8, i => [...draw({ gazeY: -5, eyes: i === 5 ? 'happy' : 'open' }), ...frameBox(60, 25, 80, 30), ...[0, 1, 2].map(j => rect(80 + j * 15, 35 - (j === i % 3 ? 5 : 0), 5, 5, CORAL))]);
    }
    if (!frames) throw new Error(`Missing frames for ${name}`);
    return { number: number + 1, name, title, label: title, description, duration, loop: name !== 'done', viewBox: VIEW_BOX, frames };
  });
  return [...baseStates, ...accessoryVariants.map(([baseState, accessory, title], index) => {
    const base = baseStates.find(state => state.name === baseState);
    return { ...base, number: baseStates.length + index + 1,
      name: `${baseState}-${accessory}`, baseState, accessory, title, label: title,
      description: `${base.description} Wearing ${accessory.replaceAll('-', ' ')}.`,
      frames: base.frames.map(frame => ({ ...frame, shapes: [...frame.shapes, ...accessoryShapes(frame.shapes, accessory)] })),
    };
  }), ...buildFluidStates(baseStates.length + accessoryVariants.length + 1, {
    draw: options => actor(reference, options), rect, shift, glyph, check,
    frameBox, book, pencil, list, walking: walkingFrames(reference),
    mini, terminal, glass, globe, order: stateDefinitions.map(s=>s[0]),
    titles: Object.fromEntries(stateDefinitions.map(s=>[s[0],s[1]])),
  })];
}

export const accessoryVariants = [
  ['idle', 'wizard-hat', 'Idle / wizard hat'],
  ['thinking', 'wizard-hat', 'Thinking / wizard hat'],
  ['reading', 'wizard-hat', 'Reading / wizard hat'],
  ['writing', 'sunglasses', 'Writing / sunglasses'],
  ['running-commands', 'sunglasses', 'Commands / sunglasses'],
  ['greeting', 'crown', 'Greeting / crown'],
  ['asleep', 'nightcap', 'Asleep / nightcap'],
  ['error', 'propeller-cap', 'Error / propeller cap'],
];

function accessoryShapes(shapes, accessory) {
  // These variants use authored actors: their top torso block is an explicit
  // 85px-wide rectangle, including each stepped lean and per-frame dx/dy.
  const head = shapes.find(s => s.fill === CORAL && s.w === 85);
  if (!head) throw new Error(`No authored head anchor for ${accessory}`);
  const x = head.x, y = head.y;
  const purple = '#6943AD', lavender = '#B994F2', blue = '#337FB7';
  if (accessory === 'wizard-hat') return [
    rect(x - 8,y - 8,101,8,purple), rect(x + 6,y - 20,73,12,purple),
    rect(x + 16,y - 34,53,14,purple), rect(x + 26,y - 48,33,14,purple),
    rect(x + 36,y - 62,13,14,purple), rect(x + 39,y - 70,13,8,purple),
    rect(x + 6,y - 20,73,5,lavender), rect(x + 37,y - 41,7,17,GOLD), rect(x + 32,y - 36,17,7,GOLD),
  ];
  if (accessory === 'sunglasses') {
    // Follow the actual eyes, including the downward gaze in writing/commands.
    const eyes = shapes.filter(s => s.fill === INK && s.w === 11 && s.h === 11
      && s.x >= x && s.x < x + 85 && s.y >= y && s.y < y + 40).slice(0, 2);
    if (eyes.length !== 2) throw new Error('Missing eye anchors for sunglasses');
    const [left, right] = eyes.sort((a,b) => a.x - b.x);
    return [rect(left.x - 9,left.y, right.x - left.x + 29,5,INK),
      ...eyes.flatMap(eye => [rect(eye.x - 6,eye.y - 3,27,19,INK),
        rect(eye.x - 1,eye.y,8,4,'#5A7885')])];
  }
  if (accessory === 'crown') return [
    rect(x + 5,y - 14,75,14,GOLD), rect(x + 5,y - 30,10,16,GOLD),
    rect(x + 37,y - 37,11,23,GOLD), rect(x + 70,y - 30,10,16,GOLD),
    rect(x + 38,y - 12,9,8,RED), rect(x + 12,y - 8,5,5,PAPER), rect(x + 67,y - 8,5,5,PAPER),
  ];
  if (accessory === 'nightcap') return [
    rect(x + 2,y - 7,81,7,PAPER), rect(x + 8,y - 22,69,15,blue),
    rect(x + 18,y - 35,49,13,blue), rect(x + 38,y - 45,39,10,blue),
    rect(x + 67,y - 35,20,10,blue), rect(x + 77,y - 25,10,10,blue),
    rect(x + 76,y - 16,15,12,PAPER), rect(x + 30,y - 29,5,5,PAPER),
  ];
  return [
    rect(x + 3,y - 7,79,7,blue), rect(x + 12,y - 19,61,12,RED),
    rect(x + 25,y - 28,35,9,GOLD), rect(x + 40,y - 40,5,12,INK),
    rect(x + 12,y - 45,61,5,GREEN), rect(x + 35,y - 48,15,11,GOLD),
  ];
}

function colour(fill) {
  if (fill.toUpperCase() === CORAL) return 'var(--cm-color, #DD775B)';
  if (['BLACK', '#000', '#000000', 'RGB(0, 0, 0)'].includes(fill.toUpperCase())) return 'var(--cm-ink, #000000)';
  return fill;
}
export function shapeMarkup(shapes) {
  return shapes.filter(s => s.points || s.w > 0 && s.h > 0).map(s => s.points
    ? `<polygon points="${s.points.map(p => p.join(',')).join(' ')}" fill="${colour(s.fill)}"/>`
    : `<rect x="${s.x}" y="${s.y}" width="${s.w}" height="${s.h}" fill="${colour(s.fill)}"/>`).join('');
}

export function compileAnimation(animation) {
  const { name, duration, frames } = animation;
  // Repeated artwork is emitted once and receives all its holds in one timeline.
  const poses = [], indices = [], lookup = new Map();
  for (const frame of frames) {
    const markup = shapeMarkup(frame.shapes);
    if (!lookup.has(markup)) { lookup.set(markup, poses.length); poses.push(markup); }
    indices.push(lookup.get(markup));
  }
  const selector = `.cm-root[data-state="${name}"]`;
  let css = `${selector} .cm-frame { opacity: 0; }\n${selector} .cm-frame-${indices[0]} { opacity: 1; }\n`;
  poses.forEach((pose, index) => {
    const keyframes = [];
    let previous = -1;
    frames.forEach((frame, i) => {
      const visible = indices[i] === index ? 1 : 0;
      if (visible !== previous) keyframes.push(`${+(100 * frame.time / duration).toFixed(6)}% { opacity: ${visible}; }`);
      previous = visible;
    });
    // Hold the final sample until the loop boundary, or after one-shot playback.
    const last = indices[indices.length - 1];
    keyframes.push(`100% { opacity: ${index === last ? 1 : 0}; }`);
    css += `${selector} .cm-frame-${index} { animation: cm-${name}-${index} calc(${duration}s * var(--cm-tempo, 1)) steps(1, end) var(--cm-repeat, ${animation.loop ? 'infinite' : '1'}) both; }\n@keyframes cm-${name}-${index} { ${keyframes.join(' ')} }\n`;
  });
  css += `.cm-root[data-paused="true"] .cm-frame { animation-play-state: paused !important; }\n@media (prefers-reduced-motion: reduce) { ${selector} .cm-frame { animation: none !important; } }\n`;
  const markup = poses.map((pose, i) => `<g class="cm-frame cm-frame-${i}">${pose}</g>`).join('\n');
  const { frames: ignored, ...metadata } = animation;
  return { ...metadata, poseCount: poses.length, frameCount: frames.length, markup, css };
}

export function svgDocument(animation) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${animation.viewBox.join(' ')}" width="${animation.viewBox[2]}" height="${animation.viewBox[3]}" class="cm-root" data-state="${animation.name}" role="img" aria-label="${animation.label}" shape-rendering="crispEdges"><title>${animation.label}</title><style>${animation.css}</style>${animation.markup}</svg>\n`;
}
