import { Client } from 'discord.js';

export interface DiscordServiceInterface {
    getClient(): Promise<Client>;
    refreshCommands(): Promise<void>;
}
