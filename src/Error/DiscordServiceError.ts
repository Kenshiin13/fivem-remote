const enum DiscordServiceErrorCode {
    GENERIC_ERROR = 1000,
    INVALID_TOKEN = 1001,
    BAD_COMMAND = 1002,
    APPLICATION_NOT_FOUND = 1003,
    GUILD_NOT_FOUND = 1004,
}

class DiscordServiceError extends Error {
    public readonly name = 'DiscordServiceError';
    public readonly code: DiscordServiceErrorCode;

    constructor(message: string, code: DiscordServiceErrorCode) {
        super(message);
        this.code = code;
        Object.setPrototypeOf(this, DiscordServiceError.prototype);
    }
}

export { DiscordServiceError, DiscordServiceErrorCode };
