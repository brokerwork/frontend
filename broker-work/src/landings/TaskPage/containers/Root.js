import * as actions from '../controls/actions';
import { connect } from 'react-redux';
import Root from '../components/Root';

export default connect(({ taskmgmt, common }) => {
  return {
    data: taskmgmt.object_list,
    taskId: taskmgmt.taskId,
    brandInfo: common.brandInfo
  };
}, actions)(Root);
