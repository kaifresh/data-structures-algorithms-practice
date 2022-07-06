export class RateLimiter {

    private lastUpdatedMsec: number = 0;
    private requestCount: number = 0;

    private readonly maxRequestsInPeriod: number = 100;
    private readonly periodMsec: number = 10 * 1000;

    constructor(maxRequestsInPeriod: number, periodMsec: number) {
        // TODO: validate inputs
        if (maxRequestsInPeriod < 1 || !Number.isInteger(maxRequestsInPeriod)) {
            throw new Error('Please provide a value for `maxRequestsInPeriod` that is an integer greater than 1');
        }
        if (periodMsec < 1 || !Number.isInteger(periodMsec)) {
            throw new Error('Please provide a value for `periodMsec` that is an integer greater than 1');
        }

        this.maxRequestsInPeriod = maxRequestsInPeriod;
        this.periodMsec = periodMsec;
    }

    request() {
        const nowUnix = (new Date()).valueOf();

        this.rescaleExistingRequestCount(nowUnix);
        this.incrementRequestCount();

        this.updateLastUpdatedMsec(nowUnix);

        return this.checkRequestCountAgainstLimit();
    }

    private updateLastUpdatedMsec(nowUnix: number) {
        this.lastUpdatedMsec = nowUnix;
    }

    private checkRequestCountAgainstLimit(): boolean {
        return this.requestCount <= this.maxRequestsInPeriod;
    }

    private rescaleExistingRequestCount(nowUnix: number) {
        const delta = nowUnix - this.lastUpdatedMsec;

        const rawScaleFactor = delta/this.periodMsec;

        const rectifiedScaleFactor = Math.min(Math.abs(rawScaleFactor), 1);

        const invertedScaleFactor = 1 - rectifiedScaleFactor;

        this.requestCount = this.requestCount * invertedScaleFactor;
    }

    private incrementRequestCount() {
        this.requestCount += 1;
    }

}