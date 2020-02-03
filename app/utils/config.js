// 设备控制指令
const Instructions = {
    powerOn: 0,//开
    powerOff: 1,//关
    gearPlus: 2,//档位+
    gearMinus: 3,//档位-
    timePlus: 4,//定时+
    timeMinus: 5,//定时-
    upDown: 6,//上下
    leftRight: 7,//左右
    threeD: 8,//3d
    cancel: 9,//取消
    sleepWind: 10,//睡眠
    naturalWind: 11,//自然
    normalWind: 12,//正常
    intelligentWind: 13,//智能
    add: 14,//添加设备
    delete: 15,//清除设备
};

// 用户设定默认语言
const StorageKey = {
    language: "LANGUAGE", 
    startUpHome: "STARTUPHOME",
}

module.exports = {
    Instructions,
    StorageKey,
};