import React from 'react';
import { connect } from 'react-redux';
import { Settings } from '../settings';
import * as actions from '../actions';

export default connect(
    ({ settings }) => ({ settings }),
    { ...actions }
)(Settings)
