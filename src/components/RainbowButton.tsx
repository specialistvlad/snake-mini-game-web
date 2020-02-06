import React, { FC, useCallback } from 'react';
import withStyles, { WithStylesProps } from 'react-jss'

export type TRainbowButtonColor = 'green' | 'orange' | 'blue';
export type TRainbowButtonTextColor = 'greenButtonText' | 'orangeButtonText' | 'blueButtonText';

const styles = {
  btn: {
    display: 'inline-block',
    margin: '0.5em 0',
    padding: '0.7em 3em',
    borderRadius: 6,
    fontWeight: 400,
    ['textAlign' as any]: 'center',
    backgroundSize: '100% 2px',
    backgroundPosition: '0 100%, 0 0',
    backgroundRepeat: 'no-repeat',
    backgroundClip: 'border-box',
    cursor: 'pointer',
  },
  green: {
    borderLeft: '2px solid #add356',
    borderRight: '2px solid #00dfa6',
    backgroundImage: '-webkit-linear-gradient(left, #add356, #00dfa6), -webkit-linear-gradient(left, #add356, #00dfa6)',
  },
  greenButtonText: {
    background: '-webkit-linear-gradient(left, #add356, #00dfa6)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  orange: {
    borderLeft: '2px solid #ffcb52',
    borderRight: '2px solid #ff451f',
    backgroundImage: '-webkit-linear-gradient(left, #ffcb52, #ff451f), -webkit-linear-gradient(left, #ffcb52, #ff451f)',
  },
  orangeButtonText: {
    background: '-webkit-linear-gradient(left, #ffcb52, #ff451f)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  blue: {
    borderLeft: '2px solid #3dade9',
    borderRight: '2px solid #bf2fcb',
    backgroundImage: '-webkit-linear-gradient(left, #3dade9, #bf2fcb), -webkit-linear-gradient(left, #3dade9, #bf2fcb)',
  },
  blueButtonText: {
    background: '-webkit-linear-gradient(left, #3dade9, #bf2fcb)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
};

interface IProps extends WithStylesProps<typeof styles> {
  color: TRainbowButtonColor,
  onClick: Function,
}

const RainbowButton: FC<IProps> = ({ children, classes, color, onClick }) => {
  const _onClick = useCallback(() => onClick(), [onClick]);
  const containerClasses = `${classes.btn} ${classes[color]}`;
  const textClasses = classes[`${color}ButtonText` as TRainbowButtonTextColor];

  return <a className={containerClasses} onClick={_onClick}><span className={textClasses}>{children}</span></a>;
}

export default withStyles(styles)(RainbowButton);
