import keyMirror from "keymirror";

export const ActionTypes = keyMirror({
    CONNECTION_OPEN: null,
    CONNECTION_LOST: null,
    CONNECTION_RECONNECT: null,

    LOAD_DEVICES: null,
    LOAD_DEVICES_SUCCESS: null,

    LOAD_FIRMWARES: null,
    LOAD_FIRMWARES_SUCCESS: null,

    MESSAGE_RECEIVED: null,
    SEND_MESSAGE: null,

    DEVICE_PROPERTY_UPDATE: null,
    DEVICE_NODE_TYPE_UPDATE: null,
    DEVICE_NODE_PROPERTY_DEFINITION: null,
    DEVICE_NODE_PROPERTY_VALUE_UPDATE: null
});