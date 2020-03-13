import { BaseLogDataParser } from 'LogAnalyzer'
import { Device } from 'LogAnalyzer/Device'

export interface Reference {
  thermometer: number
  humidity: number
  monoxide: number
  [key: string]: number
}

export interface Parser extends BaseLogDataParser {}

export type LogDataInput = string

export interface DeviceConfig {
  resolve: (stats: DeviceStats, reference: Reference) => any
}

export interface DevicesConfig {
  [key: string]: DeviceConfig
}

export interface LogAnalyzerConfig {
  parser?: Parser
  devicesConfig: DevicesConfig
}

export interface LogAnalyzerConfigExtension extends Partial<LogAnalyzerConfig> {
  parser: Parser
  devicesConfig?: DevicesConfig
}

export interface DeviceDataItem {
  timestamp: number
  value: number
}

export interface ParserResultDevice {
  id: string
  type: string
  data: IterableIterator<DeviceDataItem>
}

export interface ParserResultData {
  reference?: Reference
  device?: ParserResultDevice
}

export type DeviceStats = ReturnType<Device['toJSON']>['stats']
export interface DeviceStatsExt extends DeviceStats {
  [key: string]: number
}

export type ParserResult = IterableIterator<ParserResultData>
