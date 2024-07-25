import build from 'pino-abstract-transport';
type Options = {
    link: string;
    timeout?: number;
};
export default function (options: Options): Promise<ReturnType<typeof build>>;
export {};
