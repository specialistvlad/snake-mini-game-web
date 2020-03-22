import { VisualGame } from './classes/VisualGame';
import { PlayAgent } from './classes/PlayAgent';

const size = 5;

export const visualGame = new VisualGame(size);
export const agent = new PlayAgent(size, '/snake-mini-game-web/model/model.json');
