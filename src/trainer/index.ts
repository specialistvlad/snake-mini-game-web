import { SnakeGameAgent } from './agent';
import { SnakeGame } from './snake_game';
import { Trainer } from '../core/classes/Trainer';

(async function () {
  const opts = {
    "height": 5,
    "width": 5,
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
    "saveModelTo": 'public/model',
    "logDir": './logs',
  };

  console.log(`opts: ${JSON.stringify(opts, null, 2)}`);

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