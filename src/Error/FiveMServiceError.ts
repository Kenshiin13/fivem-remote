const enum FiveMServiceErrorCode {
    GENERIC_ERROR = 1000,
    SERVER_NOT_FOUND = 1001,
}

class FiveMServiceError extends Error {
    public readonly name = 'FiveMServiceError';
    public readonly code: FiveMServiceErrorCode;

    constructor(message: string, code: FiveMServiceErrorCode) {
        super(message);
        this.code = code;
        Object.setPrototypeOf(this, FiveMServiceError.prototype);
    }
}

export { FiveMServiceError, FiveMServiceErrorCode };
