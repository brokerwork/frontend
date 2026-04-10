import { connect } from 'react-redux';
import List from '../components/List';
import {
  getMessages,
  modifyParams,
  getAvaliableEmails,
  resendEmail,
  setPageTitle,
  selectItem,
  removeMessage,
  markSelectedAsRead
} from '../../../controls/actions';

import { showTopAlert, showTipsModal } from 'commonActions/actions';

export default connect(
  ({
    messages: {
      messages,
      paginationInfo,
      searchParams,
      avaliableEmails,
      selectedItem
    }
  }) => ({
    data: messages,
    paginationInfo,
    searchParams,
    avaliableEmails,
    selectedItem
  }),
  {
    getMessages,
    modifyParams,
    getAvaliableEmails,
    resendEmail,
    showTopAlert,
    showTipsModal,
    setPageTitle,
    selectItem,
    markSelectedAsRead,
    removeMessage: removeMessage.bind(this, 'OUTBOX')
  }
)(List);
