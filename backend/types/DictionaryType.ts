import { AnyAction } from 'redux';

//for actions
export const SET_DICTIONARY = 'SET_DICTIONARY'

export interface SetDictionaryAction extends AnyAction {
  type: typeof SET_DICTIONARY;
  payload: DictionaryState;
}
export type DictionaryActionTypes = SetDictionaryAction;

//for reducers
export interface WordInitGroup {
    initial: string;
    words: string[];
}
export interface Dictionary {
    [initital: string]: WordInitGroup[]; 
}
export interface DictionaryState {
    dictionary: Dictionary;
    size: number;
}