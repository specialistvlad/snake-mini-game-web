import React, { FC, useState, useEffect, useCallback } from 'react';
import withStyles, { WithStylesProps } from 'react-jss'
import useEventListener from '@use-it/event-listener';
import { useSwipeable } from 'react-swipeable'
import { isMobile } from 'react-device-detect';

import { GameState } from '../core/types';
import game from '../core/game';
import Table from './Table';
import Popup from './Popup';
import Paper from './Paper';
import MenuBar from './MenuBar';
import Copyright from './Copyright';

const size = 75;

const styles = {
  container: {
    height: '100%',
    '@media (orientation: landscape)': {
      width: size+'vh',
    },
    '@media (orientation: portrait)': {
      width: size+'vw',
    },
    '@media only screen and (max-device-width: 720px)': {
      width: '100vw',
    },
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 'auto',
    ['flexDirection' as any]: 'column',
  },
  spacer: { height: 25 },
};

const Game: FC<WithStylesProps<typeof styles>> = ({ classes }) => {
  const [state, setState] = useState<GameState>(GameState.ready);
  const [cells, setCells] = useState(game.cells);
  const [score, setScore] = useState<number>(game.score);
  const [stepsLeft, setStepsLeft] = useState<number>(game.stepsLeft);

  const callback = useCallback(event => {
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
      case 'Menu':
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
  useEventListener('keydown', callback);

  // reactions on swipes
  const handlers = useSwipeable({
    onSwiped: callback,
    preventDefaultTouchmoveEvent: true,
    trackMouse: true
  });

  // syncronization signal for the game
  useEffect(() => {
    const tmp = setInterval(() => {
      if (state === GameState.running) {
        setCells(game.tick());
      }

      if (game.gameOver) {
        setState(GameState.gameOver);
      }

      setScore(game.score);
      setStepsLeft(game.stepsLeft);
    }, isMobile ? 350 : 250);

    return () => clearTimeout(tmp);
  }, [state]);

  const start = useCallback(() => callback({ code: 'StartGame' }), [callback]);
  const reset = useCallback(() => callback({ code: 'ResetGame' }), [callback]);
  const pause = useCallback(() => callback({ code: 'Menu' }), [callback]);

  return (
    <div className={classes.container} {...handlers}>
      <MenuBar score={score} stepsLeft={stepsLeft} pause={pause}/>
      <div className={classes.spacer}/>
      <Paper>
        <Table cells={cells} />
      </Paper>
      {state === GameState.running
        ? null
        : <Popup
        state={state}
        score={score}
        start={start}
        reset={reset}
        />
      }
      <Copyright/>
    </div>
  );
};

export default withStyles(styles)(Game);
