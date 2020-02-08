import React from 'react'
import { StyleSheet, View } from 'react-native'

import Image from './Image'
import IconButton from './IconButton'

export const CtrlList = ({ tonPress, bonPress, source, tname, bname, imgSty, color = "#727272", size = 30 }) => (
    <View style={styles.box}>
        <IconButton onPress={tonPress} style={styles.list} name={tname} color={color} size={size} />
        <View style={styles.list}>
            <Image source={source} style={[styles.img, imgSty]} />
        </View>
        <IconButton onPress={bonPress} style={styles.list} name={bname} color={color} size={size} />
    </View>
)

const styles = StyleSheet.create({
    box: {
        width: 60,
        backgroundColor: "#EFEFEF",
        borderRadius: 12,
        overflow: "hidden"
    },
    list: {
        width: "100%",
        height: 66,
        backgroundColor: "transparent",
        alignItems: "center",
        justifyContent: "center"
    },
    img: {
        width: 26,
        height: 26,
        overflow: "hidden"
    },
})

export default CtrlList
