export class RateLimiter {

    private maxRequests: number;
    private windowMsec: number;

    private requestVolume: number;
    private lastRequestTimeUnix: number;


    constructor(maxRequests: number, windowMsec: number) {
        this.windowMsec = windowMsec;
        this.maxRequests = maxRequests;

        this.requestVolume = 0;
        this.lastRequestTimeUnix = this.getRequestTime();
    }

    canProcessRequest () : boolean {
        // get the time of the request
        const requestTimeUnix = this.getRequestTime();

        // update the existing rate limiting quantity
        this.updateExistingRateLimit(requestTimeUnix);

        // increment the rate limiting quantity with the new request
        this.incrementRateLimit()

        // check if we can process
        const underRateLimit = this.isUnderRateLimit();

        // store last request time
        this.lastRequestTimeUnix = requestTimeUnix;

        return underRateLimit;
    }

    private getRequestTime() {
        return (new Date()).valueOf();
    }

    private updateExistingRateLimit(requestTimeUnix: number) {
        const deltaMsec = requestTimeUnix - this.lastRequestTimeUnix;

        const deltaScaled = Math.min(1, deltaMsec / this.windowMsec);

        const deltaInverted = 1 - deltaScaled;

        this.requestVolume *= deltaInverted;
    }

    private incrementRateLimit () {
        this.requestVolume += 1;
    }

    private isUnderRateLimit () {
        return this.requestVolume <= this.maxRequests + this.burstRequestIncrement;
    }

}