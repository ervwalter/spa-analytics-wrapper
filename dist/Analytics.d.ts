declare class Tracker {
    private matomoIdentifier?;
    private gaguesIdentifier?;
    private sentryDSN?;
    private isInitialized;
    private isTrackingStarted;
    private DNT;
    private userId?;
    private isMatomoUserIdSet;
    init(options: {
        gaugesIdentifier?: string;
        matomoIdentifier?: {
            hostname: string;
            siteId: string;
        };
        sentryDSN?: string;
        sentryRelease?: string;
    }): void;
    track: () => void;
    logEvent: (key: string, value: string) => void;
    setUser: (userId: string) => void;
    clearUser: () => void;
    private log;
}
export declare const analytics: Tracker;
export {};
