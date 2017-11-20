import immutable from "immutable";

import Dispatcher from "../Dispatcher";
import { MapStore } from "../libs/Flux";
import { ActionTypes } from "../Constants";
import { uuid } from "../utils/Crypto";

function handleMessageReceived(state, { topic, message, error, deleted }) {
  const messages = state.get("messages") || immutable.OrderedSet();
  const log = {
    id: uuid(),
    message,
    topic,
    date: new Date(),
    deleted
  };
  if (error) {
    log.error = error;
  }
  return state.set("messages", messages.add(log));
}

class MessageStore extends MapStore {
  initialize() {
    this.addAction(ActionTypes.MESSAGE_RECEIVED, handleMessageReceived);
  }

  getMessages() {
    return this.getState().get("messages", immutable.Set());
  }
}

const instance = new MessageStore(Dispatcher);
export default instance;
