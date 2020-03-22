import * as tf from '@tensorflow/tfjs';

export class ReplayBuffer<T> {
  protected size: number;
  protected index: number;
  protected length: number;
  protected buffer: Array<T>;
  protected bufferIndices_: Array<number>;

  constructor(size: number, defaultValue: T) {
    this.size = size;
    this.buffer = [];
    for (let i = 0; i < size; ++i) {
      this.buffer.push(defaultValue);
    }
    this.index = 0;
    this.length = 0;

    this.bufferIndices_ = [];
    for (let i = 0; i < size; ++i) {
      this.bufferIndices_.push(i);
    }
  }

  append(item: T) {
    this.buffer[this.index] = item;
    this.length = Math.min(this.length + 1, this.size);
    this.index = (this.index + 1) % this.size;
  }

  sample(batchSize: number) {
    tf.util.shuffle(this.bufferIndices_);

    const out = [];
    for (let i = 0; i < batchSize; ++i) {
      out.push(this.buffer[this.bufferIndices_[i]]);
    }
    return out;
  }
}
