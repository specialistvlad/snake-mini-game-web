type T = number;

export class NumbersStack {
  protected buffer: Array<T> = [];
  constructor(bufferLength: number, defaultValue: T = 0) {
    for (let i = 0; i < bufferLength; ++i) {
      this.buffer.push(defaultValue);
    }
  }

  append(x: T) {
    this.buffer.shift();
    this.buffer.push(x);
  }

  average() {
    return this.buffer.reduce((x, prev) => x + prev) / this.buffer.length;
  }
}