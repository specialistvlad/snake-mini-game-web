export class MovingAverager {
  constructor(bufferLength: number) {
    // @ts-ignore
    this.buffer = [];
    for (let i = 0; i < bufferLength; ++i) {
    // @ts-ignore
      this.buffer.push(null);
    }
  }

    // @ts-ignore
  append(x) {
    // @ts-ignore
    this.buffer.shift();
    // @ts-ignore
    this.buffer.push(x);
  }

  average() {
    // @ts-ignore
    return this.buffer.reduce((x, prev) => x + prev) / this.buffer.length;
  }
}