import React from 'react';
import './style.css';

// @ts-ignore
const Component = ({ rows }) => (
  <table className="grid">
    <tbody>
    {rows.map((row: [], y: number) => (
      <tr key={`row-id-${y}`}>
        {row.map((backgroundColor: string, x: number) =>
        (<td
          key={`cell-id-${x}`}
          className="cell"
          style={{
            backgroundColor,
            // opacity: 0.5,
          }}
        />))}
      </tr>
    ))}
    </tbody>
  </table>
);

export default Component;