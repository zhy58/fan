import React, { PureComponent } from 'react'
import { View, StyleSheet, Text, Dimensions, ScrollView, Platform, BackHandler, Linking } from 'react-native'
import { connect } from 'react-redux'
import I18n from 'i18n-js'
import Modal from 'react-native-modal'

import { Touchable } from '../components'
import { Storage, createAction } from '../utils'
import { StorageKey } from '../utils/config'
import Loading from './Loading'

const { width } = Dimensions.get("window");

@connect(({ app }) => ({ app }))
class Reminder extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isVisible: false,
    }
  }

  componentDidMount() {  
    Storage.get(StorageKey.reminder).then(res => {
        console.log("res: ", res);
        let isVisible = !res ? true : false;
        this.setState({
          isVisible: isVisible
        });
        if(res){
          // Storage.set(StorageKey.reminder, false);
          this.props.dispatch(createAction("app/updateState")({ loading: false }));
        }
    }).catch(err => {
        console.log("get StorageKey.reminder err: ", err);
    });
  }

  closeModal = () => {
    this.setState({
      isVisible: false
    })
  }

  linking = () => {
    Linking.openURL("http://zzz.wx1108.com/privacy.html");
  }
  
  cancle = () => {
    if(Platform.OS == "android"){
      this.closeModal()
      BackHandler.exitApp()
    }
  }

  comfirm = () => {
    this.closeModal();
    Storage.set(StorageKey.reminder, true);
    this.props.dispatch(createAction("app/updateState")({ loading: false }));
  }

  render(){
    if(!this.state.isVisible) return <Loading />
    return (
      <Modal isVisible={this.state.isVisible} 
        style={styles.flexCenter}
        avoidKeyboard={true}>
        <View style={styles.main}>
          <Text style={styles.text}>温馨提示</Text>
          <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
            <Text style={styles.textList}>您的信任对我们至关重要，请您充分阅读<Text onPress={this.linking} style={styles.linking}>《隐私协议》</Text>。特向您说明如下：</Text>
            <Text style={styles.textList}>1、为向您提供相关功能，我们会使用必要信息；</Text>
            <Text style={styles.textList}>2、为了缓存数据信息，我们需要您授权“存储权限”，您有权拒绝或取消授权；</Text>
            <Text style={styles.textList}>3、为向您提供基本的蓝牙控制功能，我们需要您授权“蓝牙权限”，您有权拒绝或取消授权；</Text>
            <Text style={styles.textList}>4、未经您同意，我们不会从第三方处获取、共享或向其提供您的信息；</Text>
          </ScrollView>
          <View style={styles.btnBox}>
            <Touchable onPress={this.cancle} style={styles.btn}>
              <Text style={styles.minText}>不同意</Text>
            </Touchable>
            <Touchable onPress={this.comfirm} style={[styles.btn, styles.active]}>
              <Text style={[styles.minText, {color: "#ffffff"}]}>同意</Text>
            </Touchable>
          </View>
        </View>
      </Modal>
    )
  }
}

const styles = StyleSheet.create({
  flexCenter: {
    margin: 0,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  main: {
    paddingHorizontal: 20,
    width: width * 0.8,
    height: 360,
    backgroundColor: "#ffffff",
    borderRadius: 6,
    overflow: "hidden",
  },
  scrollView: {
    flex: 1,
    marginVertical: 5,
  },
  text: {
    color: "#000",
    fontSize: 16,
    textAlign: "center",
    paddingVertical: 10,
  },
  textList: {
    lineHeight: 22,
    color: "#333",
  },
  btnBox: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    alignContent: "center",
    marginTop: 5,
    marginBottom: 20,
  },
  btn: {
    width: 106,
    paddingVertical: 8,
    borderRadius: 20,
    borderColor: "#333",
    borderWidth: 0.5,
    alignItems: "center",
  },
  active: {
    backgroundColor: "#26c785",
    borderColor: "#26c785",
  },
  linking: {
    color: "#26c785",
    textDecorationLine: "underline",
  }
})

export default Reminder