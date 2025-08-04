import { FiveMServerInfoDTO } from '../DTO/FiveMServerInfoDTO';

export interface FivemServiceInterface {
    getServerInfo(): Promise<FiveMServerInfoDTO>;
}
