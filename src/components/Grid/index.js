import React from 'react';
import './style.css';
import { colors } from '../../types';

export default ({ rows }) => (
  <table className="grid">
    <tbody>
    {rows.map((row, i) => (
      <tr key={`row-id-${i}`}>
        {row.map((cell, j) => (<td key={`cell-id-${j}`} className="cell" style={{ backgroundColor: colors[cell]}}>&nbsp;</td>))}
      </tr>
    ))}
    </tbody>
  </table>
);
