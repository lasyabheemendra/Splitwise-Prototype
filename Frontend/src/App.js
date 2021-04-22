import React, { PureComponent } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { PersistGate } from 'redux-persist/integration/react';
import { Provider } from 'react-redux';
import { store, persistor } from './store/index';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Main from './components/Main';

class App extends PureComponent {
  render() {
    return (
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <BrowserRouter>
            <div>
              {/* App Component Has a Child Component called Main */}
              <Main />
            </div>
          </BrowserRouter>
        </PersistGate>
      </Provider>
    );
  }
}
export default App;
