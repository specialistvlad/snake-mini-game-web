import React, { useState, useEffect, useCallback } from 'react';
import useEventListener from '@use-it/event-listener';
import Table from '../Table';
import './style.css';
import game from '../../core/game';

const keys = {
  ArrowRight: 0,
  ArrowDown: 90,
  ArrowLeft: 180,
  ArrowUp: 270,
  KeyD: 0,
  KeyS: 90,
  KeyA: 180,
  KeyW: 270,
};

export default () => {
  const [rows, setRows] = useState(game.cellsToColorTable());

  useEffect(() => {
    setInterval(() => {
      setRows(game.tick());
    }, 50);
  }, []);

  useEventListener('keydown', useCallback(({ code }) => {
    if (!Object.keys(keys).includes(code)) {
      return;
    }
    // @ts-ignore
    game.snakes[0].direction = keys[code];
  }, []));

  return (<Table rows={rows}/>);
};
