import {buildGagStories} from './mascot-gag-stories.mjs';
export function buildGagStates(firstNumber,h) {
 return buildGagStories(h).map((state,i)=>({...state,number:firstNumber+i,collection:'gags',extended:true}));
}
