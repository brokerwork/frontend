import createHistory from "history/createBrowserHistory";
import configStore from "./middlewares/store";
import { Provider } from "react-redux";
import { ConnectedRouter } from "react-router-redux";
import { AppContainer } from "react-hot-loader";
import { render as domRender } from "react-dom";
import { IntlProvider } from "react-intl";
import i18n from "@/utils/i18n";
import Routes from "./routes";
import "intl";
var attachFastClick = require("fastclick");

attachFastClick.attach(document.body);
// 子页面从父页面中拉取sessionStorage中的信息
// ====================================
// transfers sessionStorage from one tab to another
const sessionStorageTransfer = event => {
	if (!event) {
		event = window.event;
	} // ie suq
	if (!event.newValue) return; // do nothing if no value to work with
	if (event.key === "getSessionStorage") {
		// another tab asked for the sessionStorage -> send it
		localStorage.setItem("sessionStorage", JSON.stringify(sessionStorage));
		// the other tab should now have it, so we're done with it.
		setTimeout(() => {
			localStorage.removeItem("sessionStorage");
		}, 1);
	} else if (event.key === "sessionStorage") {
		// another tab sent data <- get it
		const data = JSON.parse(event.newValue);
		for (let key in data) {
			if (sessionStorage.getItem(key)) return;
			sessionStorage.setItem(key, data[key]);
		}
	}
};

// listen for changes to localStorage
if (window.addEventListener) {
	window.addEventListener("storage", sessionStorageTransfer, false);
} else {
	window.attachEvent("onstorage", sessionStorageTransfer);
}

// Ask other tabs for session storage (this is ONLY to trigger event)
if (!sessionStorage.length) {
	localStorage.setItem("getSessionStorage", "getSessionStorage");
	localStorage.removeItem("getSessionStorage", "getSessionStorage");
}
// ====================================

const history = createHistory();
const store = configStore(history);
const render = Component => {
	domRender(
		<AppContainer>
			<Provider store={store}>
				<IntlProvider locale="en" messages={i18n}>
					<ConnectedRouter history={history}>
						<Component dispatch={store.dispatch} />
					</ConnectedRouter>
				</IntlProvider>
			</Provider>
		</AppContainer>,
		document.getElementById("root")
	);
};

render(Routes);
if (module.hot) {
	module.hot.accept("./routes", () => {
		render(Routes);
		setTimeout(() => {
			render(Routes);
		}, 1);
	});
}
