import React from 'react';
import './style.css';
import { colors, TRow, TCell } from '../../core/types';

// @ts-ignore
const Component = ({ area }) => (
  <table className="grid">
    <tbody>
    {area.map((row: TRow, i: number) => (
      <tr key={`row-id-${i}`}>
        {row.map((cell: TCell, j: number) =>
        (<td
          key={`cell-id-${j}`}
          className="cell"
          style={{
            backgroundColor: colors[cell.cellType]
          }}
        />))}
      </tr>
    ))}
    </tbody>
  </table>
);

export default Component;