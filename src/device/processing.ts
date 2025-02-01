export class VibeSmoother {
  private _s: number

  constructor() {
    this._s = 0
  }

  boost = 1.6
  decay = 0.98

  update(v: number) {
    this._s *= this.decay
    this._s += (v * this.boost) / 100
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
