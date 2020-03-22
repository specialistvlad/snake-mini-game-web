import * as tf from '@tensorflow/tfjs-node';

export class DeepLearningNetwork {
  public model: tf.Sequential;

  constructor(sideSize: number, trainable: boolean = false) {
    const layers = [
      tf.layers.conv2d({
        filters: 128,
        kernelSize: 2,
        strides: 1,
        activation: 'relu',
        inputShape: [sideSize, sideSize, 2]
      }),
      tf.layers.flatten(),
      tf.layers.dense({ units: 100, activation: 'relu' }),
      tf.layers.dropout({ rate: 0.25 }),
      tf.layers.dense({ units: 3 }),
    ];

    this.model = tf.sequential({ layers }); 
    this.model.trainable = trainable;
  }
}
