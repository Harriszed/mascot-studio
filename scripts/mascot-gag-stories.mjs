import {createStoryKit,rect as r,shift,box,tick,table,card,bulb,handAt,C,I,P,G,OK,B,R,V} from './mascot-story-kit.mjs';

export function buildGagStories(h) {
 const {story}=createStoryKit(h.draw),states=[];
 const add=(name,title,description,author,options)=>states.push({...story(name,description,author,options),title,label:title});
 const dots=()=>[0,1,2].map(j=>r(70+j*20,25,5,5,B));
 add('gag-hallucinate','Hallucinating','Looks up, sketches an imaginary rainbow constellation, double-checks it with a ruler and confidently signs it off.',b=>{
  const sky=n=>[...h.glyph('?',90+(n%3-1)*5,5,5,C),...Array.from({length:Math.min(3,n)},(_,j)=>Array.from({length:6},(_,i)=>r(10+j*65+i*5,30+[0,5,10,5,0,-5][(i+n)%6],5,5,[G,OK,B][j]))).flat()];
  const constellation=()=>[[20,20],[55,35],[100,15],[150,30],[185,10]].flatMap(([x,y],j)=>[r(x,y,10,10,[G,OK,B][j%3]),...(j<4?[r(x+10,y+5,20,5,B)]:[])]);
  b(650,'Neutral');b(350,'Look up',{gazeY:-10});b(650,'Something there',{gazeY:-10},sky(0));
  for(let n=1;n<=8;n++)b(220,'Imagine',{gazeY:-10,gazeX:n<5?-5:5},sky(n));
  b(750,'A convincing pattern',{gazeY:-5},constellation());b(180,'Reach for ruler',{right:'reach'},[...constellation(),r(155,125,50,10,G)]);
  for(const y of [115,100,80,60])b(120,'Raise ruler',{rightBlocks:handAt(175,y+5)},[...constellation(),r(150,y,55,10,G)]);
  for(const x of [150,145,140,145,150])b(350,'Measure the imaginary',{rightBlocks:handAt(x+25,65),gazeY:-5},[...constellation(),r(x,60,55,10,G)]);
  b(650,'Check twice',{right:'head',gazeY:-5},[...constellation(),r(155,125,50,10,G)]);b(700,'Conclude confidently',{right:'point',eyes:'happy'},constellation());
  for(let i=0;i<3;i++){b(170,'Confident nod',{dy:5,eyes:'closed'},constellation());b(400,'Absolutely certain',{eyes:'happy'},constellation());}
  b(850,'Sign off',{right:'half-wave',eyes:'happy'},[...constellation(),...tick(165,110)]);for(const y of [0,-5,-15,-30,-50,-80])b(140,'Let the fantasy drift',{eyes:'happy'},shift(constellation(),0,y));b(650,'Neutral');
 },{reducedStage:'Conclude confidently'});

 add('gag-tokens','Counting tokens','Counts six coins into a jar, tries to fit the overflow, catches the surplus and packs the savings away.',b=>{
  const coin=(x,y)=>[r(x,y,10,5,G),r(x+5,y,5,5,P)];
  const jar=(n,lid=0)=>[...table(),...box(165,100,40,45),r(165,95-lid,40,5,G),...Array.from({length:n},(_,j)=>coin(170+(j%2)*15,135-Math.floor(j/2)*15)).flat()];
  b(700,'Inspect empty jar',{gazeX:5},jar(0));
  for(let n=0;n<6;n++){
   b(220,'Take a coin',{rightBlocks:handAt(170,90),gazeX:5},[...jar(n),...coin(165,90)]);b(350,'Count the coin',{rightBlocks:handAt(175,90),gazeX:5},[...jar(n),...coin(175,85)]);
   for(const y of [90,100,115,135-Math.floor(n/2)*15])b(80,'Drop into jar',{right:'point',gazeX:5},[...jar(n),...coin(170+(n%2)*15,y)]);b(250,'Count again',{gazeX:5},jar(n+1));
  }
  b(650,'The jar is full',{right:'point',gazeX:5},jar(6));
  for(const y of [60,70,85,95,90,85])b(120,'One coin too many',{gazeX:5},[...jar(6),...coin(180,y)]);
  b(350,'Try the lid',{rightBlocks:handAt(180,90),eyes:'closed',dy:5},[...jar(6),...coin(180,90)]);
  for(const [x,y] of [[180,80],[190,90],[200,110],[205,135],[205,160]])b(100,'Overflow',{gazeX:5},[...jar(6,10),...coin(x,y)]);
  b(650,'Catch the surplus',{rightBlocks:handAt(205,150),eyes:'happy'},[...jar(6),...coin(200,145)]);
  for(let n=6;n>=0;n--)b(250,'Pack the savings',{right:'reach',gazeX:5},[...jar(n),...card(120,140,3,G)]);
  for(const x of [120,130,145,165,190,220])b(120,'File savings',{right:'reach',eyes:'happy'},[...jar(0),...card(x,140,3,G)]);b(700,'Inspect empty jar',{gazeX:5},jar(0));
 },{reducedStage:'The jar is full'});

 add('gag-context','Context feeling full','Fills the memory bar, puffs up while trying one extra card, presses a release valve and slowly returns to size.',b=>{
  const bar=n=>[...box(55,15,85,25),...Array.from({length:n},(_,j)=>r(60+j*10,20,5,15,j<6?OK:G))];
  const valve=()=>[...table(),...box(165,120,35,25),r(175,110,15,10,G)];
  b(700,'Room to think',{gazeY:-5},[...bar(0),...valve()]);for(let n=1;n<=8;n++){b(180,'Bring a memory',{gazeY:-5,right:'point'},[...bar(n-1),...valve(),...card(165,45)]);b(300,'Store the memory',{gazeY:-5},[...bar(n),...valve()]);}
  for(const puff of [1,2,3])b(350,'Feeling full',{puff,eyes:'closed'},[...bar(8),...valve()]);b(650,'One more card',{puff:3,gazeX:5},[...bar(8),...valve(),...card(165,45)]);
  for(const x of [160,150,140,150,160])b(180,'Try to fit it',{puff:3,right:'point',gazeY:-5},[...bar(8),...valve(),...card(x,45)]);
  b(450,'Give up the squeeze',{puff:3,eyes:'closed'},[...bar(8),...valve()]);b(180,'Find the release',{puff:3,right:'reach'},[...bar(8),...valve()]);b(150,'Press release',{puff:3,right:'reach',dy:5},[...bar(8),...valve()]);
  for(let n=7;n>=0;n--)b(300,'Let memory go',{puff:Math.max(0,Math.floor(n/2)-1),eyes:n>3?'closed':'happy'},[...bar(n),...valve(),...card(150+(7-n)*10,50-(7-n)*10)]);
  b(1000,'Room again',{eyes:'happy'},[...bar(0),...valve(),...tick(165,45)]);b(180,'Recover',{right:'point'},[...bar(0),...valve()]);b(700,'Room to think',{gazeY:-5},[...bar(0),...valve()]);
 },{reducedStage:'Feeling full'});

 add('gag-prompt','Deep thought','Draws a quiet problem in the air, considers two routes, scratches its head and assembles one steady three-step answer.',b=>{
  const problem=n=>[...box(60,5,80,40),...Array.from({length:n},(_,j)=>r(70+j*10,20,5,5,B))];
  b(700,'Consider a blank',{gazeY:-5},problem(0));b(180,'Raise a hand',{right:'half-wave',gazeY:-5},problem(0));
  for(let n=1;n<=6;n++)b(220,'Draw the problem',{right:'wave',gazeY:-5},problem(n));b(800,'Think it through',{gazeY:-5},[...problem(6),...dots()]);
  b(650,'Try one route',{gazeX:-5,gazeY:-5},[...problem(6),...dots()]);b(650,'Try another',{gazeX:5,gazeY:-5},[...problem(6),...dots()]);b(180,'Raise hand',{right:'half-head'},problem(6));
  for(let i=0;i<3;i++){b(350,'Scratch',{right:'scratch',gazeY:-5},problem(6));b(550,'Consider',{right:'head',gazeY:-5},problem(6));}
  b(700,'A steady idea',{right:'half-head'},[...problem(6),...bulb()]);for(let n=1;n<=3;n++)b(500,'Build the answer',{right:'point',gazeX:5},[...problem(6),...bulb(),...card(165,90,n,OK)]);
  b(1000,'Answer ready',{eyes:'happy'},[...problem(6),...bulb(),...card(165,90,3,OK)]);b(180,'Satisfied nod',{eyes:'closed',dy:5},[...problem(6),...bulb(),...card(165,90,3,OK)]);
  for(const x of [165,175,190,215,245])b(140,'File the answer',{eyes:'happy'},[...problem(6),...card(x,90,3,OK)]);b(450,'Recover',{},problem(0));b(700,'Consider a blank',{gazeY:-5},problem(0));
 },{reducedStage:'Answer ready'});

 add('gag-robot','Fellow AI','Welcomes a tiny robot, exchanges a wave and a real fist bump, shares a little victory groove and sees it off.',b=>{
  const robot=(x,step=0,arm='rest')=>[r(x+10,100,25,20,B),r(x+5,120,35,25,B),r(x+20,90,5,10),r(x+15,85,15,5,G),r(x+15,105,5,5),r(x+30,105,5,5),r(x+15,125,15,5,P),r(x+10,140,10,15-step%2*5,B),r(x+30,140,10,10+step%2*5,B),r(x,arm==='bump'?115:125,10,15,B),r(x+40,arm==='wave'?105:125,10,arm==='wave'?25:10,B)];
  b(700,'Notice company',{gazeX:5});for(let i=0;i<14;i++)b(140,'Robot arrives',{gazeX:5,right:i>9?'point':'rest'},robot(220-i*5,i));b(550,'Meet',{gazeX:5,right:'half-wave'},robot(155));
  for(let i=0;i<6;i++)b(220,'Wave hello',{right:i%2?'wave-in':'wave-out',eyes:'happy'},robot(155,i,'wave'));
  b(250,'Offer a bump',{rightBlocks:handAt(160,120),gazeX:5},robot(155));b(650,'Fist bump',{rightBlocks:handAt(155,120),eyes:'happy'},robot(155,0,'bump'));b(180,'Release bump',{right:'point'},robot(155));
  b(650,'In sync',{eyes:'happy'},[...robot(155),...tick(160,50)]);for(let i=0;i<6;i++)b(240,'Victory groove',{eyes:'happy',dy:i%2?0:5,left:i%2?'point':'down'},shift(robot(155),0,i%2?0:5));
  b(450,'Farewell',{right:'half-wave',eyes:'happy'},robot(155));for(let i=0;i<16;i++)b(140,'Robot leaves',{gazeX:5,right:i<5?'wave':'rest'},robot(155+i*5,i));b(650,'Good company',{eyes:'happy'});b(700,'Notice company',{gazeX:5});
 },{reducedStage:'Fist bump'});

 add('gag-nap','Training nap','Puts on a nightcap, dozes through training, wakes for a stretch, nearly falls asleep again and finally catches itself.',b=>{
  const cap=(x=55,y=60)=>[r(x,y,85,10,P),r(x+10,y-15,65,15,B),r(x+25,y-25,45,10,B),r(x+65,y-15,20,10,B),r(x+75,y-5,15,15,P)];
  const bar=n=>[...box(50,5,100,20),...(n?[r(55,10,n*10,10,OK)]:[])];
  b(700,'Getting sleepy',{},bar(0));for(const y of [120,105,90,75,60])b(140,'Put on nightcap',{right:'head'},[...bar(0),...cap(55,y)]);
  b(650,'Cap settled',{right:'head',eyes:'closed'},[...bar(0),...cap()]);b(200,'Lower hand',{right:'half-head',eyes:'closed'},[...bar(0),...cap()]);
  for(let i=0;i<24;i++){const dy=i%8<4?5:0;b(260,'Training asleep',{eyes:'closed',dy,left:'down',right:'down'},[...bar(Math.min(9,Math.floor(i/2))),...cap(55,60+dy),...h.glyph('Z',165,55-i%6*10,5,C)]);}
  b(800,'Training complete',{eyes:'closed'},[...bar(9),...cap(),...tick(170,30)]);b(180,'Wake',{eyes:'open'},[...bar(9),...cap()]);b(180,'Prepare stretch',{left:'half-wave',right:'half-wave'},[...bar(9),...cap()]);b(650,'Stretch',{left:'wave',right:'wave',eyes:'happy',dy:-5},[...bar(9),...cap(55,55)]);b(180,'Release stretch',{left:'half-wave',right:'half-wave'},[...bar(9),...cap()]);
  b(550,'Almost asleep again',{eyes:'closed',dy:5},[...bar(9),...cap(55,65)]);b(180,'Catch yourself',{right:'half-head'},[...bar(9),...cap()]);b(650,'Awake now',{eyes:'happy',right:'head'},[...bar(9),...cap()]);
  for(const y of [75,90,110,135,165])b(140,'Set cap aside',{right:'reach'},[...bar(9),...cap(115,y)]);b(700,'Getting sleepy',{},bar(0));
 },{reducedStage:'Training asleep'});

 add('gag-coffee','Coffee break','Grinds a few beans, pours into a tabletop mug, stirs and taps the spoon, then quietly savors the warmth.',b=>{
  const mug=()=>[...table(),r(190,125,10,15),r(195,130,5,5,P),...box(165,120,25,25),r(170,120,15,5,'#704B32')];
  const grinder=(phase=0)=>[...box(5,125,30,25,G),r(15,110,5,15),r(10+phase,105,20,5),r(5+phase,105,5,10)];
  const jug=(x,y)=>[...box(x,y,25,30),r(x+25,y+15,10,5),r(x+5,y+5,15,5,'#704B32')];
  const steam=phase=>[0,1].flatMap(j=>[r(170+j*10,110-(phase+j)%5*5,5,5,G),r(175+j*10,100-(phase+j)%5*5,5,5,G)]);
  b(700,'A coffee ritual',{gazeX:5},[...mug(),...grinder()]);b(180,'Reach for grinder',{left:'point',gazeX:-5},[...mug(),...grinder()]);
  for(let i=0;i<8;i++)b(240,'Grind beans',{leftBlocks:handAt(20+i%2*5,110,'left'),gazeX:-5},[...mug(),...grinder(i%2*5)]);
  b(350,'Ground beans ready',{eyes:'happy'},[...mug(),...grinder()]);for(const y of [125,110,95,80])b(140,'Lift the pot',{rightBlocks:handAt(165,y+15),gazeX:5},[...mug(),...jug(155,y)]);
  b(550,'Ready to pour',{rightBlocks:handAt(165,95),gazeX:5},[...mug(),...jug(155,80)]);
  for(let i=0;i<6;i++)b(220,'Pour coffee',{rightBlocks:handAt(165,95),gazeX:5,gazeY:10},[...mug(),...jug(155,80),r(185,100,5,20,'#704B32')]);
  for(const [x,y] of [[165,95],[180,105],[195,115],[215,115],[235,115]])b(140,'Return the pot',{rightBlocks:handAt(Math.min(205,x+10),y+15),gazeX:5},[...mug(),...jug(x,y)]);
  const stir=x=>[r(x,95,5,35,'#70685D'),r(x-5,125,10,5,'#70685D')];
  b(250,'Take spoon',{rightBlocks:handAt(175,100),gazeX:5},[...mug(),...steam(0),...stir(175)]);
  for(let i=0;i<10;i++){const x=170+[0,5,10,5][i%4];b(200,'Stir',{rightBlocks:handAt(x,100),gazeX:5,gazeY:10},[...mug(),...steam(i),...stir(x)]);}
  for(let i=0;i<2;i++){b(300,'Lift spoon',{rightBlocks:handAt(185,95)},[...mug(),...steam(2),...shift(stir(185),0,-5)]);b(100,'Tap the rim',{rightBlocks:handAt(185,100)},[...mug(),...steam(2),...stir(185)]);b(300,'Let it settle',{rightBlocks:handAt(185,95)},[...mug(),...steam(3),...shift(stir(185),0,-5)]);}
  b(250,'Set spoon aside',{right:'point'},[...mug(),...steam(3)]);for(let i=0;i<5;i++)b(350,'Enjoy the warmth',{eyes:i<3?'closed':'happy',gazeX:5,lean:i<3?5:0},[...mug(),...steam(i)]);b(750,'Coffee ready',{eyes:'happy'},[...mug(),...steam(0)]);b(700,'A coffee ritual',{gazeX:5},[...mug(),...grinder()]);
 },{reducedStage:'Coffee ready'});

 add('gag-dance','Headphone dance','Puts on headphones, finds the beat, side-steps, poses, adds a small hop and bows before taking them off.',b=>{
  const phones=(x=55,y=60)=>[r(x-5,y,95,5,V),r(x-10,y+5,10,35),r(x+85,y+5,10,35),r(x-10,y+20,10,25,V),r(x+85,y+20,10,25,V)];
  b(700,'Find the music');for(const y of [125,110,95,80,60])b(140,'Put on headphones',{left:'half-head',right:'half-head'},phones(55,y));b(650,'Find the beat',{eyes:'happy',right:'head'},phones());
  for(let verse=0;verse<3;verse++)for(let step=0;step<8;step++){
   const dx=[0,5,10,5,0,-5,-10,-5][step],dy=step%4===2?-5:0;
   b(step%4===2?250:150,'Side-step',{dx,dy,eyes:'happy',left:step<4?'wave-out':'point',right:step<4?'point':'wave-out',footLift:step%4===2?[step<4?0:1,step<4?2:3]:[]},phones(55+dx,60+dy));
  }
  b(650,'Hold the pose',{left:'wave-in',right:'wave-out',eyes:'happy'},phones());b(180,'Gather for hop',{dy:5,left:'point',right:'point',eyes:'closed'},phones(55,65));b(180,'Hop',{dy:-10,airborne:true,left:'wave',right:'wave',eyes:'happy'},phones(55,50));b(180,'Land',{dy:5,left:'down',right:'down',eyes:'closed'},phones(55,65));b(600,'Recover',{eyes:'happy'},phones());b(550,'Bow',{dy:5,eyes:'closed'},phones(55,65));b(200,'Rise',{eyes:'happy'},phones());
  for(const y of [70,90,115,145,170])b(140,'Take headphones off',{right:'reach'},phones(115,y));b(700,'Find the music');
 },{reducedStage:'Hold the pose'});

 add('gag-buffering','Buffering','Watches the spinner stall, winds a little crank to restart it, celebrates success and spots a new stall.',b=>{
  const ring=[[0,-15],[10,-10],[15,0],[10,10],[0,15],[-10,10],[-15,0],[-10,-10]];
  const spinner=p=>ring.map(([x,y],i)=>r(95+x,25+y,5,5,i===p?V:'#D6CCBC'));
  const crank=p=>[...table(),...box(165,120,35,25),r(175,110,5,15),r(170+p,105,20,5,G),r(165+p,105,5,10,G)];
  b(700,'Watch spinner',{gazeY:-5},[...spinner(0),...crank(0)]);for(let i=0;i<12;i++)b(180,'Buffering',{gazeY:-5},[...spinner(i%8),...crank(0)]);b(850,'Stalled',{gazeY:-5},[...spinner(3),...crank(0)]);b(180,'Check your head',{right:'half-head'},[...spinner(3),...crank(0)]);b(650,'Not moving',{right:'head',gazeY:-5},[...spinner(3),...crank(0)]);b(300,'Notice the crank',{right:'point',gazeX:5},[...spinner(3),...crank(0)]);
  for(let i=0;i<8;i++)b(i<4?260:160,'Wind the buffer',{rightBlocks:handAt(180+i%2*5,110),gazeX:5},[...spinner(i<4?3:i%8),...crank(i%2*5)]);
  for(let i=0;i<8;i++)b(120,'Running again',{gazeY:-5},[...spinner(i),...crank(0)]);b(1000,'Success',{eyes:'happy',right:'half-wave'},[...tick(85,20),...crank(0)]);b(180,'Lower hand',{right:'point'},crank(0));b(700,'Another stall',{gazeY:-5},[...spinner(0),...crank(0)]);b(450,'Really',{right:'head',gazeY:-5},[...spinner(0),...crank(0)]);b(700,'Watch spinner',{gazeY:-5},[...spinner(0),...crank(0)]);
 },{reducedStage:'Stalled'});

 add('gag-deploy','Deploy launch','Inspects a rocket, pulls a launch lever, counts down, watches the accelerating launch and verifies delivery before resetting the pad.',b=>{
  const pad=()=>[r(155,150,50,5),r(160,155,5,10),r(195,155,5,10)];
  const rocket=(y,flame=0,x=165)=>[r(x+10,y,5,5,C),r(x+5,y+5,15,5,C),...box(x,y+10,25,35),r(x+5,y+20,15,10,B),r(x-5,y+35,5,15,C),r(x+25,y+35,5,15,C),r(x+5,y+45,15,5),...(flame?[r(x+5,y+50,15,flame*5,G),r(x+10,y+50,5,(flame+1)*5,C)]:[])];
  const lever=up=>[...box(5,120,30,25),r(15,up?95:110,5,25,G),r(10,up?90:105,15,10)];
  const digit=n=>({3:['111','001','111','001','111'],2:['111','001','111','100','111'],1:['010','110','010','010','111']})[n].flatMap((row,y)=>[...row].flatMap((bit,x)=>bit==='1'?[r(85+x*5,15+y*5,5,5)]:[]));
  b(700,'Inspect rocket',{gazeX:5},[...pad(),...rocket(100),...lever(true)]);b(450,'Check nose',{right:'half-wave',gazeX:5},[...pad(),...rocket(100),...lever(true)]);b(450,'Check engines',{right:'reach',gazeX:5,gazeY:10},[...pad(),...rocket(100),...lever(true)]);b(450,'Ready for launch',{eyes:'happy'},[...pad(),...rocket(100),...lever(true)]);
  b(350,'Reach for lever',{leftBlocks:handAt(20,100,'left'),gazeX:-5},[...pad(),...rocket(100),...lever(true)]);b(150,'Pull lever',{leftBlocks:handAt(20,115,'left'),dy:5},[...pad(),...rocket(100),...lever(false)]);
  for(const n of [3,2,1])b(700,'Countdown',{gazeY:-5},[...pad(),...rocket(100),...lever(false),...digit(n)]);
  for(const f of [1,2,3])b(250,'Ignition',{right:'half-wave',gazeX:5},[...pad(),...rocket(100,f),...lever(false)]);
  for(const y of [100,95,90,80,65,45,20,-10,-50,-100])b(120,'Launch',{right:'wave',gazeX:5,gazeY:-5},[...pad(),...rocket(y,3),...lever(false)]);
  b(700,'Follow the flight',{right:'wave',gazeY:-10},[...pad(),...lever(false)]);b(900,'Delivery confirmed',{eyes:'happy',right:'half-wave'},[...pad(),...lever(false),...tick(165,25)]);b(180,'Recover',{right:'point'},[...pad(),...lever(false)]);
  for(const x of [225,215,205,190,175,165])b(180,'Next rocket rolls in',{gazeX:5},[...pad(),...rocket(100,0,x),...lever(false)]);b(400,'Reset lever',{leftBlocks:handAt(20,100,'left')},[...pad(),...rocket(100),...lever(true)]);b(700,'Inspect rocket',{gazeX:5},[...pad(),...rocket(100),...lever(true)]);
 },{reducedStage:'Delivery confirmed'});
 return states;
}
