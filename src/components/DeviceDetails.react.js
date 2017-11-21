import React from "react";
import Modal from "./Modal.react";

const DeviceDetails = props => {
  return (
    <Modal
      className="device-details"
      title="Device details"
      active
      onClose={() => props.history.push("/devices")}
      actions={[
        <button key="delete" className="button is-danger" onClick={() => {}}>
          <span className="icon is-small">
            <i className="fa fa-trash-o" />
          </span>
          <span>Delete</span>
        </button>,
        <button key="reset" className="button is-info" onClick={() => {}}>
          <span className="icon is-small">
            <i className="fa fa-refresh" />
          </span>
          <span>Reset</span>
        </button>
      ]}
    >
      <div>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit.{" "}
        <strong>Pellentesque risus mi</strong>, tempus quis placerat ut, porta
        nec nulla. Vestibulum rhoncus ac ex sit amet fringilla. Nullam gravida
        purus diam, et dictum <a>felis venenatis</a> efficitur. Aenean ac{" "}
        <em>eleifend lacus</em>, in mollis lectus. Donec sodales, arcu et
        sollicitudin porttitor, tortor urna tempor ligula, id porttitor mi magna
        a neque. Donec dui urna, vehicula et sem eget, facilisis sodales sem.
      </div>
    </Modal>
  );
};

export default DeviceDetails;
