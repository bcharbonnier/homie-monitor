import { Dispatcher } from "flux";

const instance = new Dispatcher();
export default instance;

export function dispatch(...args) {
    return instance.dispatch.call(instance, ...args);
}