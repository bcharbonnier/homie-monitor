import React from "react";

import * as DeviceAction from "../actions/DeviceAction";
import * as NotificationAction from "../actions/NotificationAction";

const DeviceReset = props => {
  const { deviceId } = props.match.params;
  return (
    <article className="message is-danger">
      <div className="message-header">
        <p>Reset confirmation needed</p>
        <button onClick={() => props.history.goBack()} className="delete" />
      </div>
      <div className="message-body">
        <div className="level">
          <div className="level-left">
            <p className="level-item">
              Do you really want to send the `reset` command to the '{deviceId}'
              device ?
            </p>
          </div>
          <div className="level-right">
            <button
              className="button is-danger"
              onClick={() => {
                DeviceAction.resetDevice(deviceId);
                props.history.goBack();
                setTimeout(() => {
                  NotificationAction.success(
                    `Device '${deviceId}' has been restarted.`
                  );
                }, 1000);
              }}
            >
              Reset
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};

export default DeviceReset;
