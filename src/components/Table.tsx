import React, { FC, memo } from 'react';
import withStyles, { WithStylesProps } from 'react-jss'

import { TCellTypes, CellType } from '../core/types';
import CellCssGrid from './Cell';

const styles = {
  container: {
    width: '100%',
    height: '100%',
    border: '2px dashed #F7EEEE',
    borderRadius: 5,
    display: 'grid',
    gridColumnGap: 0,
    gridRowGap: 0,
  }
};

interface IProps extends WithStylesProps<typeof styles> {
  cells: TCellTypes,
}

const TableCssGrid: FC<IProps> = ({ classes, cells }) => {
  const result = (
    <div
      className={`table-css-grid-container ${classes.container}`}
      style={{
        gridTemplateColumns: `repeat(${Math.sqrt(cells.length)}, 1fr)`,
        gridTemplateRows: `repeat(${Math.sqrt(cells.length)}, 1fr)`,
      }}
    >
      {cells.map((cellType: CellType, index: number) => (<CellCssGrid key={index} cellType={cellType} />))}
    </div>
  );
  return result;
}

export default memo(withStyles(styles)(TableCssGrid));

// @ts-ignore
// TableCssGrid.whyDidYouRender = true;
