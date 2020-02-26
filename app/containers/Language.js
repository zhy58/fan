import React, { Component } from 'react'
import { StyleSheet, View } from 'react-native'
import { connect } from 'react-redux'
import I18n from 'i18n-js'

import { NavigationActions, StackActions, Storage, setLanguage } from '../utils'
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
      <View style={[styles.marginV20]}>
        <View style={styles.container}>
          <SingleRow onPress={_=>{this.setLanguage("zh-CN")}} text={"中文简体"} />
          <SingleRow onPress={_=>{this.setLanguage("zh-TW")}} text={"中文繁體"} />
          <SingleRow onPress={_=>{this.setLanguage("en-US")}} text={"English"} />
          <SingleRow onPress={_=>{this.setLanguage("ja-JP")}} text={"日本語"} />
          <SingleRow onPress={_=>{this.setLanguage("ko-KR")}} text={"한국어"} />
        </View>
      </View>
    )
  }

  setLanguage(lang){
    const code = lang.replace(/-/g, '');
    const language = { lang, code };
    
    setLanguage(language);
    Storage.set(StorageKey.language, language);
    this.props.dispatch(StackActions.reset({
      index: 0,
      actions: [NavigationActions.navigate({ routeName: 'Home' })] 
    }));
  }
}

const styles = StyleSheet.create({
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
})

export default Language
