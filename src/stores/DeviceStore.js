import Dispatcher from "../Dispatcher";
import { MapStore } from "../libs/Flux";
import { ActionTypes } from "../Constants";

function handleDeviceListReceived(state, { devices }) {
    if (!devices) {
        return state;
    }
    return state.withMutations(map => {
        for(const deviceName in devices) {
            const device = devices[deviceName];
            device.id = deviceName;
            device.online = device.online === "true" ? true : false;
            map.set(deviceName, device);
        }
        return map;
    })
}

function updateDeviceProp(state, deviceId, propName, propValue) {
    return state.setIn([deviceId, propName], propValue);
}

function handleDeviceIPUpdate(state, { deviceId, localip }) {
    return updateDeviceProp(state, deviceId, "localip", localip);
}

function handleDeviceOnlineUpdate(state, { deviceId, online }) {
    return updateDeviceProp(state, deviceId, "online", online);
}

function handleDeviceStatsUpdate(state, payload) {
    const { deviceId } = payload;
    if ("uptime" in payload) {
        return updateDeviceProp(state, deviceId, "uptime", payload.uptime);
    } else if ("signal" in payload) {
        return updateDeviceProp(state, deviceId, "signal", payload.signal);
    }
    return state;
}

class DeviceStore extends MapStore {
    initialize() {
        this.addAction(ActionTypes.LOAD_DEVICES_SUCCESS, handleDeviceListReceived);
        this.addAction(ActionTypes.DEVICE_UPDATE_STATS, handleDeviceStatsUpdate);
        this.addAction(ActionTypes.DEVICE_UPDATE_ONLINE, handleDeviceOnlineUpdate);
        this.addAction(ActionTypes.DEVICE_UPDATE_IP, handleDeviceIPUpdate);
    }

    getDevices() {
        return this.getState().toSet();
    }
}

const instance = new DeviceStore(Dispatcher);
export default instance;