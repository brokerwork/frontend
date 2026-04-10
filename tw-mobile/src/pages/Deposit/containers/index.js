import React from 'react';
import { connect } from 'react-redux';
import { Deposit } from '../components/index';
import * as actions from '../actions';
import * as commonActions from 'common/commonActions';

export default connect(
	(state) => {
		return {
			selectedAccount: state.common.selectedAccount,
			depositPage: state.depositPage,
			depositSetting: state.common.depositSetting,
			structuralList: state.common.structuralList,
			brand: state.common.brand
		}
	},
	{ ...actions, ...commonActions}
)(Deposit)