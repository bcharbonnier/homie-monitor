import React from "react";
import classnames from "classnames";
import { withRouter } from "react-router";
import { Link } from "react-router-dom";

import ActionButton from "./ActionButton.react";

const NotAvailableWrapper = (props) =>
    <div className={classnames(props.className)}>
        {props.device.online ?
            props.children :
            <div className="tag">n/a</div>
        }
    </div>;

class DeviceList extends React.PureComponent {
    render() {
        const { devices, history } = this.props;

        const deviceList = devices.map(device => {
            let actions;
            if (device.online) {
                actions = (
                    <ActionButton
                        label="Info"
                        onClick={() => {
                            history.push(`/devices/${device.id}`)
                        }}
                    >
                        <Link
                            key="delete"
                            to={`/devices/${device.id}/reset`}
                            className="navbar-item"
                        >
                            <span className="icon is-small">
                                <i className="fa fa-refresh" />
                            </span>
                            Reset
                        </Link>
                        <span key="divider" className="navbar-divider" />

                        <Link to={`/devices/${device.id}`} className="navbar-item">
                            <span className="icon is-small">
                                <i className="fa fa-info-circle" />
                            </span>
                            Info
                        </Link>
                    </ActionButton>
                );
            } else {
                actions = <Link to={`/devices/${device.id}`} className="button is-info is-small">
                    <span className="icon is-small">
                        <i className="fa fa-info-circle" />
                    </span>
                    <span>Info</span>
                </Link>;
            }
            return (
                <tr key={device.id}>
                    <td className="device-online">
                        <span className={classnames("tag", {
                            "is-danger": !device.online,
                            "is-success": device.online
                        })}>{device.online ? "online" : "offline"}</span>
                    </td>
                    <td>
                        <div>{device.name}</div>
                        <div className="content is-small">
                            <span className="icon is-small">
                                <i className="fa fa-microchip" aria-hidden="true"></i>
                            </span>
                            {device.id}
                        </div>
                    </td>
                    <td>
                        <NotAvailableWrapper device={device}>
                            <progress
                            title={`${device.signal}%`}
                                className="progress is-small is-dark"
                                value={device.signal}
                                max="100"
                            ></progress>
                        </NotAvailableWrapper>
                    </td>
                    <td>
                        <NotAvailableWrapper
                            className={{
                                content: true,
                                "is-small": device.online
                            }}
                            device={device}
                        >
                            <div>{device.localip}</div>
                            <div>{device.mac}</div>
                        </NotAvailableWrapper>
                    </td>
                    <td>
                        <div>{device.fwname}</div>
                    </td>
                    <td>{device.fwversion}</td>
                    <td>
                        <NotAvailableWrapper device={device}>
                            {device.human_uptime}
                        </NotAvailableWrapper>
                    </td>
                    <td>{actions}</td>
                </tr>
            );
        });

        return (
            <tbody>
                {deviceList}
            </tbody>
        )
    }
}

export default withRouter(DeviceList);