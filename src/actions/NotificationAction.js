import { dispatch } from "../Dispatcher";
import {
  ActionTypes,
  NOTIFICATION,
  NOTIFICATION_DEFAULT_TIME
} from "../Constants";

function notify(notification) {
  dispatch({
    type: ActionTypes.NOTIFICATION_ADD,
    notification
  });
  setTimeout(() => {
    dispatch({
      type: ActionTypes.NOTIFICATION_REMOVE,
      notification
    });
  }, notification.type !== NOTIFICATION.ERROR ? NOTIFICATION_DEFAULT_TIME : 3 * NOTIFICATION_DEFAULT_TIME);
}

export function error(message) {
  const notification = {
    type: NOTIFICATION.ERROR,
    message
  };
  notify(notification);
}

export function warning(message) {
  const notification = {
    type: NOTIFICATION.WARNING,
    message
  };
  notify(notification);
}

export function success(message) {
  const notification = {
    type: NOTIFICATION.SUCCESS,
    message
  };
  notify(notification);
}

export function close(notification) {
  dispatch({
    type: ActionTypes.NOTIFICATION_REMOVE,
    notification
  });
}
