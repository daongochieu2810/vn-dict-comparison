import ExpoFileSystemStorage from 'redux-persist-expo-filesystem';
import { AnyAction, createStore } from 'redux';
import { persistStore, persistReducer, PersistConfig } from 'redux-persist';
import rootReducer, {RootState} from './reducers/RootReducer';

const persistConfig : PersistConfig<any> = {
    key: 'root',
    storage: ExpoFileSystemStorage,
    whitelist: ['dictionaryReducer'],
    blacklist: []
}

const customPersistReducer = persistReducer(persistConfig, rootReducer);

const store = createStore<RootState, any, any, any>(customPersistReducer,{});
const persistor = persistStore(store);
export default {
  store,
  persistor
};
