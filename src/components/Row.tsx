import React, { FC, memo } from 'react';
import withStyles, { WithStylesProps } from 'react-jss'

import { TColorTableRow, CellType } from '../core/types';

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
  row: TColorTableRow,
  index: number,
}

const Row: FC<IProps> = ({ classes, row, index }) => {
  console.time(`render Row ${index}`);
  // console.log(rows);
  const result = (
    <tr>
      {row.map((cellType: CellType, indX: number) =>
      (<td
        key={`${index}-${indX}`}
        className={`${classes.cell} ${classes[cellType]}`}
      ></td>))}
    </tr>
  );
  console.timeEnd(`render Row ${index}`);
  return result;
}

function areEqual(prevProps: any, nextProps: any): boolean {
  return !prevProps.row.some((item: CellType, ind: number) => item !== nextProps.row[ind]);
}

export default memo(withStyles(styles)(Row), areEqual);
// @ts-ignore
Row.whyDidYouRender = true
