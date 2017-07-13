import Dispatcher from "../Dispatcher";
import { MapStore } from "../libs/Flux";
import { ActionTypes } from "../Constants";

function handleFetchStart(state) {
    return state.set("fetching", true);
}

function handleFetchStop(state) {
    return state.set("fetching", false);
}

class DeviceStateStore extends MapStore {
    initialize() {
        this.addAction(ActionTypes.LOAD_DEVICES, handleFetchStart);
        this.addAction(ActionTypes.LOAD_DEVICES_SUCCESS, handleFetchStop);
    }

    isFetchOnGoing() {
        return this.getState().get("fetching", true);
    }
}

const instance = new DeviceStateStore(Dispatcher);
export default instance;