import React from "react";
import classnames from "classnames";

import * as FirmwareAction from "../actions/FirmwareAction";

import ActionButton from "./ActionButton.react";

export default class FirmwareList extends React.PureComponent {
    deleteFirmware(name) {
        FirmwareAction.deleteFirmware(name);
    }

    render() {
        const { firmwares } = this.props;

        const firmwareList = firmwares.map(firmware => {
            return (
                <tr key={firmware.firmware}>
                    <td>
                        <span className="icon is-small">
                            <i className={classnames("fa", {
                                "fa-microchip": firmware.type === "esp8266",
                                "fa-desktop": firmware.type !== "esp8266"
                            })} aria-hidden="true"></i>
                        </span>
                    </td>
                    <td>
                        <div>{firmware.firmware}</div>
                        <div className="content is-small">
                            <em title="checksum">{firmware.checksum}</em>
                        </div>
                    </td>
                    <td>{firmware.version}</td>
                    <td>
                        <div>{firmware.type}</div>
                        <div className="content is-small">
                            <div>2.0.0</div>
                        </div>
                    </td>
                    <td>{firmware.human_size}</td>
                    <td>
                        <ActionButton
                            label="Details">
                            <a className="navbar-item">
                                <span className="icon is-small">
                                    <i className="fa fa-cloud-upload" />
                                </span>
                                <span>Deploy</span>
                            </a>
                            <a className="navbar-item">
                                <span className="icon is-small">
                                    <i className="fa fa-download" />
                                </span>
                                <span>Download</span>
                            </a>
                            <span className="navbar-divider" />
                            <a
                                onClick={() => this.deleteFirmware(firmware.firmware)}
                                className="navbar-item">
                                <span className="icon is-small">
                                    <i className="fa fa-trash" />
                                </span>
                                <span>Delete</span>
                            </a>
                            <span className="navbar-divider" />
                            <a className="navbar-item">
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

        return (
            <tbody>
                {firmwareList}
            </tbody>
        )
    }
}