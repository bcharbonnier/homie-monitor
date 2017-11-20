import { dispatch } from "../Dispatcher";
import { ActionTypes } from "../Constants";

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
  return fetch(`/api/firmwares/${firmware.name}`, {
    method: "DELETE",
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
        type: ActionTypes.DELETE_FIRMWARE_SUCCESS,
        firmware,
        firmwares
      });
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
    .then(response => {
      if (response.status !== 200) {
        return {};
      }
      return response.json();
    })
    .then(({ ok, firmwares, error }) => {
      if (!ok) {
        dispatch({
          type: ActionTypes.UPLOAD_FIRMWARE_FAILURE,
          error
        });
        return;
      }
      dispatch({
        type: ActionTypes.UPLOAD_FIRMWARE_SUCCESS,
        firmwares
      });
    });
}
