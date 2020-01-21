import React, { useState, useEffect } from 'react';
import Grid from '../Grid';
import './style.css';
import { colors } from '../../types';

import { GameTable } from '../../core/modules/GameTable';
import { Snake } from '../../core/modules/Snake';

const game = new GameTable();

export default () => {
  const [area, setArea] = useState(game.getActualArea());

  useEffect(() => {
    setInterval(() => {
      game.tick();
      setArea(game.getActualArea());
    }, 500);
  }, []);

  return (<Grid area={area}/>);
};
