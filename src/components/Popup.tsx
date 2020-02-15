import React, { FC, useCallback } from 'react';
import withStyles, { WithStylesProps } from 'react-jss'

import { GameState } from '../core/types';
import AlignCenter from './AlignCenter';
import RainbowButton from './RainbowButton';

const styles = {
  container: {
    height: '100%',
    top: 0,
    left: 0,
    fontSize: 'xx-large',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    width: '100%',
    cursor: 'default',
    ['textAlign' as any]: 'center',
    ['position' as any]: 'fixed',
  },
  article: {
    marginTop: '1em',
  },
  text: {
    top: '47%',
    color: 'white',
    ['position' as any]: 'relative',
    ['textAlign' as any]: 'center',
  },
  title: {
    fontSize: 70,
    marginBottom: '0.2em',
  },
  score: {
    fontSize: 40,
  },
  description: {
    marginTop: '1.5em',
    fontSize: 25,
  },
};

interface IProps extends WithStylesProps<typeof styles> {
  score: number,
  state: GameState,
  start: Function,
  reset: Function,
}

const Popup: FC<IProps> = ({ classes, score, state, start, reset }) => {
  const _start = useCallback(() => start(), [start]);
  const _reset = useCallback(() => reset(), [reset]);

  return (
    <div className={classes.container}>
      <AlignCenter>
        <div className={`${classes.text} ${classes.title}`}>
          { state === GameState.ready ? 'Hi there!' : null}
          { state === GameState.pause ? 'Pause' : null}
          { state === GameState.gameOver ? 'You lose' : null}
        </div>
        { state === GameState.pause || state === GameState.gameOver
          ? (<div className={`${classes.text} ${classes.score}`}>Score: {score}</div>)
          : null
        }

          <article className={classes.article}>
            { state === GameState.ready || state === GameState.pause
              ? (
                <RainbowButton onClick={_start} color="green">
                  {state === GameState.ready ? 'Start' : 'Continue'}
                </RainbowButton>
              )
              : null
            }

            { state === GameState.gameOver || state === GameState.pause
              ? (
                <RainbowButton onClick={_reset} color={state === GameState.pause ? 'blue' : 'orange'}>
                  {state === GameState.pause ? 'New Game' : 'Try again'}
                </RainbowButton>
              )
              : null}
          </article>

        <div className={`${classes.text} ${classes.description}`}>
          { state === GameState.ready ? ' Press the button or "space" to start' : null}
          { state === GameState.pause ? ' Press "space" to continue or "R" to restart' : null}
          { state === GameState.gameOver ? ' Press the button or "space" to restart' : null}
        </div>
      </AlignCenter>
    </div>
  );
}

export default withStyles(styles)(Popup);
