import React from 'react'
import { View, StyleSheet, Text, Dimensions, ScrollView } from 'react-native'
import I18n from 'i18n-js'
import Modal from 'react-native-modal'

import { Touchable } from '../components'

const { width } = Dimensions.get("window");
export const Reminder = ({ isVisible, lonPress, go, ronPress }) => (
  <Modal 
    isVisible={isVisible}
    style={styles.flexCenter}
    avoidKeyboard={true}>
    <View style={styles.main}>
      <Text style={styles.text}>{I18n.t("reminder")}</Text>
      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
        <Text style={styles.textList}>{I18n.t("reminderTips")}
          <Text onPress={go} style={styles.linking}>
            《{I18n.t("agreement")}{I18n.t("and")}{I18n.t("privacy")}》
          </Text>
          ，
          {I18n.t("reminderSay")}
        </Text>
        <Text style={styles.textList}>{I18n.t("reminderTips1")}</Text>
        <Text style={styles.textList}>{I18n.t("reminderTips2")}</Text>
        <Text style={styles.textList}>{I18n.t("reminderTips3")}</Text>
        <Text style={styles.textList}>{I18n.t("reminderTips4")}</Text>
      </ScrollView>
      <View style={styles.btnBox}>
        <Touchable onPress={lonPress} style={styles.btn}>
          <Text style={styles.minText}>{I18n.t("disagree")}</Text>
        </Touchable>
        <Touchable onPress={ronPress} style={[styles.btn, styles.active]}>
          <Text style={[styles.minText, {color: "#ffffff"}]}>{I18n.t("agree")}</Text>
        </Touchable>
      </View>
    </View>
  </Modal>
)

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
