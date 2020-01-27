import React from 'react'
import { StyleSheet } from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons'
import Octicons from 'react-native-vector-icons/Octicons'

import Touchable from './Touchable'

export const IconButton = ({ style, name, color, size = 30, type, ...rest }) => (
    <Touchable style={[styles.iconBtn, style]} {...rest} >
        {renderIconView(name, color, size, type)}
    </Touchable>
)

const renderIconView = (name, color, size, type) => {
    switch(type){
        case "Octicons":
            return <Octicons name={name} color={color} size={size} />
        default:
            return <Ionicons name={name} color={color} size={size} />
    }
}

const styles = StyleSheet.create({
    iconBtn: {
        width: 50,
        height: 50,
        overflow: 'hidden',
        backgroundColor: "#EFEFEF",
        justifyContent: "center",
        alignItems: "center"
    },
})

export default IconButton
