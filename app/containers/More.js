import React, { Component } from 'react'
import { StyleSheet, View, Dimensions } from 'react-native'
import { connect } from 'react-redux'
import I18n from 'i18n-js'
import Ionicons from 'react-native-vector-icons/Ionicons'

import { FlatList, Text, Touchable, ButtonList, Modal, TextInput } from '../components'
import tool from './style/style'
import { NavigationActions, createAction } from '../utils'
import BLE from '../native'

@connect(({ app }) => ({ ...app }))
class More extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isVisible: false,
      value: "",
      deviceID: "",
    }
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
      </View>
    )
  }
  goBack = () => {
    this.props.dispatch(NavigationActions.back());
  }
  add = () => {
    this.setState({ isVisible: true, deviceID: "" });
  }
  closeModal = () => {
    this.setState({ isVisible: false, value: "" });
  }
  editName(item) {
    this.setState({ value: item.name, isVisible: true, deviceID: item.id });
  }
  del(item) {
    if(item.id){
      BLE.delete(item.id).then(({devices, status}) => {
        this.props.dispatch(createAction("app/updateState")({ devices }));
        this.props.dispatch(createAction("app/currentDevice")());
      });
    }
  }
  comfirm = () => {
    if(this.state.value){
      BLE.add(this.state.value, this.state.deviceID).then(({devices, status}) => {
        // console.log("devices: ", devices);
        if(status == 0){
          //设备存在
        }
        this.props.dispatch(createAction("app/updateState")({ devices }));
      });
      this.closeModal();
    }
  }
}

const styles = StyleSheet.create({
  header: {
      height: 60,
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
  input: {
    marginVertical: 20,
    fontSize: 14,
    paddingVertical: 0,
    paddingHorizontal: 0,
  },
  btn: {
    marginHorizontal: 25,
    paddingHorizontal: 22,
    paddingVertical: 5,
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
