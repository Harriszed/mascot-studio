import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {buildToolStudy} from './mascot-tool-study.mjs';
import {compileAnimation,svgDocument} from './mascot-pixel-art.mjs';

const root=new URL('../',import.meta.url);
const reference=JSON.parse(await readFile(new URL('src/components/claude-mascot/reference-artwork.json',root),'utf8'));
const {states}=JSON.parse(await readFile(new URL('src/components/claude-mascot/artwork.json',root),'utf8'));
const study=buildToolStudy(reference),candidate=compileAnimation(study);
const directory=new URL('public/mascot/lab/',root);await mkdir(directory,{recursive:true});
await writeFile(new URL('using-tool-story-study.svg',directory),svgDocument(candidate));
await writeFile(new URL('tool-study-frames.json',directory),JSON.stringify(study));
const originals=states.filter(s=>['using-tool','using-tool-fluid'].includes(s.name));
const shown=[...originals,candidate];
const sprite=s=>`<svg class="cm-root" data-state="${s.name}" viewBox="${s.viewBox.join(' ')}" role="img" aria-label="${s.label}" shape-rendering="crispEdges"><title>${s.label}</title>${s.markup}</svg>`;
const cards=[['The benchmark','Headband and dumbbells','../gifs/using-tool.gif'],['Current extended version','Hammer and three strikes','../gifs/using-tool-fluid.gif'],['New candidate','Grip, weight, work, recovery','using-tool-story-study.gif']];
const html=`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Mascot Studio / Tool story study</title><style>
${shown.map(s=>s.css).join('\n')}
*{box-sizing:border-box}body{margin:0;background:#f7f4ec;color:#25231e;font:15px/1.6 system-ui,sans-serif}main{max-width:1280px;margin:auto;padding:32px 24px}h1{font:normal clamp(36px,5vw,64px)/1.1 Georgia,serif;letter-spacing:-.035em;margin:14px 0}h2{font:normal 24px Georgia,serif;margin:8px 0}.eyebrow{font-size:11px;letter-spacing:.12em}a{color:inherit}button,select,input{font:inherit}button,select{padding:8px 12px;border:1px solid #bfb9ac;background:transparent;color:inherit}button,a,select,input{outline-offset:4px}.toolbar{display:flex;flex-wrap:wrap;gap:18px;align-items:center;margin:26px 0}.toolbar label{display:flex;gap:8px;align-items:center}.gallery{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:22px}.card{border-top:1px solid #cec8ba;padding-top:12px}.surface{background:#ede9df;display:grid;place-items:center;aspect-ratio:12/11}.surface svg{width:100%;height:auto}body[data-dark=true] .surface{background:#302d28}.card p{font-size:12px;margin:8px 0}.new .eyebrow{color:#9d452f}.new .surface{outline:1px solid #9d452f}.transport{border-top:1px solid #cec8ba;margin-top:28px;padding-top:20px}.transport input{width:100%;accent-color:#9d452f}.beat{display:flex;justify-content:space-between;gap:20px}.notes{font-size:12px;color:#6d685e}.story{display:flex;flex-wrap:wrap;gap:10px 20px;padding:0;list-style:none}@media(max-width:900px){.gallery{grid-template-columns:1fr}.surface svg{max-width:480px}.surface{aspect-ratio:auto;min-height:300px}}@media(max-width:480px){main{padding:24px 16px}.beat{flex-direction:column;gap:4px}}
</style></head><body><main><a href="../index.html">Full playground</a><div class="eyebrow" style="margin-top:24px">MASCOT STUDIO / ONE-ANIMATION STUDY</div><h1>A little work. A little weight.</h1><p>One candidate built around preparation, deliberate strikes, expressive poses and a quiet recovery.<br>Compare it with the weightlifting benchmark and the current hammer animation.</p>
<div class="toolbar"><button id="pause" aria-pressed="false">Pause</button><button id="replay">Replay together</button><label>Speed<select id="speed"><option value="1">1&times;</option><option value="2">0.5&times;</option><option value="4">0.25&times;</option></select></label><label><input id="dark" type="checkbox">Dark canvas</label><a href="using-tool-story-study.gif" download>Candidate GIF</a><a href="using-tool-story-study.svg" download>Candidate SVG</a></div>
<section class="gallery">${shown.map((s,i)=>`<article class="card ${i===2?'new':''}"><div class="eyebrow">${cards[i][0]}</div><h2>${cards[i][1]}</h2><div class="surface">${sprite(s)}</div><p>${s.duration.toFixed(2)}s ${s.loop?'loop':'one-shot'} &middot; <a href="${cards[i][2]}" download>GIF</a></p></article>`).join('')}</section>
<section class="transport"><div class="beat"><strong id="stage">Notice the job</strong><span id="time">0.00 / ${study.duration.toFixed(2)}s</span></div><label for="seek" class="notes">Scrub the candidate to inspect its poses</label><input id="seek" type="range" min="0" max="${study.duration}" step="0.01" value="0"><ul class="story"><li>Pick up and grip</li><li>Light strike</li><li>Heavier strike</li><li>Finishing tap</li><li>Inspect and recover</li></ul></section>
<p class="notes">The candidate keeps the original eyes and four block legs. The torso counterbalances in coarse steps, the hand covers the handle, and the nail sinks on contact. This is a separate study; the current 62-state collection is unchanged.<br>Unofficial community project. Claude: Anthropic. Original reference: Ayotomiwa Wale-Durojaye. <a href="../NOTICE.md">Attribution and reuse status</a>.</p></main><script>
const sprites=[...document.querySelectorAll('.cm-root')],candidate=sprites.at(-1),duration=${study.duration},beats=${JSON.stringify(study.frames.map(f=>({time:f.time,stage:f.stage})))};
let paused=false,scrubbing=false;
function setPaused(value){paused=value;sprites.forEach(s=>s.dataset.paused=String(value));const b=document.querySelector('#pause');b.textContent=value?'Resume':'Pause';b.setAttribute('aria-pressed',String(value));}
document.querySelector('#pause').onclick=()=>setPaused(!paused);
document.querySelector('#replay').onclick=()=>sprites.forEach(s=>s.getAnimations({subtree:true}).forEach(a=>a.currentTime=0));
document.querySelector('#speed').onchange=e=>sprites.forEach(s=>s.style.setProperty('--cm-tempo',e.target.value));
document.querySelector('#dark').onchange=e=>document.body.dataset.dark=String(e.target.checked);
function describe(t){const beat=beats.findLast(b=>b.time<=t)||beats[0];document.querySelector('#stage').textContent=beat.stage;document.querySelector('#time').textContent=t.toFixed(2)+' / '+duration.toFixed(2)+'s';}
const seek=document.querySelector('#seek');seek.oninput=()=>{scrubbing=true;setPaused(true);const t=+seek.value;candidate.getAnimations({subtree:true}).forEach(a=>a.currentTime=t*1000*+document.querySelector('#speed').value);describe(t);};seek.onchange=()=>scrubbing=false;
function update(){if(!scrubbing){const a=candidate.getAnimations({subtree:true})[0];if(a){const t=((a.currentTime||0)/+document.querySelector('#speed').value/1000)%duration;seek.value=t;describe(t);}}requestAnimationFrame(update);}update();
</script></body></html>`;
await writeFile(new URL('tool-story.html',directory),html);
console.log(`Built tool-story candidate: ${study.frames.length} timed poses, ${study.duration}s at /mascot/lab/tool-story.html`);
