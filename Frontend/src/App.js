import React, { PureComponent } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store/index';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Main from './components/Main';

class App extends PureComponent {
  render() {
    return (
      <Provider store={store}>
        <BrowserRouter>
          <div>
            {/* App Component Has a Child Component called Main */}
            <Main />
          </div>
        </BrowserRouter>
      </Provider>
    );
  }
}
export default App;
