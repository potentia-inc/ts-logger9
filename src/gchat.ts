import debug from 'debug'
import build from 'pino-abstract-transport'

type Options = {
  link: string
  timeout?: number
}

const log = debug('logger:gchat')

export default async function (
  options: Options,
): Promise<ReturnType<typeof build>> {
  const { link, timeout = 30000 } = options
  return build(async (source) => {
    for await (const obj of source) {
      const { level, time, name, msg, ...misc } = obj
      const date = new Date(time as number).toISOString()
      const text = [
        `[${date}] ${s(name)} *${s(level)}* ${s(msg)}`,
        JSON.stringify(misc),
      ].join('\n')
      fetch(link, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        signal: AbortSignal.timeout(timeout),
        body: JSON.stringify({ text }),
      })
        .then((res) => Promise.all([res, res.text()]))
        .then(([res, text]) => {
          log(res.status, text)
          if (!res.ok) throw new Error(text)
        })
        .catch(console.error)
    }
  })

  function s(x: unknown): string {
    return String(x)
  }
}
