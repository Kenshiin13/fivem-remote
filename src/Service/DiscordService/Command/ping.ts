import { SlashCommandBuilder, CommandInteraction } from 'discord.js';
import { DiscordCommandInterface } from '../Interface/DiscordCommandInterface';

const pingCommand: DiscordCommandInterface = {
    data: new SlashCommandBuilder().setName('ping').setDescription('Replies with Pong!'),

    async execute(interaction: CommandInteraction) {
        await interaction.reply('Pong!');
    },
};

export default pingCommand;
