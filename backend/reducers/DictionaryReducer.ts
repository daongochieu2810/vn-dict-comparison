import { Reducer } from "redux";
import {
  DictionaryState,
  DictionaryActionTypes,
  SET_DICTIONARY,
  ADD_DICTIONARY,
  DEL_DICTIONARY,
  EDIT_DICTIONARY,
} from "../types/DictionaryType";
import { Word } from "../../components/cards/WordCard";
const initState: DictionaryState = {
  dictionary: {},
  size: 0,
};

export const dictionaryReducer: Reducer<
  DictionaryState,
  DictionaryActionTypes
> = (state = initState, action: DictionaryActionTypes): DictionaryState => {
  switch (action.type) {
    case SET_DICTIONARY: {
      return {
        dictionary: action.payload.dictionary,
        size: action.payload.size,
      };
    }
    case ADD_DICTIONARY: {
      let word: Word = action.payload;
      let newDictionary = state.dictionary;
      if (!newDictionary[word.word[0]]) {
        newDictionary[word.word[0]] = [];
      }
      newDictionary[word.word[0]].push(word);
      return {
        ...state,
        dictionary: newDictionary,
        size: state.size + 1,
      };
    }
    case DEL_DICTIONARY: {
      let word: Word = action.payload;
      let newDictionary = state.dictionary;
      newDictionary[word.word[0]] = state.dictionary[word.word[0]].filter(
        (item) => item.id !== word.id
      );
      return {
        ...state,
        dictionary: newDictionary,
        size: state.size - 1,
      };
    }
    case EDIT_DICTIONARY: {
      let word: Word = action.payload;
      let newDictionary = state.dictionary;
      newDictionary[word.word[0]] = state.dictionary[word.word[0]].map(
        (item) => {
          if (item.id === word.id) {
            return word;
          }
          return item;
        }
      );
      return {
        ...state,
        dictionary: newDictionary,
      };
    }
    default: {
      return initState;
    }
  }
};
