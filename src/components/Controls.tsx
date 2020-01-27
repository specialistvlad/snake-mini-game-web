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

  return (<div className={className}> 
    <button onClick={up}>Up</button>
    <button onClick={left}>Left</button> <button onClick={right}>Right</button>
    <button onClick={down}>Down</button>
    {/* <button onClick={resetGame}>Reset game</button> */}
  </div>);
};
