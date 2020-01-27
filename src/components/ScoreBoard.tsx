import React, { FC } from 'react';
import { TScoreTable } from '../core/types';
import { Table } from './Table';

export const ScoreBoard: FC<{
  className: string,
  score: TScoreTable,
}> = ({
  className,
  score,
}) =>
<div className={className}>
  <h1>Score board</h1>
  <br/>
  <table>
    <thead>
      <tr>
        <th>Name</th>
        <th>Energy</th>
      </tr>
    </thead>
    <tbody>
    {score.map(({ name, died, preview }, index) => (
      <tr key={`row-id-${name}`}>
        <td className={died ? 'died' : ''}>{index + 1}. {name}</td>
        <td><Table rows={[preview]}/> </td>
      </tr>
    ))}
    </tbody>
  </table>
</div>;