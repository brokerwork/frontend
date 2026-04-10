import { connect } from 'react-redux';
import List from '../components/List';
import {
  getMessages,
  modifyParams,
  markAsRead,
  setPageTitle,
  selectItem,
  markAllAsRead,
  markSelectedAsRead,
  removeMessage
} from '../../../controls/actions';
import { showTopAlert, showTipsModal } from 'commonActions/actions';

export default connect(
  ({ messages: { messages, paginationInfo, searchParams, selectedItem } }) => ({
    data: messages,
    paginationInfo,
    searchParams,
    selectedItem
  }),
  {
    showTopAlert,
    showTipsModal,
    getMessages,
    modifyParams,
    markAsRead,
    setPageTitle,
    selectItem,
    markSelectedAsRead,
    removeMessage: removeMessage.bind(this, 'INBOX')
  }
)(List);
