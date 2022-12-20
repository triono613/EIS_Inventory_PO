import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import translation from './app/shared/i18n/en';

export const defaultNS = "translation";
export const resources = {
  en: {
    translation: translation,
  },
}

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: 'id',

    keySeparator: false, // we do not use keys in form messages.welcome

    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  })

export default i18n
