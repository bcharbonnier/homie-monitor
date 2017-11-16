import Dispatcher from "../Dispatcher";
import { MapStore } from "../libs/Flux";
import { ActionTypes } from "../Constants";

function handleDeviceListReceived(state, { devices }) {
    if (!devices) {
        return state;
    }
    return state.withMutations(map => {
        for(const deviceId in devices) {
            const device = devices[deviceId];
            device.id = deviceId;
            map.set(deviceId, device);
        }
        return map;
    });
}

function handleDeviceDelete(state, { devices, device }) {
    state = state.delete(device.id);
    return handleDeviceListReceived(state, { devices });
}

// function handleDeviceReceived(state, { device }) {
//     return state;
// }

function handleDevicePropertyUpdate(state, { deviceId, property, value }) {
    if (state.has(deviceId)) {
        const oldDevice = state.get(deviceId);
        switch (property) {
            case "online":
                value = value === "true" ? true : false
                if (value === false) {
                    oldDevice.uptime = 0;
                    oldDevice.signal = 0;
                }
                break;
            default:
                break;
        }

        const device = {
            ...oldDevice,
            [property]: value
        }
        return state.set(deviceId, device);
    }
    return state;
}

class DeviceStore extends MapStore {
    initialize() {
        this.addAction(ActionTypes.LOAD_DEVICES_SUCCESS, handleDeviceListReceived);
        this.addAction(ActionTypes.DEVICE_DELETE_SUCCESS, handleDeviceDelete);
        // this.addAction(ActionTypes.DEVICE_RECEIVED, handleDeviceReceived);

        this.addAction(ActionTypes.DEVICE_PROPERTY_UPDATE, handleDevicePropertyUpdate);
        // this.addAction(ActionTypes.DEVICE_UPDATE_STATS, handleDeviceStatsUpdate);
        // this.addAction(ActionTypes.DEVICE_UPDATE_ONLINE, handleDeviceOnlineUpdate);
        // this.addAction(ActionTypes.DEVICE_UPDATE_IP, handleDeviceIPUpdate);
    }

    getDevices() {
        return this.getState().toSet();
    }

    getDevice(deviceId) {
        return this.getState().get(deviceId, false);
    }
}

const instance = new DeviceStore(Dispatcher);
export default instance;