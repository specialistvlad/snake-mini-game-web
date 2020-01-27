import React, { FC } from 'react';
import { TColorTable, TColorTableRow } from '../core/types';

export const Table: FC<{ rows: TColorTable }> = ({ rows }) => (
  <table className="grid">
    <tbody>
    {rows.map((row: TColorTableRow, indY: number) => (
      <tr key={`row-id-${indY}`}>
        {row.map((backgroundColor: string, indX: number) =>
        (<td
          key={`cell-id-${indX}`}
          className="cell"
          style={{
            border: '1px solid #333333',
            backgroundColor,
            width: 25,
            height: 25,
          }}
        ></td>))}
      </tr>
    ))}
    </tbody>
  </table>
);