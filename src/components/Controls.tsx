import React, { FC, useCallback } from 'react';
import withStyles, { WithStylesProps } from 'react-jss'

import TactileButton from './TactileButton';

const styles = {
  container: {
    display: 'flex',
    ['flexDirection' as any]: 'column',
    alignItems: 'center',
  },
  row: {
    display: 'flex',
  },
};

interface IProps extends WithStylesProps<typeof styles> {
  callback: Function,
}

const Controls: FC<IProps> = ({ classes, callback }) => {
  const up = useCallback(() => callback({ code: 'ArrowUp' }), [callback]);
  const left = useCallback(() => callback({ code: 'ArrowLeft' }), [callback]);
  const right = useCallback(() => callback({ code: 'ArrowRight' }), [callback]);
  const down = useCallback(() => callback({ code: 'ArrowDown' }), [callback]);
  const menu = useCallback(() => callback({ code: 'Escape' }), [callback]);

  return (
    <div className={classes.container}>
      <div className={classes.row}>
        <div/>
        <TactileButton onClick={up}>Up</TactileButton>
        <div/>
      </div>
      <div className={classes.row}>
        <TactileButton onClick={left}>Left</TactileButton>
        <TactileButton onClick={menu}>Menu</TactileButton>
        <TactileButton onClick={right}>Right</TactileButton>
      </div>
      <div className={classes.row}>
        <div/>
        <TactileButton onClick={down}>Down</TactileButton>
        <div/>
      </div>
    </div>
  );
};

export default withStyles(styles)(Controls);

