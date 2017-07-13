import React from "react";
import { Container } from "flux/utils";

import * as FirwmareAction from "../actions/FirmwareAction";

import FirmwareList from "./FirmwareList.react";

import FirmwareStore from "../stores/FirmwareStore";

const NoFirmware = () => (
    <section className="section has-text-centered">
        <p>
            <button className="button is-large">
                <span className="icon is-medium">
                    <i className="fa fa-upload" />
                </span>
                <span>Upload</span>
            </button>
        </p>
    </section>
);

class FirmwaresContainer extends React.PureComponent {
    static getStores() {
        return [ FirmwareStore ];
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
                            {firmwares.size > 0 && <button className="button is-small">
                                <span className="icon is-small">
                                    <i className="fa fa-upload" />
                                </span>
                                <span>Upload</span>
                            </button>}
                        </div>
                        <div className="level-item">
                            <p className="control has-icons-right">
                                <input className="input is-small" type="search" placeholder="Filter" />
                                <span className="icon is-small is-right">
                                    <i className="fa fa-search"></i>
                                </span>
                            </p>
                        </div>
                    </div>
                </div>
                <table className="table is-striped">
                    <thead>
                        <tr>
                            <th></th>
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
