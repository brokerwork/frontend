import { connect } from 'react-redux';
import ActionBar from '../components/ActionBar';
import {
  getMessages,
  modifyParams,
  initialParams,
  resetData,
  removeMessage,
  selectItem
} from '../../../controls/actions';

import { showTopAlert, showTipsModal } from 'commonActions/actions';
export default connect(
  ({
    messages: {
      searchParams,
      typesOptions,
      selectedItem,
      paginationInfo,
      listUpdateTime
    }
  }) => ({
    searchParams,
    typesOptions,
    selectedItem,
    paginationInfo,
    listUpdateTime
  }),
  {
    showTopAlert,
    showTipsModal,
    getMessages,
    modifyParams,
    initialParams,
    resetData,
    selectItem,
    removeMessage: removeMessage.bind(this, 'OUTBOX')
  }
)(ActionBar);
