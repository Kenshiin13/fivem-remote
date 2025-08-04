import { LogEntity } from '../../Entity/LogEntity';
import LogRepositoryInterface from './Interface/LogRepositoryInterface';

class LogRepository implements LogRepositoryInterface {
    public async save(log: LogEntity): Promise<void> {
        //@TODO: Implement the logic to save the log entity to the database
    }
}

export default new LogRepository();
