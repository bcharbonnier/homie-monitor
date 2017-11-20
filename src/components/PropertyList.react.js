import React from "react";

export default class PropertyList extends React.Component {
  render() {
    const { properties } = this.props;
    const list = properties.map((device, name) => {
      const nodes = device.get("nodes").map((node, nodeName) => {
        return node.properties.map(prop => {
          return (
            <tr key={`${name}-${nodeName}-${prop.name}`}>
              <td>
                {name}
                <span>/</span>
                {nodeName}
              </td>
              <td>{prop.name}</td>
              <td />
              <td />
              <td />
              <td />
            </tr>
          );
        });
      });
      return nodes.toArray();
    });
    console.log(list.toArray());
    return <tbody>{list.toArray()}</tbody>;
  }
}
