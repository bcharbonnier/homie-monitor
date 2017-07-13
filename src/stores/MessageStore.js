import immutable from "immutable";

import Dispatcher from "../Dispatcher";
import { MapStore } from "../libs/Flux";
import { ActionTypes } from "../Constants";
import { uuid } from "../utils/Crypto";

function handleMessageReceived(state, { topic, message }) {
    const messages = state.get("messages") || immutable.OrderedSet();    
    return state.set("messages", messages.add({
        id: uuid(),
        message,
        topic,
        date: new Date()
    }));
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