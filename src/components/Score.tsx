import React, { FC } from 'react';
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
};

interface IProps extends WithStylesProps<typeof styles> {
  score: number,
  stepsLeft: number,
}

const Score: FC<IProps> = ({ classes, score, stepsLeft }) =>
  <div className={classes.container}>
    <p className={classes.text}>Score: {score >= 0 ? score : 0}</p>
    <p className={classes.text}>Steps left: {stepsLeft}</p>
  </div>;

export default withStyles(styles)(Score);
