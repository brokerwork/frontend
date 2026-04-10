import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import * as reduxPromise from 'redux-promise';
import loadingMiddleware from '../../common/middleware/loadingMiddleware.ts'
import errorMiddleware from '../../common/middleware/errorMiddleware.ts'
import { routerReducer } from 'react-router-redux';
import { AccountTableReducer, IAccountTableState } from '../reducers/accountTableReducer';
import { AddAccountReducer, IAddAccountState } from '../reducers/addAccountReducer';
import { EditAccountReducer, IEditAccountState } from '../reducers/editAccountReducer';

interface IAccountState {
    accountTable: IAccountTableState,
    addAccount: IAddAccountState,
    editAccount: IEditAccountState
}

let mt4Store = createStore(
    combineReducers({
        accountTable: AccountTableReducer,
        addAccount: AddAccountReducer,
        editAccount: EditAccountReducer,
        routing: routerReducer
    }),
    applyMiddleware(
        loadingMiddleware,
        errorMiddleware,
        thunk,
        reduxPromise
    )
)

export { mt4Store, IAccountState }
