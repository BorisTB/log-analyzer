import { StringLogDataParser } from './parsers'
import { Device } from './Device'
import {
  Parser,
  ParserResultDevice,
  LogAnalyzerConfig,
  Reference,
  LogAnalyzerConfigExtension,
  LogDataInput
} from 'types'

const getDefaultConfig = (): LogAnalyzerConfigExtension => ({
  parser: new StringLogDataParser()
})

class LogAnalyzer {
  private _parser: Parser
  private _config: LogAnalyzerConfig
  private _reference: Reference = {
    thermometer: 0,
    humidity: 0,
    monoxide: 0
  }
  private _devices = new Map<string, Device>()

  constructor(configExt: LogAnalyzerConfig) {
    if (!configExt.devicesConfig) {
      throw new Error('Invalid deviceConfig')
    }

    this._config = {
      ...getDefaultConfig(),
      ...configExt
    }

    if (this._config.parser && this._config.devicesConfig) {
      this._parser = this._config.parser
    } else {
      throw new Error('Invalid parser')
    }
  }

  private _getConfig = () => ({ ...this._config })

  private _getReference = () => ({ ...this._reference })

  private _updateReference = (referenceUpdate: Reference) => {
    this._reference = {
      ...this._getReference(),
      ...referenceUpdate
    }
  }

  private _updateDevice = ({ id, type, data }: ParserResultDevice) => {
    const device = this._getOrCreateDevice(id, type)

    for (const dataItem of data) {
      device.addData(dataItem)
    }
  }

  private _toGlobalId = (id: string | number, type: string): string =>
    `${type}-${id}`

  private _getDevice = (globalId: string): Device | undefined =>
    this._devices.get(globalId)

  private _createDevice = (id: string, type: string): Device => {
    const device = new Device(id, type)
    this._devices.set(this._toGlobalId(id, type), device)

    return device
  }

  private _getAllDevices = () => Array.from(this._devices.values())

  private _getOrCreateDevice = (id: string, type: string): Device =>
    this._getDevice(this._toGlobalId(id, type)) || this._createDevice(id, type)

  public addLogData = (logData: LogDataInput) => {
    if (!logData) {
      throw new TypeError(`Invalid log data: ${logData}`)
    }

    const parsedData = this._parser.parse(logData)

    for (const dataItem of parsedData) {
      if (dataItem.reference) {
        this._updateReference(dataItem.reference)
      }

      if (dataItem.device) {
        this._updateDevice(dataItem.device)
      }
    }
  }

  public getResults = () =>
    this._getAllDevices().reduce(
      (acc, device) => ({
        ...acc,
        [device.getId()]: this._getConfig().devicesConfig[
          device.getType()
        ].resolve(device.getStats(), this._getReference())
      }),
      {}
    )
}

export { LogAnalyzer }
