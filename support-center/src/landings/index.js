import createHistory from 'history/createBrowserHistory';
import storeFun from './store';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';
import { AppContainer } from 'react-hot-loader';
import { render as domRender } from 'react-dom';
import { IntlProvider } from 'react-intl';
import Routes from './routes';


const history = createHistory();
const store = storeFun(history);
const render = Component => {
  domRender(
    <AppContainer>
      <Provider store={store}>
        <IntlProvider locale="en">
          <ConnectedRouter history={history}>
            <Component />
          </ConnectedRouter>
        </IntlProvider>
      </Provider>
    </AppContainer>
    , document.getElementById('react-root')
  );
};

render(Routes);

if (module.hot) {
  module.hot.accept('./routes', () => render(Routes));
}


