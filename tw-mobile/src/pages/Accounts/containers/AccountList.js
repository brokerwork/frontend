import React from 'react';
import { connect } from 'react-redux';
import { AccountList } from '../components/AccountList';
import * as actions from '../actions';
import * as commonActions from 'common/commonActions';

export default connect(
	({ accountsPage, common }) => ({
		accounts: accountsPage.accounts,
		brand: common.brand,
		structuralList: common.structuralList
	}),
	{ ...actions, ...commonActions }
)(AccountList)
