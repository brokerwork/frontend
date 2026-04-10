import { connect } from 'react-redux';
import Root from '../components/Root';
import { getBlackList, getIdType } from '../controls/actions';
export default connect(
  ({
    common: { userRights },
    settings: {
      blackList: { pageParam }
    }
  }) => {
    return {
      userRights,
      pageParam
    };
  },
  {
    getBlackList,
    getIdType
  }
)(Root);
