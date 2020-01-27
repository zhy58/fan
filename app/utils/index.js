import translate from '../translate'
import i18n from 'i18n-js'

export { NavigationActions, StackActions } from 'react-navigation'

export { default as Storage } from './storage'
export { default as Toast } from './toast'

export const createAction = type => payload => ({ type, payload })

export const setLanguage = language => {
    i18n.translations[language.lang] = translate[language.code];
    i18n.defaultLocale = language.lang;
    i18n.locale = language.lang;
}

