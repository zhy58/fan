import React from 'react'
import { FlatList } from 'react-native'
import _RefreshControl from './RefreshControl'

const refresh = _ => {};

const _FlatList = ({children, onRefresh, style, ...rest}) => 
{
  return (
    <FlatList showsVerticalScrollIndicator={false}
      keyExtractor={(item, index) => index.toString()}
      refreshControl={
        <_RefreshControl
          onRefresh={onRefresh || refresh}
        />
      }
      {...rest}
    />
  )
};

export default _FlatList