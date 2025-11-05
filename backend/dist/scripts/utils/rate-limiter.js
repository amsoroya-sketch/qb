"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RateLimiter = void 0;
class RateLimiter {
    constructor(maxRequestsPerSecond = 10, maxRequestsPerMinute = 600, safetyBufferMs = 100) {
        this.requestTimes = [];
        this.maxRequestsPerSecond = maxRequestsPerSecond;
        this.maxRequestsPerMinute = maxRequestsPerMinute;
        this.safetyBufferMs = safetyBufferMs;
    }
    async throttle() {
        const now = Date.now();
        this.requestTimes = this.requestTimes.filter((time) => now - time < 60000);
        if (this.requestTimes.length >= this.maxRequestsPerMinute) {
            const oldestRequest = this.requestTimes[0];
            const waitTime = 60000 - (now - oldestRequest) + this.safetyBufferMs;
            console.log(`⏳ Minute limit reached (${this.maxRequestsPerMinute}/min). Waiting ${(waitTime / 1000).toFixed(1)}s...`);
            await this.sleep(waitTime);
        }
        const recentRequests = this.requestTimes.slice(-this.maxRequestsPerSecond);
        if (recentRequests.length >= this.maxRequestsPerSecond) {
            const oldestRecent = recentRequests[0];
            const waitTime = 1000 - (now - oldestRecent) + this.safetyBufferMs;
            if (waitTime > 0) {
                await this.sleep(waitTime);
            }
        }
        await this.sleep(this.safetyBufferMs);
        this.requestTimes.push(Date.now());
    }
    getStats() {
        const now = Date.now();
        const requestsLastSecond = this.requestTimes.filter((time) => now - time < 1000).length;
        const requestsLastMinute = this.requestTimes.filter((time) => now - time < 60000).length;
        return {
            requestsLastSecond,
            requestsLastMinute,
            utilizationPercent: (requestsLastMinute / this.maxRequestsPerMinute) * 100,
        };
    }
    sleep(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
    reset() {
        this.requestTimes = [];
    }
}
exports.RateLimiter = RateLimiter;
//# sourceMappingURL=rate-limiter.js.map