import 'server-only'
 
/* eredeti
const dictionaries = {
  en: () => import('../dictionaries/en.json').then((module) => module.default),
  hu: () => import('../dictionaries/hu.json').then((module) => module.default),
}
*/
const dic = (lng) => import('../dictionaries/'+lng+'.json').then((module => module.default));
const json = (filePath) => import(filePath).then((module => module.default));

//eredeti  export const getDictionary = async (locale) => dictionaries[locale]()
export const getDictionary = async (locale) => dic(locale);
export const getJson = async (filePath) => json(filePath);