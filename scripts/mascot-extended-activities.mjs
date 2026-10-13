// Activity stories share the original thick block actor and reference props.
const C='#DD775B',I='#000000',P='#FFFDF5',G='#D9A441',OK='#3AAB7C',R='#B94236';
export function addExtendedActivities(h){
 const {sequence,rect,shift,glyph,check,frameBox,list,mini,terminal,glass,globe,spark}=h;
 const accent=shapes=>shapes.map(s=>s.fill===I?{...s,fill:'#337FB7'}:s);
 const work=n=>[...frameBox(165,120,40,30),rect(175,125,20,10,G),...Array.from({length:n},(_,i)=>rect(170+i*10,140,5,5,OK))];
 const hammer=up=>up===1?[rect(155,60,5,30,G),rect(145,50,25,15,I)]:up?[rect(155,35,5,30,G),rect(145,25,25,15,I)]:[rect(160,85,5,30,G),rect(150,110,25,15,I)];
 const tool=[[250,{gazeX:5},work(0)]];
 for(let n=0;n<3;n++)tool.push([100,{right:'point',gazeX:5},work(n)],
  [100,{right:'half-wave',gazeX:5},[...work(n),...hammer(1)]],
  [180,{right:'wave',gazeX:5},[...work(n),...hammer(true)]],
  [80,{right:'point',gazeX:5},[...work(n+1),...hammer(false),...spark(185,110,true)]],
  [100,{right:'point',eyes:'closed'},[...work(n+1),...hammer(false)]],[180,{gazeX:5},work(n+1)]);
 tool.push([350,{eyes:'happy'},[...work(3),...check(170,80)]],[150,{eyes:'closed'},work(0)],[250,{gazeX:5},work(0)]);
 sequence('using-tool','Raises a block hammer, makes three timed strikes, and inspects the finished work.',tool);
 const team=(a,b)=>[...mini(-5,129,a),...mini(170,129,b)];
 const helpers=[[300,{},team(false,false)]];
 for(const side of ['left','right']){
  for(let i=0;i<6;i++)helpers.push([130,{[side]:i<2?'point':i<4?'half-wave':'point',gazeX:side==='left'?-5:5},
   [...team(side==='left'&&i%2===0,side==='right'&&i%2===0),rect(side==='left'?45-i*5:145+i*5,110-i%3*5,5,5,G)]]);
  helpers.push([240,{eyes:'happy'},[...team(false,false),...check(side==='left'?5:175,100,OK,3)]]);
 }
 helpers.push([200,{left:'point',right:'point',eyes:'happy'},[...team(true,true),...spark(90,40,true)]],[350,{},team(false,false)]);
 sequence('directing-helpers','Dispatches a task to each helper; they work, report back, and celebrate together.',helpers);
 const done=[[200],[100,{eyes:'closed',dy:5}],[100,{left:'point',right:'point'}],[100,{left:'half-wave',right:'half-wave'}],[200,{left:'wave',right:'wave',eyes:'happy'},spark(95,30,true)]];
 for(let i=0;i<16;i++)done.push([100,{left:i<8?'wave':'point',right:i<8?'wave-out':'point',eyes:'happy',dy:i===3||i===4?-5:0,airborne:i===3||i===4},
  Array.from({length:8},(_,j)=>rect(10+j*25+(i%2?5:0),-10+((i*10+j*15)%120),5,5,j%3===0?OK:j%3===1?G:C))]);
 done.push([100,{left:'half-wave',right:'half-wave',eyes:'happy'}],[100,{left:'point',right:'point',eyes:'happy'}],[300,{eyes:'happy'},check(90,35)],[2200]);
 sequence('done','A blocky celebration hop and falling confetti, then a resting pose at five seconds.',done);
 const output=rows=>[...frameBox(50,113,100,40),...glyph('>',60,123,3),rect(75,123,40,5,C),rect(125,123,5,5,OK),
  ...Array.from({length:rows},(_,j)=>rect(65,133+j*5,30+j*15,5,OK))];
 const commands=[[250,{left:'hold',right:'hold',gazeY:15},terminal(0)]];
 for(let i=0;i<12;i++)commands.push([140,{left:i%2?'hold':'down',right:i%2?'down':'hold',gazeY:15},output(Math.min(3,Math.floor(i/4)))]);
 commands.push([160,{gazeY:15,eyes:'closed'},output(3)],[350,{eyes:'happy'},[...output(3),...check(90,35)]],
  [180,{right:'point'},[...terminal(0),...glyph('>',90,30,5,C)]],[250,{left:'hold',right:'hold',gazeY:15},terminal(0)]);
 sequence('running-commands','Types a command, waits for output, and gets a successful exit.',commands);
 for(const activity of ['searching-web','searching-code']){
  const target=activity==='searching-web'?accent(globe()):[...frameBox(70,15,60,40),...glyph('<',80,25,3),...glyph('/',95,25,3),...glyph('>',110,25,3)];
  const search=[[300,{right:'point'},[...target,...accent(glass(145,65))]]];
  for(const x of [145,140,135,130,125,130,135,140,145,150,155,150,145])search.push([150,{right:'point',gazeX:x<145?-5:5,gazeY:-5},[...target,...accent(glass(x,x<140?60:65))]]);
  search.push([160,{right:'point',eyes:'closed'},[...target,...accent(glass(145,65))]],[200,{right:'half-wave',eyes:'happy'},[...target,...spark(155,40,true)]],
   [350,{right:'point',eyes:'happy'},[...target,...accent(glass(145,65)),...check(155,115)]],[200,{right:'point'},[...target,...accent(glass(145,65))]]);
  sequence(activity,activity==='searching-web'?'Sweeps a pixel magnifier around the globe, spots a result, and confirms the find.':'Scans the code panel with a pixel magnifier and highlights a matching result.',search);
 }
 const branch=()=>accent([rect(95,15,5,40),rect(100,30,20,5),rect(115,20,5,15),...[[90,10],[110,10],[90,50]].flatMap(([x,y])=>frameBox(x,y,15,15))]);
 const commit=[[250,{gazeY:-5},branch()],[150,{right:'point',gazeY:-5},branch()]];
 for(const y of [50,45,40,35,30,25,20,15])commit.push([110,{right:'point',gazeY:-5},[...branch(),rect(95,y,5,5,OK)]]);
 for(const x of [100,105,110,115])commit.push([100,{right:'point',gazeY:-5},[...branch(),rect(x,15,5,5,OK)]]);
 commit.push([180,{right:'half-wave',eyes:'happy'},[...branch(),...spark(125,5,true)]],[350,{eyes:'happy'},[...branch(),...check(150,100)]],[100,{eyes:'closed'},branch()],[300,{gazeY:-5},branch()]);
 sequence('committing','A green commit travels up the branch, pushes across, and lands with a confirmation.',commit);
 const q=offset=>glyph('?',150,45+offset,5,C);
 sequence('waiting-for-you','Looks toward you, gives a small questioning gesture, then waits patiently.',[
  [600,{gazeX:5},q(0)],[120,{gazeX:10},q(0)],[160,{right:'point',gazeX:5},q(-5)],[150,{right:'half-wave',gazeX:5},q(-10)],
  [300,{right:'point',gazeX:5},q(-5)],[400,{right:'point',gazeX:5},q(0)],[90,{right:'point',eyes:'closed'},q(0)],
  [500,{right:'point',gazeX:5},q(0)],[150,{gazeX:5},q(0)],[700,{gazeX:5},q(0)]]);
 const warning=()=>glyph('!',95,25,5,R),error=[[300,{},warning()],[100,{eyes:'closed',dy:5},warning()]];
 for(const dx of [-5,5,-5,5,-5,0])error.push([80,{dx,eyes:'closed',left:'down',right:'down'},warning()]);
 error.push([150,{right:'half-head',gazeY:-5},warning()],[200,{right:'head',gazeY:-5},warning()],
  [110,{right:'scratch',eyes:'closed'},warning()],[110,{right:'head'},warning()],[160,{right:'half-head'},warning()],
  [220,{right:'point'},[...warning(),...glyph('?',155,45,5,C)]],[350,{},warning()]);
 sequence('error','Reacts with a short blocky shake, checks the problem, and asks what to try next.',error);
 const stack=(amount,gap)=>Array.from({length:amount},(_,j)=>[...frameBox(75+j*5,10+j*gap,50,25),rect(85+j*5,20+j*gap,25,5,C)]).flat();
 const compact=[[250,{gazeY:-5},stack(3,15)]];
 for(const gap of [15,10,5,0])compact.push([140,{left:'point',right:'point',gazeY:-5},stack(3,gap)]);
 compact.push([160,{left:'half-wave',right:'half-wave',eyes:'closed'},stack(2,5)],[200,{left:'wave',right:'wave',eyes:'happy'},stack(1,0)],
  [250,{left:'point',right:'point',eyes:'happy'},[...stack(1,0),...spark(135,25,true)]],[350,{eyes:'happy'},[...stack(1,0),...check(150,100)]],[150,{eyes:'closed'},stack(1,0)]);
 for(const gap of [0,5,10,15])compact.push([140,{gazeY:-5},stack(3,gap)]);
 compact.push([250,{gazeY:-5},stack(3,15)]);
 sequence('compacting','Squeezes three memory cards into one neat packet, checks it, and unfolds the next batch.',compact);
 const meter=last=>[...frameBox(65,20,75,25),...Array.from({length:5},(_,j)=>rect(75+j*12,25,8,15,j<4?G:last))];
 const full=[[650,{gazeY:-5},meter(G)],[350,{gazeY:-5,right:'point'},meter(R)],
  [250,{gazeY:-5,right:'half-head'},meter(R)],[500,{gazeY:-5,right:'head'},meter(R)],
  [350,{right:'scratch',gazeY:-5},meter(R)],
  [650,{right:'head',gazeY:-5},[...meter(R),...glyph('!',155,40,5,R)]],
  [300,{right:'half-head',gazeY:-5},meter(R)],[500,{right:'point',gazeY:-5},meter(R)],
  [350,{gazeY:-5},meter(G)],[1000,{gazeY:-5},meter(G)]];
 sequence('context-nearly-full','Notices a steady amber-to-red memory warning, inspects it, then calmly points out the problem.',full);
 const plan=[[300,{gazeY:-5},list(0)]];
 for(let row=0;row<3;row++)plan.push([160,{right:'point',gazeY:-5},list(row)],
  [120,{right:'half-wave',gazeY:-5},[...list(row),rect(140,20+row*10,5,5,C)]],
  [120,{right:'wave',gazeY:-5},list(row+1)],[400,{right:'point',eyes:row===2?'happy':'open',gazeY:-5},list(row+1)]);
 plan.push([200,{left:'point',right:'point',eyes:'happy'},[...list(3),...check(145,65)]],[350,{eyes:'happy'},list(3)],[100,{eyes:'closed'},list(0)],[300,{gazeY:-5},list(0)]);
 sequence('plan-progress','Points through three checklist milestones, then proudly shows the completed plan.',plan);
 const server=phase=>[0,1,2].flatMap(j=>[...frameBox(70,10+j*15,60,15),rect(80,15+j*15,5,5,OK),rect(95,15+j*15,25,5)]);
 const serving=[[400,{},server(0)]];
 for(let i=0;i<12;i++)serving.push([170,{gazeY:i<4?-5:0,right:i===4||i===5?'point':'rest',eyes:i===8?'closed':'open'},
  [...server(i),...(i>=4&&i<=6?[rect(150+(i-4)*10,80,5,5,OK)]:[])]]);
 serving.push([250,{eyes:'happy'},[...server(0),...spark(145,20)]],[400,{},server(0)]);
 sequence('server-running','Monitors steady server lights, follows a request packet, acknowledges it, and returns to monitoring.',serving);
 const bubble=phase=>[...frameBox(60,25,80,30),...[0,1,2].map(j=>rect(80+j*15,35-(j===phase?5:0),5,5,C))];
 const typing=[[350,{gazeY:-5},bubble(-1)]];
 for(let i=0;i<12;i++)typing.push([130,{gazeY:-5,gazeX:i<6?-5:5,eyes:i===7?'closed':'open'},bubble(i%3)]);
 typing.push([180,{right:'point',eyes:'happy'},bubble(2)],[300,{eyes:'happy'},bubble(-1)],[150,{gazeY:-5},bubble(-1)],[350,{gazeY:-5},bubble(-1)]);
 sequence('typing','Follows the bouncing message dots, perks up at your draft, and settles back to listening.',typing);
}
