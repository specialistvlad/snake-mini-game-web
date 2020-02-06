import React, { FC, useCallback } from 'react';
import withStyles, { WithStylesProps } from 'react-jss'

export type TRainbowButtonColor = 'green' | 'orange' | 'blue';
export type TRainbowButtonTextColor = 'greenButtonText' | 'orangeButtonText' | 'blueButtonText';

const styles = {
  btn: {
    display: 'inline-block',
    minWidth: 270,
    margin: '0.4em',
    padding: '0.7em 3em',
    fontWeight: 400,
    fontSize: 30,
    ['textAlign' as any]: 'center',
    backgroundColor: 'transparent',
    border: '4px solid transparent',
    borderImage: 'linear-gradient(to right, #add356 0%, #00dfa6 100%)',
    borderImageSlice: 1,
    backgroundClip: 'border-box',
    cursor: 'pointer',
  },
  green: {
    borderImageSlice: 1,
    borderImage: 'linear-gradient(to right, #add356 0%, #00dfa6 100%)',
  },
  greenButtonText: {
    background: '-webkit-linear-gradient(left, #add356, #00dfa6)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    },
  orange: {
    borderImageSlice: 1,
    borderImage: 'linear-gradient(to right, #ffcb52 0%, #ff451f 100%)',
  },
  orangeButtonText: {
    background: '-webkit-linear-gradient(left, #ffcb52, #ff451f)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  blue: {
    borderImageSlice: 1,
    borderImage: 'linear-gradient(to right, #3dade9 0%, #bf2fcb 100%)',
  },
  blueButtonText: {
    background: '-webkit-linear-gradient(left, #3dade9, #bf2fcb)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
};

// @ts-ignore
interface IProps extends WithStylesProps<typeof styles> {
  color: TRainbowButtonColor,
  onClick: Function,
}

const RainbowButton: FC<IProps> = ({ children, classes, color, onClick }) => {
  const _onClick = useCallback(() => onClick(), [onClick]);
  const containerClasses = `${classes.btn} ${classes[color]}`;
  const textClasses = classes[`${color}ButtonText` as TRainbowButtonTextColor];

  return <button className={containerClasses} onClick={_onClick}><p className={textClasses}>{children}</p></button>;
}
// @ts-ignore
export default withStyles(styles)(RainbowButton);
