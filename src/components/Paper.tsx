import React, { FC } from 'react';
import withStyles, { WithStylesProps } from 'react-jss'

const size = 75;
const padding = 30;

const styles = {
  paper: {
    '@media (orientation: landscape)': {
      width: size+'vh',
      height: size+'vh',
    },
    '@media (orientation: portrait)': {
      width: size+'vw',
      height: size+'vw',
    },
    backgroundColor: 'tomato',
    borderRadius: 12,
    ['position' as any]: 'relative',
    ['boxShadow' as any]: '0 1px 4px rgba(0, 0, 0, 0.3), 0 0 20px rgba(0, 0, 0, 0.1) inset',
    '&::before': {
      ['position' as any]: 'absolute',
      content: 'open-quote',
      bottom: 12,
      left: 15,
      top: '75%',
      width: '55%',
      background: '#9B7468',
      zIndex: -1,
      boxShadow: '0 20px 15px #9B7468',
      transform: 'rotate(-6deg)',
    },
    '&::after': {
      ['position' as any]: 'absolute',
      content: 'open-quote',
      bottom: 12,
      top: '75%',
      width: '55%',
      background: '#9B7468',
      zIndex: -1,
      boxShadow: '0 20px 15px #9B7468',
      right: 15,
      left: 'auto',
      transform: 'rotate(6deg)',
      WebkitTransform: 'rotate(6deg)',
      MozTransform: 'rotate(6deg)',
    }
  },
  content: {
    border: '2px dashed #F7EEEE',
    borderRadius: 5,
    height: `calc(100% - 4px - ${padding}px - ${padding}px)`,
    width: `calc(100% - 4px - ${padding}px - ${padding}px)`,
    margin: padding,
    // backgroundColor: 'red',
    display: 'inline-block',
  },
};

interface IProps extends WithStylesProps<typeof styles> {
  children: React.ReactNode
}

const Paper: FC<IProps> = ({ classes, children }) =>
  <div className={classes.paper}>
    <div className={classes.content}>
      {children}
    </div>
  </div>;

export default withStyles(styles)(Paper);
