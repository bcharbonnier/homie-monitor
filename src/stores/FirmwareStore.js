import Dispatcher from "../Dispatcher";
import { MapStore } from "../libs/Flux";
import { ActionTypes } from "../Constants";

function handleFirmwareListReceived(state, { firmwares }) {
  if (!firmwares) {
    return state;
  }
  return state.withMutations(map => {
    for (const firmwareName in firmwares) {
      const firmware = firmwares[firmwareName];
      map.set(firmwareName, firmware);
    }
    return map;
  });
}

function handleFirmwareDeleted(state, { firmware }) {
  return state.delete(firmware.filename);
}

class FirmwareStore extends MapStore {
  initialize() {
    this.addAction(
      ActionTypes.LOAD_FIRMWARES_SUCCESS,
      ActionTypes.UPLOAD_FIRMWARE_SUCCESS,
      handleFirmwareListReceived
    );

    this.addAction(ActionTypes.DELETE_FIRMWARE_SUCCESS, handleFirmwareDeleted);
  }

  getFirmwares() {
    return this.getState().toSet();
  }

  getFirmware(firmwareName) {
    return this.getState()
      .filter(f => f.name === firmwareName)
      .first();
  }
}

const instance = new FirmwareStore(Dispatcher);
export default instance;
