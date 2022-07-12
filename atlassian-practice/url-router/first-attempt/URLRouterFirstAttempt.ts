
type HTTPMethods = 'get' | 'post' | 'put' | 'delete';


/**
 * Additions
 * - Make this a singleton
 * - Use a trie
 */
export class URLRouterFirstAttempt {

    private static routes: {[key: string]: () => any} = {}; // what if it was a trie
    // private routes: Trie = new Trie();

    private static errorHandlers = {
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
        const key = URLRouterFirstAttempt.generateKeyForRouteAndString(route, httpMethod);
        URLRouterFirstAttempt.routes[key] = handler;
    }

    /**
     * Get a handler for a route & http verb
     * @param route
     * @param httpMethod
     */
    getHandlerForRoute(route: string, httpMethod: HTTPMethods) {
        const key = URLRouterFirstAttempt.generateKeyForRouteAndString(route, httpMethod);
        const handler = URLRouterFirstAttempt.routes[key];
        return handler || URLRouterFirstAttempt.errorHandlers["404"];
    }

    getRoutesCount() {
        return Object.keys(URLRouterFirstAttempt.routes).length;
    }

    private static generateKeyForRouteAndString(route: string, httpMethod: HTTPMethods) {
        return route + httpMethod;
    }
}