declare class Tracker {
    private matomoIdentifier?;
    private gaguesIdentifier?;
    private sentryDSN?;
    private isInitialized;
    private isMatomoInitialized;
    private DNT;
    init(options: {
        gaugesIdentifier?: string;
        matomoIdentifier?: {
            hostname: string;
            siteId: string;
            script?: string;
            tracker?: string;
        };
        sentryDSN?: string;
        sentryRelease?: string;
        ignoreDNT?: boolean;
    }): void;
    track: () => void;
    logEvent: (key: string, value: string) => void;
    setUser: (userId: string) => void;
    clearUser: () => void;
    setCustom: <T>(values: T, scope?: string) => void;
    private log;
}
export declare const analytics: Tracker;
export {};
