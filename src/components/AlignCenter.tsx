import React, { FC } from 'react';
import withStyles, { WithStylesProps } from 'react-jss'
import classNames from "classnames";

const styles = {
  wrapper: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100vw',
    height: '100vh',
    margin: 'auto',
  },
  wrappedMobile: {
    display: 'inherit',
  },
  container: {
    margin: '0 auto',
  },
};

interface IProps extends WithStylesProps<typeof styles> {
  children: React.ReactNode,
  isMobile?: boolean,
}

const FlexAlignCenter: FC<IProps> = ({ classes, children, isMobile }) =>
  <div className={classNames(
    classes.wrapper, 
    {[classes.wrappedMobile]: isMobile}, 
  )}>
    <div className={classes.container}>{children}</div>
  </div>;

export default withStyles(styles)(FlexAlignCenter);
