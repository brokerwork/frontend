import React from 'react';
import { connect } from 'react-redux';
import { AccountSinglePage } from '../components/index';
import * as actions from '../actions';
import * as commonActions from 'common/commonActions';

export default connect(
	(state) => ({
		selectedAccount: state.common.selectedAccount,
		brand: state.common.brand,
		structuralList: state.common.structuralList
	}),
	{ ...actions, ...commonActions }
)(AccountSinglePage);


