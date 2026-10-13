# Animation refinement / v1.6.0

Built using the researched Mascot Studio guidance: readable key poses, separate setup/action/recovery timing, stable pixel clusters, deliberate secondary motion, and complete loop recovery.

The 22 extended activity IDs and all ten gag IDs remain compatible. The 22 originals and eight accessories are unchanged. All states retain transparent SVG/GIF downloads, and the GIF ZIP still contains 62 individual animations.

## Longer gag stories

Each loop adds actions and a payoff rather than repeating its previous sequence at a slower speed. Deep thought retains steady dots; coffee stays on its table. Speech captions remain the host app's responsibility.

| ID | Previous | Updated | Story |
| --- | --- | --- | --- |
| `gag-hallucinate` | 3.76s | 10.71s | Watches rainbow squiggles form an imaginary constellation, checks it carefully, then nods with complete confidence. |
| `gag-tokens` | 5.10s | 12.29s | Counts coins, overfills the jar, tidies the surplus into a packet, then slides the savings away. |
| `gag-context` | 3.72s | 10.73s | Fills the memory bar, tries to fit one more card while puffed up, then releases the backlog and returns to size. |
| `gag-prompt` | 6.86s | 10.76s | Studies steady dots, scratches its head, turns a small idea into a three-step plan, then calmly settles back. |
| `gag-robot` | 5.09s | 10.97s | A little robot walks in, waves, shares a fist bump and a successful sync, then heads out with a farewell. |
| `gag-nap` | 4.82s | 12.43s | Yawns, trains through a long nap, wakes for a stretch, almost nods off again, then catches itself. |
| `gag-coffee` | 5.45s | 11.87s | Studies the steam, stirs the mug, taps the rim twice, gives it one last stir, then relaxes into the warmth. |
| `gag-dance` | 4.66s | 9.89s | Adjusts the headphones, side-steps with lifted feet, adds a shoulder groove and a little hop, then bows and resets. |
| `gag-buffering` | 5.04s | 11.12s | Watches the spinner stall, checks its head, celebrates a brief success, then discovers it is buffering again. |
| `gag-deploy` | 4.61s | 11.02s | Runs launch checks, counts down, watches the rocket accelerate away, confirms delivery, then welcomes the next rocket. |

## Refined activities

Setup and recovery receive their own holds, while useful action transitions keep their speed. Reading now has eleven page-turn silhouettes. Writing gets a connected pen grip. Thinking keeps one steady bulb; memory warnings and server lights stay stable. Small torso movements keep the feet supported, and the walk keeps its original rectangular anatomy with weighted contact timing. Done still lasts five seconds and finishes in its resting pose. Every extended state has a chosen reduced-motion pose.

| ID | Previous | Updated |
| --- | --- | --- |
| `idle-fluid` | 4.12s | 5.00s |
| `thinking-fluid` | 3.23s | 5.79s |
| `using-tool-fluid` | 3.22s | 4.02s |
| `directing-helpers-fluid` | 2.89s | 3.80s |
| `done-fluid` | 5.00s | 5.00s |
| `greeting-fluid` | 3.00s | 3.85s |
| `asleep-fluid` | 3.92s | 6.06s |
| `reading-fluid` | 2.99s | 4.08s |
| `writing-fluid` | 2.55s | 3.43s |
| `running-commands-fluid` | 2.51s | 3.67s |
| `searching-web-fluid` | 2.53s | 4.26s |
| `searching-code-fluid` | 2.53s | 4.26s |
| `testing-fluid` | 3.69s | 4.67s |
| `committing-fluid` | 2.61s | 3.58s |
| `waiting-for-you-fluid` | 3.05s | 3.97s |
| `error-fluid` | 2.18s | 2.73s |
| `compacting-fluid` | 2.73s | 3.73s |
| `context-nearly-full-fluid` | 2.40s | 4.90s |
| `plan-progress-fluid` | 3.17s | 4.45s |
| `server-running-fluid` | 3.09s | 4.39s |
| `typing-fluid` | 2.89s | 4.06s |
| `walking-fluid` | 0.60s | 0.60s |

Validation: original/accessory preservation, source geometry and bounds, full loop recovery, five-second Done behavior, decoded GIF frames, and browser controls. The showcase renderer uses pages long enough to show complete stories.
