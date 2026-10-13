// Ten extended visual jokes, drawn with the original actor and coarse blocks.
// Speech-bubble captions belong to the host app and are intentionally absent.
const CORAL='#DD775B', INK='#000000', PAPER='#FFFDF5', GOLD='#D9A441', GREEN='#3AAB7C';
const BLUE='#337FB7', PURPLE='#6943AD';
const RAINBOW=['#B94236',GOLD,GREEN,BLUE,PURPLE];

export function buildGagStates(firstNumber,{draw,rect,shift,glyph,frameBox}) {
  const states=[];
  function story(name,title,description,poses,reducedFrame) {
    let elapsed=0;
    const frames=poses.map(([hold,options={},extras=[],puff=0])=>{
      let actor=draw({planted:!options.airborne,...options});
      // Puffing is the requested gag: expand the SAME rectangle in coarse 5px
      // increments, keeping the original eyes and four 11px-wide legs intact.
      if(puff)actor=actor.map(s=>{
        if(s.fill===CORAL&&s.w===85&&s.h===65)return {...s,x:s.x-puff*5,y:s.y-puff*5,w:s.w+puff*10,h:s.h+puff*5};
        if(s.fill===CORAL&&s.w===22&&s.h===23)return {...s,x:s.x+(s.x<55?-1:1)*puff*5};
        return s;
      });
      const frame={time:elapsed/1000,shapes:[...actor,...extras]};
      elapsed+=hold;return frame;
    });
    states.push({number:firstNumber+states.length,name,title,label:title,description,
      duration:elapsed/1000,frames,loop:true,collection:'gags',extended:true,
      reducedFrame,
      style:'original-block-pixel',viewBox:[-20,-40,240,220]});
  }
  const tick=(x,y)=>[[0,1],[1,2],[2,1],[3,0]].map(([a,b])=>rect(x+a*5,y+b*5,5,5,GREEN));
  const star=(x,y)=>[rect(x+5,y,5,15,GOLD),rect(x,y+5,15,5,GOLD)];
  const squiggle=(x,y,phase,color)=>Array.from({length:6},(_,j)=>rect(x+j*5,y+[0,5,10,5,0,-5][(j+phase)%6],5,5,color));
  const daydream=phase=>[...glyph('?',90+(phase%3-1)*5,5,5,CORAL),
    ...RAINBOW.slice(0,3).flatMap((color,j)=>squiggle(15+j*65,40-Math.floor(phase/2)*5,phase%6,color))];
  const constellation=()=>[...star(25,10),...star(170,5),rect(45,20,10,5,BLUE),rect(60,25,10,5,BLUE),rect(150,20,10,5,BLUE)];
  const hallucinate=[[650],[300,{gazeY:-5}],[600,{gazeY:-10},glyph('?',90,5,5,CORAL)]];
  for(let i=0;i<14;i++)hallucinate.push([180,{gazeY:-10,gazeX:i<7?-5:5},daydream(i)]);
  hallucinate.push([650,{gazeY:-5},constellation()],[250,{right:'half-head',gazeY:-5},constellation()],
    [450,{right:'head',gazeY:-5},constellation()],[350,{right:'scratch',gazeY:-5},constellation()],
    [450,{right:'head',gazeX:5},constellation()],[300,{right:'half-head',gazeX:-5},constellation()],
    [650,{right:'point',eyes:'happy'},constellation()]);
  for(let i=0;i<4;i++)hallucinate.push([240,{eyes:'happy',dy:i%2?0:5},constellation()]);
  for(let i=0;i<6;i++)hallucinate.push([180,{eyes:'happy',gazeY:-5},shift(constellation(),0,-i*10)]);
  hallucinate.push([550,{right:'point',eyes:'happy'}],[250,{eyes:'happy'}],[700]);
  story('gag-hallucinate','Hallucinating','Watches rainbow squiggles form an imaginary constellation, checks it carefully, then nods with complete confidence.',hallucinate,23);

  const coin=(x,y)=>[rect(x,y,10,5,GOLD),rect(x+5,y,5,5,PAPER)];
  const jar=count=>[rect(165,100,40,50,INK),rect(170,105,30,40,PAPER),rect(165,95,40,5,GOLD),
    ...Array.from({length:count},(_,j)=>coin(170+j%3*10,140-Math.floor(j/3)*10)).flat()];
  const tokens=[[650,{gazeX:5},jar(0)]];
  for(let count=0;count<6;count++) {
    for(const y of [20,30,45,65,85,100])tokens.push([80,{right:count%2?'point':'rest',gazeX:5,gazeY:y<70?-5:5},[...jar(count*3),...[170,180,190].flatMap(x=>coin(x,y))]]);
    tokens.push([280,{right:'point',gazeX:5},jar((count+1)*3)]);
  }
  tokens.push([650,{gazeX:5,right:'point'},jar(18)]);
  for(let i=0;i<6;i++)tokens.push([160,{right:'point',gazeX:5},[...jar(18),...coin(205+i*5,100+i*10),...coin(155-i*5,105+i*10)]]);
  tokens.push([650,{right:'point',eyes:'happy'},[...jar(18),...coin(145,160),...coin(205,155)]]);
  // He tidies the surplus, packs the coins, and slides the packet away.
  for(let count=18;count>=0;count-=3)tokens.push([300,{right:'hold',gazeX:5,gazeY:5},
    [...jar(count),...Array.from({length:18-count},(_,j)=>coin(145+j%2*10,160-Math.floor(j/2)*5)).flat()]]);
  const packet=x=>[...frameBox(x,140,25,25,GOLD),...coin(x+5,150)];
  tokens.push([450,{eyes:'happy',gazeX:5},[...jar(0),...packet(145)]]);
  for(const x of [150,155,165,180,195,210,225])tokens.push([160,{right:'point',gazeX:5},[...jar(0),...packet(x)]]);
  tokens.push([500,{eyes:'happy'},jar(0)],[650,{gazeX:5},jar(0)]);
  story('gag-tokens','Counting tokens','Counts coins, overfills the jar, tidies the surplus into a packet, then slides the savings away.',tokens,43);

  const contextBar=count=>[...frameBox(55,20,85,25),...Array.from({length:count},(_,j)=>rect(60+j*10,25,5,15,j<6?GREEN:GOLD))];
  const memory=x=>[...frameBox(x,5,25,15),rect(x+5,10,15,5,BLUE)];
  const context=[[650,{gazeY:-5},contextBar(0)]];
  for(let fill=1;fill<=8;fill++)context.push([320,{gazeY:-5,right:fill>4?'point':'rest'},contextBar(fill)]);
  for(const puff of [1,2,3])context.push([350,{eyes:'open'},contextBar(8),puff]);
  context.push([650,{eyes:'closed'},[...contextBar(8),...memory(170)],3]);
  for(const x of [165,160,155,150,155,160,165])context.push([220,{gazeX:5,gazeY:-5},[...contextBar(8),...memory(x)],3]);
  context.push([650,{eyes:'closed'},contextBar(8),3]);
  for(let i=0;i<8;i++)context.push([260,{eyes:i<4?'closed':'happy'},
    [...contextBar(7-i),...Array.from({length:Math.min(3,8-i)},(_,j)=>rect(65+j*25,-5-i*5,5,5,GREEN))],Math.max(0,3-Math.floor((i+1)/2))]);
  context.push([600,{eyes:'happy'},[...contextBar(0),...tick(165,25)]],
    [300,{right:'point',eyes:'happy'},contextBar(0)],[650,{gazeY:-5},contextBar(0)]);
  story('gag-context','Context feeling full','Fills the memory bar, tries to fit one more card while puffed up, then releases the backlog and returns to size.',context,12);

  // Fixed dots and one steady idea: no color cycling or blinking panel.
  const thoughtDots=()=>[rect(65,30,5,5,BLUE),rect(90,30,5,5,BLUE),rect(115,30,5,5,BLUE)];
  const idea=()=>[rect(170,25,15,5,GOLD),rect(165,30,25,15,GOLD),rect(170,45,15,5,GOLD),rect(170,50,15,5,INK),rect(175,55,5,5,INK)];
  const thoughtPlan=n=>[...frameBox(165,65,30,25),...Array.from({length:3},(_,i)=>rect(170,70+i*5,20,5,i<n?GREEN:'#70685D'))];
  const prompt=[[700,{gazeY:-5},thoughtDots()],[450,{gazeX:-5,gazeY:-5},thoughtDots()],
    [450,{gazeX:5,gazeY:-5},thoughtDots()],[250,{right:'point',gazeY:-5},thoughtDots()],
    [250,{right:'half-head',gazeY:-5},thoughtDots()]];
  for(let i=0;i<3;i++)prompt.push([400,{right:'head',gazeY:-5},thoughtDots()],[400,{right:'scratch',gazeY:-5},thoughtDots()]);
  prompt.push([700,{right:'head',gazeY:-5},thoughtDots()],[300,{right:'half-head',gazeX:5},[...thoughtDots(),...idea()]],
    [650,{right:'point',gazeX:5},[...thoughtDots(),...idea(),...thoughtPlan(0)]]);
  for(let row=1;row<=3;row++)prompt.push([420,{right:'point',gazeX:5,eyes:row===3?'happy':'open'},[...thoughtDots(),...idea(),...thoughtPlan(row)]]);
  prompt.push([850,{eyes:'happy'},[...thoughtDots(),...idea(),...thoughtPlan(3)]]);
  for(const dx of [5,15,30,45,60])prompt.push([220,{eyes:'happy'},[...thoughtDots(),...shift([...idea(),...thoughtPlan(3)],dx,0)]]);
  prompt.push([350,{eyes:'happy'},thoughtDots()],[350,{},thoughtDots()],[700,{gazeY:-5},thoughtDots()]);
  story('gag-prompt','Deep thought','Studies steady dots, scratches its head, turns a small idea into a three-step plan, then calmly settles back.',prompt,17);

  function robot(x,step,gesture='rest') {
    return [rect(x+10,100,25,20,BLUE),rect(x+5,120,35,25,BLUE),rect(x+20,90,5,10,INK),rect(x+15,85,15,5,GOLD),
      rect(x+15,105,5,5,INK),rect(x+30,105,5,5,INK),rect(x+15,125,15,5,gesture==='sync'?GREEN:PAPER),
      rect(x+10,140,10,15-(step%2)*5,BLUE),rect(x+30,140,10,10+(step%2)*5,BLUE),
      ...(gesture==='bump'?[rect(x-5,110,15,20,BLUE),rect(x,100,10,15,BLUE)]:[rect(x,125,10,10,BLUE)]),
      rect(x+40,gesture==='wave'?105:125,10,gesture==='wave'?25:10,BLUE),
      ...(gesture==='wave'?[rect(x+40+(step%2?5:0),95,10,10,BLUE)]:[])];
  }
  const robotStory=[[700,{gazeX:5}]];
  for(let i=0;i<12;i++)robotStory.push([140,{gazeX:5,right:i>7?'point':'rest'},robot(210-i*5,i)]);
  robotStory.push([450,{gazeX:5,right:'half-wave'},robot(155,0)]);
  for(let i=0;i<8;i++)robotStory.push([200,{right:i%2?'wave':'wave-out',eyes:'happy',gazeX:5},robot(155,i,'wave')]);
  robotStory.push([350,{right:'half-wave',gazeX:5},robot(155,0)],
    [650,{right:'half-wave',eyes:'happy',gazeX:5},robot(155,0,'bump')],
    [350,{right:'point',eyes:'happy'},robot(155,0)],
    [800,{eyes:'happy'},[...robot(155,0,'sync'),...tick(155,55)]]);
  for(let i=0;i<4;i++)robotStory.push([220,{eyes:'happy',dy:i%2?0:5},shift(robot(155,0,'sync'),0,i%2?0:5)]);
  robotStory.push([350,{right:'half-wave',eyes:'happy'},robot(155,0)]);
  for(let i=0;i<14;i++)robotStory.push([140,{gazeX:5,right:i<5?'wave':'rest'},robot(155+i*5,i)]);
  robotStory.push([500,{gazeX:5,eyes:'happy'}],[700,{gazeX:5}]);
  story('gag-robot','Fellow AI','A little robot walks in, waves, shares a fist bump and a successful sync, then heads out with a farewell.',robotStory,25);

  const alphabet={T:['111','010','010','010','010'],R:['110','101','110','101','101'],A:['010','101','111','101','101'],I:['111','010','010','010','111'],N:['101','111','111','111','101'],G:['111','100','101','101','111']};
  const trainingLabel=()=>[...'TRAINING'].flatMap((char,i)=>alphabet[char].flatMap((row,y)=>[...row].flatMap((bit,x)=>bit==='1'?[rect(45+i*12+x*3,-5+y*3,3,3,INK)]:[])));
  const training=progress=>[...trainingLabel(),...frameBox(45,15,105,20),...(progress?[rect(50,20,progress*10,10,GREEN)]:[])];
  const nap=[[650,{},training(0)],[300,{eyes:'closed',left:'point',right:'point'},training(0)],
    [300,{eyes:'closed',left:'half-wave',right:'half-wave'},training(0)],
    [550,{eyes:'closed',left:'wave',right:'wave'},training(0)],
    [300,{eyes:'closed',left:'half-wave',right:'half-wave'},training(0)],
    [300,{eyes:'closed',left:'down',right:'down'},training(0)]];
  for(let i=0;i<24;i++)nap.push([220,{eyes:'closed',left:i===13?'head':'down',right:'down'},
    [...training(Math.min(9,Math.floor(i/2))),...glyph('Z',165,55-i%6*10,5,CORAL)]]);
  nap.push([600,{eyes:'closed',left:'down',right:'down'},training(9)],
    [350,{left:'point',right:'point'},training(9)],[300,{left:'half-wave',right:'half-wave',eyes:'closed'},training(9)],
    [650,{left:'wave',right:'wave',eyes:'happy'},training(9)],
    [300,{left:'half-wave',right:'half-wave',eyes:'happy'},training(9)],
    [300,{left:'point',right:'point'},training(9)],[550,{eyes:'closed',left:'down',right:'down'},training(9)],
    [450,{right:'half-head'},training(9)],[550,{eyes:'happy'},[...training(9),...tick(165,30)]],
    [700,{},training(0)]);
  story('gag-nap','Training nap','Yawns, trains through a long nap, wakes for a stretch, almost nods off again, then catches itself.',nap,34);

  const coffeeTable=()=>[rect(155,150,55,5,INK),rect(160,155,5,15,INK),rect(200,155,5,15,INK)];
  const mug=()=>[rect(190,125,10,15,INK),rect(195,130,5,5,PAPER),rect(165,120,25,30,INK),rect(170,125,15,20,PAPER),rect(170,120,15,5,'#704B32')];
  const steam=phase=>Array.from({length:2},(_,i)=>[rect(170+i*10,110-(phase+i)%5*5,5,5,GOLD),rect(175+i*10,100-(phase+i)%5*5,5,5,GOLD)]).flat();
  const coffeeScene=(phase=0)=>[...coffeeTable(),...mug(),...steam(phase)];
  const spoon=(x,y=100)=>[rect(x,y,5,130-y,'#70685D'),rect(x-5,125,10,5,'#70685D'),rect(165,95,x-160,10,CORAL)];
  const coffee=[[700,{gazeX:5,gazeY:5},coffeeScene()],[450,{gazeX:5,gazeY:-5},coffeeScene(1)],
    [250,{right:'point',gazeX:5,gazeY:5},coffeeScene(2)]];
  for(let i=0;i<12;i++)coffee.push([200,{right:'point',gazeX:5,gazeY:5},[...coffeeScene(i%5),...spoon(170+[0,5,10,5][i%4])]]);
  // Two deliberate rim taps, then a slower final stir: mug never approaches face.
  for(const x of [180,185,185,180])coffee.push([250,{right:'point',gazeX:5},[...coffeeScene(2),...spoon(x,x===185?105:100)]]);
  coffee.push([650,{right:'point',gazeX:5},[...coffeeScene(3),...spoon(180)]]);
  for(let i=0;i<8;i++)coffee.push([240,{right:'point',gazeX:5,gazeY:5},[...coffeeScene(i%5),...spoon(170+[0,5,10,5][i%4])]]);
  coffee.push([400,{right:'point',eyes:'happy'},coffeeScene(4)],[450,{eyes:'closed'},coffeeScene(0)]);
  for(let i=0;i<6;i++)coffee.push([300,{eyes:'happy',dy:i===2?-5:0},coffeeScene(i%5)]);
  coffee.push([750,{eyes:'happy'},coffeeScene(1)],[400,{gazeX:5,gazeY:5},coffeeScene(2)],
    [700,{gazeX:5,gazeY:5},coffeeScene()]);
  story('gag-coffee','Coffee break','Studies the steam, stirs the mug, taps the rim twice, gives it one last stir, then relaxes into the warmth.',coffee,30);

  const headphones=(dx=0,dy=0)=>shift([rect(50,60,95,5,INK),rect(45,65,10,30,INK),rect(140,65,10,30,INK),rect(45,80,10,25,PURPLE),rect(140,80,10,25,PURPLE),rect(50,55,95,5,PURPLE)],dx,dy);
  const note=(x,y)=>[rect(x+5,y,5,20,BLUE),rect(x+10,y,10,5,BLUE),rect(x,y+15,10,10,BLUE)];
  const dance=[[650,{},headphones()],[350,{right:'half-head'},headphones()],[450,{eyes:'happy'},headphones()]];
  for(let beat=0;beat<4;beat++)for(let step=0;step<4;step++) {
    const dx=(beat%2?1:-1)*[0,5,10,5][step];
    dance.push([180,{dx,eyes:'happy',left:beat%2?'wave-out':'point',right:beat%2?'point':'wave-out',footLift:step===2?[beat%2,2+beat%2]:[]},
      [...headphones(dx),...note(10,40-step*5),...note(170,25+step*5)]]);
  }
  for(let beat=0;beat<6;beat++)dance.push([280,{eyes:'happy',left:beat%2?'half-wave':'point',right:beat%2?'point':'half-wave',dy:beat%2?-5:0},
    [...headphones(0,beat%2?-5:0),...note(10,30),...note(170,45)]]);
  dance.push([250,{dy:5,eyes:'closed',left:'point',right:'point'},headphones(0,5)],
    [180,{dy:-5,airborne:true,eyes:'happy',left:'wave',right:'wave'},headphones(0,-5)],
    [350,{eyes:'happy',left:'half-wave',right:'half-wave'},headphones()]);
  for(let beat=0;beat<4;beat++)dance.push([250,{eyes:'happy',left:beat%2?'wave-out':'point',right:beat%2?'point':'wave-out'},[...headphones(),...note(10,40),...note(170,30)]]);
  dance.push([350,{dy:5,eyes:'closed',left:'down',right:'down'},headphones(0,5)],
    [600,{eyes:'happy'},headphones()],[450,{right:'half-head'},headphones()],[700,{},headphones()]);
  story('gag-dance','Headphone dance','Adjusts the headphones, side-steps with lifted feet, adds a shoulder groove and a little hop, then bows and resets.',dance,29);

  const ring=[[0,-15],[10,-10],[15,0],[10,10],[0,15],[-10,10],[-15,0],[-10,-10]];
  const spinner=phase=>ring.map(([x,y],i)=>rect(95+x,25+y,5,5,i===phase?PURPLE:'#D6CCBC'));
  const buffering=[[700,{gazeY:-5},spinner(0)]];
  for(let tick=0;tick<16;tick++)buffering.push([180,{gazeY:-5,gazeX:tick<8?-5:5},spinner(tick%8)]);
  buffering.push([800,{gazeY:-5},spinner(2)],[350,{right:'half-head',gazeY:-5},spinner(2)],
    [600,{right:'head',gazeY:-5},spinner(2)],[450,{right:'scratch',gazeY:-5},spinner(2)],
    [500,{right:'head',gazeY:-5},spinner(2)],[350,{right:'half-head'},spinner(2)]);
  for(let tick=2;tick<10;tick++)buffering.push([180,{gazeY:-5},spinner(tick%8)]);
  buffering.push([900,{eyes:'happy'},tick(90,20)],[450,{right:'point',eyes:'happy'},tick(90,20)],
    [650,{gazeY:-5},spinner(0)],[350,{right:'half-head',gazeY:-5},spinner(0)],[700,{gazeY:-5},spinner(0)]);
  story('gag-buffering','Buffering','Watches the spinner stall, checks its head, celebrates a brief success, then discovers it is buffering again.',buffering,20);

  const pad=()=>[rect(155,150,50,5,INK),rect(160,155,5,10,INK),rect(195,155,5,10,INK)];
  const rocket=(y,flame=0,x=165)=>[rect(x+10,y,5,5,CORAL),rect(x+5,y+5,15,5,CORAL),rect(x,y+10,25,35,PAPER),
    rect(x,y+10,5,35,INK),rect(x+20,y+10,5,35,INK),rect(x+5,y+20,15,10,BLUE),rect(x-5,y+35,5,15,CORAL),
    rect(x+25,y+35,5,15,CORAL),rect(x+5,y+45,15,5,INK),
    ...(flame?[rect(x+5,y+50,15,flame*5,GOLD),rect(x+10,y+50,5,(flame+1)*5,CORAL)]:[])];
  const numerals={3:['111','001','111','001','111'],2:['111','001','111','100','111'],1:['010','110','010','010','111']};
  const digit=n=>numerals[n].flatMap((row,y)=>[...row].flatMap((bit,x)=>bit==='1'?[rect(85+x*5,15+y*5,5,5,INK)]:[]));
  const launchCheck=n=>[...frameBox(5,30,30,25),...Array.from({length:n},(_,j)=>rect(10+j*5,35,5,15,GREEN))];
  const deploy=[[700,{gazeX:5},[...pad(),...rocket(100)]]];
  for(let n=1;n<=3;n++)deploy.push([450,{left:'point',gazeX:-5},[...pad(),...rocket(100),...launchCheck(n)]]);
  for(const n of [3,2,1])deploy.push([650,{right:'point',gazeX:5,gazeY:-5},[...pad(),...rocket(100),...digit(n)]]);
  for(const flame of [1,2,3])deploy.push([220,{right:'half-wave',gazeX:5},[...pad(),...rocket(100,flame)]]);
  for(const y of [100,95,90,80,70,55,35,10,-20,-55,-100])deploy.push([120,{right:'wave',gazeX:5,gazeY:-5},[...pad(),...rocket(y,3),
    ...[0,1,2].map(j=>rect(175+(j%2)*5,145-j*15,5,5,GOLD))]]);
  for(let i=0;i<6;i++)deploy.push([220,{right:i<3?'wave':'half-wave',eyes:'happy'},[...pad(),
    ...Array.from({length:3},(_,j)=>rect(165+j*15+(j%2?-i:i)*5,140-i*10,10,5,'#D6CCBC'))]]);
  deploy.push([900,{eyes:'happy'},[...pad(),...tick(165,30)]]);
  for(const x of [220,215,210,205,195,185,175,170,165])deploy.push([180,{right:'point',gazeX:5},[...pad(),...rocket(100,0,x)]]);
  deploy.push([500,{eyes:'happy'},[...pad(),...rocket(100)]],[700,{gazeX:5},[...pad(),...rocket(100)]]);
  story('gag-deploy','Deploy launch','Runs launch checks, counts down, watches the rocket accelerate away, confirms delivery, then welcomes the next rocket.',deploy,12);

  // Edge-entering props are clipped as rectangles, preserving transparent bounds.
  return states.map(state=>({...state,frames:state.frames.map(frame=>({...frame,shapes:frame.shapes.flatMap(s=>{
    const x=Math.max(-20,s.x),y=Math.max(-40,s.y),right=Math.min(220,s.x+s.w),bottom=Math.min(180,s.y+s.h);
    return right>x&&bottom>y?[{...s,x,y,w:right-x,h:bottom-y}]:[];
  })}))}));
}
