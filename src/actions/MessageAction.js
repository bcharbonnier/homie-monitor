import { dispatch } from "../Dispatcher";
import { ActionTypes } from "../Constants";

export const receiveMessage = (topic, message) => {
    dispatch({
        type: ActionTypes.MESSAGE_RECEIVED,
        topic,
        message: message.toString()
    });
}