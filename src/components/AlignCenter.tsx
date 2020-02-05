import React, { FC } from 'react';
import withStyles, { WithStylesProps } from 'react-jss'

const styles = {
  wrapper: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100vw',
    height: '100vh',
    margin: 'auto',
  },
  container: {
    margin: '0 auto',
  },
};

interface IProps extends WithStylesProps<typeof styles> {
  children: React.ReactNode
}

const FlexAlignCenter: FC<IProps> = ({ classes, children }) =>
  <div className={classes.wrapper}>
    <div className={classes.container}>{children}</div>
  </div>;

export default withStyles(styles)(FlexAlignCenter);
