import React from "react";
import { Container } from "flux/utils";
import { Route } from "react-router";

import Fetching from "./Fetching.react";
import DeviceList from "./DeviceList.react";
import DeviceDelete from "./DeviceDelete.react";
import DeviceReset from "./DeviceReset.react";
import DeviceStore from "../stores/DeviceStore";
import DeviceStateStore from "../stores/DeviceStateStore";

const NoDevice = props => (
  <div className="columns">
    <div className="column">
      <div className="has-text-centered">
        {props.fetching ? "Fetching devices list..." : "No device"}
      </div>
    </div>
  </div>
);

class DevicesContainer extends React.Component {
  static getStores() {
    return [DeviceStore, DeviceStateStore];
  }

  static calculateState() {
    return {
      devices: DeviceStore.getDevices(),
      fetching: DeviceStateStore.isFetchOnGoing()
    };
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
              <input
                className="input is-small"
                type="search"
                placeholder="Filter"
              />
              <span className="icon is-small is-right">
                <i className="fa fa-search" />
              </span>
            </p>
          </div>
        </div>
        <Route path="/devices/:deviceId/reset" component={DeviceReset} />
        <Route path="/devices/:deviceId/delete" component={DeviceDelete} />
        <table className="table is-striped is-hoverable is-fullwidth">
          <thead>
            <tr>
              <th />
              <th>Name</th>
              <th>Signal</th>
              <th>IP</th>
              <th>Firmware</th>
              <th className="has-text-centered">Version</th>
              <th>Uptime</th>
              <th>Actions</th>
            </tr>
          </thead>
          {devices.size > 0 && <DeviceList devices={devices} />}
        </table>
        <Fetching active={fetching} />
        {devices.size === 0 && !fetching && <NoDevice />}
      </div>
    );
  }
}

const container = Container.create(DevicesContainer);
export default container;
