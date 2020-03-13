import { log } from '../utils/logger'

class Stats {
  public count: number = 0
  public min: number = Number.MAX_VALUE
  public max: number = -Number.MAX_VALUE
  public sum: number = 0
  public mean: number = 0
  public squareDiff: number = 0
  public standardDeviation: number = 0

  addValue = (value: number) => {
    if (isNaN(value)) {
      log(new TypeError(`Invalid value ${value}`))
      return
    }

    this.count = this.count += 1
    this.min = Math.min(this.min, value)
    this.max = Math.max(this.max, value)
    this.sum = this.sum += value

    const prevMean = this.mean
    this.mean = this.sum / this.count
    this.squareDiff = this.squareDiff + (value - prevMean) * (value - this.mean)
    this.standardDeviation = Math.sqrt(this.squareDiff / this.count)
  }

  toJSON = () => ({
    count: this.count,
    min: this.min,
    max: this.max,
    sum: this.sum,
    mean: this.mean,
    squareDiff: this.squareDiff,
    standardDeviation: this.standardDeviation
  })
}

export { Stats }
