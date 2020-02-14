import React, { FC, memo } from 'react';
import withStyles, { WithStylesProps } from 'react-jss'

import { TColorTable, TColorTableRow } from '../core/types';
import Row from './Row';

const styles = {
  table: {
    width: '100%',
    height: '100%',
    ['borderCollapse' as any]: 'inherit',
    border: '2px dashed #F7EEEE',
    borderRadius: 5,
  },
};

interface IProps extends WithStylesProps<typeof styles> {
  rows: TColorTable,
}

const Table: FC<IProps> = ({ classes, rows }) => {
  // console.time('render table');
  const result = (
    <table className={classes.table}>
    <tbody>
      {rows.map((row: TColorTableRow, indY: number) => (<Row key={indY} indY={indY} row={row} />))}
    </tbody>
  </table>
  );
  // console.timeEnd('render table');
  return result;
}

export default memo(withStyles(styles)(Table));

// @ts-ignore
Table.whyDidYouRender = true
