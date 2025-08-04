export interface FiveMServerInfoDTO {
    enhancedHostSupport: boolean;
    requestSteamTicket: string;
    resources: string[];
    server: string;
    vars: {
        banner_connecting: string;
        banner_detail: string;
        gamename: string;
        gametype: string;
        locale: string;
        onesync_enabled: string;
        sv_disableClientReplays: string;
        sv_enforceGameBuild: string;
        sv_enhancedHostSupport: string;
        sv_lan: string;
        sv_licenseKeyToken: string;
        sv_maxClients: string;
        sv_poolSizesIncrease: string;
        sv_projectDesc: string;
        sv_projectName: string;
        sv_pureLevel: string;
        sv_replaceExeToSwitchBuilds: string;
        sv_scriptHookAllowed: string;
        tags: string;
        'txAdmin-version': string;
    };
    version: number;
}
