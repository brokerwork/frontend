import React from 'react';
import { connect } from 'react-redux';
import { Fundflow } from '../components/index';
import * as actions from '../actions';

export default connect(
	(state) => ({
		selectedAccount: state.common.selectedAccount,
		deposit: state.depositPage
	}),
	{ ...actions }
)(Fundflow);