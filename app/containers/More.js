import React, { Component } from 'react'
import { StyleSheet, View, Platform, Text as RNText } from 'react-native'
import { connect } from 'react-redux'
import I18n from 'i18n-js'
import Ionicons from 'react-native-vector-icons/Ionicons'

import { FlatList, Text, Touchable, ButtonList, Modal, TextInput } from '../components'
import tool from './style/style'
import { Storage, NavigationActions, createAction, Toast } from '../utils'
import { StorageKey } from '../utils/config'
import BLE from '../native'

@connect(({ app }) => ({ ...app }))
class More extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isVisibleTips: true,
      isVisible: false,
      value: "",
      deviceID: "",
    }
  }
  componentDidMount() {
    //   
    // Storage.get(StorageKey.addDeviceTips).then(res => {
    //     // console.log("res: ", res);
    //     this.setState({
    //         isVisibleTips: !res
    //     });
    // }).catch(err => {
    //     console.log("get StorageKey.addDeviceTips err: ", err);
    // });
  }
  render() {
    return (
      <View style={tool.container}>
        <View style={[styles.header, tool.flexBetween]}>
          <Touchable onPress={this.goBack} style={[styles.flexRowCenter, styles.back]}>
            <Ionicons name={"ios-arrow-back"} color={"#333"} size={24} />
            <View style={styles.title}>
              <Text style={styles.text}>{I18n.t("addDevice")}</Text>
            </View>
          </Touchable>
          <Touchable onPress={this.add} style={styles.add}>
              <Text style={styles.text}>{I18n.t("add")}</Text>
          </Touchable>
        </View>
        
        <FlatList
          data={this.props.devices}
          renderItem={({item, index}) => <ButtonList key={index} name={item.name} lonPress={_=>{this.editName(item)}} ronPress={_=>{this.del(item)}} /> } />
        
        <Modal isVisible={this.state.isVisible} 
          style={tool.flexCenter}
          onBackButtonPress={this.closeModal}>
          <View style={{flex: 1}}>
            <Text style={[styles.text, tool.weight]}>{I18n.t("name")}</Text>
            <TextInput 
              style={styles.input}
              value={this.state.value}
              onChangeText={value => {this.setState({ value })}}
              placeholder={I18n.t("enterDeviceName")} />
            <Touchable onPress={this.comfirm} style={styles.btn}>
              <Text style={styles.minText}>{I18n.t("confirm")}</Text>
            </Touchable>
          </View>
        </Modal>

        <Modal isVisible={this.state.isVisibleTips}
          style={tool.flexCenter}
          maskStyle={{height: 250}}
          onBackButtonPress={this.closeModal}>
          <View style={{flex: 1}}>
            <Text style={[styles.tips, tool.weight]}>{I18n.t("tips")}:</Text>
            <View style={styles.tipBox}>
                <RNText style={styles.tipText}>{I18n.t("tipText")}</RNText>
            </View>
            {/* <View style={tool.flexBetween}> */}
                {/* <Touchable onPress={this.comfirmTips} style={styles.btn1}>
                    <Text style={styles.minText}>{I18n.t("noPrompt")}</Text>
                </Touchable> */}
                <Touchable onPress={this.comfirmTipsFirst} style={styles.btn}>
                    <Text style={styles.minText}>{I18n.t("iKnow")}</Text>
                </Touchable>
            {/* </View> */}
          </View>
        </Modal>
      </View>
    )
  }
  goBack = () => {
    this.props.dispatch(NavigationActions.back());
  }
  add = () => {
    let value = "MY FANS";
    // let devices = this.props.devices;
    // if(devices && devices.length > 0){
    //     const reg = /^Fan(\d+)?$/g;
    //     const regNum = /\d+$/g;
    //     let result = 0;
    //     devices.map((item, idx)=>{
    //         if(item.name){
    //             const regVal = item.name.match(reg);
    //             if(regVal && regVal[0]){
    //                 let num = regVal[0].match(regNum);
    //                 num = num ? parseInt(num) : 0;
    //                 if(num > result){
    //                     result = num;
    //                 }
    //             }
    //         }
    //     });
    //     value = value + (parseInt(result) + 1);
    // }
    this.setState({ value, isVisible: true, deviceID: "" });
  }
  closeModal = () => {
    this.setState({ isVisible: false, value: "" });
  }
  editName(item) {
    this.setState({ value: item.name, isVisible: true, deviceID: item.id });
  }
  del(item) {
    const that = this;
    if(item.id){
        BLE.delete(item.id).then(({devices, status}) => {
          that.props.dispatch(createAction("app/updateState")({ devices }));
          that.props.dispatch(createAction("app/currentDevice")());
        });
    }
    // BLE.checkBLEState().then(res => {
    //     if(res && res.status){
            
    //     }else{
    //         Toast(I18n.t("openBLETip"));
    //     }
    // }).catch(err => {
    //     console.log("isBLEEnabled err: ", err);
    // });
  }
  comfirm = () => {
    const that = this;
    BLE.checkBLEState().then(res => {
        if(res && res.status){
            if(that.state.value){
                if(Platform.OS == "ios"){
                    BLE.add(that.state.value, that.state.deviceID).then(({devices, status}) => {
                        //   console.log("devices: ", devices, status);
                          that.props.dispatch(createAction("app/updateState")({ devices }));
                        if(status == 0){
                            //设备存在
                            Toast(I18n.t("sameDevice"));
                        }else{
                            that.closeModal();
                            setTimeout(()=>{
                                that.goBack();
                            }, 350);
                        }
                    });
                }else{
                    BLE.isSupport().then(({ isSupport }) => {
                        if(isSupport){
                            BLE.add(that.state.value, that.state.deviceID).then(({devices, status}) => {
                            //   console.log("devices: ", devices, status);
                              that.props.dispatch(createAction("app/updateState")({ devices }));
                              if(status == 0){
                                //设备存在
                                Toast(I18n.t("sameDevice"));
                              }else{
                                that.closeModal();
                                setTimeout(()=>{
                                    that.goBack();
                                }, 350);
                              }
                            });
                        }else{
                            that.closeModal();
                            Toast(I18n.t("noSupportBLEAdv"));
                        }
                    }).catch(err => {
                        console.log("isSupport err: ", err);
                    });
                }
            }
        }else{
            that.closeModal();
            Toast(I18n.t("openBLETip"));
        }
    }).catch(err => {
        console.log("isBLEEnabled err: ", err);
    });
  }
//   comfirmTips = () => {
//     this.setState({
//         isVisibleTips: false
//     });
//     Storage.set(StorageKey.addDeviceTips, true);
//   }
  comfirmTipsFirst = () => {
    this.setState({
        isVisibleTips: false
    });
  }
}

const styles = StyleSheet.create({
  header: {
    marginTop: Platform.select({
        ios: 20,
        android: 0
    }),
    paddingHorizontal: 20,
    paddingVertical: 5,
  },
  flexRowCenter: {
    display: 'flex',
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
  },
  title: {
    marginLeft: 10
  },
  text: {
    color: "#333",
    fontSize: 16
  },
  tips: {
    color: "#333",
    fontSize: 18
  },
  tipBox: {
    marginTop: 10,
    flex: 1,
  },
  tipText: {
    color: "#666",
    fontSize: 16,
    height: 130
  },
  input: {
    marginVertical: 20,
    fontSize: 14,
    paddingVertical: 0,
    paddingHorizontal: 0,
  },
  btn: {
    marginHorizontal: 25,
    paddingHorizontal: 22,
    paddingVertical: 8,
    borderRadius: 16,
    borderColor: "#333",
    borderWidth: 0.5,
    alignItems: "center",
  },
  btn1: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    borderColor: "#333",
    borderWidth: 0.5,
    alignItems: "center",
  },
  back: {height: 40},
  add: {
    height: 40,
    width: 40,
    justifyContent: "center"
  },
})

export default More
