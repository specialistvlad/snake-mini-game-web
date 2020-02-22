import React, { FC, useState, useEffect, useCallback } from 'react';
import withStyles, { WithStylesProps } from 'react-jss'
import useEventListener from '@use-it/event-listener';
import { useSwipeable } from 'react-swipeable'
import { isMobile } from 'react-device-detect';

import { GameState, TCellTypes } from '../core/types';
import { game, agent } from '../core/instance';

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
  const [cells, setCells] = useState<TCellTypes>(game.cells);
  const [score, setScore] = useState<number>(game.score);
  const [stepsLeft, setStepsLeft] = useState<number>(game.stepsLeft);
  const [autoPlay, setAutoPlay] = useState<boolean>(true);

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

  useEffect(() => {
    if (!autoPlay) {
      return;
    }

    agent.init();
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
      // if (count > 1) {
        // return;
      // }
      // count++;
      if (state === GameState.running) {
        if (autoPlay) {
          if (agent.agentReady) {
            game.relativeDirection = agent.predict(game.state);
            setCells(game.tick());
          }
        } else {
          setCells(game.tick());
        }
      }

      if (game.gameOver) {
        setState(GameState.gameOver);
      }

      setScore(game.score);
      setStepsLeft(game.stepsLeft);
    }, isMobile ? 350 : 150);

    return () => clearTimeout(tmp);
  }, [state, cells, autoPlay]);

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
