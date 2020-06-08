import { createAction, NavigationActions, StackActions, Storage, setLanguage } from '../utils'
import * as authService from '../services/auth'
import { Instructions, StorageKey } from '../utils/config'

import I18n from 'i18n-js'
import * as RNLocalize from "react-native-localize"
import translate from '../translate'
import BLE from '../native'

export default {
  namespace: 'app',
  state: {
    refresh: false, // 刷新
    isKoKR: false,
    loading: true,
    isAccept: false,
    power: Instructions.powerOff,
    currentDevice: null,
    devices: []
  },
  reducers: {
    updateState(state, { payload }) {
      return { ...state, ...payload }
    },
  },
  effects: {
    *loadStorage({ payload }, { call, put }) {
      const language = yield call(Storage.get, StorageKey.language);
      let isKoKR = false;
      if(language){
        if(language.lang == "ko-KR"){
            isKoKR = true;
        }
        setLanguage(language);
      }else{
        let _language = {},
          arr_lang = RNLocalize.getLocales();
        if(arr_lang && arr_lang[0]){
          const lang = arr_lang[0];
  
          _language.lang = lang.languageTag; //"en-US"
          _language.code = lang.languageCode + (lang.countryCode).toLocaleUpperCase();//"enUS"
        }
  
        if(!translate[_language.code]){
          _language = {lang: "en-US", code: "enUS"};
        }
        if(_language.lang == "ko-KR"){
            isKoKR = true;
        }
        setLanguage(_language);
      }
      yield put(createAction("updateState")({ loading: false, isKoKR }));
      // yield put(createAction("updateState")({ isKoKR }));
    },
    *getDevices({ payload }, { call, put }) {
      const devices = yield call(BLE.getDevices);
    //   console.log("getDevices: ", devices);
      yield put(createAction("updateState")({ devices }));
    },
    *currentDevice({ payload }, { call, put }) {
      const currentDevice = yield call(BLE.currentDevice);
    //   console.log("currentDevice: ", currentDevice);
      yield put(createAction("updateState")({ currentDevice }));
    },
  },
  subscriptions: {
    setup({ dispatch }) {
      dispatch(createAction("loadStorage")())
    },
  },
}
