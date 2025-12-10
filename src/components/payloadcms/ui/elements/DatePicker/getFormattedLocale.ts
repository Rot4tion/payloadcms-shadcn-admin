// @ts-nocheck payloadcms original type safe issue will fix later
'use client'
export const getFormattedLocale = (language = 'enUS') => {
  const formattedLocales = {
    en: 'enUS',
    my: 'enUS', // Burmese is not currently supported
    ua: 'uk',
    zh: 'zhCN',
  }

  const formattedLocale = formattedLocales[language] || language

  return formattedLocale
}
