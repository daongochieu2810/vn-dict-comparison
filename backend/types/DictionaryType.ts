import { AnyAction } from "redux";
import { Word } from "../../components/cards/WordCard";
//for actions
export const SET_DICTIONARY = "SET_DICTIONARY";
export const ADD_DICTIONARY = "ADD_DICTIONARY";
export const DEL_DICTIONARY = "DEL_DICTIONARY";
export const EDIT_DICTIONARY = "EDIT_DICTIONARY";

export interface SetDictionaryAction extends AnyAction {
  type: typeof SET_DICTIONARY;
  payload: DictionaryState;
}
export interface AddDictionaryAction extends AnyAction {
  type: typeof ADD_DICTIONARY;
  payload: Word;
}
export interface DelDictionaryAction extends AnyAction {
  type: typeof DEL_DICTIONARY;
  payload: Word;
}
export interface EditDictionaryAction extends AnyAction {
  type: typeof EDIT_DICTIONARY;
  payload: Word;
}
export type DictionaryActionTypes =
  | SetDictionaryAction
  | AddDictionaryAction
  | DelDictionaryAction
  | EditDictionaryAction;

//for reducers
export interface Dictionary {
  [initital: string]: Word[];
}
export interface DictionaryState {
  dictionary: Dictionary;
  size: number;
}
