import { LogEntityInterface, LogEntityOptions } from './Interface/LogEntityInterface';

export enum LogLevel {
    INFO = 'INFO',
    WARN = 'WARN',
    ERROR = 'ERROR',
    DEBUG = 'DEBUG',
}

export class LogEntity implements LogEntityInterface {
    private _timestamp: Date;
    private _level: LogLevel;
    private _message: string;
    private _context?: string;
    private _stack?: string;
    private _metadata?: Record<string, unknown>;

    constructor(options: LogEntityOptions) {
        this._timestamp = new Date();
        this._level = options.level;
        this._message = options.message;
        this._context = options.context;
        this._stack = options.error?.stack;
        this._metadata = options.metadata;
    }

    get timestamp(): Date {
        return this._timestamp;
    }

    get level(): LogLevel {
        return this._level;
    }

    get message(): string {
        return this._message;
    }

    get context(): string | undefined {
        return this._context;
    }

    get stack(): string | undefined {
        return this._stack;
    }

    get metadata(): Record<string, unknown> | undefined {
        return this._metadata;
    }

    set level(level: LogLevel) {
        this._level = level;
    }

    set message(message: string) {
        this._message = message;
    }

    set context(context: string | undefined) {
        this._context = context;
    }

    set stack(stack: string | undefined) {
        this._stack = stack;
    }

    set metadata(metadata: Record<string, unknown> | undefined) {
        this._metadata = metadata;
    }

    toJSON() {
        return {
            timestamp: this._timestamp.toISOString(),
            level: this._level,
            message: this._message,
            context: this._context,
            stack: this._stack,
            metadata: this._metadata,
        };
    }

    toString(): string {
        return `[${this._timestamp.toISOString()}] [${this._level}]${this._context ? ` [${this._context}]` : ''} ${this._message}${
            this._stack ? `\n${this._stack}` : ''
        }`;
    }
}
