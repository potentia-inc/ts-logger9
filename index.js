import { pino } from 'pino';
export function createLogger(options) {
    const { level = 'info', transports = [], ...misc } = options;
    const targets = transports.map(({ type, link, level }) => {
        switch (type) {
            case 'gchat':
                return { target: './gchat.js', level, options: { link } };
            default:
                throw new Error(`Unsupported logger transport type ${type}`);
        }
    });
    targets.push({
        target: 'pino-pretty',
        level: 'trace',
        options: { destination: 1 },
    });
    return pino({ level, ...misc }, pino.transport({ targets }));
}
//# sourceMappingURL=index.js.map