
interface SyncManager {
    register(tag: string): Promise<void>;
    getTags(): Promise<string[]>;
}

interface ServiceWorkerRegistration {
    periodicSync?: {
        register(tag: string, options: { minInterval: number }): Promise<void>;
        getTags(): Promise<string[]>;
        unregister(tag: string): Promise<void>;
    };
}