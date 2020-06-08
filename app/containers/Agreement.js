import React, { Component } from 'react'
import { StyleSheet, View, Text, Platform } from 'react-native'
import { connect } from 'react-redux'
import I18n from 'i18n-js'
import Ionicons from 'react-native-vector-icons/Ionicons'

import tool from './style/style'
import { ScrollView, Touchable } from '../components'
import { NavigationActions, createAction } from '../utils'

@connect()
class Agreement extends Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={[styles.header, tool.flexBetween]}>
          <Touchable onPress={this.goBack} style={[styles.flexRowCenter, styles.back]}>
            <Ionicons name={"ios-arrow-back"} color={"#333"} size={24} />
            <View style={styles.title}>
              <Text style={styles.text}>
                {I18n.t("agreement")}
                {I18n.t("and")}
                {I18n.t("privacy")}
              </Text>
            </View>
          </Touchable>
          <Text></Text>
        </View>
        <ScrollView>
          <View style={[tool.paddingH20, styles.marginB30]}>
            <View><Text style={[styles.titleText, tool.weight]}>用户协议与隐私政策</Text></View>
            <View><Text style={styles.mainText}>本软件尊重并保护所有使用服务用户的个人隐私权。为了给您提供更准确、更有个性化的服务，本软件会按照本隐私权政策的规定使用和披露您的个人信息。但本软件将以高度的勤勉、审慎义务对待这些信息。除本隐私权政策另有规定外，在未征得您事先许可的情况下，本软件不会将这些信息对外披露或向第三方提供。本软件会不时更新本隐私权政策。您在同意本软件服务使用协议之时，即视为您已经同意本隐私权政策全部内容。本隐私权政策属于本软件服务使用协议不可分割的一部分。</Text></View>
            <View><Text style={[styles.titleText, tool.weight]}>一、适用范围</Text></View>
            <View><Text style={styles.mainText}>1）在您使用本软件网络服务，本软件自动接收并记录的您的手机上的信息，包括但不限于您的健康数据、使用的语言、访问日期和时间、软硬件特征信息及您需求的网页记录等数据；</Text></View>
            <View><Text style={[styles.titleText, tool.weight]}>二、信息的使用</Text></View>
            <View><Text style={styles.mainText}>1）在获得您的数据之后，本软件会将其上传至服务器，以生成您的排行榜数据，以便您能够更好地使用服务。</Text></View>
            <View><Text style={[styles.titleText, tool.weight]}>三、信息披露</Text></View>
            <View><Text style={styles.mainText}>1）本软件不会将您的信息披露给不受信任的第三方；</Text></View>
            <View><Text style={styles.mainText}>2）根据法律的有关规定，或者行政或司法机构的要求，向第三方或者行政、司法机构披露；</Text></View>
            <View><Text style={styles.mainText}>3）如您出现违反中国有关法律、法规或者相关规则的情况，需要向第三方披露；</Text></View>
            <View><Text style={[styles.titleText, tool.weight]}>四、信息存储和交换</Text></View>
            <View><Text style={styles.mainText}>本软件收集的有关您的信息和资料将保存在本软件及（或）其关联公司的服务器上，这些信息和资料可能传送至您所在国家、地区或本软件收集信息和资料所在地的境外并在境外被访问、存储和展示。</Text></View>
            <View><Text style={[styles.titleText, tool.weight]}>五、信息安全</Text></View>
            <View><Text style={styles.mainText}>1）在使用本软件网络服务进行网上交易时，您不可避免的要向交易对方或潜在的交易对方披露自己的个人信息，如联络方式或者邮政地址。请您妥善保护自己的个人信息，仅在必要的情形下向他人提供。如您发现自己的个人信息泄密，请您立即联络本软件客服，以便本软件采取相应措施。</Text></View>
          </View>
        </ScrollView>
      </View>
    )
  }

  goBack = () => {
    // console.log(this.props.navigation);
    const { params } = this.props.navigation.state
    if(params){
      this.props.dispatch(createAction("app/updateState")({ refresh: true }));
    }
    this.props.dispatch(NavigationActions.back());
  }
  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff"
  },
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
  back: {
    height: 40
  },
  title: {
    marginLeft: 10
  },
  text: {
    color: "#333",
    fontSize: 16
  },
  mainText: {
    color: "#333",
    lineHeight: 20,
  },
  titleText: {
    color: "#333",
    lineHeight: 24,
    paddingVertical: 5,
  },
  marginB30: {
    marginBottom: 30,
  }
})

export default Agreement
