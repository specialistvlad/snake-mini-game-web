import * as tf from '@tensorflow/tfjs';
import { TCellTypes, Directions } from './types';

export default (fullSize: number) => {
  console.log('a', fullSize);
  
  // Define a model for linear regression.
  const model = tf.sequential({
    name: 'snake game model',
    layers: [
      tf.layers.inputLayer({ inputShape: [fullSize, 784] }),
      tf.layers.dense({ units: 32, activation: 'relu' }),
      tf.layers.dense({ units: 10, activation: 'softmax' }),
    ]
  });

  model.compile({ loss: 'meanSquaredError', optimizer: 'sgd' });
  // model.compile({
  //   optimizer: tf.train.adam(1e-6),
  //   loss: tf.losses.sigmoidCrossEntropy,
  //   metrics: ['accuracy']
  // });
  model.save('localstorage://my-model-1');
  // tf.loadLayersModel('localstorage://my-model-1');
  console.log(model.summary());

  
  // // Generate some synthetic data for training.
  // const xs = tf.tensor2d([1, 2, 3, 4], [4, 1]);
  // const ys = tf.tensor2d([1, 3, 5, 7], [4, 1]);

  // // Train the model using the data.
  // model.fit(xs, ys, {epochs: 10}).then(() => {
  //   // Use the model to do inference on a data point the model hasn't seen before:
  //   // @ts-ignore
  //   model.predict(tf.tensor2d([5], [1, 1])).print();
  //   // Open the browser devtools to see the output
  // });

  return (cells: TCellTypes): Directions => {
  console.log('b');
  return Directions.Down;
  };
};