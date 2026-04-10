import React from 'react';
import { connect } from 'react-redux';
import { Entrance } from '../components/index';
import * as actions from '../actions';
import * as commonActions from 'common/commonActions';

export default connect(
	({common}) => ({brand: common.brand}),
	{ ...actions, ...commonActions }
)(Entrance);