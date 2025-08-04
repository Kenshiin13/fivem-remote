import { Collection } from 'discord.js';
import { DiscordCommandInterface } from '../Interface/DiscordCommandInterface';
import fs from 'fs';
import path from 'path';
import { DiscordServiceError, DiscordServiceErrorCode } from '../../../Error/DiscordServiceError';

const commands = new Collection<string, DiscordCommandInterface>();
const commandsPath = path.resolve(__dirname);

/**
 * @throws {DiscordServiceError}
 */
async function refreshCommands(): Promise<void> {
    commands.clear(); // clear existing commands before reloading

    const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith('.ts') && file !== 'index.ts');

    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const commandModule = await import(filePath);
        const command: DiscordCommandInterface = commandModule.default ?? Object.values(commandModule)[0];

        if (command && command.data && typeof command.execute === 'function') {
            commands.set(command.data.name, command);
        } else {
            throw new DiscordServiceError(`Invalid command structure in ${filePath}`, DiscordServiceErrorCode.BAD_COMMAND);
        }
    }
}

export { commands, refreshCommands };
