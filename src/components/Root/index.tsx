import React, { useState, useEffect, useCallback } from 'react';
import useEventListener from '@use-it/event-listener';
import { useSwipeable } from 'react-swipeable'

import game from '../../core/game';
import Table from '../Table';
import './style.css';

export default () => {
  const [rows, setRows] = useState(game.cellsToColorTable());
  const controlsCallback = useCallback(event => {
    const mySnake = game.getSnake();
    switch (event?.dir || event?.code) {
      case 'Right':
      case 'ArrowRight':
      case 'KeyD':
        mySnake.direction = 0
      break;
  
      case 'Down':
      case 'ArrowDown':
      case 'KeyS':
          mySnake.direction = 90
      break;
  
      case 'Left':
      case 'ArrowLeft':
      case 'KeyA':
          mySnake.direction = 180
      break;
  
      case 'Up':
      case 'ArrowUp':
      case 'KeyW':
        mySnake.direction = 270
      break;
    }
  }, []);

  // reactions on buttong press
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
    }, 125);
  }, []);

  return (<div {...handlers} style={{ height: '100%' }}><Table rows={rows}/></div>);
};
