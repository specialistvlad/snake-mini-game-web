import React, { FC } from 'react';
import withStyles, { WithStylesProps } from 'react-jss'

import { TColorTable, TColorTableRow } from '../core/types';

const styles = {
  table: {
    width: '100%',
    height: '100%',
    ['borderCollapse' as any]: 'inherit',
  },
  gameOver: {
    height: '100%',
    top: 0,
    left: 0,
    fontSize: 'xx-large',
    backgroundColor: 'rgba(255,125,35,0.5)',
    ['position' as any]: 'absolute',
    width: '100%',
    ['textAlign' as any]: 'center',
  },
  gameOverText: {
    top: '47%',
    ['position' as any]: 'relative',
    fontFamily: "'Didact Gothic', sans-serif",
    ['fontWeight' as any]: 'normal',
    ['textAlign' as any]: 'center',
    fontSize: 50,
  },
};

interface IProps extends WithStylesProps<typeof styles> {
  rows: TColorTable,
  gameOver?: boolean,
}

const Table: FC<IProps> = ({ classes, rows, gameOver }) =>
<>
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
  {gameOver ? (<div className={classes.gameOver}><span className={classes.gameOverText}>Game Over</span></div>) : null}
  </>

export default withStyles(styles)(Table);
