import Immutable from "immutable";

import Dispatcher from "../Dispatcher";
import { MapStore } from "../libs/Flux";
import { ActionTypes } from "../Constants";

function handleAddNotification(state, { notification }) {
  return state.add(notification);
}

function handleRemoveNotification(state, { notification }) {
  if (state.has(notification)) {
    return state.remove(notification);
  }
  return state;
}

class NotificationStore extends MapStore {
  initialize() {
    this.addAction(ActionTypes.NOTIFICATION_ADD, handleAddNotification);
    this.addAction(ActionTypes.NOTIFICATION_REMOVE, handleRemoveNotification);
  }

  getInitialState() {
    return Immutable.OrderedSet();
  }

  getAll() {
    return this.getState();
  }
}

const instance = new NotificationStore(Dispatcher);
export default instance;
