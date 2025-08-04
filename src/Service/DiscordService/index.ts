import { Client, DiscordjsError, DiscordjsErrorCodes, GatewayIntentBits, Interaction, Collection } from 'discord.js';
import { DiscordServiceError, DiscordServiceErrorCode } from '../../Error/DiscordServiceError';
import { DiscordCommandInterface } from './Interface/DiscordCommandInterface';
import { DiscordServiceInterface } from './Interface/DiscordServiceInterface';
import { LogEntity, LogLevel } from '../../Entity/LogEntity';
import LogRepository from '../../Repository/LogRepository';
import fs from 'fs';
import path from 'path';

class DiscordService implements DiscordServiceInterface {
    private readonly _client: Client;
    private _initialized = false;
    private _commands = new Collection<string, DiscordCommandInterface>();

    constructor() {
        this._client = new Client({
            intents: [GatewayIntentBits.Guilds],
        });
    }

    public get commands() {
        return this._commands;
    }

    /**
     * @throws {DiscordServiceError}
     */
    private async login(): Promise<void> {
        if (this._initialized) return;

        try {
            await this._client.login(process.env.DISCORD_SERVICE_TOKEN);
            this._initialized = true;

            await this.refreshCommands();
            this._client.on('interactionCreate', this.handleInteraction.bind(this));
        } catch (error: unknown) {
            if (error instanceof DiscordServiceError) {
                throw error;
            } else if (error instanceof DiscordjsError && error.code === DiscordjsErrorCodes.TokenInvalid) {
                throw new DiscordServiceError('Invalid Discord bot token provided.', DiscordServiceErrorCode.INVALID_TOKEN);
            }

            throw new DiscordServiceError('Failed to connect to Discord service.', DiscordServiceErrorCode.GENERIC_ERROR);
        }
    }

    private async handleInteraction(interaction: Interaction): Promise<void> {
        if (!interaction.isChatInputCommand()) return;

        const command = this._commands.get(interaction.commandName);
        if (!command) {
            await interaction.reply({
                content: 'Command not found.',
                ephemeral: true,
            });
            return;
        }

        try {
            await command.execute(interaction);
        } catch (error) {
            const logEntity = new LogEntity({
                level: LogLevel.ERROR,
                message: `Error executing command ${interaction.commandName}`,
                context: 'DiscordService',
                error: error instanceof Error ? error : new Error(String(error)),
                metadata: {
                    commandName: interaction.commandName,
                    userId: interaction.user.id,
                },
            });

            LogRepository.save(logEntity);
        }
    }

    public async getClient(): Promise<Client> {
        if (!this._initialized) {
            await this.login();
        }
        return this._client;
    }

    /**
     * @throws {DiscordServiceError}
     */
    public async refreshCommands(): Promise<void> {
        this._commands.clear();

        const commandsPath = path.resolve(__dirname, './Command');
        const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith('.ts') || file.endsWith('.js'));

        for (const file of commandFiles) {
            const filePath = path.join(commandsPath, file);
            const commandModule = await import(filePath);
            const command: DiscordCommandInterface = commandModule.default ?? Object.values(commandModule)[0];

            if (command && command.data && typeof command.execute === 'function') {
                this._commands.set(command.data.name, command);
            } else {
                throw new DiscordServiceError(`Invalid command structure in ${filePath}`, DiscordServiceErrorCode.BAD_COMMAND);
            }
        }

        const client = await this.getClient();

        if (!client.application) {
            throw new DiscordServiceError('Discord application is not available.', DiscordServiceErrorCode.APPLICATION_NOT_FOUND);
        }

        const guild = client.guilds.cache.get(process.env.DISCORD_SERVICE_GUILD_ID || '');
        if (!guild) {
            throw new DiscordServiceError('Guild not found.', DiscordServiceErrorCode.GUILD_NOT_FOUND);
        }

        await guild.commands.set(this._commands.map((cmd) => cmd.data));
    }
}

export default new DiscordService();
