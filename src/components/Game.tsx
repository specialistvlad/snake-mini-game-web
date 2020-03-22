import React, { FC, useState, useEffect, useCallback } from 'react';
import withStyles, { WithStylesProps } from 'react-jss'
import useEventListener from '@use-it/event-listener';
import { useSwipeable } from 'react-swipeable'
import { isMobile } from 'react-device-detect';

import { GameState, TCellTypes, Direction } from '../core/types';
import { visualGame, agent } from '../core/instance';

import Table from './Table';
import Popup from './Popup';
import Paper from './Paper';
import MenuBar from './MenuBar';
import Copyright from './Copyright';
import CheckBox from './CheckBox';

// let count = 0;
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
};

const Game: FC<WithStylesProps<typeof styles>> = ({ classes }) => {
  const [state, setState] = useState<GameState>(GameState.ready);
  const [direction, setDirection] = useState<Direction>(visualGame.direction);
  const [cells, setCells] = useState<TCellTypes>(visualGame.cells);
  const [score, setScore] = useState<number>(visualGame.score);
  const [stepsLeft, setStepsLeft] = useState<number>(visualGame.stepsLeft);
  const [autoPlay, setAutoPlay] = useState<boolean>(true);

  const callback = useCallback(event => {
    switch (event?.dir || event?.code) {
      case 'Right':
      case 'ArrowRight':
      case 'KeyD':
        setDirection(Direction.Right);
        break;
  
      case 'Down':
      case 'ArrowDown':
      case 'KeyS':
        setDirection(Direction.Down);
        break;
  
      case 'Left':
      case 'ArrowLeft':
      case 'KeyA':
        setDirection(Direction.Left);
        break;
  
      case 'Up':
      case 'ArrowUp':
      case 'KeyW':
        setDirection(Direction.Up);
        break;

      case 'Space':
      case 'Escape':
      case 'Enter':
      case 'Menu':
      case 'StartGame':
        if (visualGame.gameOver) {
          visualGame.reset();
        }
        if (state === GameState.running) {
          setState(GameState.pause);
        } else {
          setState(GameState.running);
        }
        break;
          
      case 'KeyR':
      case 'ResetGame':
        visualGame.reset();
        setState(GameState.running);
        break;
    }
  }, [state]);

  useEffect(() => {
    if (!autoPlay) {
      return;
    }

    agent.loadModel();
  }, [autoPlay]);

  // reactions on button press
  useEventListener('keydown', callback);

  // reactions on swipes
  const handlers = useSwipeable({
    onSwiped: callback,
    preventDefaultTouchmoveEvent: true,
    trackMouse: true
  });

  // main function aka loop
  useEffect(() => {
    const tmp = setInterval(() => {
      if (state === GameState.running) {
        if (autoPlay) {
          if (agent.ready) {
            visualGame.step(agent.predict(visualGame.state));
            setCells(visualGame.cells);
          }
        } else {
          visualGame.step(direction);
          setCells(visualGame.cells);
        }
      }

      if (visualGame.gameOver) {
        setState(GameState.gameOver);
      }

      setScore(visualGame.score);
      setStepsLeft(visualGame.stepsLeft);
    }, isMobile ? 350 : 150);

    return () => clearTimeout(tmp);
  }, [state, direction, cells, autoPlay]);

  const start = useCallback(() => callback({ code: 'StartGame' }), [callback]);
  const reset = useCallback(() => callback({ code: 'ResetGame' }), [callback]);
  const pause = useCallback(() => callback({ code: 'Menu' }), [callback]);
  const autoPlayCallback = useCallback((value) => setAutoPlay(value), []);

  return (
    <div className={classes.container} {...handlers}>
      <MenuBar score={score} stepsLeft={stepsLeft} pause={pause}/>
      <CheckBox checked={autoPlay} onChange={autoPlayCallback} >Allow deep learned network to play automatically</CheckBox>
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
