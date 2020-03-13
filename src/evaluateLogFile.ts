import { LogAnalyzer } from './LogAnalyzer'
import { DevicesConfig } from 'types'

const devicesConfig: DevicesConfig = {
  thermometer: {
    resolve: ({ mean, standardDeviation }, { thermometer }) => {
      const inAllowedDev = Math.abs(mean - thermometer) <= 0.5

      if (inAllowedDev) {
        if (standardDeviation <= 3) {
          return 'ultra precise'
        }

        if (standardDeviation <= 5) {
          return 'very precise'
        }
      }

      return 'precise'
    }
  },
  humidity: {
    resolve: ({ min, max }, { humidity }) =>
      [min, max].every(value => Math.abs(value - humidity) <= 1)
        ? 'keep'
        : 'discard'
  },
  monoxide: {
    resolve: ({ min, max }, { monoxide }) =>
      [min, max].every(value => Math.abs(value - monoxide) <= 3)
        ? 'keep'
        : 'discard'
  }
}

const evaluateLogFile = (logContentsStr: string) => {
  if (!logContentsStr) {
    throw new TypeError(`Invalid input type: ${logContentsStr}`)
  }

  const logAnalyzer = new LogAnalyzer({ devicesConfig })

  logAnalyzer.addLogData(logContentsStr)

  return logAnalyzer.getResults()
}

export { evaluateLogFile }
