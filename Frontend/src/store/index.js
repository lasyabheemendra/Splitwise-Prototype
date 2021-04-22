import { createStore, applyMiddleware, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import rootReducer from '../reducers/index';

const storeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const persistConfig = {
  key: 'rootReducer',
  storage,
  whitelist: ['rootReducer'],
};
const presistedReducer = persistReducer(persistConfig, rootReducer);
const store = createStore(
  presistedReducer,
  storeEnhancers(applyMiddleware(
    thunkMiddleware,
  )),
);

const persistor = persistStore(store);
export { persistor, store };
