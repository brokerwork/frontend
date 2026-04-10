import { connect } from 'react-redux';
import List from '../components/List';
import {
  getMessages,
  modifyParams,
  removeMessage,
  removeMessageCompletely,
  revertMessage,
  selectItem,
  setPageTitle
} from '../../../controls/actions';

import { showTopAlert, showTipsModal } from 'commonActions/actions';

export default connect(
  ({ messages: { messages, paginationInfo, searchParams, selectedItem } }) => ({
    data: messages,
    paginationInfo: paginationInfo,
    searchParams: searchParams,
    selectedItem: selectedItem
  }),
  {
    getMessages,
    modifyParams,
    selectItem,
    setPageTitle,
    removeMessageCompletely,
    revertMessage,
    showTopAlert,
    showTipsModal,
    removeMessage: removeMessage.bind(this, 'RECYCLE_INBOX')
  }
)(List);
