import React from "react";
import classnames from "classnames";

import * as FirmwareAction from "../actions/FirmwareAction";

import ActionButton from "./ActionButton.react";
import { Link } from "react-router-dom";

export default class FirmwareList extends React.PureComponent {
  deleteFirmware(firmware) {
    FirmwareAction.deleteFirmware(firmware);
  }

  render() {
    const { firmwares } = this.props;

    const firmwareList = firmwares.map(firmware => {
      return (
        <tr key={firmware.name}>
          <td>
            <span className="icon is-small">
              <i
                className={classnames("fa", {
                  "fa-microchip": firmware.type === "esp8266",
                  "fa-desktop": firmware.type !== "esp8266"
                })}
                aria-hidden="true"
              />
            </span>
          </td>
          <td>
            <div>{firmware.name}</div>
            <div className="content is-small">
              <em title="checksum">{firmware.checksum}</em>
            </div>
          </td>
          <td className="has-text-centered">{firmware.version}</td>
          <td>
            <div>{firmware.type}</div>
            <div className="content is-small">
              <div>2.0.0</div>
            </div>
          </td>
          <td>{firmware.human_size}</td>
          <td>
            <ActionButton
              label={
                <span>
                  <span className="icon is-small">
                    <i className="fa fa-info-circle" />
                  </span>
                  <span>Details</span>
                </span>
              }
            >
              <Link
                to={`/firmwares/${firmware.name}/deploy`}
                className="dropdown-item"
              >
                <span className="icon is-small">
                  <i className="fa fa-cloud-upload" />
                </span>
                <span>Deploy</span>
              </Link>
              <a
                className="dropdown-item"
                href={`/api/firmwares/${firmware.filename}`}
                download
              >
                <span className="icon is-small">
                  <i className="fa fa-download" />
                </span>
                <span>Download</span>
              </a>
              <span className="dropdown-divider" />
              <a
                onClick={() => this.deleteFirmware(firmware)}
                className="dropdown-item has-text-danger"
              >
                <span className="icon is-small">
                  <i className="fa fa-trash" />
                </span>
                <span>Delete</span>
              </a>
              <span className="dropdown-divider" />
              <a className="dropdown-item">
                <span className="icon is-small">
                  <i className="fa fa-info-circle" />
                </span>
                <span>Details</span>
              </a>
            </ActionButton>
          </td>
        </tr>
      );
    });

    return <tbody>{firmwareList}</tbody>;
  }
}
