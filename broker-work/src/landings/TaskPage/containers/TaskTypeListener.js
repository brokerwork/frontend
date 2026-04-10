import * as actions from '../controls/actions';
import { connect } from 'react-redux';
import TaskTypeListener from '../components/TaskTypeListener';

export default connect(({ taskmgmt }) => {
  return {
    data: taskmgmt.object_list,
    taskType: taskmgmt.taskType,
    taskId: taskmgmt.taskId
  };
}, actions)(TaskTypeListener);
