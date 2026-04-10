import React from 'react';
import {connect} from 'react-redux';
import * as actions from '../actions';
import * as commonActions from 'common/commonActions';

import {Login} from '../components/login';

export default connect(
	({loginPage, common})=>({
		...loginPage,
		brand: common.brand,
		countryPhone: common.countryPhone,
	}), 
	{
		...actions, 
		...commonActions
	}
)(Login);