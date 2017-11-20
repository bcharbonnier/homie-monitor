import Dispatcher from "../Dispatcher";
import { MapStore } from "../libs/Flux";
import { ActionTypes } from "../Constants";

function handleFetchStart(state) {
  if (state.has("error")) {
    state = state.delete("error");
  }
  return state.set("fetching", true);
}

function handleFetchStop(state) {
  return state.set("fetching", false);
}

function handleFailed(state, { firmware, error }) {
  return state.set("error", error);
}

class FirmwareStateStore extends MapStore {
  initialize() {
    this.addAction(ActionTypes.LOAD_FIRMWARES, handleFetchStart);
    this.addAction(ActionTypes.LOAD_FIRMWARES_SUCCESS, handleFetchStop);
    this.addAction(
      ActionTypes.DELETE_FIRMWARE_FAILURE,
      ActionTypes.UPLOAD_FIRMWARE_FAILURE,
      handleFailed
    );
  }

  isFetchOnGoing() {
    return this.getState().get("fetching", true);
  }

  hasError() {
    return this.getState().has("error");
  }

  getError() {
    return this.getState().get("error");
  }
}

const instance = new FirmwareStateStore(Dispatcher);
export default instance;
