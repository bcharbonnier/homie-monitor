import React from "react";
import { Container } from "flux/utils";
import { Route } from "react-router";
import classnames from "classnames";

import * as FirwmareAction from "../actions/FirmwareAction";

import FirmwareDeploy from "./FirmwareDeploy.react";
import FirmwareList from "./FirmwareList.react";

import FirmwareStore from "../stores/FirmwareStore";

const upload = className => (
  <div className={classnames("file", className)}>
    <label className="file-label">
      <input
        className="file-input"
        type="file"
        name="firmware"
        onChange={({ target }) => {
          FirwmareAction.upload(target.files[0]);
        }}
      />
      <span className="file-cta">
        <span className="file-icon">
          <i className="fa fa-upload" />
        </span>
        <span className="file-label">Choose a file to upload…</span>
      </span>
    </label>
  </div>
);

const NoFirmware = () => (
  <section className="section">{upload("is-centered is-boxed")}</section>
);

class FirmwaresContainer extends React.Component {
  static getStores() {
    return [FirmwareStore];
  }

  static calculateState() {
    return {
      firmwares: FirmwareStore.getFirmwares()
    };
  }

  componentWillMount() {
    FirwmareAction.getList();
  }

  render() {
    const { firmwares } = this.state;
    return (
      <div className="container">
        <div className="level">
          <div className="level-left">
            <h1 className="title">Firmwares</h1>
          </div>
          <div className="level-right">
            <div className="level-item">
              {firmwares.size > 0 && upload("is-small")}
            </div>
            <div className="level-item">
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
        </div>
        <Route
          path="/firmwares/:firmwareName/deploy"
          component={FirmwareDeploy}
        />
        <table className="table is-striped is-fullwidth">
          <thead>
            <tr>
              <th />
              <th>Name</th>
              <th>Version</th>
              <th>Implementation</th>
              <th>Size</th>
              <th>Actions</th>
            </tr>
          </thead>
          {firmwares.size > 0 && <FirmwareList firmwares={firmwares} />}
        </table>
        {firmwares.size === 0 && <NoFirmware />}
      </div>
    );
  }
}

const instance = Container.create(FirmwaresContainer);
export default instance;
