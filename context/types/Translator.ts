/**
 * Human translator data types
 */

export type DictionaryType = {
    name: string,
    position: number,
    items: Record<string,string>  // { toke:value, ....}
    loaded: boolean
}
export type TranslatorDataType = {
    lng: string,
    dictionaries: Array<DictionaryType>,
}
export type TranslatorStoreStateType = {
    translator: TranslatorDataType
}
