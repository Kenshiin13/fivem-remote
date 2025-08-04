import { LogLevel } from '../';

export interface LogEntityOptions {
    level: LogLevel;
    message: string;
    context?: string;
    error?: Error;
    metadata?: Record<string, unknown>;
}

export interface LogEntityInterface {
    timestamp: Date;
    level: LogLevel;
    message: string;
    context?: string;
    stack?: string;
    metadata?: Record<string, unknown>;

    toJSON(): Record<string, unknown>;
    toString(): string;
}
