import { connect } from 'react-redux';
import VoucherModal from '../components/VoucherModal';
import { showTipsModal, getTenantInfo } from 'common/actions';
import { getVoucherList } from '../controls/actions';

export default connect(
  ({ common: { tenantInfo }, dashboard: { voucherList } }) => ({
    tenantInfo,
    voucherList
  }),
  {
    showTipsModal,
    getTenantInfo,
    getVoucherList
  }
)(VoucherModal);
