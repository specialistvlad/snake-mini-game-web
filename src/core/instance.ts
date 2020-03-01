import { Game } from './classes/Game';
import { PlayAgent } from './classes/PlayAgent';

const size = 5;

export const game = new Game(size);
export const agent = new PlayAgent(size, '/snake-mini-game-web/model/model.json');
