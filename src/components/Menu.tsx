import React, { FC, useCallback } from 'react';
import withStyles, { WithStylesProps } from 'react-jss'

import { GameState } from '../core/types';
import AlignCenter from './AlignCenter';

const styles = {
  gameOver: {
    height: '100%',
    top: 0,
    left: 0,
    fontSize: 'xx-large',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    ['position' as any]: 'fixed',
    width: '100%',
    ['textAlign' as any]: 'center',
  },
  title: {
    top: '47%',
    ['position' as any]: 'relative',
    fontFamily: "'Didact Gothic', sans-serif",
    ['fontWeight' as any]: 'normal',
    ['textAlign' as any]: 'center',
    fontSize: 70,
    color: 'white',
  },
  score: {
    top: '47%',
    ['position' as any]: 'relative',
    fontFamily: "'Didact Gothic', sans-serif",
    ['fontWeight' as any]: 'normal',
    ['textAlign' as any]: 'center',
    fontSize: 40,
    color: 'white',
    marginTop: 20,
  },
  description: {
    top: '47%',
    ['position' as any]: 'relative',
    fontFamily: "'Didact Gothic', sans-serif",
    ['fontWeight' as any]: 'normal',
    ['textAlign' as any]: 'center',
    fontSize: 25,
    color: 'white',
    marginTop: 20,
  },
};

interface IProps extends WithStylesProps<typeof styles> {
  score: number,
  state: GameState,
  start: Function,
  reset: Function,
}

const Menu: FC<IProps> = ({ classes, score, state, start, reset }) => {
  const _start = useCallback(() => start(), []);
  const _reset = useCallback(() => reset(), []);

  return (
    <div className={classes.gameOver}>
      <AlignCenter>
        <div className={classes.title}>
          { state === GameState.ready ? 'Hi there!' : null}
          { state === GameState.pause ? 'Pause' : null}
          { state === GameState.gameOver ? 'You los\'' : null}
        </div>
        { state === GameState.pause || state === GameState.gameOver
          ? (<div className={classes.score}>Score: {score}</div>)
          : null
        }

        <section className="container">
          <article className="buttons border">
            { state === GameState.ready ? <a className="btn green" onClick={_start}><span>Start</span></a> : null}
            { state === GameState.pause ? <a className="btn green" onClick={_start}><span>Continue</span></a> : null}
            { state === GameState.gameOver || state === GameState.pause ? <a className="btn orange" onClick={_reset}><span>Reset</span></a> : null}
          </article>
        </section>

        <div className={classes.description}>
          { state === GameState.ready ? ' Press space to start' : null}
          { state === GameState.pause ? ' Press space to continue' : null}
          { state === GameState.gameOver ? ' Press space to restart' : null}
        </div>

      </AlignCenter>
    </div>
  );
}

export default withStyles(styles)(Menu);
