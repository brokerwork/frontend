import { TASK_TYPES } from '../../contants';
export default class TaskTypeListener extends Component {
  componentDidMount() {
    const {
      updateTaskObject,
      updateTaskId,
      data,
      match: { params }
    } = this.props;
    const objectId = params.objectId;
    const task = getMatchTask(objectId, data);
    updateTaskObject(task);
  }
  componentWillReceiveProps(nextProps) {
    const { updateTaskObject, taskId, data } = this.props;
    const { match: { params } } = nextProps;
    const objectId = params.objectId;
    const task = getMatchTask(objectId, data);
    if (objectId !== taskId) {
      updateTaskObject(task);
    }
  }
  render() {
    return null;
  }
}

function getMatchTask(id, arr) {
  return (
    arr.find(object => {
      return object.itemId === id;
    }) || {}
  );
}
