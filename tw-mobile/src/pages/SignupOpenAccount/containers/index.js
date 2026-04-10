// libs
import React from 'react';
import { connect } from 'react-redux';
//
import { SignupOpenAccount } from '../components/Root/index';
import * as actions from '../actions/index';
import * as commonActions from 'common/commonActions';

export default connect(
	({ signupOpenAccountPage, common }) => ({
		...signupOpenAccountPage,
		brand: common.brand
	}),
	{ ...actions, ...commonActions }
)(SignupOpenAccount);