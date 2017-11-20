import { dispatch } from "../Dispatcher";
import { ActionTypes } from "../Constants";

import DeviceStore from "../stores/DeviceStore";

export const receiveMessage = (topic, message, deviceId, deleted = false) => {
  const payload = {
    type: ActionTypes.MESSAGE_RECEIVED,
    topic: topic.toString(),
    message: message.toString(),
    deleted
  };

  if (!DeviceStore.getDevice(deviceId)) {
    payload.error = true;
  }
  dispatch(payload);
};
