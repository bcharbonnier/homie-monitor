import mqtt from "mqtt";
import immutable from "immutable";

import Dispatcher, { dispatch } from "../Dispatcher";
import { MapStore, withNoMutations } from "../libs/Flux";

import { ActionTypes } from "../Constants";

import * as MessageAction from "../actions/MessageAction";
import * as DeviceAction from "../actions/DeviceAction";

const CLIENT_ID = `homie-sentinel-ui-${Math.random().toString(16).substr(2, 8)}`;

// const client = mqtt.connect("ws://192.168.0.66:9001", {
//     clientId: CLIENT_ID
// });
const client = mqtt.connect("ws://localhost:9001", {
    clientId: CLIENT_ID
});

client.on("connect", () => {
    dispatch({
        type: ActionTypes.CONNECTION_OPEN
    })
});

client.on("close", () => {
    dispatch({
        type: ActionTypes.CONNECTION_LOST
    })
});

client.on("reconnect", () => {
    dispatch({
        type: ActionTypes.CONNECTION_RECONNECT
    });
});

client.on("message", (topic, message) => {
    MessageAction.receiveMessage(topic, message);
    const [PREFIX, deviceId, ...rest] = topic.split("/"); // eslint-disable-line no-unused-vars
    if (!deviceId.startsWith("$")) {
        DeviceAction.receiveMessage(deviceId, rest.join("/"), message);
    }
})

function handleConnectionOpen(state) {
    client.subscribe("homie/#");
    return state.withMutations(map => {
        map.set("connected", true);
        map.set("connecting", false);
        return map;
    });
}

function handleConnectionLost(state) {
    return state.set("connected", false);
}

function handleReconnect(state) {
    return state.set("connecting", true);
}

function handleSendMessage({topic, message, options}) {
    options = options || { retain: false }
    client.publish(topic, message, options);
}

class ConnectionStore extends MapStore {
    initialize() {
        this.addAction(ActionTypes.CONNECTION_OPEN, handleConnectionOpen);
        this.addAction(ActionTypes.CONNECTION_LOST, handleConnectionLost);
        this.addAction(ActionTypes.CONNECTION_RECONNECT, handleReconnect);
        this.addAction(ActionTypes.SEND_MESSAGE, withNoMutations(handleSendMessage));
    }

    getInitialState() {
        return immutable.fromJS({
            connected: false,
            connecting: true
        });
    }

    isConnected() {
        return this.getState().get("connected");
    }

    isConnecting() {
        return this.getState().get("connecting");
    }
}

const instance = new ConnectionStore(Dispatcher);
export default instance;