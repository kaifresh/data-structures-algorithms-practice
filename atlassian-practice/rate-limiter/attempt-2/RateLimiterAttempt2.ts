export class RateLimiterAttempt2 {

    private readonly maxRequests: number;
    private readonly windowMsec: number;

    private requestVolume: number;
    private lastRequestTimeUnix: number;

    /**
     * Construct a new rate limiter specifying the rate limit
     * @param maxRequests
     * @param windowMsec
     */
    constructor(maxRequests: number, windowMsec: number) {
        if (maxRequests < 1 || !Number.isInteger(maxRequests)) {
            throw new Error('Please supply a value for `maxRequests` which is an integer greater than or equal to 1.');
        }
        if (windowMsec < 1 || !Number.isInteger(windowMsec)) {
            throw new Error('Please supply a value for `windowMsec` which is an integer greater than or equal to 1.');
        }

        this.maxRequests = maxRequests;
        this.windowMsec = windowMsec;
        this.requestVolume = 0;
        this.lastRequestTimeUnix = RateLimiterAttempt2.getRequestTime();
    }

    /**
     * Determine whether a request can be processed
     * @note space complexity is O(1) - because it doesn't use any collections which scale with the input.
     * Its all just single variables.
     */
    canProcessRequest(): boolean {
        const requestTime = RateLimiterAttempt2.getRequestTime();

        // update the existing request volume
        this.updateRequestVolume(requestTime);

        // increment the request volume to reflect the new request
        this.incrementRequestVolume();

        // determine whether we can process this new request
        return this.isRequestVolumeWithinLimit();
    }

    private static getRequestTime() {
        return (new Date()).valueOf();
    }

    private updateRequestVolume(requestTimeUnix: number) {
        const deltaMsec = requestTimeUnix - this.lastRequestTimeUnix;
        const scaledDelta = deltaMsec / this.windowMsec;
        const deltaRectified = Math.min(1, scaledDelta);

        this.requestVolume *= (1 - deltaRectified);
    }

    private incrementRequestVolume() {
        this.requestVolume += 1;
    }

    private isRequestVolumeWithinLimit(): boolean {
        return this.requestVolume <= this.maxRequests;
    }
}