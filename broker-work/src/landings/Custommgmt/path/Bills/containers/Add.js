import { connect } from 'react-redux';
import Add from '../components/Add';
import * as actions from '../controls/actions';
import { showTopAlert } from 'commonActions/actions';
import { submit } from 'redux-form';
import {
  getCustomerDetail,
  getAccountOwnerOfCustomerById
} from '../../Customers/controls/actions';
export default connect(
  ({
    common,
    customMgmt: {
      customers: { customerDetailInfo, accountOwnerInfo },
      bills: { productList }
    }
  }) => ({
    productList,
    customerDetailInfo,
    accountOwnerInfo,
    userRights: common.userRights
  }),
  {
    ...actions,
    getCustomerDetail,
    getAccountOwnerOfCustomerById,
    showTopAlert,
    submitForm: submit
  }
)(Add);
