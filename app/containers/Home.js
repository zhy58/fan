import React, { Component } from 'react'
import { StyleSheet, View, FlatList, Platform, Dimensions } from 'react-native'
import { connect } from 'react-redux'
import I18n from 'i18n-js'
import Modal from 'react-native-modal'
import LottieView from 'lottie-react-native'
import { copilot, walkthroughable, CopilotStep } from 'react-native-copilot'

import { IconButton, ImageButton, CtrlList, CtrlTitle, Image, ScrollView, Touchable, Text } from '../components'
import BLE from '../native'
import { Storage, NavigationActions, createAction, Toast } from '../utils'
import { Instructions, StorageKey } from '../utils/config'
import tool from './style/style'

const WalkthroughableText = walkthroughable(View);
const { width, height } = Dimensions.get("window");

@connect(({ app }) => ({ ...app }))
class Home extends Component {
  constructor(props) {
    super(props);
    this.step1 = I18n.t("step1");
    this.step2 = I18n.t("step2");
    this.step3 = I18n.t("step3");
    this.animation = null;
    this.powerOnColor = "rgb(0,153,68)";
    this.powerOffColor = "rgb(230,0,18)";
    this.state = {
      speed: 0,
      isVisible: false,
    }
  }
  componentWillMount() {
    this.initBle();
  }
  componentDidMount() {
    Storage.get(StorageKey.startUpHome).then(res => {
        // console.log("res: ", res);
        if(!res){
            this.props.copilotEvents.on('stop', this.handleStop);
            this.props.start();
        }
    }).catch(err => {
        console.log("get StorageKey.startUpHome err: ", err);
    });
    if(this.props.power == Instructions.powerOn){
        this.setState({ speed: 1 });
        if(Platform.OS == "ios" && this.animation){
            this.animation.play();
        }
    }
  }
  componentWillUnmount() {
    this.props.copilotEvents.off('stop');
  }
  handleStop = () => {
    Storage.set(StorageKey.startUpHome, true);
  }
  judgeDevice = _ => {
    if(this.props.currentDevice && this.props.currentDevice.name && this.props.currentDevice.id){
      return true;
    }
    Toast(I18n.t("selectDeviceTip"));
    return false;
  }
  power = _ => {
    const that = this;
    BLE.checkBLEState().then(res => {
        if(res && res.status){
            if(that.judgeDevice()){
                const power = that.props.power === Instructions.powerOff ? Instructions.powerOn : Instructions.powerOff;
                BLE.send(power, that.props.currentDevice.id).then(({status}) => {
                  // console.log("status: ", status);
                  if(status == 0){
                    let speed = 0;
                    if(power == Instructions.powerOn){
                      speed = 1;
                    }
                    that.setState({ speed });
                    that.props.dispatch(createAction("app/updateState")({ power }));
                    if(Platform.OS == "ios"){
                      if(speed > 0){
                        that.animation.play();
                      }else{
                        that.animation.reset();
                      }
                    }
                  }
                });
            }
        }else{
            Toast(I18n.t("openBLETip"));
        }
    }).catch(err => {
        console.log("isBLEEnabled err: ", err);
    });
    
  }
  sendOrder(order) {
    const that = this;
    BLE.checkBLEState().then(res => {
        if(res && res.status){
            if(that.judgeDevice()){
                BLE.send(order, that.props.currentDevice.id).then(res => {
                  if(res.status == 4){
                    Toast(I18n.t("openDeviceTip"));
                  }
                }).catch(err => {
                  console.log("sendOrder err", err);
                });
              }
        }else{
            Toast(I18n.t("openBLETip"));
        }
    }).catch(err => {
        console.log("isBLEEnabled err: ", err);
    });
    
  }
  select = _ => {
    this.setState({ isVisible: true });
  }
  closeModal = _ => {
    this.setState({ isVisible: false });
  }
  goLanguage = _ => {
    this.props.dispatch(NavigationActions.navigate({ routeName: 'Language' }))
  }
  goMore = _ => {
    this.props.dispatch(NavigationActions.navigate({ routeName: 'More' }))
  }
  selectDevice(currentDevice) {
    this.closeModal();
    this.props.dispatch(createAction("app/updateState")({ currentDevice }));
    BLE.choose(currentDevice.id, currentDevice.name).then(res => {
        console.log("res: ", res);
      this.props.dispatch(createAction("app/currentDevice")());
    }).catch(err => {
      console.log("err: ", err);
    });
  }
  initBle = _ => {
    BLE.initBLE();
    this.props.dispatch(createAction("app/getDevices")());
    this.props.dispatch(createAction("app/currentDevice")());
  }

  render() {
    let dev = this.props.currentDevice || {};
    const selectDeviceName = dev.name ? dev.name : I18n.t("selectDevice");
    let powerColor = this.props.power === Instructions.powerOn ? this.powerOnColor : this.powerOffColor;
    return (
      <View style={[tool.container, styles.container]}>
        <ScrollView contentContainerStyle={tool.paddingH30}>
            <View style={[tool.flexCenter, tool.marginT30]}>
                <CopilotStep text={this.step3} order={3} name="step3">
                    <WalkthroughableText>
                        <IconButton onPress={this.power} style={styles.iconBtnCir} name="ios-power" color={powerColor} />
                    </WalkthroughableText>
                </CopilotStep>
            </View>
          
          <View style={[tool.flexBetween, styles.marginT15]}>
            <CtrlList tname={"md-add"} bname={"md-remove"} 
              tonPress={_=>{this.sendOrder(Instructions.gearPlus)}}
              bonPress={_=>{this.sendOrder(Instructions.gearMinus)}}
              source={require('../images/amount.png')} />
            {/* <View style={[styles.box, tool.flexCenter]}>
                <Image source={require('../images/in.png')} style={styles.moving} />
            </View> */}
            <View style={styles.fan}>
                <LottieView ref={animation => { this.animation = animation }}
                    speed={this.state.speed}
                    autoPlay={true}
                    style={styles.box}
                    source={require('./json/in.json')}
                />
            </View>
            
            <CtrlList tname={"ios-arrow-up"} bname={"ios-arrow-down"} 
              tonPress={_=>{this.sendOrder(Instructions.timePlus)}}
              bonPress={_=>{this.sendOrder(Instructions.timeMinus)}}
              imgSty={{height: 32}}
              source={require('../images/timer.png')} />
          </View>
          {/* 循环 */}
          <View style={tool.marginT20}>
            <CtrlTitle title={this.props.isKoKR ? "Rotation" : I18n.t("rotation")} />
            <View style={[tool.flexBetween, tool.marginT10]}>
              <ImageButton onPress={_=>{this.sendOrder(Instructions.upDown)}} source={require('../images/updown.png')} text={I18n.t("upDown")} />
              <ImageButton onPress={_=>{this.sendOrder(Instructions.leftRight)}} source={require('../images/lrt.png')} text={I18n.t("leftRight")} />
              <ImageButton onPress={_=>{this.sendOrder(Instructions.threeD)}} source={require('../images/a3d.png')} text={I18n.t("threeD")} />
              <ImageButton onPress={_=>{this.sendOrder(Instructions.cancel)}} source={require('../images/cancel.png')} text={I18n.t("cancle")} />
            </View>
          </View>
          {/* 模式 */}
          <View style={tool.marginT20}>
            <CtrlTitle title={this.props.isKoKR ? "Wind mode" : I18n.t("windMode")} />
            <View style={[tool.flexBetween, tool.marginT10]}>
              <ImageButton onPress={_=>{this.sendOrder(Instructions.sleepWind)}} source={require('../images/sleep.png')} text={I18n.t("sleep")} />
              <ImageButton onPress={_=>{this.sendOrder(Instructions.naturalWind)}} source={require('../images/natural.png')} text={I18n.t("natural")} />
              <ImageButton onPress={_=>{this.sendOrder(Instructions.normalWind)}} source={require('../images/normal.png')} text={I18n.t("normal")} />
              <ImageButton onPress={_=>{this.sendOrder(Instructions.intelligentWind)}} source={require('../images/eco.png')} text={I18n.t("eco")} />
            </View>
          </View>
        </ScrollView>
        {/* 语言，设备切换，设备添加 */}
        <View style={[styles.bar, tool.flexBetween]}>
          {/* <View style={tool.flexCenter}>
            <IconButton size={24} onPress={this.goLanguage} type={"Octicons"} name={"globe"} style={styles.icon} />
            <Text style={styles.font12}>{I18n.t("language")}</Text>
          </View> */}
          <IconButton onPress={this.goLanguage} type={"Octicons"} name={"globe"} style={styles.icon} />
          <CopilotStep text={this.step2} order={2} name="step2">
            <WalkthroughableText>
            <Touchable style={[styles.select, tool.flexCenter]} onPress={this.select}>
                <Text style={tool.weight}>{ selectDeviceName }</Text>
            </Touchable>
            </WalkthroughableText>
          </CopilotStep>
          <CopilotStep text={this.step1} order={1} name="step1">
            <WalkthroughableText>
            <IconButton onPress={this.goMore} type={"Octicons"} name={"gear"} style={styles.icon} />
            {/* <View style={tool.flexCenter}>
                <IconButton size={24} onPress={this.goMore} type={"Octicons"} name={"gear"} style={styles.icon} />
                <Text style={styles.font12}>{I18n.t("device")}</Text>
            </View> */}
            </WalkthroughableText>
          </CopilotStep>
        </View>

        <Modal isVisible={this.state.isVisible} 
          style={styles.modal}
          swipeDirection={['down']}
          onSwipeComplete={this.closeModal}
          scrollOffsetMax={height - 200}
          onBackdropPress={this.closeModal}
          onBackButtonPress={this.closeModal}>
            <View style={styles.mask}>
              <FlatList showsVerticalScrollIndicator={false}
                style={tool.container}
                keyExtractor={(item, index) => index.toString()}
                data={this.props.devices} 
                renderItem={({item, index}) => (
                  <Touchable style={styles.selectList} onPress={_=>{this.selectDevice(item)}}>
                    <Text key={index} style={styles.selectText}>{item.name}</Text>
                  </Touchable>
                )} />
            </View>
        </Modal>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    paddingTop: Platform.select({
        ios: 20,
        android: 0,
    }),
  },
  iconBtnCir: {
    borderRadius: 25,
  },
  fan: {
    paddingTop: 40,
    height: 198,
  },
  box: {
    height: 158,
  },
  moving: {
    width: 90,
    height: 90,
  },
  bar: {
    paddingHorizontal: 30,//10,
    height: 50,
    justifyContent: "center",
    overflow: "hidden",
  },
  icon: {
    width: 50,//30,
    height: 50,//30,
    backgroundColor: "transparent",
  },
  marginT15: {
    marginTop: 15,
  },
  modal: {
    justifyContent: "flex-end",
    margin: 0
  },
  select: {
    width: 120,//130,
    height: 40//30
  },
  selectList: {
    paddingVertical: 8,
  },
  selectText: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
    textAlign: "center"
  },
  font12: {
    fontSize: 12,
    color: "#333",
    fontWeight: "400",
    textAlign: "center",
    width: 90,
  },
  mask: {
    height: 200,
    borderRadius: 5,
    paddingVertical: 39,
    backgroundColor: "#FFFFFF"
  }
})

export default copilot({
    verticalOffset: Platform.OS == "android" ? 23 : 0,
    animated: true,
    overlay: 'svg',
})(Home)
