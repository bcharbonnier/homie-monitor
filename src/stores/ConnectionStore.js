import mqtt from "mqtt";
import immutable from "immutable";

import Dispatcher, { dispatch } from "../Dispatcher";
import { MapStore, withNoMutations } from "../libs/Flux";

import { ActionTypes } from "../Constants";

import * as MessageAction from "../actions/MessageAction";
import * as DeviceAction from "../actions/DeviceAction";

import config from "../config.json";

const CLIENT_ID = `homie-sentinel-ui-${Math.random()
  .toString(16)
  .substr(2, 8)}`;

const client = mqtt.connect(
  `ws://${config.mqtt.mqtt_websocket_host}:${config.mqtt.mqtt_websocket_port}`,
  {
    clientId: CLIENT_ID
  }
);

client.on("connect", () => {
  dispatch({
    type: ActionTypes.CONNECTION_OPEN
  });
});

client.on("close", () => {
  dispatch({
    type: ActionTypes.CONNECTION_LOST
  });
});

client.on("reconnect", () => {
  dispatch({
    type: ActionTypes.CONNECTION_RECONNECT
  });
});

client.on("message", (topic, message, packet) => {
  const [PREFIX, deviceId, ...rest] = topic.split("/"); // eslint-disable-line no-unused-vars
  MessageAction.receiveMessage(
    topic,
    message,
    deviceId,
    packet.payload.length === 0 // message deletion, empty message
  );
  if (!deviceId.startsWith("$")) {
    console.info(deviceId, ...rest);
    DeviceAction.receiveMessage(deviceId, rest.join("/"), message);
  }
});

function handleConnectionOpen(state) {
  setTimeout(() => {
    DeviceAction.getList();
    client.subscribe("homie/#");
  }, 0);
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

function handleSendMessage({ topic, message, options }) {
  options = options || { retain: false };
  client.publish(topic, message, options);
}

class ConnectionStore extends MapStore {
  initialize() {
    this.addAction(ActionTypes.CONNECTION_OPEN, handleConnectionOpen);
    this.addAction(ActionTypes.CONNECTION_LOST, handleConnectionLost);
    this.addAction(ActionTypes.CONNECTION_RECONNECT, handleReconnect);
    this.addAction(
      ActionTypes.SEND_MESSAGE,
      withNoMutations(handleSendMessage)
    );
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
