# @potentia/logger9

wrapper for [pino](https://github.com/pinojs/pino) `^9.0.0` with google chat webhook support

## API

```js
import { createLogger } from '@potentia/logger'

const logger = createLogger({
  name: 'foobar',
  level: 'warn', // default to info
  transports: [
    {
      type: 'gchat', // currently only google chat supported
      link: 'https://...',
      level: 'fatal', // specify the level to log to google chat
    }
  ],
})

logger.debug('debug') // the message is supressed
logger.warn('warn') // log to console
logger.fatal('fatal') // log to console and google chat
```
