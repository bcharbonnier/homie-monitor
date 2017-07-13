import React from "react";

import { Container } from "flux/utils";
import classnames from "classnames";

import ConnectionStore from "../stores/ConnectionStore";

class ConnectionButton extends React.Component {
    static getStores() {
        return [ ConnectionStore ]
    }

    static calculateState() {
        return {
            connected: ConnectionStore.isConnected(),
            connecting: ConnectionStore.isConnecting()
        }
    }

    render() {
        const { connected, connecting } = this.state;
        return (
            <a className={classnames("button", {
                "is-loading": connecting,
                "is-dark": !connected,                
                "is-success": connected
            })}>{connected ? "Connected" : "Disconnected"}</a>
        )
    }
}

const container = Container.create(ConnectionButton);
export default container;
