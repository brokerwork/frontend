// libs
import { applyMiddleware, compose, createStore, combineReducers } from 'redux';
import { routerMiddleware, routerReducer } from 'react-router-redux';
import { hashHistory } from 'react-router';
import promiseMiddleware from './middlewares/promise';
import errorMiddleware from './middlewares/error';
import transitionMiddleware from './middlewares/transition';
import thunkMiddleware from './middlewares/thunk';
import loadingMiddleware from './middlewares/loading';
import { accountsPage } from './pages/Accounts/reducers';
import { loginPage } from './pages/Login/reducers';
import { signupOpenAccountPage } from './pages/SignupOpenAccount/reducers';
import { openDemoAccountPage } from './pages/OpenMockAccount/reducers';
import { openRealAccountPage } from './pages/OpenRealAccount/reducers';
import { bindAccountPage } from './pages/BindAccount/reducers'
import { openRealAccountSuccessPage } from './pages/OpenRealAcctSuccess/reducers';
import { openAcctStepPage, formData } from './pages/OpenAcctStep/reducers'
import { liveSinaglePage } from './pages/LiveSinglePage/reducers';
import { albumPage } from './pages//AlbumPage/reducers';
import { depositPage } from './pages/Deposit/reducers';
import { telegraphicPage } from './pages/Telegraphic/reducers'
import { leveragePage } from './pages/Leverage/reducers'
import { withDrawPage } from './pages/Withdraw/reducers'
import { tradereportsPage } from './pages/TradeReports/reducers'
import { common } from './common/commonReducer';
import { personalInfoPage } from './pages/Personal/reducers';

const rMiddleware = routerMiddleware(hashHistory)

const middlewareList = [
	loadingMiddleware,	
	rMiddleware,
	thunkMiddleware,
	promiseMiddleware,
	errorMiddleware,
	transitionMiddleware
];

const middleware = applyMiddleware(...middlewareList);

const store = createStore(combineReducers({
	accountsPage,
	loginPage,
	signupOpenAccountPage,
	bindAccountPage,
	openDemoAccountPage,
	openRealAccountPage,
	openRealAccountSuccessPage,
	openAcctStepPage,
	formData,
	depositPage,
	telegraphicPage,
	leveragePage,
	withDrawPage,
	tradereportsPage,
	personalInfoPage,
	liveSinaglePage,
	albumPage,
	common,
	routing: routerReducer
}), middleware);

//logger store change, later can change to use a loggerMiddleware
store.subscribe(() => {
	//console.log('store update', store.getState())
})

window.store = store; //debug

export default store;