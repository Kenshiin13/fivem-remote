import { FiveMServiceError, FiveMServiceErrorCode } from '../../Error/FiveMServiceError';
import { FiveMServerInfoDTO } from './DTO/FiveMServerInfoDTO';
import { FivemServiceInterface } from './Interface/FiveMServiceInterface';

class FiveMService implements FivemServiceInterface {
    private readonly serverIP: string;
    private readonly serverPort: string;
    constructor() {
        this.serverIP = process.env.FIVEM_SERVICE_SERVER_IP || '';
        this.serverPort = process.env.FIVEM_SERVICE_SERVER_PORT || '';
    }

    /**
     * @throws {FiveMServiceError}
     */
    public async getServerInfo(): Promise<FiveMServerInfoDTO> {
        const response = await fetch(`http://${this.serverIP}:${this.serverPort}/info.json`);

        if (!response.ok) {
            throw new FiveMServiceError(`Failed to fetch server info: ${response.statusText}`, FiveMServiceErrorCode.SERVER_NOT_FOUND);
        }
        return await response.json();
    }
}

export default new FiveMService();
