import React from 'react';
import { connect } from 'react-redux';
import { LiveSinglePage } from '../components/index';
import { checkToken, msgDialog } from 'common/commonActions';
import * as actions from '../actions';

export default connect(
	({ liveSinaglePage,common }) => ({ 
		liveDetail: liveSinaglePage.liveDetail,
		isLogin: common.isLogin,
		disable: liveSinaglePage.disable,
		isAdmin: liveSinaglePage.isAdmin,
		userName: liveSinaglePage.userName,
	 }),
	{ ...actions, checkToken, msgDialog }
)(LiveSinglePage)