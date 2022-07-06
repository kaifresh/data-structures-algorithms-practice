
type HTTPMethods = 'get' | 'post' | 'put' | 'delete';

export class URLRouter {

    private routes: {[key: string]: () => any} = {}; // what if it was a trie
    // private routes: Trie = new Trie();

    private errorHandlers = {
        404: () => "Not found",
    }

    /**
     * @todo implement this as a trie - Unfortunately datastructures-js/trie only lets you store strings, not functions
     * @note this will overwrite an existing handler
     * @param route
     * @param httpMethod
     * @param handler
     */
    setHandlerForRoute(route: string, httpMethod: HTTPMethods, handler: () => any) {
        const key = URLRouter.generateKeyForRouteAndString(route, httpMethod);
        this.routes[key] = handler;
    }

    /**
     * Get a handler for a route & http verb
     * @param route
     * @param httpMethod
     */
    getHandlerForRoute(route: string, httpMethod: HTTPMethods) {
        const key = URLRouter.generateKeyForRouteAndString(route, httpMethod);
        const handler = this.routes[key];
        return handler || this.errorHandlers["404"];
    }

    getRoutesCount() {
        return Object.keys(this.routes).length;
    }

    private static generateKeyForRouteAndString(route: string, httpMethod: HTTPMethods) {
        return route + httpMethod;
    }
}