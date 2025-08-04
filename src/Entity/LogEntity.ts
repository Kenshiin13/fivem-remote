export enum LogLevel {
    INFO = 'INFO',
    WARN = 'WARN',
    ERROR = 'ERROR',
    DEBUG = 'DEBUG',
}

export class LogEntity {
    public timestamp: Date;
    public level: LogLevel;
    public message: string;
    public context?: string;
    public stack?: string;
    public metadata?: Record<string, unknown>;

    constructor(options: { level: LogLevel; message: string; context?: string; error?: Error; metadata?: Record<string, unknown> }) {
        this.timestamp = new Date();
        this.level = options.level;
        this.message = options.message;
        this.context = options.context;
        this.stack = options.error?.stack;
        this.metadata = options.metadata;
    }

    toJSON() {
        return {
            timestamp: this.timestamp.toISOString(),
            level: this.level,
            message: this.message,
            context: this.context,
            stack: this.stack,
            metadata: this.metadata,
        };
    }

    toString(): string {
        return `[${this.timestamp.toISOString()}] [${this.level}]${this.context ? ` [${this.context}]` : ''} ${this.message}${
            this.stack ? `\n${this.stack}` : ''
        }`;
    }
}
