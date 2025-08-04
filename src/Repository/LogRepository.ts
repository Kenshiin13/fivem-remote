import { LogEntity } from '../Entity/LogEntity';

class LogRepository {
    public async save(log: LogEntity): Promise<void> {
        //@TODO: Implement the logic to save the log entity to the database
    }
}

export default new LogRepository();
