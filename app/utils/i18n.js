import * as RNLocalize from "react-native-localize";
import i18n from 'i18n-js';

import translate from '../translate';

export default (_ => {
    let lang = "zh-CN", code = "zhCN";
    let arr_lang = RNLocalize.getLocales();
    if(arr_lang && arr_lang[0]){
        let lang = arr_lang[0];
        locale = lang.languageTag; //"en-US"
        code = (lang.languageCode + (lang.countryCode).toLocaleUpperCase()) || code;
        // console.log("系统语言：", lang);
    }
    i18n.translations[lang] = translate[code];
    i18n.defaultLocale = lang;
    i18n.locale = lang;
})();

// 中文简体
// isRTL: false
// countryCode: "CN"
// languageTag: "zh-CN"
// languageCode: "zh"

// 中文繁体
// isRTL: false
// countryCode: "TW"
// languageTag: "zh-TW"
// languageCode: "zh"

// 英语
// isRTL: false
// countryCode: "US"
// languageTag: "en-US"
// languageCode: "en"

// 日语
// isRTL: false
// countryCode: "JP"
// languageTag: "ja-JP"
// languageCode: "ja"

// 韩语
// isRTL: false
// countryCode: "KR"
// languageTag: "ko-KR"
// languageCode: "ko"