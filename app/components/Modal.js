import React from 'react'
import { StyleSheet, View, Dimensions } from 'react-native'
import Modal from 'react-native-modal'

const { width } = Dimensions.get("window");

const _Modal = ({style, maskStyle, children, onBackButtonPress, ...rest}) => 
{
  return (
    <Modal style={[styles.modal, style]}
      avoidKeyboard={true}
      swipeDirection={['down']}
      onSwipeComplete={onBackButtonPress}
      onBackButtonPress={onBackButtonPress}
      onBackdropPress={onBackButtonPress}
      {...rest}
    >
      <View style={[styles.chooseModal, maskStyle]}>
        {children}
      </View>
    </Modal>
  )
};

const styles = StyleSheet.create({
  modal:{
    justifyContent: "flex-end",
    margin: 0
  },
  blue: {
    color: '#00A0E9',
  },
  chooseModal:{
    width: 0.8 * width,
    height: 170,
    backgroundColor: "#FAFAFA",
    padding: 20,
    borderRadius: 6,
    borderColor: "rgba(0, 0, 0, 0.1)",
    overflow: "hidden",
  },
})

export default _Modal