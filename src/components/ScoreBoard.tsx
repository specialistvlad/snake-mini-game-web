import React, { FC } from 'react';
import { TScoreTable } from '../core/types';
import { Table } from './Table';

export const ScoreBoard: FC<{ score: TScoreTable }> = ({ score }) =>
<div>
  <h1>Score board</h1>
  <table>
    <thead>
    <th>
      <td>Name</td>
      <td>Energy</td>
      <td>Preview</td>
    </th>
    </thead>
    <tbody>
    {score.map(({ name, died, length, preview }, index) => (
      <tr key={`row-id-${name}`}>
        <td>{index + 1}. {name}</td>
        <td>{length}</td>
        <td><Table rows={[preview]}/></td>
      </tr>
    ))}
    </tbody>
  </table>
</div>;