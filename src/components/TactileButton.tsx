import React, { FC, useCallback } from 'react';
import withStyles, { WithStylesProps } from 'react-jss'

const styles = {
  btn: {

  },
};

interface IProps extends WithStylesProps<typeof styles> {
  onClick: Function,
}

const TactileButton: FC<IProps> = ({ children, classes, onClick }) => {
  const _onClick = useCallback(() => onClick(), [onClick]);
  return (
    <div className="toggle">
      <input onClick={_onClick} type="checkbox"></input>
      <span className="button"></span>
      <span className="label">{children}</span>
    </div>
  );
};

export default withStyles(styles)(TactileButton);
