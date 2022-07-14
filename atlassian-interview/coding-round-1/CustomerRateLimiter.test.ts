import { assert } from 'chai';
import {CustomerRateLimiter} from "./CustomerRateLimiter";

describe('CustomerRateLimiter', function () {
    it('should process the request of a single customer', async function () {
        const customerRateLimiter = new CustomerRateLimiter(1, 1000);
        const customerName = 'kai';

        const canProcessRequest = customerRateLimiter.canProcessRequestForCustomer(customerName);

        assert.isTrue(canProcessRequest);
    });
    it('should block requests on a per customer basis', async function () {
        // arrange
        const customerRateLimiter = new CustomerRateLimiter(1, 1000);
        const customerOne = 'kai';
        const customerTwo = 'aidan';

        // act
        customerRateLimiter.canProcessRequestForCustomer(customerOne);
        const deniedSecondRequest = customerRateLimiter.canProcessRequestForCustomer(customerOne);
        const allowedFirstRequest = customerRateLimiter.canProcessRequestForCustomer(customerTwo);

        // assert
        assert.isTrue(allowedFirstRequest);
        assert.isFalse(deniedSecondRequest);
    });
});