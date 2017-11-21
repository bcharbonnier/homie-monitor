import React from "react";
import { Container } from "flux/utils";
import classnames from "classnames";

import * as NotificationAction from "../actions/NotificationAction";

import NotificationStore from "../stores/NotificationStore";
import { NOTIFICATION } from "../Constants";

import { uuid } from "../utils/Crypto";

function Notification(props) {
  const { type, children } = props;
  return (
    <div className={classnames("notification", type)}>
      {type === "is-danger" && (
        <button onClick={props.onClose} className="delete" />
      )}
      {children}
    </div>
  );
}

function DangerNotification({ children, onClose }) {
  return (
    <Notification type="is-danger" onClose={onClose}>
      {children}
    </Notification>
  );
}

function WarningNotification({ children }) {
  return <Notification type="is-warning">{children}</Notification>;
}

function SuccessNotification({ children }) {
  return <Notification type="is-success">{children}</Notification>;
}

class Notifications extends React.Component {
  static getStores() {
    return [NotificationStore];
  }

  static calculateState() {
    return {
      notifications: NotificationStore.getAll()
    };
  }

  render() {
    const notifications = this.state.notifications
      .map(n => {
        const key = uuid();
        switch (n.type) {
          case NOTIFICATION.ERROR:
            return (
              <DangerNotification
                key={key}
                onClose={() => {
                  NotificationAction.close(n);
                }}
              >
                {n.message}
              </DangerNotification>
            );

          case NOTIFICATION.WARNING:
            return (
              <WarningNotification key={key}>{n.message}</WarningNotification>
            );

          case NOTIFICATION.SUCCESS:
            return (
              <SuccessNotification key={key}>{n.message}</SuccessNotification>
            );

          default:
            return null;
        }
      })
      .toArray();
    return <div className="notifications">{notifications}</div>;
  }
}

const instance = Container.create(Notifications);
export default instance;
