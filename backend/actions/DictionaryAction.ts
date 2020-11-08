import { SetDictionaryAction, DictionaryState, SET_DICTIONARY } from '../types/DictionaryType';
export const setDictionary = (data : DictionaryState) : SetDictionaryAction => ({
    type: SET_DICTIONARY,
    payload: data
})