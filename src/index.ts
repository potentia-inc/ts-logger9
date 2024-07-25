import { default as pino } from 'pino'

export type Level = pino.Level

type Transport = {
  type: 'gchat'
  link: string
  level: Level
}

type Options = {
  name: string
  level?: pino.Level
  transports?: Transport[]
}

export function createLogger(options: Options): ReturnType<typeof pino> {
  const { level = 'info', transports = [], ...misc } = options
  const targets: pino.TransportTargetOptions[] = transports.map(
    ({ type, link, level }) => {
      switch (type) {
        case 'gchat':
          return { target: './gchat.js', level, options: { link } }
        default:
          throw new Error(`Unsupported logger transport type ${type}`)
      }
    },
  )
  targets.push({
    target: 'pino-pretty',
    level: 'trace',
    options: { destination: 1 },
  })
  return pino({ level, ...misc }, pino.transport({ targets }))
}
