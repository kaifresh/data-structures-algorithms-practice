import { assert } from 'chai';
import {RateLimiterAttempt2} from "./RateLimiterAttempt2";

const sleep = (sleepTimeMsec: number) => new Promise(resolve => setTimeout(resolve, sleepTimeMsec));

describe('RateLimiterAttempt2', function () {
    it('should process a single request successfully', async function () {
        const rateLimiter = new RateLimiterAttempt2(2, 1000);
        const result = rateLimiter.canProcessRequest();
        assert.isTrue(result);
    });
    it('should process two requests successfully', async function () {
        const rateLimiter = new RateLimiterAttempt2(2, 1000);
        rateLimiter.canProcessRequest();
        const result = rateLimiter.canProcessRequest();
        assert.isTrue(result);
    });
    it('should not process a third request if it is above the limiting threshold', async function () {
        const rateLimiter = new RateLimiterAttempt2(2, 1000);
        rateLimiter.canProcessRequest();
        rateLimiter.canProcessRequest();
        const result = rateLimiter.canProcessRequest();
        assert.isFalse(result);
    });
    it('should successfully process a third request if we give the rate limiter time to recover', async function () {
        const rateLimiter = new RateLimiterAttempt2(2, 1000);
        rateLimiter.canProcessRequest();
        rateLimiter.canProcessRequest();

        await sleep(1000);
        const result = rateLimiter.canProcessRequest();
        assert.isTrue(result);
    });
    it('should not process a third request if we don\'t give the rate limiter sufficient time to recover', async function () {
        const rateLimiter = new RateLimiterAttempt2(2, 1000);
        rateLimiter.canProcessRequest();
        rateLimiter.canProcessRequest();

        await sleep(400);
        const result = rateLimiter.canProcessRequest();
        assert.isFalse(result);
    });
});