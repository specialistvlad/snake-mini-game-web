import React, { useState, useEffect } from 'react';
import Table from '../Table';
import './style.css';
import game from '../../core/game';

// const random = (max: number) => Math.floor((Math.random() * max));
// const dir = ['up', 'down', 'left', 'right'];

export default () => {
  const [rows, setRows] = useState(game.cellsToColorTable());

  useEffect(() => {
    setInterval(() => {
      setRows(game.tick());
    }, 50);

    // setInterval(() => {
    //   // @ts-ignore
    //   game.snakes[0].changeDirection(dir[random(4)])
    // }, 1000);
  }, []);

  return (<Table rows={rows}/>);
};
