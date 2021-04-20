// env-model.ts
export interface Host {
    protocol: string;
    hostname: string;
    port: number | string;
}

export interface EnvConfig {
    environment: string;
    api: Host;
}