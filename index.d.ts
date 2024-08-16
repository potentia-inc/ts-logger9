import { pino } from 'pino';
export type Level = pino.Level;
type Transport = {
    type: 'gchat';
    link: string;
    level: Level;
};
type Options = {
    name: string;
    level?: pino.Level;
    transports?: Transport[];
};
export declare function createLogger(options: Options): ReturnType<typeof pino>;
export {};
