import { connect } from 'react-redux';
import AddModal from '../components/AddModal';
import {
  getIdType,
  addBlackList,
  getBlackList,
  updateBlackList
} from '../controls/actions';
import { submit } from 'redux-form';

export default connect(
  ({
    settings: {
      blackList: { idTypes, pageParam }
    }
  }) => {
    return {
      idTypes,
      pageParam
    };
  },
  { getIdType, submitForm: submit, addBlackList, getBlackList, updateBlackList }
)(AddModal);
