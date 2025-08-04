import { FiveMServiceError, FiveMServiceErrorCode } from '../../Error/FiveMServiceError';
import { FiveMServerInfoDTO } from './DTO/FiveMServerInfoDTO';
import { FivemServiceInterface } from './Interface/FiveMServiceInterface';

class FiveMService implements FivemServiceInterface {
    private readonly _serverIP: string;
    private readonly _serverPort: string;
    constructor() {
        this._serverIP = process.env.FIVEM_SERVICE_SERVER_IP || '';
        this._serverPort = process.env.FIVEM_SERVICE_SERVER_PORT || '';
    }

    /**
     * @throws {FiveMServiceError}
     */
    public async getServerInfo(): Promise<FiveMServerInfoDTO> {
        const response = await fetch(`http://${this._serverIP}:${this._serverPort}/info.json`);

        if (!response.ok) {
            throw new FiveMServiceError(`Failed to fetch server info: ${response.statusText}`, FiveMServiceErrorCode.SERVER_NOT_FOUND);
        }
        return await response.json();
    }
}

export default new FiveMService();
