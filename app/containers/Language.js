import React, { Component } from 'react'
import { StyleSheet, View, Text, Linking } from 'react-native'
import { connect } from 'react-redux'
import I18n from 'i18n-js'

import { createAction, NavigationActions, StackActions, Storage, setLanguage } from '../utils'
import { SingleRow } from '../components'
import { StorageKey } from '../utils/config'

@connect()
class Language extends Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  render() {
    return (
      <View style={styles.main}>
        <View style={[styles.container, styles.marginV20]}>
          <SingleRow onPress={_=>{this.setLanguage("zh-CN")}} text={"中文简体"} />
          <SingleRow onPress={_=>{this.setLanguage("zh-TW")}} text={"中文繁體"} />
          <SingleRow onPress={_=>{this.setLanguage("en-US")}} text={"English"} />
          <SingleRow onPress={_=>{this.setLanguage("ja-JP")}} text={"日本語"} />
          <SingleRow onPress={_=>{this.setLanguage("ko-KR")}} text={"한국어"} />
        </View>
        <Text onPress={this.goAgrrement} style={styles.linking}>
          《{I18n.t("agreement")}{I18n.t("and")}{I18n.t("privacy")}》
        </Text>
      </View>
    )
  }

  setLanguage(lang){
    const code = lang.replace(/-/g, '');
    const language = { lang, code };
    let isKoKR = false;
    if(language.lang == "ko-KR"){
        isKoKR = true;
    }
    this.props.dispatch(createAction("app/updateState")({ isKoKR }));
    setLanguage(language);
    Storage.set(StorageKey.language, language);
    this.props.dispatch(StackActions.reset({
      index: 0,
      actions: [NavigationActions.navigate({ routeName: 'Home' })] 
    }));
  }

  linking = () => {
    Linking.openURL("http://zzz.wx1108.com/privacy.html");
  }

  goAgrrement = () => {
    this.props.dispatch(NavigationActions.navigate({ routeName: 'Agreement' }))
  }
}

const styles = StyleSheet.create({
  main: {
    flex: 1, 
    backgroundColor: "#FFFFFF"
  },
  container: {
    flex: 1,
    marginVertical: 20,
    paddingHorizontal: 20,
    justifyContent: "space-around",
  },
  marginV20: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingVertical: 30,
  },
  linking: {
    color: "#333",
    textAlign: "center",
    paddingVertical: 10,
    textDecorationLine: "underline",
  }
})

export default Language
