import React, { FC } from 'react';
import withStyles, { WithStylesProps } from 'react-jss'

const size = 75;
const padding = 30;

const getRandomColor = () => {
  const colors = [
    '#e47763',
    '#ef857c',
    '#e8e277',
    '#9ee0a1',
    '#90d8af',
    '#9ED9EB',
    '#9EB3EB',
    '#C49EEB',
    '#DB9EEB',
  ];
  return colors[6];
  // return colors[Math.floor((Math.random() * colors.length))]
};
  
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
    backgroundColor: getRandomColor(),
    borderRadius: 12,
    ['position' as any]: 'relative',
    ['boxShadow' as any]: '0 1px 4px rgba(0, 0, 0, 0.3), 0 0 20px rgba(0, 0, 0, 0.1) inset',
    '&::before': {
      ['position' as any]: 'absolute',
      content: 'open-quote',
      top: 100,
      bottom: 5,
      left: 30,
      right: 30,
      zIndex: -1,
      boxShadow: '0 0 40px 13px #848484;',
      borderRadius: '100px/20px',
    },
    '&::after': {
      ['position' as any]: 'absolute',
      content: 'open-quote',
      top: 100,
      bottom: 5,
      left: 30,
      right: 30,
      zIndex: -1,
      boxShadow: '0 0 40px 13px #848484;',
      borderRadius: '100px/20px',
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
