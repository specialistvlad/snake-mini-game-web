import React, { FC } from 'react';
import withStyles, { WithStylesProps } from 'react-jss'

import { TColorTable, TColorTableRow } from '../core/types';

const styles = {
  table: {
    width: '100%',
    height: '100%',
    ['borderCollapse' as any]: 'inherit',
  },
};

interface IProps extends WithStylesProps<typeof styles> {
  rows: TColorTable,
}

const Table: FC<IProps> = ({ classes, rows }) =>
  <table className={classes.table}>
    <tbody>
    {rows.map((row: TColorTableRow, indY: number) => (
      <tr key={`row-id-${indY}`}>
        {row.map((backgroundColor: string, indX: number) =>
        (<td
          key={`cell-id-${indX}`}
          className="cell"
          style={{
            backgroundColor,
            border: '1px dashed #ffffff21',
          }}
        ></td>))}
      </tr>
    ))}
    </tbody>
  </table>

export default withStyles(styles)(Table);
