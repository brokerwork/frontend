import React from 'react';
import { connect } from 'react-redux';
import { WithDraw } from '../components/index';
import * as actions from '../actions';
import * as commonActions from 'common/commonActions';

export default connect(
	(state) => {
		return {
			selectedAccount: state.common.selectedAccount,
			brand: state.common.brand,
			withDrawPage: state.withDrawPage,
			structuralList: state.common.structuralList,
		}
	},
	{ ...actions,
		...commonActions}
)(WithDraw)