import React from 'react'
import { StyleSheet, View } from 'react-native'

import Touchable from './Touchable'
import Image from './Image'
import Text from './Text'

export const ImageButton = ({ style, source, text, ...rest }) => (
    <View style={[styles.btn, style]}>
        <Touchable {...rest}>
            <View style={styles.img}>
                <Image source={source} style={styles.img} />
            </View>
        </Touchable>
        <Text style={styles.marginV5}>{text}</Text>
    </View>
)

const styles = StyleSheet.create({
    btn: {
        width: 50,
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
    },
    img: {
        width: 50,
        height: 50,
    },
    marginV5: {
        marginVertical: 5,
        width: 60,
        textAlign: "center"
    },
})

export default ImageButton
