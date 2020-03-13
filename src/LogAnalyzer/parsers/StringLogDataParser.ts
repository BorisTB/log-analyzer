import { BaseLogDataParser } from './BaseLogDataParser'
import { log } from '../../utils/logger'
import { ParserResult, LogDataInput, DeviceDataItem } from 'types'

const FULL_REGEX = /(?<dataType>^[a-zA-Z]+) (?:(?:(?<thermometer>\S+) (?<humidity>\S+) (?<monoxide>\S+))|(?<id>\S+)(?:.|[\n\r]?)(?:[\s\S](?<data>^[^a-z]*)))/gm
const REFERENCE_TYPE = 'reference'

interface UnparsedReference {
  thermometer: string
  humidity: string
  monoxide: string
}

class StringLogDataParser extends BaseLogDataParser {
  private _parseReferenceData = ({
    thermometer,
    humidity,
    monoxide
  }: UnparsedReference) => ({
    thermometer: parseFloat(thermometer),
    humidity: parseFloat(humidity),
    monoxide: parseFloat(monoxide)
  })

  private *_parseDeviceData(data: string): Generator<DeviceDataItem> {
    const dataLines = data.split('\n')

    for (let i = 0; i < dataLines.length; i++) {
      const line = dataLines[i]

      if (!line) {
        continue
      }

      const [datetime, value] = line.split(' ')

      const result = {
        timestamp: +new Date(datetime),
        value: parseFloat(value)
      }

      yield result
    }
  }

  public *parse(logData: LogDataInput): ParserResult {
    const matches = Array.from(logData.matchAll(FULL_REGEX))

    for (let i = 0; i < matches.length; i++) {
      const match = matches[i]

      if (!match || !match.groups || !match.groups.dataType) {
        log('Invalid match', match)
        continue
      }

      const { dataType } = match.groups

      if (dataType === REFERENCE_TYPE) {
        const { thermometer, humidity, monoxide } = match.groups

        const reference = this._parseReferenceData({
          thermometer,
          humidity,
          monoxide
        })

        yield { reference }
      } else if (match.groups.id) {
        const { id, data } = match.groups
        const device = {
          id,
          type: dataType,
          data: this._parseDeviceData(data)
        }

        yield { device }
      } else {
        log('Invalid match', match)
        continue
      }
    }
  }
}

export { StringLogDataParser }
