import { Client, DiscordjsError, DiscordjsErrorCodes, GatewayIntentBits, Interaction } from 'discord.js';
import { DiscordServiceError, DiscordServiceErrorCode } from '../../Error/DiscordServiceError';
import { DiscordServiceInterface } from './Interface/DiscordServiceInterface';
import { commands, refreshCommands } from './Command';

class DiscordService implements DiscordServiceInterface {
    private readonly _client: Client;
    private _initialized = false;

    constructor() {
        this._client = new Client({
            intents: [GatewayIntentBits.Guilds],
        });
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

        const command = commands.get(interaction.commandName);
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
            console.error(`Error executing command ${interaction.commandName}:`, error);
            if (interaction.replied || interaction.deferred) {
                await interaction.followUp({ content: 'There was an error executing this command.', ephemeral: true });
            } else {
                await interaction.reply({ content: 'There was an error executing this command.', ephemeral: true });
            }
        }
    }

    async getClient(): Promise<Client> {
        if (!this._initialized) {
            await this.login();
            return this._client;
        }
        return this._client;
    }

    /**
     * @throws {DiscordServiceError}
     */
    public async refreshCommands(): Promise<void> {
        const client = await this.getClient();
        await refreshCommands();

        if (client.application === null) {
            throw new DiscordServiceError('Discord application is not available.', DiscordServiceErrorCode.APPLICATION_NOT_FOUND);
        }

        const guild = client.guilds.cache.get(process.env.DISCORD_SERVICE_GUILD_ID || '');
        if (guild === undefined) {
            throw new DiscordServiceError('Guild not found.', DiscordServiceErrorCode.GUILD_NOT_FOUND);
        }
        await guild.commands.set(commands.map((cmd) => cmd.data));
    }
}

export default new DiscordService();
