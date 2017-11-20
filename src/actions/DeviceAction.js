import { dispatch } from "../Dispatcher";
import { ActionTypes } from "../Constants";

export function getList() {
  dispatch({
    type: ActionTypes.LOAD_DEVICES
  });
  return fetch("/api/devices", {
    headers: {
      accepts: "application/json"
    }
  })
    .then(response => {
      if (response.status !== 200) {
        return {};
      }
      return response.json();
    })
    .then(devices => {
      dispatch({
        type: ActionTypes.LOAD_DEVICES_SUCCESS,
        devices
      });
    });
}

export function deleteDevice(deviceId) {
  return fetch(`/api/devices/${deviceId}`, {
    method: "DELETE"
  })
    .then(response => {
      if (response.status !== 200) {
        console.error(response.statusText);
        dispatch({
          type: ActionTypes.DEVICE_DELETE_FAILURE,
          deviceId
        });
        return {};
      }
      return response.json();
    })
    .then(({ devices, device }) => {
      dispatch({
        type: ActionTypes.DEVICE_DELETE_SUCCESS,
        devices,
        device // TODO: display de notification of successful deletion
      });
    });
}

export function receiveMessage(deviceId, subTopic, message) {
  // clever hack to use regular expression to detect patterns
  const DEVICE_PROPERTY = /^\$(\w+)(?:\/?(\w+))?$/;
  const DEVICE_NODE_TYPE = /^(\w+)\/\$type$/;
  const DEVICE_NODE_PROPERTIES = /^(\w+)\/\$properties$/;
  const NODE_PROPERTIES = /^(\w+)(?:\[(\d-\d)\])?(?::(settable))?$/;
  const DEVICE_NODE_PROPERTY_VALUE = /^(\w+)\/(.+)$/;

  const value = message.toString();
  if (value.length === 0) {
    return;
  }

  subTopic
    .replace(DEVICE_PROPERTY, (match, property, subProperty) => {
      if (!subProperty) {
        receiveProperty(deviceId, property, message.toString());
      }
      return match;
    })
    .replace(DEVICE_NODE_TYPE, (match, node) => {
      receiveNodeType(deviceId, node, message.toString());
      return match;
    })
    .replace(DEVICE_NODE_PROPERTIES, (match, node) => {
      const properties = value.split(",").map(prop => {
        const [match, name, range, settable, ...rest] = prop.match(
          NODE_PROPERTIES
        ); // eslint-disable-line no-unused-vars
        return {
          name,
          settable: settable !== undefined,
          range
        };
      });
      receiveNodeDefinition(deviceId, node, properties);
      return match;
    })
    .replace(DEVICE_NODE_PROPERTY_VALUE, (match, node) => {
      receiveNodePropertyValue(deviceId, node, message.toString());
    });
}

function receiveProperty(deviceId, property, value) {
  console.log("receiveProperty", deviceId, "=>", property, value);
  dispatch({
    type: ActionTypes.DEVICE_PROPERTY_UPDATE,
    deviceId,
    property,
    value
  });
}

function receiveNodeType(deviceId, nodeId, nodeType) {
  console.log("receiveNodeType", deviceId, "=>", nodeId, "=>", nodeType);
  dispatch({
    type: ActionTypes.DEVICE_NODE_TYPE_UPDATE,
    deviceId,
    nodeId,
    nodeType
  });
}

function receiveNodeDefinition(deviceId, nodeId, properties) {
  console.log(
    "receiveNodeDefinition",
    deviceId,
    "=>",
    nodeId,
    "=>",
    properties
  );
  properties.forEach(property => {
    dispatch({
      type: ActionTypes.DEVICE_NODE_PROPERTY_DEFINITION,
      deviceId,
      nodeId,
      property
    });
  });
}

function receiveNodePropertyValue(deviceId, nodeId, value) {
  dispatch({
    type: ActionTypes.DEVICE_NODE_PROPERTY_VALUE_UPDATE
  });
}
