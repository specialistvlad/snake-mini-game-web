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
        <th>Length</th>
        <th>Steps left</th>
      </tr>
    </thead>
    <tbody>
    {score.map(({ name, died, preview, length, stepsLeft }, index) => (
      <tr key={`row-id-${name}`}>
        <td className={died ? 'died' : ''}>{index + 1}. {name} <Table rows={[preview]}/></td>
        <td>{length}</td>
        <td>{stepsLeft}</td>
      </tr>
    ))}
    </tbody>
  </table>
</div>;