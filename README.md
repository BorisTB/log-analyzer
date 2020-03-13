# Log Analyzer

Process and analyze data logs of 365 Widgets devices

## Usage

```typescript
import { evaluateLogFile } from 'log-analyzer'
import log from 'log.txt'

evaluateLogFile(log)
```

## Local Development

#### `npm start` or `yarn start`

Runs the project in development/watch mode. Project will be rebuilt upon changes.

#### `npm run build` or `yarn build`

Bundles the package to the `dist` folder.
The package is optimized and bundled with Rollup into multiple formats (CommonJS, UMD, and ES Module).

#### `npm test` or `yarn test`

Runs the test watcher (Jest) in an interactive mode.
By default, runs tests related to files changed since the last commit.

## Devices config

Configuration for device types processing

```typescript
const devicesConfig: DevicesConfig = {
  [deviceType: string]: {
    resolve: (stats: DeviceStats, reference: Reference) => any
  }
}

const logAnalyzer = new LogAnalyzer({ devicesConfig })
```

#### Resolve device's result value

```typescript
const devicesConfig = {
  thermometer: ({ min, max }, { thermometer }) =>
    min === max && min === thermometer ? 'stable' : 'whoa'
}

const logAnalyzer = new LogAnalyzer({ devicesConfig })

logAnalyzer.addData(`
reference 50.0
thermometer foo-1
2007-04-05T22:00 50.0
2007-04-05T22:01 50.0
2007-04-05T22:02 50.0
thermometer foo-2
2007-04-05T22:00 10.0
2007-04-05T22:01 50.0
2007-04-05T22:02 50.0
`)

logAnalyzer.getResult()

/* returns
    {
      foo-1: 'stable',
      foo-2: 'whoa'
    }
*/
```

### Device Stats

Automatically calculated values for each device

```typescript
interface DeviceStats {
  count: number // # of data entries for this device
  min: number // min logged value
  max: number // max logged value
  sum: number // sum of all logged values
  mean: number // mean of all logged values
  squareDiff: number // average square difference of all logged values
  standardDeviation: number // standard deviation
}
```

### Reference

##### WARNING! Reference is currently hard coded to these values and doesn't support other device types. (For easier log parsing, where reference's type is defined only by it's position in log)

```typescript
export interface Reference {
  thermometer: number
  humidity: number
  monoxide: number
  [key: string]: number
}
```

## Custom Log Data Parser

```typescript
class CustomParser extends BaseLogDataParser {
  public *parse(logData: LogDataInput): ParserResult {}
}

const logAnalyzer = new LogAnalyzer({
  parser: new CustomParser(),
  devicesConfig
})
```

## TODO

1. Finish tests
2. Finish documentation
3. Make reference dynamic (currently it's hard-coded to `thermometer, humidity, monoxide`)
4. rename `evaluateLogFile`, as the function doesn't really work with a file but file's content. e.g. `evaluateLog`
5. rename argument `logContentsStr` to avoid Hungarian notation
6. add more parsers (URL, Blob/File, Stream...)
7. use private class fields identifier `#` instead of `private _` when it will be reasonable to target ES2015
8. allow `DeviceConfig` to be serializable (e.g. JsonLogic) and defined from outside the library
