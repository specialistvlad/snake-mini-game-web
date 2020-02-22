import React, { FC, useCallback, memo } from 'react';
import withStyles, { WithStylesProps } from 'react-jss'

const styles = {
  container: {
    marginTop: 10,
    marginBottom: 10,
  },
  input: {
    
  },
  label: {
    
  },
};

interface IProps extends WithStylesProps<typeof styles> {
  children: React.ReactNode,
  checked: boolean,
  onChange: Function,
}

const CheckBox: FC<IProps> = ({ classes, children, checked, onChange }) => 
  <div className={classes.container}>
      <input
        className={classes.input}
        type="checkbox"
        name="autoPlay"
        value={checked ? 'true' : ''}
        defaultChecked={checked}
        onClick={useCallback((event) => onChange(!Boolean(event.target.value)), [onChange])}
        ></input>
      <label className={classes.label} htmlFor="autoPlay">{children}</label>
    </div>;

export default memo(withStyles(styles)(CheckBox));
