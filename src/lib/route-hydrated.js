// Resolves once the router has rendered its first route, i.e. the prerendered
// page has been hydrated (Preact doesn't update attributes while hydrating)
/** @type {() => void} */
let resolve;
export const routeHydrated = new Promise((r) => (resolve = r));
export const markRouteHydrated = () => resolve();
