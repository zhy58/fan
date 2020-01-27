import React, { Component } from 'react'
import { StyleSheet, View, FlatList, Platform, PermissionsAndroid, Dimensions } from 'react-native'
import { connect } from 'react-redux'
import I18n from 'i18n-js'
import Modal from 'react-native-modal'

import { IconButton, ImageButton, CtrlList, CtrlTitle, Image, ScrollView, Touchable, Text } from '../components'
import BLE from '../native'
import { NavigationActions, createAction, Toast } from '../utils'
import { Instructions } from '../utils/config'
import { requestCameraPermission } from '../utils/permissions'
import tool from './style/style'

const { width, height } = Dimensions.get("window");

@connect(({ app }) => ({ ...app }))
class Home extends Component {
  constructor(props) {
    super(props);
    this.powerOnColor = "rgb(0,153,68)";
    this.powerOffColor = "rgb(230,0,18)";
    this.state = {
      isVisible: false,
      power: Instructions.powerOff,
    }
  }

  componentWillMount() {
    this.initBle();
  }
  judgeDevice = _ => {
    if(this.props.currentDevice && this.props.currentDevice.name){
      return true;
    }
    Toast(I18n.t("selectDeviceTip"));
    return false;
  }
  power = _ => {
    if(this.judgeDevice()){
      const power = this.state.power === Instructions.powerOff ? Instructions.powerOn : Instructions.powerOff;
      this.setState({power});
      BLE.send(power);
    }
  }
  sendOrder(order) {
    if(this.judgeDevice()){
      BLE.send(order).then(res => {
        if(res.status == 4){
          Toast(I18n.t("openDeviceTip"));
        }
      }).catch(err => {
        console.log("sendOrder err", err);
      });
    }
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
    let powerColor = this.state.power === Instructions.powerOn ? this.powerOnColor : this.powerOffColor;
    return (
      <View style={tool.container}>
        <ScrollView contentContainerStyle={tool.paddingH30}>
          <View style={[tool.flexCenter, tool.marginT30]}>
            <IconButton onPress={this.power} style={styles.iconBtnCir} name="ios-power" color={powerColor} />
          </View>
          <View style={[tool.flexBetween, styles.marginT15]}>
            <CtrlList tname={"md-add"} bname={"md-remove"} 
              tonPress={_=>{this.sendOrder(Instructions.gearPlus)}}
              bonPress={_=>{this.sendOrder(Instructions.gearMinus)}}
              source={require('../images/amount.png')} />
            <View style={[styles.box, tool.flexCenter]}>
              <Image source={require('../images/in.png')} style={styles.moving} />
            </View>
            <CtrlList tname={"ios-arrow-up"} bname={"ios-arrow-down"} 
              tonPress={_=>{this.sendOrder(Instructions.timePlus)}}
              bonPress={_=>{this.sendOrder(Instructions.timeMinus)}}
              source={require('../images/timer.png')} />
          </View>
          {/* 循环 */}
          <View style={tool.marginT20}>
            <CtrlTitle title={I18n.t("rotation")} />
            <View style={[tool.flexBetween, tool.marginT10]}>
              <ImageButton onPress={_=>{this.sendOrder(Instructions.upDown)}} source={require('../images/updown.png')} text={I18n.t("upDown")} />
              <ImageButton onPress={_=>{this.sendOrder(Instructions.leftRight)}} source={require('../images/lrt.png')} text={I18n.t("leftRight")} />
              <ImageButton onPress={_=>{this.sendOrder(Instructions.threeD)}} source={require('../images/a3d.png')} text={I18n.t("threeD")} />
              <ImageButton onPress={_=>{this.sendOrder(Instructions.cancel)}} source={require('../images/cancel.png')} text={I18n.t("cancle")} />
            </View>
          </View>
          {/* 模式 */}
          <View style={tool.marginT20}>
            <CtrlTitle title={I18n.t("windMode")} />
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
          <IconButton onPress={this.goLanguage} type={"Octicons"} name={"globe"} style={styles.icon} />
          <Touchable style={[styles.select, tool.flexCenter]} onPress={this.select}>
            <Text style={tool.weight}>{dev.name}</Text>
          </Touchable>
          <IconButton onPress={this.goMore} type={"Octicons"} name={"gear"} style={styles.icon} />
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
  iconBtnCir: {
    borderRadius: 25,
  },
  box: {
    height: 198,
  },
  moving: {
    width: 90,
    height: 90,
  },
  bar: {
    paddingHorizontal: 30,
    height: 50,
    justifyContent: "center",
    overflow: "hidden",
  },
  icon: {
    width: 50,
    height: 50,
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
    width: 120,
    height: 40
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
  mask: {
    height: 200,
    borderRadius: 5,
    paddingVertical: 39,
    backgroundColor: "#FFFFFF"
  }
})

export default Home
