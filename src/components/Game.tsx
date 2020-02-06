import React, { useState, useEffect, useCallback } from 'react';
import useEventListener from '@use-it/event-listener';
import { useSwipeable } from 'react-swipeable'

import { GameState } from '../core/types';
import game from '../core/game';
import Table from './Table';
import Menu from './Menu';

export default () => {
  const [state, setState] = useState<GameState>(GameState.ready);
  const [rows, setRows] = useState(game.cells);
  const [score, setScore] = useState<number>(game.score);

  const controlsCallback = useCallback(event => {
    switch (event?.dir || event?.code) {
      case 'Right':
      case 'ArrowRight':
      case 'KeyD':
        game.direction = 0;
        break;
  
      case 'Down':
      case 'ArrowDown':
      case 'KeyS':
        game.direction = 90;
        break;
  
      case 'Left':
      case 'ArrowLeft':
      case 'KeyA':
        game.direction = 180;
        break;
  
      case 'Up':
      case 'ArrowUp':
      case 'KeyW':
        game.direction = 270;
        break;

      case 'Space':
      case 'Escape':
      case 'Enter':
      case 'StartGame':
        if (game.gameOver) {
          game.reset();
        }
        if (state === GameState.running) {
          setState(GameState.pause);
        } else {
          setState(GameState.running);
        }
        break;
          
      case 'KeyR':
      case 'ResetGame':
        game.reset();
        setState(GameState.running);
        break;
    }
  }, [state]);

  // reactions on button press
  useEventListener('keydown', controlsCallback);

  // reactions on swipes
  const handlers = useSwipeable({
    onSwiped: controlsCallback,
    preventDefaultTouchmoveEvent: true,
    trackMouse: true
  });

  // syncronization signal for the game
  useEffect(() => {
    const tmp = setInterval(() => {
      if (state === GameState.running) {
        setRows(game.tick());
      }

      if (game.gameOver) {
        setState(GameState.gameOver);
      }

      setScore(game.score);
    }, 150);

    return () => clearTimeout(tmp);
  }, [state]);

  const start = useCallback(() => controlsCallback({ code: 'StartGame' }), []);
  const reset = useCallback(() => controlsCallback({ code: 'ResetGame' }), []);

  return (
    <div style={{ height: '100%' }} {...handlers}>
      <Table rows={rows} />
      {state === GameState.running
        ? null
        : <Menu
            state={state}
            score={score}
            start={start}
            reset={reset}
          />
      }
    </div>
  );
};
