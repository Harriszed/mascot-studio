'use client';

import { useEffect, useRef, useState } from 'react';
import type { CSSProperties, SVGProps } from 'react';
import artwork from './artwork.json';

export type MascotState =
  | 'idle' | 'thinking' | 'using-tool' | 'directing-helpers' | 'done'
  | 'greeting' | 'asleep' | 'reading' | 'writing' | 'running-commands'
  | 'searching-web' | 'searching-code' | 'testing' | 'committing'
  | 'waiting-for-you' | 'error' | 'compacting' | 'context-nearly-full'
  | 'plan-progress' | 'server-running' | 'typing' | 'walking'
  | 'idle-wizard-hat' | 'thinking-wizard-hat' | 'reading-wizard-hat'
  | 'writing-sunglasses' | 'running-commands-sunglasses' | 'greeting-crown'
  | 'asleep-nightcap' | 'error-propeller-cap'
  | 'idle-fluid' | 'thinking-fluid' | 'greeting-fluid' | 'reading-fluid'
  | 'writing-fluid' | 'testing-fluid' | 'asleep-fluid' | 'walking-fluid'
  | 'using-tool-fluid' | 'directing-helpers-fluid' | 'done-fluid'
  | 'running-commands-fluid' | 'searching-web-fluid' | 'searching-code-fluid'
  | 'committing-fluid' | 'waiting-for-you-fluid' | 'error-fluid' | 'compacting-fluid'
  | 'context-nearly-full-fluid' | 'plan-progress-fluid' | 'server-running-fluid' | 'typing-fluid';

export const MASCOT_STATES = artwork.states.map(({ name, title, description }) => ({
  name: name as MascotState, title, description,
}));

export interface ClaudeMascotProps extends Omit<SVGProps<SVGSVGElement>, 'children' | 'color'> {
  state?: MascotState;
  size?: number | string;
  color?: string;
  eyeColor?: string;
  speed?: number;
  paused?: boolean;
  loop?: boolean;
  decorative?: boolean;
  label?: string;
  onDoneComplete?: () => void;
}

function SpriteMascot({
  state = 'idle', size = 160, color = '#DD775B', eyeColor = '#000000',
  speed = 1, paused = false, loop, decorative = false, label,
  className = '', style, onDoneComplete, ...props
}: ClaudeMascotProps) {
  void onDoneComplete;
  const animation = artwork.states.find(item => item.name === state) ?? artwork.states[0];
  const safeSpeed = Number.isFinite(speed) && speed > 0 ? speed : 1;
  const variables = {
    '--cm-color': color, '--cm-ink': eyeColor, '--cm-tempo': 1 / safeSpeed,
    '--cm-repeat': (loop ?? animation.loop) ? 'infinite' : '1', ...style,
  } as CSSProperties;
  return (
    <svg {...props} key={state} xmlns="http://www.w3.org/2000/svg" viewBox={animation.viewBox.join(' ')}
      width={size} height={size} className={`cm-root ${className}`} shapeRendering="crispEdges"
      data-state={animation.name} data-paused={paused ? 'true' : undefined} style={variables}
      role={decorative ? undefined : 'img'} aria-hidden={decorative || undefined}
      aria-label={decorative ? undefined : label ?? animation.label}>
      {!decorative && <title>{label ?? animation.label}</title>}
      <style>{animation.css}</style>
      <g dangerouslySetInnerHTML={{ __html: animation.markup }} />
    </svg>
  );
}

function DonePlayback(props: ClaudeMascotProps) {
  const doneState = props.state === 'done-fluid' ? 'done-fluid' : 'done';
  const idleState = doneState === 'done-fluid' ? 'idle-fluid' : 'idle';
  const [finished, setFinished] = useState(false);
  const callback = useRef(props.onDoneComplete);
  useEffect(() => { callback.current = props.onDoneComplete; }, [props.onDoneComplete]);
  useEffect(() => {
    const timer = window.setTimeout(() => { setFinished(true); callback.current?.(); }, 5000);
    return () => window.clearTimeout(timer);
  }, []);
  return <SpriteMascot {...props} state={finished ? idleState : doneState} loop={finished ? props.loop : false}
    label={finished ? undefined : props.label} />;
}

/** Base states and accessory variants. The host app supplies activity signals. */
export default function ClaudeMascot(props: ClaudeMascotProps) {
  return props.state === 'done' || props.state === 'done-fluid'
    ? <DonePlayback key={props.state} {...props} /> : <SpriteMascot {...props} />;
}
