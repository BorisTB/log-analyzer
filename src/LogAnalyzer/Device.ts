import { DeviceDataItem } from 'types'
import { Stats } from './Stats'

class Device {
  public id: string | number
  public type: string
  private _stats: Stats

  constructor(id: string | number, type: string) {
    this.id = id
    this.type = type
    this._stats = new Stats()
  }

  getId = () => this.id

  getType = () => this.type

  getStats = () => ({
    ...this._stats.toJSON()
  })

  addData = ({ value }: DeviceDataItem) => {
    this._stats.addValue(value)
  }

  toJSON = () => ({
    id: this.id,
    type: this.type,
    stats: this.getStats()
  })
}

export { Device }
