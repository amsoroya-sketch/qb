export declare class RateLimiter {
    private requestTimes;
    private readonly maxRequestsPerSecond;
    private readonly maxRequestsPerMinute;
    private readonly safetyBufferMs;
    constructor(maxRequestsPerSecond?: number, maxRequestsPerMinute?: number, safetyBufferMs?: number);
    throttle(): Promise<void>;
    getStats(): {
        requestsLastSecond: number;
        requestsLastMinute: number;
        utilizationPercent: number;
    };
    private sleep;
    reset(): void;
}
