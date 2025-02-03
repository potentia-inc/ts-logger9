import assert from 'node:assert'
import { createServer } from 'node:http'
import { createLogger } from '../src/index.js'

type Logger = ReturnType<typeof createLogger>

describe('logger', () => {
  test('log all messages to console', async () => {
    const logger = createLogger({ name: 'all', level: 'trace' })
    log(logger)
  })

  test('log some messages to console', async () => {
    const logger = createLogger({ name: 'some', level: 'info' })
    log(logger)
  })

  test('log error/fatal messages to gchat', async () => {
    const [server1, server2] = await Promise.all([start(), start()])
    const logger = createLogger({
      name: 'gchat',
      level: 'warn',
      transports: [
        { type: 'gchat', link: server1.link, level: 'fatal' },
        { type: 'gchat', link: server2.link, level: 'error' },
      ],
    })
    log(logger)
    await sleep(1000)
    expect(server1.body()).toMatch('fatal')
    expect(server2.body()).toMatch('error')
    await Promise.all([server1.stop(), server2.stop()])
  })

  test('unsupported transport', async () => {
    expect(() =>
      createLogger({
        name: 'foobar',
        transports: [
          {
            type: 'foobar' as unknown as 'gchat',
            link: 'foobar',
            level: 'fatal',
          },
        ],
      }),
    ).toThrow(/unsupported/i)
  })
})

function log(logger: Logger): void {
  logger.trace('trace')
  logger.debug('debug')
  logger.info('info')
  logger.warn('warn')
  logger.error('error')
  logger.fatal('fatal')
}

async function start(): Promise<{
  link: string
  stop: () => Promise<void>
  body: () => string
}> {
  const chunks: string[] = []
  const server = createServer((req, res) => {
    req.on('data', (chunk) => chunks.push(chunk)).on('end', () => res.end())
  })
  const net = server.listen()
  const address = net.address()
  assert(address !== null && typeof address !== 'string')
  return {
    link: `http://localhost:${address.port}`,
    stop: () =>
      new Promise((resolve, reject) =>
        server.close((err) => {
          if (err) reject(err)
          else resolve()
        }),
      ),
    body: () => chunks.join(''),
  }
}

async function sleep(ms: number): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, ms))
}
