import MergeOwnerInfo from '../components/MergeOwnerInfo';
import { connect } from 'react-redux';
import { mergeOwnerInfo } from '../controls/actions';
import { showTopAlert, showTipsModal } from 'commonActions/actions';

export default connect(
  ({
    accountManagement: {
      currentServer,
      formColumns,
      detail: { accountId, diffOwnerInfo, ownerRelatedInfo }
    }
  }) => ({
    currentServer,
    formColumns,
    accountId,
    diffOwnerInfo,
    ownerRelatedInfo
  }),
  { mergeOwnerInfo, showTipsModal, showTopAlert }
)(MergeOwnerInfo);
