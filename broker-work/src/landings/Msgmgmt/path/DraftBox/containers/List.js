import { connect } from 'react-redux';
import List from '../components/List';
import {
  getMessages,
  modifyParams,
  removeMessage,
  selectItem,
  setPageTitle
} from '../../../controls/actions';

import { modifyParams as setAddFormData } from '../../AddMessage/controls/actions';

import { showTopAlert, showTipsModal } from 'commonActions/actions';

export default connect(
  ({ messages }) => ({
    data: messages.messages,
    paginationInfo: messages.paginationInfo,
    searchParams: messages.searchParams,
    selectedItem: messages.selectedItem
  }),
  {
    getMessages,
    modifyParams,
    selectItem,
    setAddFormData,
    setPageTitle,
    showTopAlert,
    showTipsModal,
    removeMessage: removeMessage.bind(this, 'DRAFT')
  }
)(List);
