import { Game } from './classes/Game';
import { Agent } from './classes/Agent';
// import greenlet from 'greenlet'
// import { trainer } from '../trainer/trainer';

const size = 5;
// const worker = greenlet(trainer);

export const game = new Game(size);
export const agent = new Agent(size);


// trainer(game, agent);
// worker(game, agent);