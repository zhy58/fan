import React from 'react'
import { ScrollView } from 'react-native'
import _RefreshControl from './RefreshControl'

const refresh = _ => {};

const _ScrollView = ({children, onRefresh, style, ...rest}) => 
{
  return (
    <ScrollView showsVerticalScrollIndicator={false}
      style={[{flex: 1, backgroundColor: "#FFFFFF"}, style]}
      refreshControl={
        <_RefreshControl
          onRefresh={onRefresh || refresh}
        />
      }
      {...rest}
    >
      {children}
    </ScrollView>
  )
};

export default _ScrollView