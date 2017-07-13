import React from "react";
import { Container } from "flux/utils";
import { Route } from "react-router";

import * as DeviceAction from "../actions/DeviceAction";

import DeviceList from "./DeviceList.react";
import DeviceReset from "./DeviceReset.react";
import DeviceStore from "../stores/DeviceStore";
import DeviceStateStore from "../stores/DeviceStateStore";

// const DEVICES = [
//     ["ESP-Lampadaire-Salon", "esp-lampadaire-salon", 84, 1234345, "192.168.0.16", "awesome-switch", "1.0", ["linux", "", "python"]],
//     ["ESP-Lampadaire-Tv", "esp-lampadaire-tv", 54, 123445, "192.168.0.96", "awesome-switch", "1.0", ["windows", "10", "python"]],
//     ["ESP-Cuisine", "esp-cuisine", 79, 4354345, "192.168.0.86", "awesome-switch", "1.1", ["microchip", "", "esp8266"]]
// ];

function refreshList() {
    DeviceAction.getList();
}

const NoDevice = (props) => (
    <tbody>
        <tr>
            <td className="has-text-centered" colSpan="20">
                {props.fetching ? "Fetching devices list..." : "No device"}
            </td>
        </tr>
    </tbody>
);

class DevicesContainer extends React.PureComponent {
    static getStores() {
        return [ DeviceStore, DeviceStateStore ];
    }

    static calculateState() {
        return {
            devices: DeviceStore.getDevices(),
            fetching: DeviceStateStore.isFetchOnGoing()
        };
    }

    componentWillMount() {
        this.interval = setInterval(refreshList, 1000);
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    render() {
        const { devices, fetching } = this.state;
        return (
            <div className="container">
                <div className="level">
                    <div className="level-left">
                        <h1 className="title">Devices</h1>
                    </div>
                    <div className="level-right">
                        <p className="control has-icons-right">
                            <input className="input is-small" type="search" placeholder="Filter" />
                            <span className="icon is-small is-right">
                                <i className="fa fa-search"></i>
                            </span>
                        </p>
                    </div>
                </div>
                <Route path="/devices/:deviceId/reset" component={DeviceReset} />
                <table className="table is-striped">
                    <thead>
                        <tr>
                            <th></th>
                            <th>Name</th>
                            <th>Signal</th>
                            <th>IP</th>
                            <th>Firmware</th>
                            <th>Version</th>
                            <th>Uptime</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    {devices.size > 0 ?
                        <DeviceList devices={devices} /> :
                        <NoDevice fetching={fetching} />}
                </table>
            </div>
        );
    }
}

const container = Container.create(DevicesContainer);
export default container;