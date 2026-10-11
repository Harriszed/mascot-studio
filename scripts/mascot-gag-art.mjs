// Six extended visual jokes, drawn with the original actor and coarse blocks.
// Speech-bubble captions belong to the host app and are intentionally absent.
const CORAL='#DD775B', INK='#000000', PAPER='#FFFDF5', GOLD='#D9A441', GREEN='#3AAB7C';
const BLUE='#337FB7', PURPLE='#6943AD';
const RAINBOW=['#B94236',GOLD,GREEN,BLUE,PURPLE];

export function buildGagStates(firstNumber,{draw,rect,shift,glyph,frameBox}) {
  const states=[];
  function story(name,title,description,poses) {
    let elapsed=0;
    const frames=poses.map(([hold,options={},extras=[],puff=0])=>{
      let actor=draw(options);
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
      reducedFrame:{'gag-hallucinate':9,'gag-tokens':poses.length-3,'gag-context':13,'gag-prompt':20,'gag-robot':18,'gag-nap':12}[name],
      style:'original-block-pixel',viewBox:[-20,-40,240,220]});
  }
  const squiggle=(x,y,phase,color)=>Array.from({length:6},(_,j)=>rect(x+j*5,y+([0,5,10,5,0,-5][(j+phase)%6]),5,5,color));
  const hallucinate=[[400],[180,{gazeY:-5}],[180,{gazeY:-10},glyph('?',90,30,5,CORAL)]];
  for(let i=0;i<12;i++)hallucinate.push([110,{gazeY:-10,gazeX:i%4<2?-5:5,right:i>5?'half-head':'rest'},
    [...glyph('?',90+(i%3-1)*5,25-Math.floor(i/3)*5,5,CORAL),
      ...RAINBOW.slice(0,Math.min(5,1+Math.floor(i/2))).flatMap((color,j)=>squiggle(15+j*35,40-Math.floor(i/2)*10+j%2*5,i%6,color))]]);
  hallucinate.push([150,{right:'head',gazeY:-5}],[120,{right:'half-head',eyes:'closed'}],
    [180,{right:'point',eyes:'happy'}],[120,{eyes:'happy',dy:5}],[120,{eyes:'happy'}],
    [120,{eyes:'happy',dy:5}],[300,{eyes:'happy'}],[120,{eyes:'closed'}],[450]);
  story('gag-hallucinate','Hallucinating','Stares skyward as a wobbly question mark and rainbow pixel squiggles rise, then nods with confidence.',hallucinate);

  const coin=(x,y)=>[rect(x,y,10,5,GOLD),rect(x+5,y,5,5,PAPER)];
  const jar=count=>[rect(165,100,40,50,INK),rect(170,105,30,40,PAPER),rect(165,95,40,5,GOLD),
    ...Array.from({length:count},(_,j)=>coin(170+j%3*10,140-Math.floor(j/3)*10)).flat()];
  const tokens=[[300,{gazeX:5},jar(0)]];
  for(let count=0;count<5;count++) {
    for(const y of [25,40,55,70,85,100])tokens.push([80,{right:count%2?'point':'rest',gazeX:5,gazeY:y<70?-5:5},[...jar(count*2),...coin(180,y)]]);
    tokens.push([140,{right:'point',gazeX:5},jar((count+1)*2)]);
  }
  for(let i=0;i<8;i++)tokens.push([100,{right:'point',eyes:i<3?'open':'happy',gazeX:5},
    [...jar(12),...coin(180,90),...coin(155-i%4*5,100+Math.floor(i/2)*10),...coin(205+i%2*5,105+Math.floor(i/2)*10)]]);
  tokens.push([350,{right:'point',eyes:'happy'},[...jar(12),...coin(150,150),...coin(205,145)]],
    [150,{eyes:'closed'},jar(0)],[400,{gazeX:5},jar(0)]);
  story('gag-tokens','Counting tokens','Counts falling pixel coins as the jar fills, then watches coins spill over its rim.',tokens);

  const contextBar=count=>[...frameBox(55,20,85,25),...Array.from({length:count},(_,j)=>rect(60+j*10,25,5,15,j<6?GREEN:GOLD))];
  const context=[[350,{gazeY:-5},contextBar(0)]];
  for(let fill=1;fill<=8;fill++)context.push([180,{gazeY:-5,right:fill>4?'point':'rest'},contextBar(fill)]);
  for(const puff of [1,2,3,3])context.push([puff===3?250:130,{eyes:puff===3?'closed':'open',left:'rest',right:'rest'},contextBar(8),puff]);
  context.push([200,{eyes:'happy'},contextBar(8),3]);
  for(const puff of [2,1,0])context.push([140,{eyes:'closed'},contextBar(puff*2),puff]);
  context.push([150,{eyes:'happy'},contextBar(0)],[400,{gazeY:-5},contextBar(0)]);
  story('gag-context','Context feeling full','Watches a memory bar fill, puffs out in coarse block poses, then returns to the original size.',context);

  const promptPanel=(letters,dots=0,glow=false)=>[
    ...frameBox(45,10,110,45,glow?GOLD:PAPER),
    ...glyph('>',55,20,3,INK),
    ...Array.from({length:letters},(_,j)=>rect(75+j*10,25,5,5,j%2?GREEN:BLUE)),
    ...Array.from({length:dots},(_,j)=>rect(80+j*15,40,5,5,INK)),
    ...(glow?[rect(35,20,5,5,GOLD),rect(160,20,5,5,GOLD),rect(95,0,5,5,GOLD)]:[])];
  const prompt=[[300,{gazeY:-5},promptPanel(0)],[120,{left:'point',right:'point',gazeY:-5},promptPanel(0)],
    [120,{left:'half-wave',right:'half-wave',gazeY:-5},promptPanel(0)]];
  for(let i=0;i<14;i++)prompt.push([100,{left:i%2?'wave':'half-wave',right:i%2?'half-wave':'wave',gazeY:-5},promptPanel(Math.min(7,1+Math.floor(i/2)),0,i%2===0)]);
  prompt.push([200,{left:'point',right:'point',eyes:'happy'},promptPanel(7,0,true)]);
  for(let cycle=0;cycle<2;cycle++)for(let dots=1;dots<=3;dots++)prompt.push([200,{gazeY:-5,eyes:cycle===1&&dots===2?'closed':'open'},promptPanel(7,dots)]);
  prompt.push([250,{gazeY:-5},promptPanel(7,3)],[100,{eyes:'closed'},promptPanel(0)],[350,{gazeY:-5},promptPanel(0)]);
  story('gag-prompt','Air prompt','Types glowing pixel code in the air, then waits beneath an animated ellipsis.',prompt);

  function robot(x,step,waving=false) {
    return [rect(x+10,100,25,20,BLUE),rect(x+5,120,35,25,BLUE),rect(x+20,90,5,10,INK),rect(x+15,85,15,5,GOLD),
      rect(x+15,105,5,5,INK),rect(x+30,105,5,5,INK),rect(x+15,125,15,5,PAPER),
      rect(x+10,140,10,15-(step%2)*5,BLUE),rect(x+30,140,10,10+(step%2)*5,BLUE),
      rect(x,125,10,10,BLUE),rect(x+40,waving?105:125,10,waving?25:10,BLUE),
      ...(waving?[rect(x+40+(step%2?5:0),95,10,10,BLUE)]:[])];
  }
  const robotStory=[[350,{gazeX:5}]];
  for(let i=0;i<12;i++)robotStory.push([100,{gazeX:5,right:i>7?'point':'rest'},robot(210-i*5,i)]);
  robotStory.push([180,{gazeX:5,right:'half-wave'},robot(155,0)]);
  for(let i=0;i<8;i++)robotStory.push([120,{right:i%2?'wave':'wave-out',eyes:'happy',gazeX:5},robot(155,i,true)]);
  robotStory.push([200,{right:'half-wave',eyes:'happy'},robot(155,0)],
    [150,{right:'point',eyes:'happy'},robot(155,0)]);
  for(let i=0;i<12;i++)robotStory.push([100,{gazeX:5},robot(155+i*5,i)]);
  robotStory.push([350,{gazeX:5}],[150,{eyes:'closed'}],[350,{gazeX:5}]);
  // Arrival/departure near the edge is a deliberate crop, handled below.
  story('gag-robot','Fellow AI','A little block robot walks in, exchanges waves, then heads back out.',robotStory);

  const alphabet={T:['111','010','010','010','010'],R:['110','101','110','101','101'],A:['010','101','111','101','101'],I:['111','010','010','010','111'],N:['101','111','111','111','101'],G:['111','100','101','101','111']};
  const trainingLabel=()=>[...'TRAINING'].flatMap((char,i)=>alphabet[char].flatMap((row,y)=>[...row].flatMap((bit,x)=>bit==='1'?[rect(45+i*12+x*3,-5+y*3,3,3,INK)]:[])));
  const training=progress=>[...trainingLabel(),...frameBox(45,15,105,20),
    ...(progress?[rect(50,20,progress*10,10,GREEN)]:[])];
  const nap=[[250,{},training(0)],[120,{eyes:'closed',left:'down',right:'down'},training(0)]];
  for(let i=0;i<20;i++)nap.push([150,{eyes:'closed',left:'down',right:'down',dy:i%8>=4?5:0},
    [...training(Math.min(9,Math.floor(i/2))),...glyph('Z',165+(i%3)*5,55-i%4*5,5,CORAL)]]);
  nap.push([200,{eyes:'closed',left:'down',right:'down'},training(9)],
    [120,{eyes:'open',left:'down',right:'down'},training(9)],
    [120,{left:'point',right:'point'},training(9)],
    [120,{left:'half-wave',right:'half-wave',eyes:'closed'},training(9)],
    [250,{left:'wave',right:'wave',eyes:'happy'},training(9)],
    [120,{left:'half-wave',right:'half-wave',eyes:'happy'},training(9)],
    [120,{left:'point',right:'point',eyes:'happy'},training(0)],
    [400,{},training(0)]);
  story('gag-nap','Training nap','Sleeps beneath a pixel training progress bar, then wakes up and stretches as it finishes.',nap);

  // Edge-entering props are clipped as rectangles, preserving transparent bounds.
  return states.map(state=>({...state,frames:state.frames.map(frame=>({...frame,shapes:frame.shapes.flatMap(s=>{
    const x=Math.max(-20,s.x),y=Math.max(-40,s.y),right=Math.min(220,s.x+s.w),bottom=Math.min(180,s.y+s.h);
    return right>x&&bottom>y?[{...s,x,y,w:right-x,h:bottom-y}]:[];
  })}))}));
}
