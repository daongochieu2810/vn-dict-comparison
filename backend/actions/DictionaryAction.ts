import {
  AddDictionaryAction,
  SetDictionaryAction,
  DelDictionaryAction,
  EditDictionaryAction,
  DictionaryState,
  SET_DICTIONARY,
  ADD_DICTIONARY,
  DEL_DICTIONARY,
  EDIT_DICTIONARY,
} from "../types/DictionaryType";
import { Word } from "../../components/cards/WordCard";
export const setDictionary = (data: DictionaryState): SetDictionaryAction => ({
  type: SET_DICTIONARY,
  payload: data,
});
export const addDictionary = (data: Word): AddDictionaryAction => ({
  type: ADD_DICTIONARY,
  payload: data,
});
export const delDictionary = (data: Word): DelDictionaryAction => ({
  type: DEL_DICTIONARY,
  payload: data,
});
export const editDictionary = (data: Word): EditDictionaryAction => ({
  type: EDIT_DICTIONARY,
  payload: data,
});
