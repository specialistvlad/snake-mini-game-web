import React, { useState, useEffect } from 'react';
import Table from '../Table';
import './style.css';
import game from '../../core/game';

const random = (max: number) => Math.floor((Math.random() * max));
const dir = [0, 90, 180, 270];

export default () => {
  const [rows, setRows] = useState(game.cellsToColorTable());

  useEffect(() => {
    setInterval(() => {
      setRows(game.tick());
    }, 250);

    setInterval(() => {
      // @ts-ignore
      game.snakes[0].direction = dir[random(4)];
    }, 500);
  }, []);

  return (<Table rows={rows}/>);
};
