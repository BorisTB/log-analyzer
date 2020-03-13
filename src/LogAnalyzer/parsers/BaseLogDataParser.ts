import { ParserResult } from 'types'

abstract class BaseLogDataParser {
  public abstract parse(logData: any): ParserResult
}

export { BaseLogDataParser }
