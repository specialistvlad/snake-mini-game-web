import React, { useState, useEffect } from 'react';
import Grid from '../Grid';
import './style.css';
import game from '../../core/game';

const random = (max: number) => Math.floor((Math.random() * max));
const dir = ['up', 'down', 'left', 'right'];

export default () => {
  const [area, setArea] = useState(game.getActualArea());

  useEffect(() => {
    // game.tick();
    //   setArea(game.getActualArea());
    setInterval(() => {
      game.tick();
      setArea(game.getActualArea());
    }, 50);

    setInterval(() => {
      // @ts-ignore
      game.snakes[0].changeDirection(dir[random(4)])
    }, 1000);
  }, []);

  return (<Grid area={area}/>);
};
