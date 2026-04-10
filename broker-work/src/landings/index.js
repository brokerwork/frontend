import createHistory from 'history/createBrowserHistory';
import storeFun from './store';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';
import { AppContainer } from 'react-hot-loader';
import { render as domRender } from 'react-dom';
import { IntlProvider } from 'react-intl';
import { Icon } from 'lean-ui';
import Routes from './routes';
import '../utils/sessionStorageShare';
import '../less/themes/index.less';
import 'lean-ui/dist/index.less';

if (Array.isArray(window.__bwIconData__)) {
  window.__bwIconData__.forEach(item => {
    Icon.addFontType(item.type, item.data);
  });
}
if (__DEV__) {
  const consoleError = window.console.error;
  window.console.error = function(msg) {
    if (
      msg &&
      typeof msg.indexOf === 'function' &&
      msg.indexOf('getDefaultProps') !== -1
    )
      return;
    //consoleError(...arguments);
  };
}
const history = createHistory();
const store = storeFun(history);
const render = Component => {
  domRender(
    <AppContainer>
      <Provider store={store}>
        <IntlProvider locale="en">
          <ConnectedRouter history={history}>
            <Component dispatch={store.dispatch} />
          </ConnectedRouter>
        </IntlProvider>
      </Provider>
    </AppContainer>,
    document.getElementById('react-root')
  );
};

const themeId = window.localStorage.getItem('THEME_ID');
if (themeId) {
  document.body.setAttribute('class', `${themeId.toLowerCase()}-theme`);
}
setTimeout(() => {
  render(Routes);
}, 1);

if (module.hot) {
  module.hot.accept('./routes', () => {
    setTimeout(() => {
      render(Routes);
    }, 1);
  });
}
