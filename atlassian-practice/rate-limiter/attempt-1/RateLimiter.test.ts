import {assert} from 'chai';
import {RateLimiter} from "./RateLimiter";

// TODO: put this in its own file
const sleep = function (msec: number) {
    return new Promise((resolve) => setTimeout(resolve, msec));
}

describe('RateLimiter', function () {
    describe('input validation', function () {
        it('should throw an error if we provide a value for maxRequestsInPeriod less than one', async function () {
            assert.throw(() => new RateLimiter(-1, 10 * 1000))
        });
        it('should throw an error if we provide a value for maxRequestsInPeriod that is not an integer', async function () {
            assert.throw(() => new RateLimiter(1.5, 10 * 1000))
        });
        it('should throw an error if we provide a value for periodMsec less than one', async function () {
            assert.throw(() => new RateLimiter(1, -10 * 1000))
        });
        it('should throw an error if we provide a value for periodMsec that is not an integer', async function () {
            assert.throw(() => new RateLimiter(1.5, 1.1))
        });
    });
    describe('rate limiting', function () {
        it('should allow a single request', async function () {
            const rateLimiter = new RateLimiter(1, 10 * 1000);

            const allowed = rateLimiter.request();

            assert.isTrue(allowed);
        });
        it('should not allow more requests than the limit within the period', async function () {
            const rateLimiter = new RateLimiter(1, 10 * 1000);

            const firstRequest = rateLimiter.request();
            const secondRequest = rateLimiter.request();

            assert.isTrue(firstRequest);
            assert.isFalse(secondRequest);
        });
        it('should allow requests again after waiting for the period to elapse', async function () {
            const rateLimiter = new RateLimiter(1, 5 * 1000);

            const firstRequest = rateLimiter.request();
            await sleep(5 * 1000);
            const secondRequest = rateLimiter.request();

            assert.isTrue(firstRequest);
            assert.isTrue(secondRequest);
        });
        it('should not allow new requests if they go over the limit, even after a big break', async function () {
            const rateLimiter = new RateLimiter(1, 5 * 1000);
            const firstRequest = rateLimiter.request();
            await sleep(5 * 1000);
            const secondRequest = rateLimiter.request();
            const thirdRequest = rateLimiter.request();

            assert.isTrue(firstRequest);
            assert.isTrue(secondRequest);
            assert.isFalse(thirdRequest);
        });
    });
});