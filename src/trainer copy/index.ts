import {SnakeGameAgent} from './agent';
import {SnakeGame} from './snake_game';
import { Trainer } from '../core/classes/Trainer';

(async function () {
  const tmp = {
    "gpu": false,
    "height": 9,
    "width": 9,
    "numFruits": 1,
    "initLen": 2,
    "cumulativeRewardThreshold": 100,
    "maxNumFrames": 1000000,
    "replayBufferSize": 10000,
    "epsilonInit": 0.5,
    "epsilonFinal": 0.01,
    "epsilonDecayFrames": 100000,
    "batchSize": 64,
    "gamma": 0.99,
    "learningRate": 0.001,
    "syncEveryFrames": 1000,
    "savePath": "./models/dqn",
    "logDir": null
  };

  const opts = {
    height: 9,
    width: 9,
    numFruits: 1,
    initLen: 2,
    cumulativeRewardThreshold: 100,
    maxNumFrames: 1e6,
    replayBufferSize: 1e4,
    epsilonInit: 0.5,
    epsilonFinal: 0.01,
    epsilonDecayFrames: 1e5,
    batchSize: 64,
    gamma: 0.99,
    learningRate: 1e-3,
    syncEveryFrames: 1e3,
    saveModelTo: 'public/model',
    logDir: './logs',
  };

  const game = new SnakeGame({
    height: opts.height,
    width: opts.width,
    numFruits: opts.numFruits,
    initLen: opts.initLen
  });

  const agent = new SnakeGameAgent(game, {
    replayBufferSize: opts.replayBufferSize,
    epsilonInit: opts.epsilonInit,
    epsilonFinal: opts.epsilonFinal,
    epsilonDecayFrames: opts.epsilonDecayFrames
  });

  const trainer = new Trainer(agent, opts);
  try {
    await trainer.loop();
  } catch(e) {
    console.error(e);
    process.exit(1);
  }
})();