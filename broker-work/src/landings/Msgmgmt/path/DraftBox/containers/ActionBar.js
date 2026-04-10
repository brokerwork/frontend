import { connect } from 'react-redux';
import ActionBar from '../components/ActionBar';
import {
  getMessages,
  modifyParams,
  initialParams,
  removeMessage,
  selectItem,
  resetData
} from '../../../controls/actions';

import { showTopAlert, showTipsModal } from 'commonActions/actions';

export default connect(
  ({
    messages: {
      searchParams,
      selectedItem,
      typesOptions,
      paginationInfo,
      listUpdateTime
    }
  }) => ({
    searchParams,
    selectedItem,
    typesOptions,
    paginationInfo,
    listUpdateTime
  }),
  {
    getMessages,
    modifyParams,
    initialParams,
    removeMessage: removeMessage.bind(this, 'DRAFT'),
    selectItem,
    showTopAlert,
    showTipsModal,
    resetData
  }
)(ActionBar);
