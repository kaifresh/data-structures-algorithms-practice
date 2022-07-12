import { assert } from 'chai';
import {URLRouter} from "./URLRouter";

describe('URLRouter', function () {
    let router: URLRouter;
    const path = '/images';
    const method = 'GET';
    const imageGetter = () => 'Images!';
    beforeEach(() => {
        // arrange
        router = new URLRouter();
    });
    it('should set a handler for a Path', async function () {
        // act
        router.setHandlerForPath(path, method, imageGetter);

        // assert
        const numberOfAssignedRoutes = router.getRoutesCount();
        assert.equal(numberOfAssignedRoutes, 1);
    });
    it('should update a handler for a path', async function () {
        // arrange
        router.setHandlerForPath(path, method, imageGetter);

        // act
        const betterImageGetter = () => 'Better images here!';
        router.setHandlerForPath(path, method, betterImageGetter);

        const handler = router.getHandlerForURL(path, method);
        const handlerResponse = handler();

        // assert
        assert.equal(handlerResponse, betterImageGetter());
    });
    it('should set and get a handler for a path', async function () {
        // act
        router.setHandlerForPath(path, method, imageGetter);
        const handler = router.getHandlerForURL(path, method);
        const handlerResponse = handler();

        // assert
        assert.equal(handlerResponse, imageGetter());
    });
    it('should delete a previously set route', async function () {
        // act
        router.setHandlerForPath(path, method, imageGetter);
        const handler = router.getHandlerForURL(path, method);
        const handlerResponse = handler();

        router.deleteRoute(path, method);
        const handlerPostDelete = router.getHandlerForURL(path, method);
        const handlerResponsePostDelete = handlerPostDelete();

        // assert
        assert.equal(handlerResponse, imageGetter());
        assert.equal(handlerResponsePostDelete, '404');
    });
});