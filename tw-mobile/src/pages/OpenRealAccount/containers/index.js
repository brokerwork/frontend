import React from 'react';
import { connect } from 'react-redux';
import OpenRealAccount from '../components/Root';
import * as actions from '../actions';
import * as commonActions from 'common/commonActions';

export default connect(
	({ openRealAccountPage, common }) => ({
		...openRealAccountPage,
		brand: common.brand,
		countryPhone: common.countryPhone,
	}),
	({ ...actions, ...commonActions })
)(OpenRealAccount);