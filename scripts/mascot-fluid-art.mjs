import {buildActivityStories} from './mascot-activity-stories.mjs';
export function buildFluidStates(firstNumber,h) {
 return buildActivityStories(h).sort((a,b)=>h.order.indexOf(a.name)-h.order.indexOf(b.name)).map((s,index)=>{
  const title=h.titles[s.name]+' / extended pixel';
  return {...s,number:firstNumber+index,baseState:s.name,name:s.name+'-fluid',collection:'fluid',title,label:title};
 });
}
