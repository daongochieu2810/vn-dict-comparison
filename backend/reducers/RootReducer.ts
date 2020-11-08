import { exp } from 'react-native-reanimated';
import { combineReducers } from 'redux';
import { dictionaryReducer } from './DictionaryReducer';

const rootReducer = combineReducers({
    dictionaryReducer: dictionaryReducer    
});
export default rootReducer;
export type RootState = ReturnType<typeof rootReducer>;