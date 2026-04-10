import { connect } from 'react-redux';
import List from '../components/List';
import { modifyPage, getBlackList, removeBlackList } from '../controls/actions';
import { showTipsModal } from 'commonActions/actions';
export default connect(
  ({
    common,
    settings: {
      blackList: { blackListData, pageParam, idTypes }
    }
  }) => {
    return {
      blackList: blackListData,
      pageParam,
      idTypes
    };
  },
  {
    modifyPage,
    getBlackList,
    showTipsModal,
    removeBlackList
  }
)(List);
