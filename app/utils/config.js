const Instructions = {
    powerOn: "a0",//开
    powerOff: "a1",//关
    gearPlus: "a2",//档位+
    gearMinus: "a3",//档位-
    timePlus: "a4",//定时+
    timeMinus: "a5",//定时-
    upDown: "a6",//上下
    leftRight: "a7",//左右
    threeD: "a8",//3d
    cancel: "a9",//取消
    sleepWind: "b0",//睡眠
    naturalWind: "b1",//自然
    normalWind: "b2",//正常
    intelligentWind: "b3",//智能
    add: "b4",//添加设备
    delete: "b5",//清除设备
};

const StorageKey = {
    language: "LANGUAGE", //用户设定默认语言
}

module.exports = {
    Instructions,
    StorageKey,
};