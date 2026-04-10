import { connect } from 'react-redux';
import ActionBar from '../components/ActionBar';
import {
  getMessages,
  modifyParams,
  initialParams,
  resetData,
  markAllAsRead,
  markSelectedAsRead,
  removeMessage,
  selectItem
} from '../../../controls/actions';
import { showTopAlert, showTipsModal } from 'commonActions/actions';

export default connect(
  ({
    messages: { searchParams, selectedItem, listUpdateTime, paginationInfo }
  }) => ({
    searchParams,
    selectedItem,
    listUpdateTime,
    paginationInfo
  }),
  {
    showTopAlert,
    showTipsModal,
    getMessages,
    markAllAsRead,
    markSelectedAsRead,
    modifyParams,
    initialParams,
    resetData,
    selectItem,
    removeMessage: removeMessage.bind(this, 'INBOX')
  }
)(ActionBar);
