import React from 'react'
import { StyleSheet, View } from 'react-native'
import I18n from 'i18n-js'

import Text from './Text'
import Touchable from './Touchable'

export const ButtonList = ({ name, lbtnText = I18n.t("rename"), rbtnText = I18n.t("delete"), lonPress, ronPress }) => (
    <View style={[styles.list, styles.flexBetween]}>
        <Text style={styles.text}>{name}</Text>
        <View style={styles.flexRowCenter}>
            <Touchable onPress={lonPress} style={styles.btn}>
                <Text style={styles.minText}>{lbtnText}</Text>
            </Touchable>
            <Touchable onPress={ronPress} style={styles.btn}>
                <Text style={styles.minText}>{rbtnText}</Text>
            </Touchable>
        </View>
    </View>
)

const styles = StyleSheet.create({
    minText: {
        color: "#333",
        fontSize: 14
    },
    text: {
        color: "#333",
        fontSize: 16,
        fontWeight: "500"
    },
    btn: {
        marginLeft: 10,
        paddingHorizontal: 22,
        paddingVertical: 5,
        borderRadius: 16,
        borderColor: "#333",
        borderWidth: 0.5,
    },
    list: {
        paddingHorizontal: 20,
        paddingVertical: 10
    },
    flexRowCenter: {
        display: 'flex',
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center"
    },
    flexBetween: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
})

export default ButtonList
