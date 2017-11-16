import React from "react";
import { Container } from "flux/utils";

import * as FirwmareAction from "../actions/FirmwareAction";

import FirmwareList from "./FirmwareList.react";

import FirmwareStore from "../stores/FirmwareStore";

const NoFirmware = () => (
    <section className="section has-text-centered">
        <p>
        <div class="file is-boxed">
        <label class="file-label">
          <input class="file-input" type="file" name="resume" />
          <span class="file-cta">
            <span class="file-icon">
              <i class="fa fa-upload"></i>
            </span>
            <span class="file-label">
              Choose a file to upload…
            </span>
          </span>
        </label>
      </div>
        </p>
    </section>
);

class FirmwaresContainer extends React.Component {
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
                            {firmwares.size > 0 && <div class="file is-small">
                            <label class="file-label">
                              <input class="file-input" type="file" name="resume" />
                              <span class="file-cta">
                                <span class="file-icon">
                                  <i class="fa fa-upload"></i>
                                </span>
                                <span class="file-label">
                                  Choose a file to upload…
                                </span>
                              </span>
                            </label>
                          </div>}
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
                <table className="table is-striped is-fullwidth">
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
