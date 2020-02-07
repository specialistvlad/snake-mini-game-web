import React, { FC, useState, useEffect, useCallback } from 'react';
import withStyles, { WithStylesProps } from 'react-jss'
import useEventListener from '@use-it/event-listener';
import { useSwipeable } from 'react-swipeable'
import { isMobile } from 'react-device-detect';

import { GameState } from '../core/types';
import game from '../core/game';
import Table from './Table';
import Menu from './Menu';
import Paper from './Paper';
import Score from './Score';
import Controls from './Controls';
import Copyright from './Copyright';

const styles = {
  container: {
    height: '100%',
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 'auto',
    ['flexDirection' as any]: 'column',
  },
  controls: {
    display: 'none',
    // '@media only screen and (max-device-width: 480px)': {
    '@media (hover: none) and (pointer: coarse)': {
      display: 'block',
    },
  }
};

const Game: FC<WithStylesProps<typeof styles>> = ({ classes }) => {
  const [state, setState] = useState<GameState>(GameState.ready);
  const [rows, setRows] = useState(game.cells);
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
        setRows(game.tick());
      }

      if (game.gameOver) {
        setState(GameState.gameOver);
      }

      setScore(game.score);
      setStepsLeft(game.stepsLeft);
    }, 150);

    return () => clearTimeout(tmp);
  }, [state]);

  const start = useCallback(() => callback({ code: 'StartGame' }), [callback]);
  const reset = useCallback(() => callback({ code: 'ResetGame' }), [callback]);

  return (
    <>
      <div className={classes.container} {...handlers}>
        <div>
          <Score score={score} stepsLeft={stepsLeft}/>
        </div>
        <div>
          <Paper>
            <Table rows={rows} />
          </Paper>
        </div>
        {isMobile ? <div className={classes.controls}><Controls callback={callback}/></div> : null}
      </div>
      {state === GameState.running
        ? null
        : <Menu
        state={state}
        score={score}
        start={start}
        reset={reset}
        />
      }
      <Copyright/>
    </>
  );
};

export default withStyles(styles)(Game);
