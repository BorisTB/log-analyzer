import { LogAnalyzer } from '../src/LogAnalyzer'
import validMultilineText, {
  expectedResult,
  devicesConfig
} from './mocks/validMultilineText'

describe('LogAnalyzer', () => {
  describe('without devicesConfig', () => {
    describe('throws on creating new instance', () => {
      expect(() => {
        // @ts-ignore
        new LogAnalyzer({})
      }).toThrow()
    })
  })

  describe('with devicesConfig', () => {
    it('creates new instance', () => {
      let logAnalyzer

      expect(logAnalyzer).not.toBeInstanceOf(LogAnalyzer)
      expect(() => {
        logAnalyzer = new LogAnalyzer({ devicesConfig })
      }).not.toThrow()
      expect(logAnalyzer).toBeInstanceOf(LogAnalyzer)
    })

    it(`accepts data update`, () => {
      const logAnalyzer = new LogAnalyzer({ devicesConfig })

      expect(() => {
        logAnalyzer.addLogData(validMultilineText)
      }).not.toThrow()
    })

    it(`returns valid parsed and resolved value`, () => {
      const logAnalyzer = new LogAnalyzer({ devicesConfig })
      logAnalyzer.addLogData(validMultilineText)
      const result = logAnalyzer.getResults()

      expect(result).toEqual(expectedResult)
    })
  })
})
