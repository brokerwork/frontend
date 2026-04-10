import { connect } from 'react-redux';
import AddFrom from '../components/AddModal/form';
import { getList, getServerList } from '../controls/actions';

export default connect(
  ({ runmgmt: { sourceSetting } }) => {
    return {
      serverList: sourceSetting.serverList
    };
  },
  {
    getList,
    getServerList
  }
)(AddFrom);
