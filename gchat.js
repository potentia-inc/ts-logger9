import { debuglog } from 'node:util';
import build from 'pino-abstract-transport';
const log = debuglog('logger:gchat');
export default async function (options) {
    const { link, timeout = 30000 } = options;
    return build(async (source) => {
        for await (const obj of source) {
            const { level, time, name, msg, ...misc } = obj;
            const date = new Date(time).toISOString();
            const text = [
                `[${date}] ${s(name)} *${s(level)}* ${s(msg)}`,
                JSON.stringify(misc),
            ].join('\n');
            fetch(link, {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                signal: AbortSignal.timeout(timeout),
                body: JSON.stringify({ text }),
            })
                .then((res) => Promise.all([res, res.text()]))
                .then(([res, text]) => {
                log(`${res.status} ${text}`);
                if (!res.ok)
                    throw new Error(text);
            })
                .catch(console.error);
        }
    });
    function s(x) {
        return String(x);
    }
}
//# sourceMappingURL=gchat.js.map