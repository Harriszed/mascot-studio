from PIL import Image,ImageDraw,ImageFont
from pathlib import Path
import json, subprocess, os
root=Path(__file__).resolve().parent.parent
os.chdir(root)
source = "import {readFileSync} from 'node:fs'; import {buildStates} from './scripts/mascot-pixel-art.mjs'; console.log(JSON.stringify(buildStates(JSON.parse(readFileSync('src/components/claude-mascot/reference-artwork.json')))));"
states={s['name']:s for s in json.loads(subprocess.check_output(['node','--input-type=module','-e',source],text=True))}
W=800
bg='#F7F4EC';ink='#25231E';muted='#70685D';coral='#DD775B'
def font(size,bold=False):
 return ImageFont.truetype('C:/Windows/Fonts/'+('segoeuib.ttf' if bold else 'segoeui.ttf'),size)
def text(d,xy,value,size=20,fill=ink,bold=False):d.text(xy,value,font=font(size,bold),fill=fill)
groups=[ [('idle','wizard-hat','Idle'),('thinking','wizard-hat','Thinking'),('reading','wizard-hat','Reading'),('writing','sunglasses','Writing')], [('running-commands','sunglasses','Commands'),('greeting','crown','Greeting'),('asleep','nightcap','Asleep'),('error','propeller-cap','Error')] ]
frames=[]
for n in range(180):
 t=n/15; group=groups[int(t//6)%2];local=t%6
 im=Image.new('RGB',(W,W),bg);d=ImageDraw.Draw(im)
 d.rectangle((32,30,44,42),fill=coral)
 text(d,(54,22),'MASCOT STUDIO',16,bold=True)
 text(d,(32,62),'Same mascot.',49,bold=True)
 text(d,(32,118),'More personality.',49,bold=True)
 text(d,(34,186),'22 activity states. 8 accessory remixes. One creation skill.',20,muted)
 d.line((32,226,768,226),fill='#CEC8BA',width=1)
 for row in range(2):
  top=254+row*224
  text(d,(32,top),'ORIGINAL STATES' if row==0 else 'MADE WITH THE SKILL',14,muted if row==0 else '#6943AD',True)
  for col,(base,accessory,label) in enumerate(group):
   x=32+col*188; y=top+30
   d.rectangle((x,y,x+172,y+156),fill='#EEE9DD' if row==0 else '#EAE2F3')
   state=states[base if row==0 else base+'-'+accessory]
   time=local%state['duration']
   pose=next(f for f in reversed(state['frames']) if f['time']<=time)
   scale=.69
   ox=x+3+20*scale;oy=y+3+40*scale
   for s in pose['shapes']:
    if 'points' in s:d.polygon([(ox+a*scale,oy+b*scale) for a,b in s['points']],fill=s['fill'])
    else:
     a,b=ox+s['x']*scale,oy+s['y']*scale
     d.rectangle((round(a),round(b),round(a+s['w']*scale)-1,round(b+s['h']*scale)-1),fill=s['fill'])
   caption=label if row==0 else accessory.replace('-',' ').title()
   text(d,(x, y+166),caption,16,bold=True)
 d.line((32,723,768,723),fill='#CEC8BA')
 text(d,(32,738),'github.com/Harriszed/mascot-studio',19,bold=True)
 text(d,(32,771),'Unofficial / Claude: Anthropic / Reference: Ayotomiwa Wale-Durojaye',11,muted)
 for j in range(2):d.rectangle((730+j*20,746,740+j*20,751),fill=coral if j==int(t//6)%2 else '#CEC8BA')
 frames.append(im)
frames[15].save(root/'sharing/reddit-showcase-cover.png')
# A shared palette keeps text, pixel edges, and background stable across frames.
contact=Image.new('RGB',(800,800*6))
for i,k in enumerate([0,20,50,90,110,140]):contact.paste(frames[k],(0,800*i))
palette=contact.quantize(colors=128)
indexed=[im.quantize(palette=palette,dither=Image.Dither.NONE) for im in frames]
# GIF delays use centiseconds: 60/70/70ms yields exactly 15 frames per second.
indexed[0].save(root/'sharing/reddit-mascot-showcase.gif',save_all=True,append_images=indexed[1:],duration=[60,70,70]*60,loop=0,optimize=True,disposal=1)
print('Created 800x800, 12-second GIF:',(root/'sharing/reddit-mascot-showcase.gif').stat().st_size,'bytes')
