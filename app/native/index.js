import { NativeModules, Platform, DeviceEventEmitter } from 'react-native'

const { BLEAdvertiser } = NativeModules;
console.log("BLEAdvertiser: ", BLEAdvertiser);
export default class BLE {
    //初始化蓝牙广播
    static initBLE(){
        return BLEAdvertiser.initBLE();
    }
    //发送广播指令
    static send(order, id){
        return BLEAdvertiser.send(order, id);
    }
    // 添加设备
    static add(name, id){
        return BLEAdvertiser.add(name, id || "");
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
    // static close(){
    //     if(Platform.OS == "ios"){
    //         return BLEAdvertiser.close();
    //     }
    // }
    // // 广播支持
    // static isSupport(){
    //     return BLEAdvertiser.advertisementIsSupportAndInit();
    // }
    // // 打开蓝牙
    // static openBLE(){
    //     return new Promise((resolve, reject) => {
    //         try {
    //             BLEAdvertiser.openBLE();
    //         }
    //         catch (e) {
    //             reject(e);
    //             return;
    //         }
    //         DeviceEventEmitter.once('openBLECallback', resp => {
    //             resolve(resp);
    //         });
    //     });
    // }
    // // 检查蓝牙状态
    // static checkBLEState(){
    //     return BLEAdvertiser.checkBLEState();
    // }
}