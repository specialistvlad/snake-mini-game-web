import React, { FC, useCallback } from 'react';
import withStyles, { WithStylesProps } from 'react-jss'

const styles = {
  container: {
    display: 'flex',
    marginTop: 5,
    justifyContent: 'space-evenly',
    width: '100%',
  },
  text: {
    padding: 6,
    font: "900 25px/1 'Source Sans Pro', Arial, sans-serif",
    ['textTransform' as any]: 'uppercase',
    color: '#fff',
    backgroundColor: '#fb8f6e',
  },
  menu: {
    backgroundColor: 'rgb(251, 143, 110)',
    zoom: 1,
    fill: 'white',
    height: 37,
    width: 37,
    '&:hover': {
      backgroundColor: 'rgb(253, 174, 150)',
    }
  },
};

interface IProps extends WithStylesProps<typeof styles> {
  score: number,
  stepsLeft: number,
  pause: Function,
}

const MenuBar: FC<IProps> = ({ classes, score, stepsLeft, pause }) => {
  const _pause = useCallback(() => pause(), [pause]);
  return (
    <div className={classes.container} onClick={_pause}>
      <svg xmlns="http://www.w3.org/2000/svg" className={classes.menu} height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0z" fill="none"/><path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/></svg>
      <p className={classes.text}>Score: {score >= 0 ? score : 0}</p>
      <p className={classes.text}>Steps left: {stepsLeft}</p>
    </div>
  );
};

export default withStyles(styles)(MenuBar);
