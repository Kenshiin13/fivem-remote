import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../cfg/.env') });
import DiscordService from './Service/DiscordService';
import FiveMService from './Service/FiveMService';

DiscordService.getClient().then((client) => {
    console.log(`Discord Service running on user: ${client.user?.tag}`);
});

FiveMService.getServerInfo().then((serverInfo) => {
    console.log(`FiveM Service running on server: ${serverInfo.vars.sv_projectName}`);
});
