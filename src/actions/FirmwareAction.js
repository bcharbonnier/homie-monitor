import { dispatch } from "../Dispatcher";
import { ActionTypes } from "../Constants";

export function getList() {
    dispatch({
        type: ActionTypes.LOAD_FIRMWARES
    })
    return fetch("/api/firmwares", {
        headers: {
            "accepts": "application/json"
        }
    })
        .then(response => {
            if (response.status !== 200) {
                return {}
            }
            return response.json();
        })
        .then(firmwares => {
            dispatch({
                type: ActionTypes.LOAD_FIRMWARES_SUCCESS,
                firmwares
            })
        });
}

export function deleteFirmware(name) {

}