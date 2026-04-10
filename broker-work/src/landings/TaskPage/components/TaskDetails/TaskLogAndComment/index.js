import { Tabs } from 'lean-ui';
import TaskLog from './TaskLog';
import TaskComment from './TaskComment';
import cs from './TaskLogAndComment.less';
import i18n from 'utils/i18n';

const Tab = Tabs.TabPane;

export default class TaskLogAndComment extends PureComponent {
  activeKey = '1';
  componentDidMount() {
    this.getData(this.activeKey);
  }
  onSelect = activeKey => {
    this.activeKey = activeKey;
    this.getData(parseInt(this.activeKey));
  };
  getData = activeKey => {
    const { getApprovalProcess, getLog, taskId } = this.props;
    if (activeKey === '1') {
      getLog(taskId);
    } else {
      getApprovalProcess(taskId);
    }
  };
  render() {
    const {
      log,
      approvalProcess,
      addComment,
      getLog,
      taskId,
      userInfo,
      taskType
    } = this.props;
    return (
      <Tabs
        onChange={this.onSelect}
        defaultActiveKey={'1'}
        id="task_details_log_and_comment"
      >
        <Tab key={'1'} tab={i18n['general.log']} className={cs['tab-content']}>
          <TaskComment
            data={log}
            userInfo={userInfo}
            taskType={taskType}
            addComment={addComment.bind(this, taskId)}
            getComments={getLog.bind(this, taskId)}
          />
        </Tab>
        <Tab
          key={'2'}
          tab={i18n['task.object_list.approval_process']}
          className={cs['tab-content']}
        >
          <TaskLog data={approvalProcess} taskType={taskType} />
        </Tab>
      </Tabs>
    );
  }
}
