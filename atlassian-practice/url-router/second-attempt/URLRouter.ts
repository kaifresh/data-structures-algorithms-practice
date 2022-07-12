import {TrieMap} from "mnemonist";
type HTTPMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

/**
 * Asked to design router class which takes a route as string and does some action with mapping the correct operation.
 *  design a router for setting and getting urls
 */
export class URLRouter {

    private errorHandlers = {
        '404': () => '404',
    }

    private routes: TrieMap<string, () => any> = new TrieMap<string, () => any>();

    /**
     * Set a handler for a URL
     * @param path
     * @param method
     * @param handler
     */
    setHandlerForPath(path: string, method: HTTPMethod, handler: () => any) {
        const key = URLRouter.createURLKey(path, method);
        this.routes.set(key, handler);
    }

    getHandlerForURL(path: string, method: HTTPMethod) {
        const key = URLRouter.createURLKey(path, method);
        const handler = this.routes.get(key);

        return handler || this.errorHandlers["404"];
    }

    deleteRoute(path: string, method: HTTPMethod) {
        const key = URLRouter.createURLKey(path, method);
        this.routes.delete(key);
    }

    /**
     * Retrieve the number of routes on this router
     */
    getRoutesCount() {
        return this.routes.size;
    }

    /**
     *
     * @param url
     * @param method
     * @private
     */
    private static createURLKey(url: string, method: HTTPMethod) {
        return method + url;
    }
}