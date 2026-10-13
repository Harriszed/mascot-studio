import {createStoryKit,rect as r,shift,box,tick,table,card,shades,bulb,handAt,C,I,P,G,OK,B,R} from './mascot-story-kit.mjs';
import {buildToolStudy} from './mascot-tool-study.mjs';
export function buildActivityStories(h) {
 const {story,actor}=createStoryKit(h.draw),stories=[];
 const add=(name,description,author,options)=>stories.push(story(name,description,author,options));
 const dots=()=>[0,1,2].map(j=>r(80+j*15,30,5,5,B));
 const keyboard=()=>[...box(55,125,85,25),...[0,1,2,3,4,5].map(i=>r(65+i*10,130,5,5,G)),r(80,140,35,5,G)];
 const screen=(n=0)=>[...box(55,5,85,50),r(65,15,10,5,C),...(n?[r(80,15,n*10,5,C)]:[]),...Array.from({length:Math.max(0,n-2)},(_,j)=>r(65,30+j*5,35+j*10,5,OK))];
 const notebook=(n=0)=>[...box(60,115,75,40),r(95,120,5,30),...[0,1,2].flatMap(j=>[r(65,120+j*10,10,5,j<n?OK:'#70685D'),r(105,120+j*10,20,5,C)])];
 add('idle','Checks both sides, rolls its shoulders and stretches before settling into a quiet watch.',b=>{
  b(1400,'At ease');b(120,'Notice',{gazeX:-5});b(650,'Listen left',{gazeX:-10});b(140,'Center');b(140,'Notice right',{gazeX:5});b(600,'Listen right',{gazeX:10});b(160,'Relax');b(100,'Blink',{eyes:'closed'});b(600,'At ease');
  b(180,'Shoulders back',{left:'point',right:'point',dy:5});b(140,'Raise arms',{left:'half-wave',right:'half-wave'});b(650,'Stretch',{left:'wave',right:'wave',eyes:'closed',dy:-5});b(250,'Release',{left:'wave-out',right:'wave-out',eyes:'happy'});b(140,'Lower arms',{left:'half-wave',right:'half-wave'});b(160,'Lower hands',{left:'point',right:'point'});b(1300,'At ease');
 },{reducedStage:'At ease'});
 add('thinking','Studies a problem, scratches its head, tests a steady idea and nods before filing the answer.',b=>{
  const problem=card(165,110,0,G);
  b(650,'Study',{gazeX:5,gazeY:10},problem);b(450,'Look for a route',{gazeY:-5},[...problem,...dots()]);b(180,'Raise a hand',{right:'half-head'},[...problem,...dots()]);b(700,'Consider',{right:'head',gazeX:-5},[...problem,...dots()]);
  for(let i=0;i<2;i++){b(280,'Scratch',{right:'scratch',gazeY:-5},[...problem,...dots()]);b(550,'Think',{right:'head',gazeY:-5},[...problem,...dots()]);}
  b(180,'A possibility',{right:'half-head',gazeX:5},[...problem,...bulb()]);b(700,'Test the idea',{right:'point',gazeX:5},[...problem,...bulb()]);b(180,'Nod',{dy:5,eyes:'closed'},[...card(165,110,3,G),...bulb()]);b(900,'Clear idea',{eyes:'happy'},[...card(165,110,3,G),...bulb()]);
  for(const y of [105,95,80,60,35])b(100,'File the answer',{right:'point'},card(165,y,3,G));b(500,'Reset');b(650,'Study',{gazeX:5,gazeY:10},problem);
 },{reducedStage:'Clear idea'});
 stories.push({...buildToolStudy(h.draw),name:'using-tool',storyVersion:2});
 add('directing-helpers','Puts on shades, lifts three work cards, conducts their dispatch, then lowers the shades to inspect the result.',b=>{
  const tasks=(ys=[25,30,25],xs=[-5,80,165],done=0)=>xs.flatMap((x,j)=>card(x,ys[j],j<done?3:0,[B,G,C][j]));
  b(650,'Survey',{},tasks());b(160,'Reach for shades',{right:'reach'},[...tasks(),...shades(115,125)]);
  for(const [x,y] of [[110,120],[100,105],[85,95],[70,85],[55,80]])b(100,'Put on shades',{rightBlocks:handAt(x+75,y+10)},[...tasks(),...shades(x,y)]);
  b(650,'Cool composure',{right:'head'},[...tasks(),...shades()]);b(180,'Prepare the lift',{dy:5,left:'point',right:'point'},[...tasks(),...shades(55,85)]);
  for(const lift of [0,5,10,15])b(120,'Lift the work',{left:'half-wave',right:'half-wave'},[...tasks([25-lift,30-lift,25-lift]),...shades()]);
  b(650,'Hold formation',{left:'wave',right:'wave'},[...tasks([10,15,10]),...shades()]);
  for(let j=0;j<3;j++){
   b(450,'Choose a task',{[j%2?'left':'right']:'wave-in'},[...tasks([10,15,10],[-5,80,165],j),...shades()]);
   for(const d of [5,15,30,50,80]){const xs=[-5,80,165],ys=[10,15,10];xs[j]+=j===0?-d:j===2?d:0;ys[j]-=j===1?d:0;b(100,'Dispatch',{left:'point',right:'wave-out'},[...tasks(ys,xs,j+1),...shades()]);}
   b(350,'Report back',{left:'point',right:'point'},[...tasks([10,15,10],[-5,80,165],j+1),...shades()]);
  }
  b(900,'All tasks complete',{left:'half-wave',right:'half-wave'},[...tasks([10,15,10],[-5,80,165],3),...shades()]);b(180,'Lower shades',{right:'head'},[...tasks([10,15,10],[-5,80,165],3),...shades(55,90)]);b(650,'Check result',{eyes:'happy'},[...tasks([10,15,10],[-5,80,165],3),...shades(55,105)]);
  for(const [x,y] of [[70,110],[90,120],[115,125]])b(120,'Set shades down',{rightBlocks:handAt(x+75,y+10)},[...tasks([10,15,10],[-5,80,165],3),...shades(x,y)]);
  b(500,'Recover',{},tasks([10,15,10],[-5,80,165],3));b(400,'Survey',{},tasks());
 },{reducedStage:'All tasks complete'});
 add('done','Makes one emphatic celebration hop, lands with weight, bows and rests at five seconds.',b=>{
  b(300,'Realize it is done');b(180,'Gather energy',{dy:5,eyes:'closed',left:'down',right:'down'});b(100,'Launch',{left:'half-wave',right:'half-wave',dy:-5,airborne:true});b(300,'Celebrate',{dy:-10,airborne:true,left:'wave',right:'wave',eyes:'happy'},tick(85,20));b(100,'Descend',{dy:-5,airborne:true,left:'half-wave',right:'half-wave',eyes:'happy'},tick(85,20));b(180,'Land',{dy:5,eyes:'closed',left:'point',right:'point'},tick(85,20));b(250,'Settle',{eyes:'happy'},tick(85,20));b(650,'Enjoy result',{eyes:'happy',right:'half-wave'},tick(85,20));b(160,'Lower hand',{eyes:'happy',right:'point'},tick(85,20));b(350,'Bow',{dy:5,eyes:'closed',left:'down',right:'down'},tick(85,20));b(450,'Recover',{eyes:'happy'},tick(85,20));b(1980,'Rest');b(0,'Rest');
 },{loop:false,reducedStage:'Enjoy result'});
 add('greeting','Spots you, perks up, gives three differently timed waves, then bows and relaxes.',b=>{
  b(650,'Spot you',{gazeX:5});b(180,'Perk up',{dy:-5,eyes:'happy'});b(120,'Raise hand',{right:'point'});b(120,'Raise elbow',{right:'half-wave'});b(500,'Hello',{right:'wave',eyes:'happy'});
  for(const hold of [200,140,300]){b(hold,'Wave out',{right:'wave-out',eyes:'happy',lean:-5});b(100,'Wave through',{right:'wave',eyes:'happy'});b(hold,'Wave in',{right:'wave-in',eyes:'happy'});}
  b(550,'Hold greeting',{right:'wave',eyes:'happy'});b(140,'Lower hand',{right:'half-wave',eyes:'happy'});b(160,'Relax hand',{right:'point',eyes:'happy'});b(550,'Bow',{dy:5,eyes:'closed',left:'down',right:'down'});b(200,'Rise',{eyes:'happy'});b(900,'Spot you',{gazeX:5});
 },{reducedStage:'Hello'});
 add('asleep','Tucks a blanket, drifts off, breathes through three slow cycles and snuggles back into it.',b=>{
  const blanket=y=>[r(55,y,85,135-y,B),r(55,y,85,5,P),r(70,y+10,55,5,'#5A7885')];
  b(650,'Sleepy',{eyes:'closed',left:'hold',right:'hold'},blanket(115));for(const y of [115,110,105])b(180,'Tuck blanket',{eyes:'closed',left:'hold',right:'hold'},blanket(y));b(900,'Drift off',{eyes:'closed',dy:5,left:'down',right:'down'},blanket(105));
  for(let cycle=0;cycle<3;cycle++)for(let phase=0;phase<8;phase++){const dy=[5,5,0,0,0,0,5,5][phase];b(300,'Breathe',{eyes:'closed',dy,left:'down',right:'down'},[...blanket(105+dy),...h.glyph('Z',155,45-phase*10,5,C)]);}
  b(180,'Snuggle',{eyes:'closed',right:'half-head'},blanket(105));b(550,'Rub sleepy eye',{eyes:'closed',right:'head'},blanket(105));b(180,'Tuck again',{eyes:'closed',right:'half-head'},blanket(110));b(650,'Sleepy',{eyes:'closed',left:'hold',right:'hold'},blanket(115));
 },{reducedStage:'Drift off'});
 add('reading','Finds a passage, turns two deliberate pages, places a bookmark and remembers the useful passage.',b=>{
  const book=()=>h.book(0),pose={left:'hold',right:'hold',gazeY:15};b(700,'Find passage',{...pose,gazeX:-5},book());
  for(let page=0;page<2;page++){for(const x of [-5,0,5])b(380,'Read across',{...pose,gazeX:x},book());b(180,'Catch corner',{...pose,rightBlocks:handAt(130,120)},book());
   for(let i=0;i<11;i++){const width=[30,25,20,15,10,5,10,15,20,25,30][i],x=i<6?100:100-width;b(i===5?220:100,'Turn page',{...pose,gazeX:i<6?5:-5},[...book(),r(x,108,width,40,P),r(i<6?x+width-5:x,113,5,30)]);}b(600,'Settle page',{...pose,gazeX:-5},book());}
  for(const y of [70,85,100,110])b(130,'Place bookmark',{...pose,right:'point'},[...book(),r(125,y,5,35,G)]);b(750,'Remember passage',{...pose,eyes:'happy'},[...book(),r(125,110,5,35,G)]);
  for(const y of [100,85,65])b(130,'Lift bookmark',{...pose,right:'point'},[...book(),r(125,y,5,35,G)]);b(700,'Find passage',{...pose,gazeX:-5},book());
 },{reducedStage:'Remember passage'});
 add('writing','Picks up a pencil, drafts two lines, corrects a word, underlines the result and clears the finished sheet.',b=>{
  const page=(a=0,c=0,dx=0)=>shift([...box(60,118,75,40),...(a?[r(70,130,a,5,C)]:[]),...(c?[r(70,142,c,5,C)]:[])],dx,0);
  const pencil=(x,y)=>[r(x,y-25,5,25,G),r(x,y-30,5,5,R),r(x,y,5,5,I)];const hold=(x,y)=>({gazeY:15,left:'hold',rightBlocks:handAt(x+2,y-10)});
  b(650,'Blank page',{left:'hold',gazeY:15},[...page(),...pencil(145,135)]);b(180,'Pick up pencil',hold(145,135),[...page(),...pencil(145,135)]);
  for(const x of [135,120,105,90,70])b(100,'Bring pencil to paper',hold(x,130),[...page(),...pencil(x,130)]);
  for(let line=0;line<2;line++){for(let i=0;i<8;i++)b(i===0?280:100,'Write a line',hold(70+i*5,130+line*12),[...page(line?40:(i+1)*5,line?(i+1)*5:0),...pencil(70+i*5,130+line*12)]);b(450,'Review',{left:'hold',gazeY:15},[...page(40,line?40:0),...pencil(140,130)]);}
  b(350,'Notice correction',{gazeY:15,right:'half-head'},[...page(40,40),...pencil(140,130)]);for(const x of [100,95,90,95,100])b(120,'Correct a word',hold(x,142),[...page(40,40),r(90,140,20,5,P),...pencil(x,142)]);
  for(const x of [70,80,90,100,110])b(100,'Underline',hold(x,150),[...page(40,40),r(70,150,x-65,5,OK),...pencil(x,150)]);
  b(850,'Finished draft',{eyes:'happy',left:'hold'},[...page(40,40),r(70,150,45,5,OK),...pencil(145,135)]);for(const x of [0,5,15,30,50,80,120])b(100,'Clear sheet',{right:'reach'},[...page(40,40,x),...pencil(145,135)]);b(650,'Blank page',{left:'hold',gazeY:15},[...page(),...pencil(145,135)]);
 },{reducedStage:'Finished draft'});
 add('running-commands','Composes a command, presses Enter with purpose, follows the output and acknowledges a successful exit.',b=>{
  b(650,'Read terminal',{gazeY:-5},[...screen(),...keyboard()]);for(let i=0;i<10;i++)b(i%3===0?180:100,'Type command',{gazeY:15,left:i%2?'hold':'down',right:i%2?'down':'hold'},[...screen(Math.min(4,Math.ceil(i/2))),...keyboard()]);
  b(450,'Check command',{gazeY:-5},[...screen(4),...keyboard()]);b(200,'Raise finger',{right:'hold',gazeY:15},[...screen(4),...keyboard()]);b(100,'Press Enter',{rightBlocks:handAt(125,135),dy:5,gazeY:15},[...screen(4),...keyboard()]);b(160,'Release key',{right:'hold',gazeY:-5},[...screen(4),...keyboard()]);
  for(let n=3;n<=5;n++)b(650,'Read output',{gazeY:-5,gazeX:n%2?5:-5},[...screen(n),...keyboard()]);b(800,'Successful exit',{eyes:'happy',right:'half-wave'},[...screen(5),...keyboard(),...tick(160,30)]);b(180,'Lower hand',{right:'point'},[...screen(5),...keyboard()]);b(350,'Reset',{},[...screen(),...keyboard()]);b(650,'Read terminal',{gazeY:-5},[...screen(),...keyboard()]);
 },{reducedStage:'Successful exit'});
 for(const name of ['searching-web','searching-code'])add(name,name==='searching-web'?'Picks up a magnifier, compares three web results, retraces a useful match and bookmarks it.':'Scans code rows with a magnifier, retraces a match and bookmarks the useful definition.',b=>{
  const emblem=name==='searching-web'?shift(h.globe().map(s=>({...s,fill:B})),-80,-10):[...h.glyph('<',0,15,3),...h.glyph('/',15,15,3),...h.glyph('>',30,15,3)];
  const panel=(found=-1)=>[...emblem,...box(60,5,80,50),...[0,1,2].flatMap(j=>[r(70,15+j*10,10,5,j===found?OK:B),r(85,15+j*10,40-j*5,5,j===found?OK:C)])];
  const glass=(x,y)=>[...box(x-15,y-15,30,30),r(x-2,y+15,5,25,G)];const hold=(x,y)=>({gazeY:-5,gazeX:x<100?-5:5,rightBlocks:handAt(x,y+30)});
  b(650,'Study search',{gazeY:-5},panel());b(180,'Take magnifier',hold(160,65),[...panel(),...glass(160,65)]);
  for(const [x,y] of [[145,50],[130,35],[110,25],[85,25],[100,25],[120,25],[120,35],[100,35],[80,35],[80,45],[100,45],[120,45]])b(x===80?330:130,'Scan result',hold(x,y),[...panel(),...glass(x,y)]);
  b(600,'Possible match',hold(100,35),[...panel(1),...glass(100,35)]);for(const x of [95,90,95,100,105,100])b(140,'Check match',hold(x,35),[...panel(1),...glass(x,35)]);b(750,'Confirm find',{...hold(100,35),eyes:'happy'},[...panel(1),...glass(100,35),...tick(160,25)]);
  for(const [x,y] of [[120,45],[140,55],[160,65]])b(130,'Lower magnifier',hold(x,y),[...panel(1),...glass(x,y)]);b(550,'Bookmark answer',{right:'point',eyes:'happy'},[...panel(1),...tick(160,25)]);b(650,'Study search',{gazeY:-5},panel());
 },{reducedStage:'Bookmark answer'});
 add('testing','Presses three test buttons, investigates an amber result, retries it and celebrates a complete pass.',b=>{
  const rig=(s=[0,0,0],pressed=-1)=>[...table(),...[0,1,2].flatMap(j=>[...box(155+j*15,120,15,25,[P,OK,G][s[j]]),r(155+j*15,115+(pressed===j?5:0),15,5,B)]),...box(65,10,70,35),...s.map((v,j)=>r(75+j*15,20,10,10,[P,OK,G][v]))];
  let s=[0,0,0];b(650,'Inspect rig',{gazeX:5},rig());
  for(let j=0;j<3;j++){const x=162+j*15;b(180,'Reach for test',{rightBlocks:handAt(x,105),gazeX:5},rig(s));b(450,'Ready test',{rightBlocks:handAt(x,110),gazeX:5},rig(s));b(100,'Press test',{rightBlocks:handAt(x,115),dy:5,gazeX:5},rig(s,j));b(150,'Release',{rightBlocks:handAt(x,110)},rig(s));s[j]=j===1?2:1;b(650,'Read result',{gazeY:-5},rig(s));
   if(j===1){b(180,'Inspect amber',{right:'half-head',gazeY:-5},rig(s));b(550,'Consider retry',{right:'head',gazeY:-5},rig(s));b(120,'Retry',{rightBlocks:handAt(x,115),dy:5},rig(s,j));s[j]=1;b(550,'Retry passed',{eyes:'happy'},rig(s));}}
  b(900,'All tests passed',{eyes:'happy',right:'half-wave'},[...rig(s),...tick(155,40)]);b(180,'Lower hand',{right:'point'},rig(s));b(550,'Reset rig',{right:'reach'},rig());b(650,'Inspect rig',{gazeX:5},rig());
 },{reducedStage:'All tests passed'});
 add('committing','Checks the changes, stamps a commit, sends its packet up the branch and waits for delivery confirmation.',b=>{
  const branch=()=>[r(95,10,5,45,B),r(100,25,25,5,B),r(120,10,5,20,B),...box(85,0,25,15),...box(110,0,25,15)];const scene=()=>[...table(),...card(165,120,0,C),...branch()];
  b(650,'Check changes',{gazeX:5,gazeY:10},scene());b(180,'Raise stamp',{rightBlocks:handAt(180,95)},[...scene(),r(170,90,20,10,G),r(175,100,10,10)]);b(550,'Ready commit',{rightBlocks:handAt(180,95),gazeX:5},[...scene(),r(170,90,20,10,G),r(175,100,10,10)]);b(100,'Stamp',{rightBlocks:handAt(180,110),dy:5},[...scene(),r(170,110,20,10,G),r(175,120,10,5)]);b(180,'Lift stamp',{rightBlocks:handAt(180,95)},[...scene(),...tick(170,125)]);b(650,'Committed',{eyes:'happy'},[...scene(),...tick(170,125)]);
  for(const [x,y] of [[165,110],[160,95],[150,80],[135,60],[115,40],[90,20],[90,5]])b(120,'Push packet',{right:'half-wave',gazeY:-5},[...table(),...branch(),...card(x,y,3,C)]);b(750,'Wait for delivery',{gazeY:-5},[...table(),...branch()]);b(900,'Delivery confirmed',{eyes:'happy',right:'wave'},[...table(),...branch(),...tick(150,25)]);b(180,'Recover',{right:'half-wave'},[...table(),...branch()]);b(650,'Check changes',{gazeX:5,gazeY:10},scene());
 },{reducedStage:'Delivery confirmed'});
 add('waiting-for-you','Turns toward you, offers an open palm and a small question, then lowers the hand and waits patiently.',b=>{
  const q=()=>h.glyph('?',170,35,5,C);b(1500,'Wait',{gazeX:5},q());b(180,'Notice you',{gazeX:10},q());b(160,'Offer hand',{right:'point',gazeX:5},q());b(650,'Your turn',{right:'half-wave',gazeX:5},q());b(180,'Small nod',{right:'half-wave',dy:5,gazeX:5},q());b(650,'Your turn',{right:'half-wave',gazeX:5},q());b(160,'Lower hand',{right:'point',gazeX:5},q());b(160,'Relax',{gazeX:5},q());b(1600,'Wait',{gazeX:5},q());b(100,'Blink',{gazeX:5,eyes:'closed'},q());b(1300,'Wait',{gazeX:5},q());
 },{reducedStage:'Wait'});
 add('error','Recoils at an unplugged connector, examines it, tries a careful repair and pauses with an honest question.',b=>{
  const cable=(gap=10)=>[...table(),r(155,130,15,10,B),r(170,130,10,10),r(180+gap,130,15,10,B),r(175+gap,132,5,5,G),...h.glyph('!',95,20,5,R)];
  b(600,'Spot failure',{},cable());b(120,'Recoil',{lean:-5,eyes:'closed',left:'down',right:'down'},cable());b(350,'Settle',{gazeX:5},cable());b(160,'Check problem',{right:'half-head'},cable());b(650,'Diagnose',{right:'head',gazeX:5},cable());
  for(const gap of [10,5,0])b(180,'Reconnect carefully',{rightBlocks:handAt(195+gap,135),gazeX:5},cable(gap));b(700,'Wait for result',{gazeX:5},cable(0));b(180,'Still a problem',{eyes:'closed',dy:5},cable(0));b(650,'Another route',{right:'scratch',gazeX:5},cable(0));b(900,'Ask what next',{right:'half-wave'},[...cable(0),...h.glyph('?',165,45,5,C)]);for(const gap of [5,10])b(180,'Leave it safe',{rightBlocks:handAt(195+gap,135)},cable(gap));b(900,'Spot failure',{},cable());
 },{reducedStage:'Ask what next'});
 add('compacting','Gathers a loose stack, squares its edges, presses it into a neat packet and files it.',b=>{
  const stack=gap=>[0,1,2].flatMap(j=>card(65+j*gap,110+j*gap,0,C));b(650,'Inspect stack',{gazeY:15},stack(15));b(180,'Gather pages',{left:'hold',right:'hold'},stack(15));for(const gap of [15,10,5,0])b(180,'Square edges',{leftBlocks:handAt(60+gap,125,'left'),rightBlocks:handAt(130-gap,125),eyes:gap===0?'closed':'open'},stack(gap));b(650,'Apply pressure',{left:'hold',right:'hold',dy:5,eyes:'closed'},stack(0));b(180,'Release',{left:'hold',right:'hold'},card(80,115,3,C));b(800,'Neat packet',{eyes:'happy',left:'hold',right:'hold'},card(80,115,3,C));for(const x of [80,90,105,125,150,180,210])b(120,'File packet',{right:'reach',gazeX:5},card(x,115,3,C));b(500,'Recover',{eyes:'happy'});for(const gap of [0,5,10,15])b(150,'Next stack',{gazeY:15},stack(gap));b(650,'Inspect stack',{gazeY:15},stack(15));
 },{reducedStage:'Neat packet'});
 add('context-nearly-full','Inspects the nearly full memory case, tries its lid, makes room for a spare card and calmly flags the limit.',b=>{
  const meter=()=>[...box(60,10,80,25),r(65,15,60,15,G),r(125,15,10,15,R)];const suitcase=lid=>[...table(),...box(155,120,50,25,G),r(155,110-lid,50,10),r(175,105-lid,15,5)];
  b(800,'Notice limit',{gazeY:-5},[...meter(),...suitcase(0)]);b(180,'Check case',{right:'reach',gazeX:5},[...meter(),...suitcase(0)]);for(const lid of [0,5,10,15])b(180,'Lift lid',{rightBlocks:handAt(180,110-lid),gazeX:5},[...meter(),...suitcase(lid)]);b(600,'No room left',{right:'half-head',gazeX:5},[...meter(),...suitcase(15),...card(165,50)]);for(const lid of [10,5,0])b(160,'Close gently',{rightBlocks:handAt(180,110-lid)},[...meter(),...suitcase(lid),...card(165,50)]);b(700,'Consider limit',{right:'head',gazeY:-5},[...meter(),...suitcase(0),...card(165,50)]);b(1000,'Flag limit',{right:'half-wave',gazeY:-5},[...meter(),...suitcase(0),...h.glyph('!',165,45,5,R)]);b(180,'Lower hand',{right:'point'},[...meter(),...suitcase(0)]);b(1000,'Notice limit',{gazeY:-5},[...meter(),...suitcase(0)]);
 },{reducedStage:'Flag limit'});
 add('plan-progress','Works through three deliberate notebook checkmarks, shows the completed plan and turns to a fresh page.',b=>{
  b(650,'Read plan',{left:'hold',right:'hold',gazeY:15},notebook());for(let row=0;row<3;row++){b(550,'Next step',{left:'hold',right:'hold',gazeY:15},notebook(row));b(160,'Raise pencil',{left:'hold',rightBlocks:handAt(80,110+row*10),gazeY:15},notebook(row));for(const x of [70,75,80])b(100,'Mark milestone',{left:'hold',rightBlocks:handAt(x,120+row*10),gazeY:15},[...notebook(row),r(x,120+row*10,5,5,OK)]);b(550,'Step complete',{left:'hold',right:'hold',gazeY:15,eyes:row===2?'happy':'open'},notebook(row+1));}b(950,'Show plan',{left:'hold',right:'half-wave',eyes:'happy'},[...notebook(3),...tick(160,25)]);for(const x of [0,5,15,30,50,80])b(100,'Next plan',{left:'hold',right:'hold'},shift(notebook(3),x,0));b(650,'Read plan',{left:'hold',right:'hold',gazeY:15},notebook());
 },{reducedStage:'Show plan'});
 add('server-running','Monitors steady lights, receives a request, checks a connection and sends a successful response.',b=>{
  const server=()=>[0,1,2].flatMap(j=>[...box(160,75+j*20,45,20),r(165,80+j*20,5,5,OK),r(175,80+j*20,20,5)]);b(1200,'Monitor',{gazeX:5},server());for(const x of [220,210,195,180,165])b(140,'Receive request',{gazeX:5},[...server(),...card(x,30)]);b(600,'Inspect request',{gazeX:5,gazeY:-5},[...server(),...card(165,30)]);b(180,'Check connection',{right:'reach'},[...server(),...card(165,30)]);b(150,'Press switch',{rightBlocks:handAt(185,115),dy:5},[...server(),...card(165,30)]);b(700,'Process',{gazeX:5},[...server(),...card(165,30,3)]);for(const x of [165,175,190,210,230])b(120,'Send response',{right:'point',gazeX:5},[...server(),...card(x,30,3)]);b(800,'Request served',{right:'half-wave',eyes:'happy'},[...server(),...tick(165,30)]);b(180,'Recover',{right:'point'},server());b(1300,'Monitor',{gazeX:5},server());b(100,'Blink',{eyes:'closed'},server());b(900,'Monitor',{gazeX:5},server());
 },{reducedStage:'Monitor'});
 add('typing','Leans in to listen, follows your growing draft, gives an encouraging nod and waits for the next line.',b=>{
  const bubble=n=>[...box(60,10,80,35),r(75,45,10,10),...Array.from({length:n},(_,j)=>r(70+(j%4)*10,20+(j>3?10:0),5,5,B))];b(900,'Listen',{gazeY:-5},bubble(0));b(180,'Lean in',{lean:5,gazeY:-5},bubble(0));for(let n=1;n<=6;n++)b(n===4?650:350,'Follow draft',{gazeY:-5,gazeX:n<4?-5:5,lean:5},bubble(n));b(700,'Next word',{gazeY:-5,lean:5},bubble(6));b(150,'Encouraging nod',{dy:5,eyes:'closed'},bubble(6));b(850,'Keep listening',{right:'half-wave',eyes:'happy'},bubble(6));b(160,'Lower hand',{right:'point'},bubble(6));for(const y of [0,-5,-15,-30,-55])b(120,'Fresh line',{gazeY:-5},shift(bubble(6),0,y));b(900,'Listen',{gazeY:-5},bubble(0));
 },{reducedStage:'Listen'});
 // A walk remains a continuous cadence, with deliberate contact and weight transfer.
 const frames=[];let elapsed=0;
 for(let i=0;i<24;i++){const source=h.walking[Math.floor(i*h.walking.length/24)].shapes,phase=Math.floor(i/6),pose=actor({gazeX:5,lean:phase%2?5:-5,left:phase%2?'point':'down',right:phase%2?'down':'point'});const legs=source.slice(0,4).map(s=>({...s,x:Math.round(s.x),y:130,w:11,h:Math.max(10,Math.round(s.h/5)*5)}));frames.push({time:elapsed/1000,stage:['Contact','Transfer weight','Pass','Push off'][phase],shapes:[...legs,...pose.slice(4)]});elapsed+=[40,30,30,40,30,30][i%6];}
 stories.push({name:'walking',description:'A continuous block gait with counterbalanced shoulders and deliberate rectangular foot contacts.',duration:elapsed/1000,frames,loop:true,reducedFrame:0,storyVersion:2,viewBox:[-20,-40,240,220],style:'original-block-pixel'});
 return stories;
}
