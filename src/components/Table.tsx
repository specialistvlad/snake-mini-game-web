import React, { FC } from 'react';
import { TColorTable, TColorTableRow } from '../core/types';

export const Table: FC<{
  className?: string,
  rows: TColorTable,
}> = ({
  className,
  rows,
}) => (
  <table className={`${className} table`}>
    <tbody>
    {rows.map((row: TColorTableRow, indY: number) => (
      <tr key={`row-id-${indY}`}>
        {row.map((backgroundColor: string, indX: number) =>
        (<td
          key={`cell-id-${indX}`}
          className="cell"
          style={{ backgroundColor }}
        ></td>))}
      </tr>
    ))}
    </tbody>
  </table>
);