import React from "react";
import { Container } from "flux/utils";
import classnames from "classnames";

import Modal from "./Modal.react";

import FirmwareStore from "../stores/FirmwareStore";
import DeviceStore from "../stores/DeviceStore";

function property(name, value) {
  return (
    <div className="field is-horizontal">
      <div className="field-label">
        <label className="label">{name}</label>
      </div>

      <div className="field-body">
        <div className="field">
          <div className="control">{value || "n/a"}</div>
        </div>
      </div>
    </div>
  );
}
class FirmwareDeploy extends React.Component {
  static getStores() {
    return [FirmwareStore, DeviceStore];
  }

  static calculateState(prevState, props) {
    const firmware = FirmwareStore.getFirmware(props.match.params.firmwareName);
    if (!firmware) {
      setTimeout(() => props.history.push("/firmwares"), 0);
    }
    return {
      firmware,
      devices: DeviceStore.getDevices().filter(
        d => d.implementation === firmware.type
      )
    };
  }

  constructor(props) {
    super(props);

    this.close = this.close.bind(this);
  }

  close() {
    this.props.history.goBack();
  }

  onDeploy() {}

  render() {
    const { firmware, devices } = this.state;
    if (!firmware) {
      return null;
    }
    const { name, version, human_size, type } = firmware;
    return (
      <Modal
        className="firmware-deploy is-info"
        title="Firmware deployment"
        active
        onClose={this.close}
        actions={[
          <button key="cancel" className="button" onClick={this.close}>
            Cancel
          </button>,
          <button
            key="deploy"
            className="button is-info"
            onClick={() => this.onDeploy()}
          >
            <span className="icon is-small">
              <i className="fa fa-cloud-upload" />
            </span>
            <span>Deploy</span>
          </button>
        ]}
      >
        {property("Name", name)}
        {property("Type", [
          <span key="icon" className="icon is-small">
            <i
              className={classnames("fa", {
                "fa-microchip": type === "esp8266",
                "fa-desktop": type !== "esp8266"
              })}
              aria-hidden="true"
            />
          </span>,
          <span key="type">{type}</span>
        ])}
        {property("Version", version)}
        {property("Size", human_size)}
        {property(
          "Device",
          <div className="select">
            <select>
              {devices.map(d => <option key={d.name}>{d.name}</option>)}
            </select>
          </div>
        )}
      </Modal>
    );
  }
}

const instance = Container.create(FirmwareDeploy, { withProps: true });
export default instance;
