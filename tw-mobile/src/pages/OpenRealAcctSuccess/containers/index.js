// libs
import React from 'react';
import { connect } from 'react-redux';
// components
import { OpenRealAcctSuccess } from '../components/openRealAcctSuccess';
/* ---------------- main -------------- */

export default connect(
	({ openRealAccountPage }) => ({ ...openRealAccountPage })
)(OpenRealAcctSuccess);