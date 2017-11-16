import Immutable from "immutable";
import Dispatcher from "../Dispatcher";
import { MapStore } from "../libs/Flux";
import { ActionTypes } from "../Constants";

function handleNodePropertyDefinition(state, { deviceId, nodeId, property }) {
    const device = state.get(deviceId, Immutable.Map());
    return state.set(deviceId, device.withMutations(map => {
        const nodes = map.get("nodes", Immutable.Map());
        return map.set("nodes", nodes.withMutations(nodeMap => {
            const node = nodeMap.get(nodeId, { name: nodeId, properties: []})
            node.properties = Array.from((new Set(node.properties)).add(property));
            return nodeMap.set(nodeId, node);
        }));
    }));
}

function handleNodeTypeUpdate(state, { deviceId, nodeId, property }) {
    return state;
}

function handleNodePropertyValueUpdate(state) {
    return state;
}

function handleDeviceDeletion(state, { device }) {
    return state.delete(device.id);
}

class PropertyStore extends MapStore {
    initialize() {
        this.addAction(ActionTypes.DEVICE_NODE_PROPERTY_DEFINITION, handleNodePropertyDefinition);
        this.addAction(ActionTypes.DEVICE_NODE_TYPE_UPDATE, handleNodeTypeUpdate);
        this.addAction(ActionTypes.DEVICE_NODE_PROPERTY_VALUE_UPDATE, handleNodePropertyValueUpdate);
        this.addAction(ActionTypes.DEVICE_DELETE_SUCCESS, handleDeviceDeletion);
    }

    getProperties(deviceId) {

    }
}

const instance = new PropertyStore(Dispatcher);
export default instance;