import { TrainingAgent } from './core/classes/TrainingAgent';
import { Game } from './core/classes/Game';
import { TrainingManager } from './core/classes/TrainingManager';

(async function () {
  const opts = {
    sideSize: 5,
    foodCount: 1,
    initLen: 2,
    cumulativeRewardThreshold: 100,
    maxNumFrames: 500000,
    // maxNumFrames: 10500,
    replayBufferSize: 10000,
    epsilonInit: 0.5,
    epsilonFinal: 0.01,
    epsilonDecayFrames: 100000,
    batchSize: 64,
    gamma: 0.99,
    learningRate: 0.001,
    syncEveryFrames: 1000,
    saveModelTo: 'public/model',
    logDir: './logs',
  };

  console.log(`Parameters: ${JSON.stringify(opts, null, 2)}`);

  const game = new Game(opts.sideSize);

  const agent = new TrainingAgent({
    sideSize: opts.sideSize,
    replayBufferSize: opts.replayBufferSize,
    epsilonInit: opts.epsilonInit,
    epsilonFinal: opts.epsilonFinal,
    epsilonDecayFrames: opts.epsilonDecayFrames,
    learningRate: opts.learningRate,
  }, game);

  const trainer = new TrainingManager(agent, opts);
  await trainer.loop();
})().catch(console.error);