import { Game } from './classes/Game';
import { PlayAgent } from './classes/PlayAgent';
// import greenlet from 'greenlet'
// import { trainer } from '../trainer/trainer';

const size = 5;
// const worker = greenlet(trainer);

export const game = new Game(size);
export const agent = new PlayAgent(size);


// trainer(game, agent);
// worker(game, agent);