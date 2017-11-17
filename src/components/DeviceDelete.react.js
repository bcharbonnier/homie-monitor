import React from "react";
import { Container } from "flux/utils";

import Modal from "./Modal.react";

import * as DeviceAction from "../actions/DeviceAction";
import DeviceStore from "../stores/DeviceStore";

class DeviceDelete extends React.Component {
  static getStores() {
    return [DeviceStore];
  }

  static calculateState(prevState, props) {
    const device = DeviceStore.getDevice(props.match.params.deviceId);
    if (!device) {
      setTimeout(() => props.history.push("/devices"), 0);
    }
    return {
      device
    };
  }

  onDelete() {
    const { id } = this.state.device;
    DeviceAction.deleteDevice(id).then(() => {
      setTimeout(() => this.props.history.push("/devices"), 0);
    });
  }

  render() {
    const { device } = this.state;
    if (!device) {
      return null;
    }
    const { name, id } = device;
    return (
      <Modal
        className="device-deletion"
        title={`${name} - ${id}`}
        active
        onClose={() => this.props.history.goBack()}
        actions={[
          <button
            key="delete"
            className="button is-danger"
            onClick={() => this.onDelete()}
          >
            Delete
          </button>
        ]}
      >
        <h4 className="subtitle">Deletion confirmation</h4>
        <p>
          Do you really want to delete the <code>{id}</code> device ? <br />
          It will both delete it from the sentinel device storage, but also
          publish proper <i>null</i> messages to remove it from MQTT.
        </p>
        <hr />
        <p className="has-text-danger">
          This operation can not be undone! Proceed with caution.
        </p>
      </Modal>
    );
  }
}

const instance = Container.create(DeviceDelete, { withProps: true });
export default instance;
