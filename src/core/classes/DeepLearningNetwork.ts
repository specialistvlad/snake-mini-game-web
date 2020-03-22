import * as tf from '@tensorflow/tfjs-node';

export class DeepLearningNetwork {
  public model: tf.Sequential;

  constructor(sideSize: number, trainable: boolean = false) {
    const kernelSize = 2;
    const strides = 1;
    this.model = tf.sequential();

    this.model.add(tf.layers.conv2d({
      filters: 128,
      kernelSize,
      strides,
      activation: 'relu',
      inputShape: [sideSize, sideSize, 2]
    }));
    this.model.add(tf.layers.flatten());
    this.model.add(tf.layers.dense({units: 100, activation: 'relu'}));
    this.model.add(tf.layers.dropout({rate: 0.25}));
    this.model.add(tf.layers.dense({units: 3}));
    this.model.trainable = trainable;
  }
}
