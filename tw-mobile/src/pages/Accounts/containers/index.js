import React from 'react';
import { connect } from 'react-redux';
import {Accounts} from '../components/index';
import * as actions from '../actions';
import * as commonActions from '../../../common/commonActions'

export default connect(
    ({ accountsPage, loginPage, common }) => ({
        accounts: accountsPage.accounts,
        loginPage,
        visibleData: common.visibleData,
        structuralList: common.structuralList
    }),
    { ...actions, ...commonActions }
)(Accounts)
