import {RateLimiter} from "./RateLimiter";

export class CustomerRateLimiter {

    perCustomerRateLimiters: {[key: string]: RateLimiter};

    private maxRequests: number;
    private windowMsec: number;

    constructor(maxRequests = 100, windowMsec = 1000) {
        this.perCustomerRateLimiters = {};
        this.maxRequests = maxRequests;
        this.windowMsec = windowMsec;
    }

    canProcessRequestForCustomer(customerId: string): boolean {
        if (!this.perCustomerRateLimiters[customerId]) {
            this.perCustomerRateLimiters[customerId] = new RateLimiter(
                this.maxRequests, this.windowMsec
            );
        }

        return this.perCustomerRateLimiters[customerId].canProcessRequest();
    }
}