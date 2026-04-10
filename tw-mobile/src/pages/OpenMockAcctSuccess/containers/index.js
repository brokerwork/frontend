import React from 'react';
import {connect} from 'react-redux';
import * as actions from '../actions';
import {OpenMockAcctSuccess} from '../components/openMockAcctSuccess';

export default connect(
  ({openDemoAccountPage})=>({
    selectedServer: openDemoAccountPage.selectedServer,
    accountName: openDemoAccountPage.accountName,
    newAccount: openDemoAccountPage.newAccount,
    newAccountPassword: openDemoAccountPage.newAccountPassword,
    newAccountInvestorPassword: openDemoAccountPage.newAccountInvestorPassword
  }), 
  {...actions}
)(OpenMockAcctSuccess);