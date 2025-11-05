/**
 * Rate Limiter Utility
 *
 * Implements sliding window rate limiting to respect API limits
 *
 * Usage:
 * const limiter = new RateLimiter(10, 600); // 10/sec, 600/min
 * await limiter.throttle();
 * // Make API request
 */

export class RateLimiter {
  private requestTimes: number[] = [];
  private readonly maxRequestsPerSecond: number;
  private readonly maxRequestsPerMinute: number;
  private readonly safetyBufferMs: number;

  constructor(
    maxRequestsPerSecond: number = 10,
    maxRequestsPerMinute: number = 600,
    safetyBufferMs: number = 100,
  ) {
    this.maxRequestsPerSecond = maxRequestsPerSecond;
    this.maxRequestsPerMinute = maxRequestsPerMinute;
    this.safetyBufferMs = safetyBufferMs;
  }

  /**
   * Throttle requests to respect rate limits
   * Call this before each API request
   */
  async throttle(): Promise<void> {
    const now = Date.now();

    // Clean up old request times (older than 1 minute)
    this.requestTimes = this.requestTimes.filter((time) => now - time < 60000);

    // Check minute-level limit
    if (this.requestTimes.length >= this.maxRequestsPerMinute) {
      const oldestRequest = this.requestTimes[0];
      const waitTime = 60000 - (now - oldestRequest) + this.safetyBufferMs;
      console.log(
        `⏳ Minute limit reached (${this.maxRequestsPerMinute}/min). Waiting ${(waitTime / 1000).toFixed(1)}s...`,
      );
      await this.sleep(waitTime);
    }

    // Check second-level limit (last N requests)
    const recentRequests = this.requestTimes.slice(-this.maxRequestsPerSecond);
    if (recentRequests.length >= this.maxRequestsPerSecond) {
      const oldestRecent = recentRequests[0];
      const waitTime = 1000 - (now - oldestRecent) + this.safetyBufferMs;
      if (waitTime > 0) {
        await this.sleep(waitTime);
      }
    }

    // Add safety buffer between all requests
    await this.sleep(this.safetyBufferMs);

    // Record this request
    this.requestTimes.push(Date.now());
  }

  /**
   * Get current request rate statistics
   */
  getStats(): {
    requestsLastSecond: number;
    requestsLastMinute: number;
    utilizationPercent: number;
  } {
    const now = Date.now();
    const requestsLastSecond = this.requestTimes.filter((time) => now - time < 1000).length;
    const requestsLastMinute = this.requestTimes.filter((time) => now - time < 60000).length;

    return {
      requestsLastSecond,
      requestsLastMinute,
      utilizationPercent: (requestsLastMinute / this.maxRequestsPerMinute) * 100,
    };
  }

  /**
   * Sleep for specified milliseconds
   */
  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Reset rate limiter (useful for testing)
   */
  reset(): void {
    this.requestTimes = [];
  }
}
