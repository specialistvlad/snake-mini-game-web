import React, { FC, memo } from 'react';

import { TColorTable, TColorTableRow } from '../core/types';
import Row from './Row';

interface IProps {
  rows: TColorTable,
}

const Table: FC<IProps> = ({ rows }) => {
  const result = (
    <table className="table">
    <tbody>
      {rows.map((row: TColorTableRow, indY: number) => (<Row key={indY} indY={indY} row={row} />))}
    </tbody>
  </table>
  );
  return result;
}

export default memo(Table);

// @ts-ignore
Table.whyDidYouRender = true;
