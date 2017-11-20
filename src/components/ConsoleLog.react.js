import React from "react";
import { Container } from "flux/utils";
import moment from "moment";
import classnames from "classnames";

import MessageStore from "../stores/MessageStore";

function timestamp(date) {
  return `${moment(date).format("HH:mm:ss")}`;
}

class Console extends React.Component {
  state = {
    fullscreen: false
  };

  toggleFullscreen() {
    this.setState(({ fullscreen }) => ({
      fullscreen: !fullscreen
    }));
  }

  componentDidUpdate() {
    if (this.state.fullscreen) {
      if (this.logs) {
        this.logs.scrollTop = this.logs.scrollHeight;
      }
    }
  }

  render() {
    const { fullscreen } = this.state;
    const messages = this.props.messages.map(payload => {
      const { id, message, topic, date, error, deleted } = payload;
      return (
        <div
          key={id}
          className={classnames("log-line", {
            "is-error": !!error,
            "is-deleted": deleted
          })}
        >
          <time className="timestamp" dateTime={date}>
            {timestamp(date)}
          </time>
          <strong className="topic">{topic}</strong>
          <span className="log-message">{message}</span>
        </div>
      );
    });

    return (
      <div
        className={classnames("console", {
          container: !fullscreen,
          section: fullscreen,
          "is-overlay": fullscreen
        })}
      >
        <div className="level">
          <div className="level-left">
            <h1 className="title">Console Logs</h1>
          </div>
          <div className="level-right">
            <a className="button" onClick={() => this.toggleFullscreen()}>
              <span className="icon is-small">
                <i
                  className={classnames("fa", {
                    "fa-window-maximize": !fullscreen,
                    "fa-close": fullscreen
                  })}
                  aria-hidden="true"
                />
              </span>
              <span>{fullscreen ? "Close" : "Fullscreen"}</span>
            </a>
          </div>
        </div>

        {!fullscreen && <hr />}
        <div className="box logs" ref={logs => (this.logs = logs)}>
          {messages}
        </div>
      </div>
    );
  }
}

class ConsoleContainer extends React.Component {
  static getStores() {
    return [MessageStore];
  }

  static calculateState() {
    return {
      messages: MessageStore.getMessages()
    };
  }

  render() {
    return <Console messages={this.state.messages} />;
  }
}

const instance = Container.create(ConsoleContainer);
export default instance;
