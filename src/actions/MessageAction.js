import { dispatch } from "../Dispatcher";
import { ActionTypes } from "../Constants";

import DeviceStore from "../stores/DeviceStore";

export const receiveMessage = (topic, message, deviceId) => {
    const payload = {
        type: ActionTypes.MESSAGE_RECEIVED,
        topic: topic.toString(),
        message: message.toString(),
    }

    if (!DeviceStore.getDevice(deviceId)) {
        payload.error = true;
    }
    dispatch(payload);
}