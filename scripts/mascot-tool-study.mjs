// A separate review candidate. The published activity registry stays unchanged.
import { drawMascot } from './mascot-pixel-art.mjs';

const C='#DD775B', I='#000000', G='#D9A441', P='#FFFDF5';
const rect=(x,y,w,h,fill=I)=>({x,y,w,h,fill});

export function buildToolStudy(reference) {
  const frames=[];let elapsed=0;
  const nailTops=[100,110,120,125];
  const bench=()=>[rect(150,135,60,10,I),rect(155,140,10,20,I),rect(195,140,10,20,I)];
  const plank=(n,dx=0)=>[rect(155+dx,125,45,10,G),
    rect(170+dx,nailTops[n],15,5,I),
    ...(nailTops[n]+5<125?[rect(175+dx,nailTops[n]+5,5,125-nailTops[n]-5,I)]:[])];
  const arms={
    reach:{blocks:[[140,103,15,20],[150,113,20,15],[165,118,20,15]],grip:[175,125]},
    low:{blocks:[[140,98,15,20],[150,88,15,20],[160,83,20,15]],grip:[170,90]},
    middle:{blocks:[[140,90,15,25],[145,75,15,20],[150,65,20,20]],grip:[160,75]},
    high:{blocks:[[140,85,15,25],[140,65,15,25],[135,50,20,20]],grip:[145,60]},
    back:{blocks:[[135,85,15,25],[130,65,15,25],[125,45,20,20]],grip:[135,55]},
    swing:{blocks:[[140,90,15,25],[150,85,20,15],[165,90,20,20]],grip:[175,100]},
    front:{blocks:[[140,100,20,15],[155,105,20,15],[170,115,20,15],[185,120,15,15]],grip:[190,130]},
    rebound:{blocks:[[140,95,20,15],[155,100,20,15],[170,105,20,15],[185,110,15,15]],grip:[190,120]},
    brow:{blocks:[[140,85,15,20],[135,70,20,15]],grip:null},
  };
  // Only the wooden shaft uses 5px staircase samples; limbs remain thick blocks.
  const shaft=(a,b)=>{
    const ax=a[0]/5,ay=a[1]/5,bx=b[0]/5,by=b[1]/5;
    const count=Math.max(Math.abs(bx-ax),Math.abs(by-ay));
    return Array.from({length:count+1},(_,i)=>rect(
      Math.round(ax+(bx-ax)*i/Math.max(1,count))*5,
      Math.round(ay+(by-ay)*i/Math.max(1,count))*5,5,5,G));
  };
  const laidHammer=()=>[...shaft([180,125],[195,120]),rect(195,105,15,30,I),rect(200,110,5,5,P)];
  function paint({arm='rest',lean=0,dy=0,gazeX=5,gazeY=10,eyes='open',nail=0,
    hammer='laid',headBottom,plankOffset=0,empty=false,left='rest'}={}) {
    const base=drawMascot(reference,{dy,gazeX:gazeX+lean,gazeY,eyes,planted:true});
    const body=lean===0?[base[4]]:[rect(55+lean,70+dy,85,45,C),rect(55,115+dy,85,20,C)];
    const leftArm=left==='brace'?[rect(33+lean,103+dy,22,18,C),rect(28+lean,108+dy,10,15,C)]:[rect(33+lean,98+dy,22,23,C)];
    const preset=arms[arm];
    const right=preset?preset.blocks.map(([x,y,w,h])=>rect(x+lean,y+dy,w,h,C)):[rect(140+lean,98+dy,22,23,C)];
    const grip=preset?.grip?.map((v,i)=>v+(i===0?lean:dy));
    let tool=[],head;
    if(hammer==='laid')tool=laidHammer();
    else if(hammer==='held') {
      if(!grip)throw new Error('A held hammer needs a grip');
      if(['front','rebound'].includes(arm))head=rect(165,headBottom-15,30,15,I);
      else if(arm==='reach')head=rect(195,105,15,30,I);
      else if(arm==='low')head=rect(grip[0]+15,grip[1]-15,30,15,I);
      else if(arm==='swing')head=rect(grip[0]-10,grip[1]-45,30,15,I);
      else head=rect(grip[0]-10,grip[1]-40,30,15,I);
      const neck=arm==='reach'?[195,120]:['front','rebound'].includes(arm)?[185,headBottom]:[head.x+10,head.y+head.h];
      tool=[...shaft(grip,neck),head,rect(head.x+5,head.y+5,5,5,P)];
    }
    const hand=hammer==='held'?right.at(-1):null;
    const shapes=[...base.slice(0,4),...body,...leftArm,...right,...base.slice(7),...bench(),
      ...(!empty?plank(nail,plankOffset):[]),...tool,...(hand?[hand]:[])];
    return {shapes,grip:hammer==='held'?grip:null,hand,head};
  }
  function beat(hold,stage,pose={}) {
    const result=paint(pose);frames.push({time:elapsed/1000,stage,...result});elapsed+=hold;
  }
  beat(650,'Notice the job');
  beat(160,'Reach for the handle',{arm:'reach',lean:5,left:'brace'});
  beat(300,'Take a firm grip',{arm:'reach',lean:5,left:'brace',hammer:'held'});
  beat(110,'Lift the tool',{arm:'low',lean:5,hammer:'held'});
  beat(100,'Raise the head',{arm:'middle',hammer:'held',gazeY:0});
  function strike(n,{backswing='high',hold=400,finish=false}={}) {
    beat(hold,'Set the weight',{arm:backswing,lean:-5,dy:finish?0:-5,left:'brace',gazeY:-5,nail:n,hammer:'held'});
    beat(80,'Accelerate',{arm:'swing',left:'brace',nail:n,hammer:'held',gazeY:5});
    beat(60,'Contact',{arm:'front',lean:5,left:'brace',nail:n,hammer:'held',headBottom:nailTops[n]});
    beat(100,'Drive the nail',{arm:'front',lean:5,dy:5,left:'brace',eyes:'closed',nail:n+1,hammer:'held',headBottom:nailTops[n+1]});
    beat(110,'Recoil',{arm:'rebound',lean:5,nail:n+1,hammer:'held',headBottom:nailTops[n+1]-15});
    beat(finish?550:420,'Let it settle',{arm:'rebound',lean:5,gazeY:15,nail:n+1,hammer:'held',headBottom:nailTops[n+1]-15});
  }
  strike(0,{hold:350});
  beat(110,'Draw back',{arm:'middle',nail:1,hammer:'held',gazeY:0});
  strike(1,{backswing:'back',hold:620});
  beat(120,'Line up the finish',{arm:'middle',nail:2,hammer:'held',gazeY:0});
  strike(2,{hold:330,finish:true});
  beat(160,'Lower the hammer',{arm:'low',lean:5,nail:3,hammer:'held'});
  beat(140,'Return it to the bench',{arm:'reach',lean:5,nail:3,hammer:'held'});
  beat(300,'Release the handle',{arm:'reach',lean:5,nail:3});
  beat(550,'Inspect the flush nail',{lean:5,dy:5,gazeY:15,nail:3});
  const reducedFrame=frames.length;
  beat(750,'Satisfied',{eyes:'happy',nail:3});
  beat(160,'Recover',{arm:'brow',nail:3});
  beat(400,'Wipe the brow',{arm:'brow',eyes:'closed',nail:3});
  beat(160,'Relax',{nail:3});
  for(const offset of [0,5,15,30,50,70])beat(100,'Slide the finished board away',{arm:'reach',lean:5,nail:3,plankOffset:offset});
  for(const offset of [80,65,45,25,10,0])beat(100,'Ready the next board',{arm:'rest',plankOffset:offset});
  beat(550,'Ready again');
  // Board entrance and departure are deliberately clipped at the canvas edge.
  for(const frame of frames)frame.shapes=frame.shapes.flatMap(s=>{
    const x=Math.max(-20,s.x),y=Math.max(-40,s.y),r=Math.min(220,s.x+s.w),b=Math.min(180,s.y+s.h);
    return r>x&&b>y?[{...s,x,y,w:r-x,h:b-y}]:[];
  });
  return {name:'using-tool-story-study',title:'Using a tool / story study',label:'A deliberate hammering story',
    description:'Picks up the hammer, makes two weighted strikes and a finishing tap, inspects the nail, then puts the tool down and recovers.',
    duration:elapsed/1000,frames,loop:true,reducedFrame,viewBox:[-20,-40,240,220],style:'original-block-pixel'};
}
