import React from 'react'
import { StyleSheet, View, Text } from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons'

import Touchable from './Touchable'

const defaultColor = "#333"

export const SingleRow = ({ text, name = "ios-arrow-forward", color = defaultColor, size = 24, ...rest }) => (
    <Touchable style={styles.flexBetween} {...rest} >
        <Text style={styles.text}>{text}</Text>
        <Ionicons name={name} color={color} size={size} />
    </Touchable>
)

const styles = StyleSheet.create({
    text: {
        color: defaultColor,
        fontSize: 16,
    },
    flexBetween: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
})

export default SingleRow
