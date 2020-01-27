import { NativeModules, DeviceEventEmitter } from 'react-native'

const { BLEAdvertiser } = NativeModules;

export default class BLE {
    //发送广播指令
    static initBLE(){
        return BLEAdvertiser.initBLE();
    }
    //发送广播指令
    static send(order){
        return BLEAdvertiser.send(order);
    }
    // 广播支持
    static isSupport(){
        return BLEAdvertiser.advertisementIsSupportAndInit();
    }
    // 打开蓝牙
    static openBLE(){
        return new Promise((resolve, reject) => {
            try {
                BLEAdvertiser.openBLE();
            }
            catch (e) {
                reject(e);
                return;
            }
            DeviceEventEmitter.once('openBLECallback', resp => {
                resolve(resp);
            });
        });
    }
    // 检查蓝牙状态
    static checkBLEState(){
        return BLEAdvertiser.checkBLEState();
    }
    // 添加设备
    static add(name, id){
        return BLEAdvertiser.add(name, id);
    }
    // 删除设备
    static delete(id){
        return BLEAdvertiser.delete(id);
    }
    // 选择设备
    static choose(id, name){
        return BLEAdvertiser.choose(id, name);
    }
    // 当前设备
    static currentDevice(){
        return BLEAdvertiser.currentDevice();
    }
    // 获取设备
    static getDevices(){
        return BLEAdvertiser.getDevices();
    }
}