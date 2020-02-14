import React, { FC, memo } from 'react';

import { TColorTableRow, CellType } from '../core/types';
import Cell from './Cell';

interface IProps {
  row: TColorTableRow,
  indY: number,
}

const Row: FC<IProps> = ({ row, indY }) => (
  <tr>
    {row.map((cellType: CellType, indX: number) => (<Cell key={`${indY}-${indX}`} cellType={cellType} />))}
  </tr>
);

function areEqual(prevProps: any, nextProps: any): boolean {
  return !prevProps.row.some((item: CellType, ind: number) => item !== nextProps.row[ind]);
}

export default memo(Row, areEqual);

// @ts-ignore
Row.whyDidYouRender = true
