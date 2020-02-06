import React from 'react';
import AlignCenter from './AlignCenter';
import Game from './Game';
import Paper from './Paper';

export const Root = () =>
  <AlignCenter>
    <Paper>
      <Game/>
      {/* <Buttons></Buttons> */}
    </Paper>
  </AlignCenter>;