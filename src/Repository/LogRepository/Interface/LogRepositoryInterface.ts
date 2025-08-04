import { LogEntity } from '../../../Entity/LogEntity';

export default interface LogRepositoryInterface {
    save(log: LogEntity): Promise<void>;
}
