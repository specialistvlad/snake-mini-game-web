import React, { useState, useEffect } from 'react';
import Grid from '../Grid';
import './style.css';
import game from '../../core/game';

export default () => {
  const [area, setArea] = useState(game.getActualArea());

  useEffect(() => {
    // game.tick();
    //   setArea(game.getActualArea());
    setInterval(() => {
      game.tick();
      setArea(game.getActualArea());
    }, 500);
  }, []);

  return (<Grid area={area}/>);
};
