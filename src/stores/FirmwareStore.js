import Dispatcher from "../Dispatcher";
import { MapStore } from "../libs/Flux";
import { ActionTypes } from "../Constants";

function handleFirmwareListReceived(state, { firmwares }) {
    if (!firmwares) {
        return state;
    }
    return state.withMutations(map => {
        for(const firmwareName in firmwares) {
            const firmware = firmwares[firmwareName];
            map.set(firmwareName, firmware);
        }
        return map;
    })
}

class FirmwareStore extends MapStore {
    initialize() {
        this.addAction(ActionTypes.LOAD_FIRMWARES_SUCCESS, handleFirmwareListReceived);
    }

    getFirmwares() {
        return this.getState().toSet();
    }
}

const instance = new FirmwareStore(Dispatcher);
export default instance;