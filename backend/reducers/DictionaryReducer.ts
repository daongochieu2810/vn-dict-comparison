import { Reducer } from 'redux';
import { DictionaryState, DictionaryActionTypes, SET_DICTIONARY } from '../types/DictionaryType';

const initState : DictionaryState = {
    dictionary: {},
    size: 0
}

export const dictionaryReducer : Reducer<DictionaryState, DictionaryActionTypes> = (
    state = initState, 
    action: DictionaryActionTypes
) : DictionaryState => {
    switch (action.type) {
        case SET_DICTIONARY: {
            return {
                dictionary: {...state.dictionary},
                size: state.size
            }
        }
        default: {
            return initState;
        }
    }
}