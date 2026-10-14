// Coarse, reference-sized rectangles: no rotation or finer-grid limb rig.
export const C='#DD775B',I='#000000',P='#FFFDF5',G='#D9A441',OK='#3AAB7C',B='#337FB7',R='#B94236',V='#6943AD';
export const rect=(x,y,w,h,fill=I)=>({x,y,w,h,fill});
export const shift=(shapes,x,y)=>shapes.map(s=>({...s,x:s.x+x,y:s.y+y}));
export const box=(x,y,w,h,fill=P)=>[rect(x,y,w,h),rect(x+5,y+5,w-10,h-10,fill)];
export const tick=(x,y)=>[[0,1],[1,2],[2,1],[3,0]].map(([a,b])=>rect(x+a*5,y+b*5,5,5,OK));
export const table=()=>[rect(150,145,60,10),rect(155,150,10,20),rect(195,150,10,20)];
export const card=(x,y,n=0,color=B)=>[...box(x,y,35,25),rect(x+5,y+5,25,5,color),...(n?[rect(x+5,y+15,n*5,5,OK)]:[])];
export const shades=(x=55,y=80)=>[rect(x,y,85,5),rect(x+5,y,30,20),rect(x+50,y,30,20),rect(x+10,y+5,10,5,B),rect(x+55,y+5,10,5,B)];
export const bulb=(x=165,y=20)=>[rect(x+5,y,20,5,G),rect(x,y+5,30,20,G),rect(x+5,y+25,20,5,G),rect(x+10,y+30,10,10),rect(x+10,y+40,10,5)];
const presets={rest:[[140,98,22,23]],down:[[140,108,22,23]],hold:[[135,113,17,18]],point:[[140,98,15,15],[155,93,15,10]],
 'half-wave':[[140,90,15,25],[150,80,20,20]],wave:[[140,85,15,25],[140,65,15,25],[135,50,20,20]],
 'wave-out':[[140,85,15,25],[145,65,15,25],[145,50,20,20]],'wave-in':[[140,85,15,25],[135,65,15,25],[125,50,20,20]],
 'half-head':[[140,90,15,20],[135,80,20,15]],head:[[140,85,15,20],[135,70,20,15]],scratch:[[140,80,15,25],[130,65,20,15]],
 lap:[[140,108,17,22],[120,123,25,15]],
 reach:[[140,103,15,20],[150,113,20,15],[165,118,20,15]],brace:[[140,103,22,18],[157,108,10,15]]};
// A supported elbow and a chunky palm, composed from thick orthogonal blocks.
export function handAt(x,y,side='right') {
 if(side==='left')return handAt(195-x,y).map(([a,b,w,h])=>[195-a-w,b,w,h]);
 const elbow=y<90?y+10:108;
 return [[140,98,15,22],[140,Math.min(elbow,105),15,Math.abs(elbow-105)+15],
  [Math.min(140,x-10),elbow,Math.abs(x-10-140)+20,15],
  [x-10,Math.min(elbow,y-10),20,Math.abs(elbow-y+10)+15],[x-10,y-10,20,20]];
}
export function createStoryKit(draw) {
 function actor(o={}) {
  const {dx=0,dy=0,lean=0,puff=0,seated=false,left='rest',right='rest',leftBlocks,rightBlocks,...other}=o;
  const base=draw({...other,dx,dy,gazeX:(other.gazeX||0)+lean,left:'rest',right:'rest',lean:0,planted:!other.airborne});
  let body=lean?[rect(55+dx+lean,70+dy,85,45,C),rect(55+dx,115+dy,85,20,C)]:[base[4]];
  if(puff)body=[rect(55+dx-puff*5,70+dy-puff*5,85+puff*10,65+puff*5,C)];
  const arm=(side,pose,custom)=>{
   let blocks=custom||presets[pose]||presets.rest;
   if(side==='left'&&!custom)blocks=blocks.map(([x,y,w,h])=>[195-x-w,y,w,h]);
   return blocks.map(([x,y,w,h])=>rect(x+dx+lean+(puff?(side==='left'?-1:1)*puff*5:0),y+dy,w,h,C));
  };
  // Fold the four original-width legs into supported L shapes on the same floor.
  // The torso keeps its original 85x65 rectangle; the feet never bob with it.
  const legs=seated?[
   rect(55+dx,140,11,11,C),rect(38+dx,145,28,11,C),
   rect(76+dx,140,11,11,C),rect(71+dx,145,16,11,C),
   rect(108+dx,140,11,11,C),rect(108+dx,145,16,11,C),
   rect(129+dx,140,11,11,C),rect(129+dx,145,28,11,C),
  ]:base.slice(0,4);
  return [...legs,...body,...arm('left',left,leftBlocks),...arm('right',right,rightBlocks),...base.slice(7)];
 }
 function story(name,description,author,{loop=true,reducedStage}={}) {
  const frames=[];let elapsed=0;
  function beat(ms,stage,options={},front=[],back=[]) {
   const shapes=[...back,...actor(options),...front].flatMap(s=>{
    const x=Math.max(-20,s.x),y=Math.max(-40,s.y),r=Math.min(220,s.x+s.w),b=Math.min(180,s.y+s.h);
    return r>x&&b>y?[{...s,x,y,w:r-x,h:b-y}]:[];
   });
   frames.push({time:elapsed/1000,stage,shapes});elapsed+=ms;
  }
  author(beat);
  return {name,description,frames,duration:elapsed/1000,loop,reducedFrame:Math.max(0,frames.findIndex(f=>f.stage===reducedStage)),storyVersion:2,viewBox:[-20,-40,240,220],style:'original-block-pixel'};
 }
 return {actor,story};
}
