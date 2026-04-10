import { connect } from 'react-redux';
import { submit, reset } from 'redux-form';
import OpportunityDetail from '../components/OpportunityDetail';
import { showTipsModal, showTopAlert } from 'commonActions/actions';
import {
  updateSalesStage,
  updateFollowRecord,
  getDetail,
  getCustomerParticipant,
  getFormColumns,
  getOpportunityTypeList,
  getLoseCauseList,
  getFollowWayList,
  getSalesStageList,
  getIsLostCustomer
} from '../controls/actions';
import {
  getProductList,
  removeContract
} from '../../Contracts/controls/actions';

export default connect(
  ({ customMgmt: { opportunities, contracts }, common }) => ({
    detail: opportunities.opportunityDetail,
    opportunityTypeList: opportunities.opportunityTypeList,
    loseCauseList: opportunities.loseCauseList,
    followWayList: opportunities.followWayList,
    salesStageList: opportunities.salesStageList,
    formColumns: opportunities.formColumns,
    userInfo: common.userInfo,
    userRights: common.userRights,
    productList: contracts.productList,
    isLostCustomer: opportunities.isLostCustomer
  }),
  {
    updateSalesStage,
    updateFollowRecord,
    getDetail,
    showTipsModal,
    showTopAlert,
    submitForm: submit,
    resetForm: reset,
    getCustomerParticipant,
    getFormColumns,
    getOpportunityTypeList,
    getLoseCauseList,
    getFollowWayList,
    getSalesStageList,
    getProductList,
    removeContract,
    getIsLostCustomer
  }
)(OpportunityDetail);
