import React, { FC } from 'react';
import withStyles, { WithStylesProps } from 'react-jss'

const styles = {
  container: {
    margin: 5,
    bottom: 0,
    ['position' as any]: 'fixed',
  },
  link: {
    textShadow: '1px 1px 1px #656363',
    textDecoration: 'inherit',
    color: 'white',
  },
};

const Copyright: FC<WithStylesProps<typeof styles>> = ({ classes }) =>
  <div className={classes.container}>
    <a className={classes.link}
      href="https://github.com/specialistvlad/snake-mini-game-web"
      rel="noopener noreferrer"
      target="_blank">Project on GitHub</a>
  </div>;

export default withStyles(styles)(Copyright);
