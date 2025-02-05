export class Smoother {
  private _s: number
  static REFERENCE_SR = 100

  constructor(sample_rate: number) {
    this.sample_rate = sample_rate
    this._s = 0
  }

  sample_rate: number

  boost = 1.0
  decay = 0.01

  update(v: number) {
    this._s *= Math.pow(1 - this.decay, Smoother.REFERENCE_SR / this.sample_rate)
    this._s += v * this.boost * (Smoother.REFERENCE_SR / this.sample_rate)
    this._s = Math.max(0, Math.min(1, this._s))
    return this._s
  }

  get value() {
    return this._s
  }

  set value(v: number) {
    this._s = Math.max(0, Math.min(1, v))
  }
}
