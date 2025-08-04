import { SlashCommandBuilder, CommandInteraction, EmbedBuilder } from 'discord.js';
import { DiscordCommandInterface } from '../Interface/DiscordCommandInterface';
import FiveMService from '../../FiveMService';
import { LogEntity, LogLevel } from '../../../Entity/LogEntity';
import LogRepository from '../../../Repository/LogRepository';

const infoCommand: DiscordCommandInterface = {
    data: new SlashCommandBuilder().setName('info').setDescription('Displays useful info about the FiveM server.'),

    async execute(interaction: CommandInteraction) {
        await interaction.deferReply();

        try {
            const serverInfo = await FiveMService.getServerInfo();

            const { server, vars, version, resources } = serverInfo;

            const embed = new EmbedBuilder()
                .setTitle(vars.sv_projectName || 'FiveM Server')
                .setDescription(vars.sv_projectDesc || 'No description available.')
                .setColor(0x00ae86)
                .addFields(
                    { name: 'Game Type', value: vars.gametype || 'Unknown', inline: true },
                    { name: 'Max Clients', value: vars.sv_maxClients || 'Unknown', inline: true },
                    { name: 'Locale', value: vars.locale || 'Unknown', inline: true },
                    { name: 'Resources Loaded', value: resources.length.toString(), inline: true },
                    { name: 'txAdmin Version', value: vars['txAdmin-version'] || 'N/A', inline: true },
                    { name: 'Server Version', value: version.toString(), inline: true }
                )
                .setFooter({ text: server || 'FiveM Server Info' });

            await interaction.editReply({ embeds: [embed] });
        } catch (error: unknown) {
            const logEntity = new LogEntity({
                level: LogLevel.ERROR,
                message: 'Failed to fetch server info',
                context: 'DiscordService/Command/info',
                error: error instanceof Error ? error : new Error(String(error)),
                metadata: { interactionId: interaction.id, userId: interaction.user.id },
            });

            LogRepository.save(logEntity);

            await interaction.editReply('❌ Failed to fetch server info. The server might be offline or misconfigured.');
        }
    },
};

export default infoCommand;
