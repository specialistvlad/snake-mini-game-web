import React, { FC, memo } from 'react';
import withStyles, { WithStylesProps } from 'react-jss'

import { CellType } from '../core/types';

const styles = {
  cell: {
    border: '1px dashed #ffffff21',
  },
  empty: {
    backgroundColor: 'inherit',
  },
  wall: {
    backgroundColor: 'orange',
  },
  food: {
    backgroundColor: 'green',
  },
  snake: {
    backgroundColor: 'red',
  },
};

interface IProps extends WithStylesProps<typeof styles> {
  cellType: CellType,
}

const Row: FC<IProps> = ({ classes, cellType }) => (
  <td className={`${classes.cell} ${classes[cellType]}`}></td>
);

export default memo(withStyles(styles)(Row));

// @ts-ignore
Row.whyDidYouRender = true
