import React from 'react';
import { connect } from 'react-redux';
import { VideoSinglePage } from '../components/index';
import * as actions from '../actions';

export default connect(
	() => ({ }),
	{ ...actions }
)(VideoSinglePage)