import React, { FC, useCallback } from 'react';

export const Controls: FC<{
  className?: string,
  callback: Function,
}> = ({
  className,
  callback,
}) => {
  const up = useCallback(() => callback({ code: 'ArrowUp' }), [callback]);
  const left = useCallback(() => callback({ code: 'ArrowLeft' }), [callback]);
  const right = useCallback(() => callback({ code: 'ArrowRight' }), [callback]);
  const down = useCallback(() => callback({ code: 'ArrowDown' }), [callback]);
  const resetGame = useCallback(() => callback({ code: 'resetGame' }), [callback]);
  
// https://stackoverflow.com/questions/34639583/how-can-i-create-responsive-joystick-layout-buttons-in-html
  return (<div className={className}> 
    <div id="joystick" style={{ width: '20%' }}>
      <svg width="100%" height="100%" viewBox="0 0 100 100">
        <defs>
          <linearGradient id="grad1" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style={{ stopColor: 'rgb(16,16,16)', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: 'rgb(240,240,240)', stopOpacity: 1}} />
          </linearGradient>
          <linearGradient id="grad2" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style={{ stopColor: 'rgb(240,240,240)', stopOpacity: 1}} />
            <stop offset="100%" style={{ stopColor: 'rgb(16,16,16)', stopOpacity: 1}} />
          </linearGradient>
          <linearGradient id="grad3" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style={{ stopColor: 'rgb(168,168,168)', stopOpacity: 1}} />
            <stop offset="100%" style={{ stopColor: 'rgb(239,239,239)', stopOpacity: 1}} />
          </linearGradient>
        </defs>
        <circle cx="50" cy="50" r="50" fill="url(#grad1)" />
        <circle cx="50" cy="50" r="47" fill="url(#grad2)" stroke="black" strokeWidth="1.5px" />
        <circle cx="50" cy="50" r="44" fill="url(#grad3)" />
        <circle cx="50" cy="50" r="20" fill="#cccccc" stroke="black" strokeWidth="1px" />
        <path d="M50,14 54,22 46,22Z" fill="rgba(0,0,0,0.8)" />
        <path d="M50,86 54,78 46,78Z" fill="rgba(0,0,0,0.8)" />
        <path d="M14,50 22,54 22,46Z" fill="rgba(0,0,0,0.8)" />
        <path d="M86,50 78,54 78,46Z" fill="rgba(0,0,0,0.8)" />
        <circle cx="50" cy="50" r="20" stroke="black" stroke-width="0" fill="rgba(0,0,0,0)" onClick={resetGame}/>
        <circle cx="50" cy="15" r="20" stroke="black" stroke-width="0" fill="rgba(0,0,0,0)" onClick={up}/>
        <circle cx="15" cy="50" r="20" stroke="black" stroke-width="0" fill="rgba(0,0,0,0)" onClick={left}/>
        <circle cx="85" cy="50" r="20" stroke="black" stroke-width="0" fill="rgba(0,0,0,0)" onClick={right}/>
        <circle cx="50" cy="85" r="20" stroke="black" stroke-width="0" fill="rgba(0,0,0,0)" onClick={down}/>
      </svg>
    </div>
  </div>);
};
