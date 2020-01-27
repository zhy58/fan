import React from 'react'

import { TextInput } from 'react-native'

const _TextInput = props => <TextInput autoCorrect={false} underlineColorAndroid={'transparent'} placeholderTextColor={'#ccc'} autoCapitalize={'none'} {...props} />

export default _TextInput