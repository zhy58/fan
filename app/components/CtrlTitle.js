import React from 'react'
import { StyleSheet, View, Text } from 'react-native'

import Image from './Image'

export const CtrlTitle = ({ title, source = require('../images/load.png') }) => (
    <View style={styles.flexCenter}>
        <Text>{title}</Text>
        <Image source={source} style={styles.load} />
    </View>
)

const styles = StyleSheet.create({
    load: {
        width: 34,
        height: 14, 
    },
    flexCenter: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
    },
})

export default CtrlTitle
