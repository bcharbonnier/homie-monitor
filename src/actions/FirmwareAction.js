import { dispatch } from "../Dispatcher";
import { ActionTypes } from "../Constants";

import * as NotificationAction from "./NotificationAction";

export function getList() {
  dispatch({
    type: ActionTypes.LOAD_FIRMWARES
  });
  return fetch("/api/firmwares", {
    headers: {
      accepts: "application/json"
    }
  })
    .then(response => {
      if (response.status !== 200) {
        return {};
      }
      return response.json();
    })
    .then(firmwares => {
      dispatch({
        type: ActionTypes.LOAD_FIRMWARES_SUCCESS,
        firmwares
      });
    });
}

export function deleteFirmware(firmware) {
  dispatch({
    type: ActionTypes.DELETE_FIRMWARE,
    firmware
  });
  return fetch(`/api/firmwares/${firmware.filename}`, {
    method: "DELETE",
    headers: {
      accepts: "application/json"
    }
  })
    .then(response => response.json())
    .then(({ ok, firmwares, error }) => {
      if (!ok) {
        NotificationAction.error(error);
        return;
      }
      dispatch({
        type: ActionTypes.DELETE_FIRMWARE_SUCCESS,
        firmware,
        firmwares
      });
      NotificationAction.success(
        `Firmware '${firmware.name}@${firmware.version}' has been deleted`
      );
    })
    .catch(ex => {
      console.error(ex);
    });
}

export function upload(file) {
  dispatch({
    type: ActionTypes.UPLOAD_FIRMWARE,
    firmware: file
  });

  const data = new FormData();
  data.append("firmware", file);

  return fetch("/api/firmwares", {
    method: "POST",
    body: data
  })
    .then(response => response.json())
    .then(({ ok, firmwares, firmware, error }) => {
      if (!ok) {
        NotificationAction.error(error);
        return;
      }
      dispatch({
        type: ActionTypes.UPLOAD_FIRMWARE_SUCCESS,
        firmwares
      });
      NotificationAction.success(
        `New firmware '${firmware.name}@${firmware.version}' uploaded!`
      );
    });
}
