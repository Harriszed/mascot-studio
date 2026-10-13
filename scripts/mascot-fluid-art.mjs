// Extended pixel storyboards reuse the ORIGINAL actor and drawing helpers.
import { addExtendedActivities } from './mascot-extended-activities.mjs';
const CORAL='#DD775B', INK='#000000', PAPER='#FFFDF5', GOLD='#D9A441', GREEN='#3AAB7C';
export function buildFluidStates(firstNumber, helpers) {
  const {draw,rect,shift,glyph,check,frameBox,book,pencil,list,walking}=helpers;
  const sequences=[];
  // Setup and recovery are separate from the fast action: no uniform slow-down.
  const cadence={idle:[1100,950],thinking:[600,800],greeting:[500,800],reading:[650,650],writing:[450,600],
    testing:[600,750],asleep:[500,500],'using-tool':[550,650],'directing-helpers':[600,750],
    'running-commands':[550,650],'searching-web':[600,750],'searching-code':[600,750],
    committing:[550,700],'waiting-for-you':[1000,1100],error:[500,700],compacting:[550,700],
    'context-nearly-full':[650,1000],'plan-progress':[600,750],'server-running':[900,1000],typing:[700,900]};
  function sequence(baseState,description,poses) {
    let elapsed=0;
    let accented=false;
    const frames=poses.map(([hold,options={},extra=[]],index)=>{
      const pace=cadence[baseState];
      if(pace&&index===0)hold=Math.max(hold,pace[0]);
      if(pace&&index===poses.length-1)hold=Math.max(hold,pace[1]);
      if(baseState!=='done'&&options.eyes==='happy'&&!accented){hold=Math.max(hold,450);accented=true;}
      const frame={time:elapsed/1000,shapes:[...draw({planted:!options.airborne,...options}),...extra]};
      elapsed+=hold;return frame;
    });
    const reducedFrame=['idle','reading','asleep'].includes(baseState)?0:Math.max(0,poses.findIndex(p=>p[1]?.eyes==='happy'));
    sequences.push({baseState,description,duration:elapsed/1000,frames,reducedFrame});
  }
  const spark=(x,y,big=false)=>big?[rect(x,y-5,5,15,GOLD),rect(x-5,y,15,5,GOLD)]:[rect(x,y,5,5,GOLD)];
  const dots=phase=>[0,1,2].map(j=>rect(80+j*15,35-(j===phase?5:0),5,5,CORAL));
  const bulb=()=>[rect(85,20,25,5,GOLD),rect(80,25,35,20,GOLD),
    rect(85,45,25,5,GOLD),rect(90,50,15,10,INK)];
  sequence('idle','Looks left, looks right, blinks, and stretches before settling.',[
    [800],[120,{gazeX:-5}],[300,{gazeX:-10}],[100,{gazeX:-5}],[150],
    [120,{gazeX:5}],[300,{gazeX:10}],[100,{gazeX:5}],[250],[90,{eyes:'closed'}],[250],
    [100,{left:'point',right:'point'}],[100,{left:'half-wave',right:'half-wave'}],
    [160,{left:'wave',right:'wave',eyes:'closed'}],
    [120,{left:'wave-out',right:'wave-out',eyes:'happy'}],
    [160,{left:'wave',right:'wave',eyes:'happy'}],
    [100,{left:'half-wave',right:'half-wave'}],[100,{left:'point',right:'point'}],[700],
  ]);
  sequence('thinking','Considers steady dots, gives a deliberate head scratch, then holds one clear idea.',[
    [600,{},dots(-1)],[300,{gazeX:-5,gazeY:-5},dots(-1)],
    [300,{gazeX:5,gazeY:-5},dots(-1)],[180,{right:'point',gazeY:-5},dots(-1)],
    [180,{right:'half-head',gazeY:-5},dots(-1)],
    [350,{right:'head',gazeX:-5,gazeY:-5},dots(-1)],
    [280,{right:'scratch',gazeX:-5,gazeY:-5},dots(-1)],
    [300,{right:'head',gazeY:-5},dots(-1)],
    [280,{right:'scratch',gazeY:-5},dots(-1)],
    [400,{right:'head',gazeY:-5},dots(-1)],
    [220,{right:'half-head',gazeY:-5},bulb()],
    [350,{right:'point',gazeY:-5},bulb()],
    [700,{right:'point',eyes:'happy'},bulb()],
    [300,{eyes:'happy'},bulb()],[250,{},dots(-1)],[800,{},dots(-1)],
  ]);
  sequence('greeting','Anticipation, three blocky waves, a cheerful bow, and recovery.',[
    [300],[120,{eyes:'closed',dy:5}],[90,{right:'point'}],
    [90,{right:'half-wave'}],[100,{right:'wave',eyes:'happy'}],
    ...[0,1,2].flatMap(i=>[
      [110,{right:'wave-out',eyes:'happy'},spark(180,45,i%2===0)],
      [100,{right:'wave',eyes:'happy'},spark(175,35)],
      [110,{right:'wave-in',eyes:'happy'},spark(180,25,i%2===1)],
      [100,{right:'wave',eyes:'happy'}],
    ]),
    [90,{right:'half-wave',eyes:'happy'}],[90,{right:'point',eyes:'happy'}],
    [100,{eyes:'happy'}],[160,{dy:5,eyes:'closed',left:'down',right:'down'}],
    [100,{eyes:'happy'}],[500],
  ]);
  // Seven explicit page silhouettes layered over the original block book.
  function turningBook(stage) {
    const result=book(0), widths=[30,25,20,15,10,5,10,15,20,25,30];
    const width=widths[stage],x=stage<6?100:100-width;
    result.push(rect(x,108,width,40,PAPER),rect(stage<6?x+width-5:x,113,5,30,INK));
    if(width>=15)result.push(rect(x+5,123,width-10,5,CORAL));
    return result;
  }
  sequence('reading','Scans the original book, lifts a page through eleven poses, then reads on.',[
    [350,{left:'hold',right:'hold',gazeY:15,gazeX:-5},book(0)],
    [200,{left:'hold',right:'hold',gazeY:15},book(0)],
    [250,{left:'hold',right:'hold',gazeY:15,gazeX:5},book(0)],
    [90,{left:'hold',right:'hold',eyes:'closed'},book(0)],
    [200,{left:'hold',right:'hold',gazeY:15,gazeX:5},book(0)],
    ...[0,1,2,3,4,5,6,7,8,9,10].map(stage=>[stage===5?140:100,{left:'hold',right:'hold',gazeY:10,gazeX:stage<6?5:-5},turningBook(stage)]),
    [250,{left:'hold',right:'hold',gazeY:15,gazeX:-5},book(0)],
    [200,{left:'hold',right:'hold',gazeY:15},book(0)],
    [250,{left:'hold',right:'hold',gazeY:15,gazeX:5},book(0)],
    [200,{left:'hold',right:'hold',gazeY:15},book(0)],
    [300,{left:'hold',right:'hold',gazeY:15,gazeX:-5},book(0)],
  ]);
  const page=(first,second)=>[...frameBox(60,118,75,35),
    ...(first?[rect(70,128,first,5,CORAL)]:[]),...(second?[rect(70,138,second,5,CORAL)]:[])];
  const writing=[[200,{left:'hold',right:'hold',gazeY:15},[...page(0,0),...pencil(65,108)]]];
  for(let line=0;line<2;line++) {
    for(let step=0;step<7;step++) {
      const dx=step*5,length=Math.min(35,dx+5);
      writing.push([95,{left:'hold',right:'hold',gazeY:15,gazeX:step>3?5:0},
        [...page(line?35:length,line?length:0),rect(120+Math.min(dx,10),113,25,15,CORAL),...pencil(95+dx,108+line*10)]]);
    }
    writing.push([180,{left:'hold',right:'hold',gazeY:15},[...page(35,line?35:0),...pencil(100,98+line*10)]]);
  }
  writing.push([220,{left:'hold',right:'hold',eyes:'happy'},[...page(35,35),...pencil(110,100),...spark(155,55,true)]]);
  for(const offset of [10,20,30])writing.push([80,{left:'hold',right:'hold',gazeY:15},[...page(0,0),...shift(page(35,35),offset,-offset),...pencil(65,108)]]);
  writing.push([200,{left:'hold',right:'hold',gazeY:15},[...page(0,0),...pencil(65,108)]]);
  sequence('writing','Draws two lines with a stepped pixel pencil, admires the work, and starts a fresh sheet.',writing);
  const tests=[[300,{gazeY:-5},list(0)]];
  for(let row=0;row<3;row++)tests.push(
    [120,{right:'point',gazeY:-5},list(row)],
    [120,{right:'half-wave',gazeY:-5},list(row)],
    [120,{right:'wave',gazeY:-5},[...list(row),rect(145,30+row*10,5,5,GOLD)]],
    [100,{right:'wave',gazeY:-5},[...list(row),rect(135,30+row*10,5,5,GOLD)]],
    [180,{right:'point',gazeY:-5},[...list(row+1),...check(145,30+row*10,GREEN,5)]],
    [140,{gazeY:-5},list(row+1)],
  );
  tests.push([220,{eyes:'happy',left:'point',right:'point'},[...list(3),...check(150,100)]],
    [180,{eyes:'happy',left:'half-wave',right:'half-wave'},[...list(3),...spark(25,60,true),...spark(175,60,true)]],
    [250,{eyes:'happy'},list(3)],[100,{eyes:'closed'},list(0)],[300,{gazeY:-5},list(0)]);
  sequence('testing','Sends three pixel test signals, ticks each result, and celebrates a full pass.',tests);
  const sleep=[];
  for(let i=0;i<24;i++) {
    const phase=i%12,dy=phase>=4&&phase<9?5:0;
    const marks=[...glyph('Z',150,40-i%6*10,5,CORAL),...glyph('Z',175,15-i%6*10,5,CORAL)];
    sleep.push([220,{eyes:'closed',left:i===12?'head':'down',right:'down',dy},marks]);
  }
  sleep.push([300,{eyes:'closed',left:'down',right:'down'},[...glyph('Z',150,40,5,CORAL),...glyph('Z',175,15,5,CORAL)]]);
  sequence('asleep','Breathes with planted feet, lets sleep glyphs rise, and briefly rubs a sleepy eye.',sleep);
  // Keep the original measured rectangular anatomy. Extra leg-height poses use
  // coarse 5px changes; no angled segments, rounded feet, or thin joint rig.
  let walkElapsed=0;
  const walkFrames=Array.from({length:24},(_,i)=>{
    const position=i*walking.length/24,a=walking[Math.floor(position)].shapes;
    const b=walking[(Math.floor(position)+1)%walking.length].shapes,blend=position%1;
    const shapes=a.map((s,j)=>{
      const out={...s,x:Math.round(s.x),y:Math.round(s.y),w:Math.round(s.w),h:Math.round(s.h)};
      if(j<4){out.y=130;out.h=Math.max(10,Math.round((s.h+(b[j].h-s.h)*blend)/5)*5);}
      return out;
    });
    const frame={time:walkElapsed/1000,shapes};walkElapsed+=[30,20,20,30,30,20][i%6];return frame;
  });
  sequences.push({baseState:'walking',description:'The measured original rectangular gait, with extra leg-height poses and a clearer stride.',duration:walkElapsed/1000,frames:walkFrames,reducedFrame:0});
  addExtendedActivities({...helpers,sequence,spark});
  sequences.sort((a,b)=>helpers.order.indexOf(a.baseState)-helpers.order.indexOf(b.baseState));
  return sequences.map((s,index)=>{
    const title=helpers.titles[s.baseState]+' / extended pixel';
    return {number:firstNumber+index,name:s.baseState+'-fluid',collection:'fluid',...s,title,label:title,
      loop:s.baseState!=='done',viewBox:[-20,-40,240,220],style:'original-block-pixel'};
  });
}
