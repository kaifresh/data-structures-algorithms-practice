import {assert} from 'chai';
import {URLRouter} from "./URLRouter";

describe('URLRouter', function () {
    it('should set a handler for a URL', async function () {
        const router = new URLRouter();
        router.setHandlerForRoute('/images', 'get', () => 'Here are some images')

        assert.equal(router.getRoutesCount(), 1);
    });
    it('should set two handlers for the same URL', async function () {
        const router = new URLRouter();
        router.setHandlerForRoute('/images', 'get', () => 'Here are some images')
        router.setHandlerForRoute('/images', 'get', () => 'Here are some images')

        assert.equal(router.getRoutesCount(), 1);
    });
    it('should get a route we have previously set', async function () {
        const router = new URLRouter();
        const handler = () => 'Here are some images';
        router.setHandlerForRoute('/images', 'get', handler)

        const recoveredHandler = router.getHandlerForRoute('/images', 'get');

        assert.equal(handler(), recoveredHandler());
    });
    it('should get a 404 response, if the HTTP verb is different', async function () {
        const router = new URLRouter();
        const handler = () => 'Here are some images';
        router.setHandlerForRoute('/images', 'get', handler)

        const recoveredHandler = router.getHandlerForRoute('/images', 'post');

        assert.equal(recoveredHandler(), "Not found");
    });
});