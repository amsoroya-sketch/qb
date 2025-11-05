import { OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
export declare class CacheService implements OnModuleInit, OnModuleDestroy {
    private config;
    private client;
    constructor(config: ConfigService);
    onModuleInit(): void;
    onModuleDestroy(): void;
    get(key: string): Promise<string | null>;
    set(key: string, value: string, ttl?: number): Promise<void>;
    getJson<T>(key: string): Promise<T | null>;
    setJson<T>(key: string, value: T, ttl?: number): Promise<void>;
    del(key: string): Promise<void>;
    delPattern(pattern: string): Promise<void>;
    exists(key: string): Promise<boolean>;
}
