import * as tf from '@tensorflow/tfjs';

export class ReplayBuffer {
  protected size: number;
  protected index: number;
  protected length: number;
  protected buffer: Array<any>;
  protected bufferIndices_: Array<any>;

  constructor(size: number) {
    this.size = size;
    this.buffer = [];
    for (let i = 0; i < size; ++i) {
      this.buffer.push(null);
    }
    this.index = 0;
    this.length = 0;

    this.bufferIndices_ = [];
    for (let i = 0; i < size; ++i) {
      this.bufferIndices_.push(i);
    }
  }

  append(item: any) {
    this.buffer[this.index] = item;
    this.length = Math.min(this.length + 1, this.size);
    this.index = (this.index + 1) % this.size;
  }

  sample(batchSize: number) {
    if (batchSize > this.size) {
      throw new Error(`batchSize (${batchSize}) exceeds buffer length (${this.size})`);
    }
    tf.util.shuffle(this.bufferIndices_);

    const out = [];
    for (let i = 0; i < batchSize; ++i) {
      out.push(this.buffer[this.bufferIndices_[i]]);
    }
    return out;
  }
}
