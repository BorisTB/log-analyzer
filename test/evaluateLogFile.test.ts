import validMultilineText, { expectedResult } from './mocks/validMultilineText'
import { evaluateLogFile } from '../src'

describe('evaluateLogFile', () => {
  describe('without any input data', () => {
    it('throws', async () => {
      // @ts-ignore
      expect(() => evaluateLogFile()).toThrow()
    })
  })

  describe('with valid text file input', () => {
    it('returns valid results', () => {
      const result = evaluateLogFile(validMultilineText)
      expect(result).toEqual(expectedResult)
    })
  })
})
