import React from "react";
import { Container } from "flux/utils";

import PropertyList from "./PropertyList.react";

import PropertyStore from "../stores/PropertyStore";

class PropertiesExplorerContainer extends React.Component {
  static getStores() {
    return [PropertyStore];
  }

  static calculateState() {
    console.log(PropertyStore.getState().toJS());
    return {
      properties: PropertyStore.getState()
    };
  }

  render() {
    const { properties } = this.state;
    return (
      <div className="container">
        <h1 className="title">Node Properties Explorer</h1>

        <table className="table is-striped is-fullwidth">
          <thead>
            <tr>
              <th>Node/Device</th>
              <th>Property</th>
              <th>Value</th>
              <th>Type</th>
              <th>Last Emitted</th>
              <th>Actions</th>
            </tr>
          </thead>
          {properties.size > 0 && <PropertyList properties={properties} />}
        </table>
      </div>
    );
  }
}

const instance = Container.create(PropertiesExplorerContainer);
export default instance;
