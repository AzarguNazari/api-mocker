import pino, { Logger as PinoLogger } from 'pino';

type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'silent';
type Logger = Pick<PinoLogger, 'debug' | 'info' | 'warn' | 'error'>;

function resolveLevel(): LogLevel {
    const rawLevel = process.env.LOG_LEVEL?.toLowerCase();
    if (rawLevel === 'debug' || rawLevel === 'info' || rawLevel === 'warn' || rawLevel === 'error' || rawLevel === 'silent') {
        return rawLevel;
    }
    if (process.env.NODE_ENV === 'test') {
        return 'silent';
    }
    return 'info';
}

const baseLogger = pino({
    level: resolveLevel(),
    base: undefined,
    timestamp: false,
    formatters: {
        level(label: string) {
            return { level: label };
        },
    },
});

export function createLogger(scope?: string): Logger {
    if (!scope) {
        return baseLogger;
    }
    return baseLogger.child({ scope });
}

export const logger = createLogger();
