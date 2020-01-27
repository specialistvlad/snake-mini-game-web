import React, { useState, useEffect, useCallback } from 'react';
import useEventListener from '@use-it/event-listener';
import { useSwipeable } from 'react-swipeable'

import game from '../core/game';
import { Table } from './Table';
import { ScoreBoard } from './ScoreBoard';
import { Controls } from './Controls';

// body, #root {
//   /* height: 500px; */
//   /* width: 500px; */
// }

// #root {
//   background: #222;
//   background: radial-gradient(#333333eb, #11111100);
//   background-position: center center;
//   background-repeat: no-repeat;
//   background-size: cover;
//   color: #fff;
// }

// .root {
//   display: 'flex';
// }

// .column {
//   flex: 1;
// }


export const Root = () => {
  const [rows, setRows] = useState(game.cellsToColorTable());
  const [score, setScore] = useState(game.score());

  const controlsCallback = useCallback(event => {
    const mySnake = game.getSnake();
    switch (event?.dir || event?.code) {
      case 'Right':
      case 'ArrowRight':
      case 'KeyD':
        mySnake.direction = 0;
      break;
  
      case 'Down':
      case 'ArrowDown':
      case 'KeyS':
          mySnake.direction = 90;
      break;
  
      case 'Left':
      case 'ArrowLeft':
      case 'KeyA':
          mySnake.direction = 180;
      break;
  
      case 'Up':
      case 'ArrowUp':
      case 'KeyW':
        mySnake.direction = 270;
      break;
    }
  }, []);

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
    setInterval(() => {
      setRows(game.tick());
      setScore(game.score());
    }, 125);
  }, []);

  return (
  <div className="root" {...handlers}>
    <div className="column"><Table rows={rows}/></div>
    <div className="column">
      <ScoreBoard score={score} />
      <Controls callback={controlsCallback}/>
    </div>
  </div>
  );
};
