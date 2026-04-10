import React from 'react';
import { connect } from 'react-redux';
import OpenMockAccount from '../components/Root';
import * as actions from '../actions';
import * as commonActions from 'common/commonActions';

export default connect(
	({ openDemoAccountPage, common }) => ({
		...openDemoAccountPage,
		brand: common.brand,
		structuralList: common.structuralList,
	}),
	({ ...actions, ...commonActions })
)(OpenMockAccount);