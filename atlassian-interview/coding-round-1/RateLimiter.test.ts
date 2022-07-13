import { assert } from 'chai';
import {RateLimiter} from "./RateLimiter";

const sleep = (sleepMsec: number) => new Promise(
    resolve => setTimeout(resolve, sleepMsec)
);

describe('Rate Limiter', function () {
    it('should allow the processing of a single request', async function () {
        const maxRequests = 1;
        const windowMsec = 1000 * 10;
        const rateLimiter = new RateLimiter(maxRequests, windowMsec);

        const canProcess = rateLimiter.canProcessRequest();

        assert.isTrue(canProcess);
    });
    it('should prevent the processing of more than one request', async function () {
        const maxRequests = 1;
        const windowMsec = 1000 * 10;
        const rateLimiter = new RateLimiter(maxRequests, windowMsec);

        rateLimiter.canProcessRequest();
        const canProcess = rateLimiter.canProcessRequest();

        assert.isFalse(canProcess);
    });
    it('should allow the processing of a second request after the window has passed', async function () {
        const maxRequests = 1;
        const windowMsec = 1000 * 2;
        const rateLimiter = new RateLimiter(maxRequests, windowMsec);

        rateLimiter.canProcessRequest();
        await sleep(windowMsec);

        const shouldBeTrue = rateLimiter.canProcessRequest();
        assert.isTrue(shouldBeTrue);
    });
});