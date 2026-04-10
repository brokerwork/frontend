import i18n from 'utils/i18n';
import cs from './ObjectDetails.less';
import PaginationBar from 'components/v2/PaginationBar';
import { Layout, Content, Sider, Summary } from 'components/v2/PageWraper';
import {
  TASK_BOARD_SUBMIT,
  TASK_BOARD_TODO,
  TASK_BOARD_CLAIMED,
  TASK_TYPES,
  ADVANCED_SEARCH_TYPE
} from '../../contants';
import DefulatTable from './Tables';
import AgencyRegisterTable from './Tables/agencyRegister';
import Conditions from '../../containers/Conditions';
import ConditionFilter from 'components/v2/ConditionFilter';
import ActionBar from '../../containers/ActionBar';

let timer = null;
const DELAY = 5 * 60 * 1000;
export default class DefaultList extends PureComponent {
  componentDidMount() {
    const { getTaRight, getIsAdaptOn } = this.props;
    this.getInitList(true);
    getTaRight();
    getIsAdaptOn();
    timer = setInterval(() => {
      const { match } = this.props;
      const isMatch = location.pathname === match.url;
      if (match.isExact && isMatch) {
        const { searchParams, getTaskGroupTasks } = this.props;
        getTaskGroupTasks(searchParams, false, false);
      }
    }, DELAY);
  }
  componentWillUnmount() {
    clearInterval(timer);
  }

  //初始化时才能调用，因为默认填充的[0]的categoryId
  getInitList = (ignoreCategory, ignoreCountTodo) => {
    const {
      match: {
        params: { objectId }
      },
      taskType
    } = this.props;
    this.getInitListCompleteParams(
      objectId,
      taskType,
      ignoreCategory,
      ignoreCountTodo
    );
  };

  //初始化时才能调用，因为默认填充的[0]的categoryId
  getInitListCompleteParams = (
    objectId,
    taskType,
    ignoreCategory,
    ignoreCountTodo
  ) => {
    const { getObjectTaskGroups } = this.props;
    if (!objectId) return;
    getObjectTaskGroups(objectId).then(res => {
      if (!res.result) return Promise.resolve(res);
      const { modifyParams, searchParams, getTaskGroupTasks } = this.props;
      const { categorys, itemId } = res.data;

      const newConditions = searchParams.advanceConditions
        ? [
            ...searchParams.advanceConditions.filter(
              item =>
                item.field !== 'categoryId' &&
                this.filterOldField(taskType, item.field)
            ),
            {
              field: 'categoryId',
              opt: 'EQ',
              originValue: [categorys[0]],
              value: categorys[0].value
            }
          ]
        : searchParams.advanceConditions;

      const params = {
        ...searchParams,
        itemId,
        advanceConditions: newConditions
        // categoryId:
        //   searchParams.categoryId || (categorys[0] && categorys[0].value)
      };

      Promise.resolve(modifyParams(params)).then(res => {
        //使用编辑后的params
        const { searchParams: newParams } = this.props;
        getTaskGroupTasks(newParams, ignoreCategory, ignoreCountTodo);
      });
      return Promise.resolve(res);
    });
  };

  //判断剔除旧的条件类型
  filterOldField = (taskType, field) => {
    const advances =
      ADVANCED_SEARCH_TYPE[
        taskType === 'TA' ? 'TA' : 'JOB_TYPE_AGENCY_REGISTER'
      ]; //默认都是第一个jobType
    return advances.some(item => item.value === field && item.keepOpen);
  };
  componentWillReceiveProps(nextProps) {
    const nextMatch = nextProps.match;
    const newId = nextMatch.params.objectId;
    if (newId && newId !== this.props.match.params.objectId) {
      const { taskType } = this.props;
      setTimeout(() => {
        this.getInitListCompleteParams(newId, taskType, true);
      }, 0);
    }
  }
  refreshTasks = () => {
    const { searchParams, refreshTasks } = this.props;
    refreshTasks(searchParams);
  };
  getTheTask = item => {
    const { getTheTask, showTopAlert } = this.props;
    getTheTask(item.jobId, item.nowStep).then(({ result }) => {
      if (!result) return;
      this.refreshTasks();
      showTopAlert({
        content: i18n['task.object_detail.get_task_success'],
        bsStyle: 'success'
      });
    });
  };
  modifyPagination = ({ pageNo, pageSize }) => {
    const { modifyParams, getTaskGroupTasks, searchParams } = this.props;
    const params = {
      ...searchParams,
      nowPage: pageNo,
      pageSize: pageSize
    };
    modifyParams(params);
    getTaskGroupTasks(params);
  };
  moidfyOrderDesc = key => {
    const { searchParams } = this.props;
    const { sortby, orderDesc } = searchParams;
    const isDesc = !(key === sortby && orderDesc);
    const params = {
      ...searchParams,
      orderDesc: isDesc,
      sortby: key
    };
    this.modifySearchType(params);
  };
  modifySearchType = (params, ignoreSearch) => {
    const { modifyParams, getTaskGroupTasks } = this.props;
    modifyParams(params);
    if (!ignoreSearch) {
      getTaskGroupTasks(params);
    }
  };
  selectTask = (item, mergeMode) => {
    const { selectTask, selectedTasks, showTopAlert } = this.props;
    let _items = item;
    if (!Array.isArray(item)) {
      _items = [item];
    }
    const firstKey = Object.keys(selectedTasks)[0];
    const diffState = _items.some(
      _item =>
        _item.state !== _items[0].state ||
        (firstKey && _item.state !== selectedTasks[firstKey].state)
    );
    if (diffState) {
      showTopAlert({
        content: i18n['task.batch_action.disable_tips_by_state'],
        bsStyle: 'danger'
      });
      return;
    }
    selectTask(item, mergeMode);
  };
  isShowCheck = () => {
    const { depositCategoryId, searchParams } = this.props;
    if (searchParams.taskBoard === TASK_BOARD_SUBMIT) {
      //未认领
      return true;
    } else if (
      [TASK_BOARD_TODO, TASK_BOARD_CLAIMED].includes(searchParams.taskBoard)
    ) {
      //未处理 or 我待办
      if (
        !searchParams.categoryId ||
        (depositCategoryId && searchParams.categoryId === depositCategoryId)
      ) {
        //所有组 或者 入金任务
        return true;
      }
    }
    return false;
  };
  render() {
    let {
      location,
      taskGroupTasks,
      children,
      searchParams,
      paginationInfo,
      currentLoginUserInfo,
      categoryIdDetailMap,
      selectedTasks,
      objectDetails: { categorys = [] },
      taRight,
      taskType
    } = this.props;
    if (children) {
      children = React.cloneElement(children, {
        refreshTasks: this.refreshTasks
      });
    }
    const categoryItem =
      categoryIdDetailMap[
        searchParams.categoryId || (categorys[0] && categorys[0].value)
      ];
    return (
      <Conditions {...this.props} onChange={this.modifySearchType}>
        <Summary>
          <ActionBar {...this.props} />
        </Summary>
        <Layout direction="horizontal">
          <Sider>
            <ConditionFilter.Panel />
          </Sider>
          {(!taskType || taskType === TASK_TYPES.TA) && !taRight ? (
            taRight === false ? (
              <div className={cs['no-item']}>
                <i className="fa fa-folder" />
                <p>{i18n['task.object_list.no_tw']}</p>
              </div> //无权限树
            ) : (
              <div />
            ) //请求未返回
          ) : (
            <Layout footer>
              {/* <ActionBar
              onChange={this.modifySearchType}
              refreshTasks={this.refreshTasks.bind(this)}
            />*/}
              <Content table>
                {categoryItem &&
                categoryItem.jobType === 'JOB_TYPE_AGENCY_REGISTER' ? (
                  <AgencyRegisterTable
                    {...this.props}
                    refreshTasks={this.refreshTasks}
                    moidfyOrderDesc={this.moidfyOrderDesc}
                    getTheTask={this.getTheTask}
                    selectTask={this.selectTask}
                    isShowCheck={this.isShowCheck}
                    pager={
                      <PaginationBar
                        {...paginationInfo}
                        onPageChange={this.modifyPagination}
                      />
                    }
                  />
                ) : (
                  <DefulatTable
                    {...this.props}
                    jobType={
                      categoryItem && categoryItem.jobType
                        ? categoryItem.jobType
                        : ''
                    }
                    refreshTasks={this.refreshTasks}
                    moidfyOrderDesc={this.moidfyOrderDesc}
                    getTheTask={this.getTheTask}
                    selectTask={this.selectTask}
                    isShowCheck={this.isShowCheck}
                    pager={
                      <PaginationBar
                        {...paginationInfo}
                        onPageChange={this.modifyPagination}
                      />
                    }
                  />
                )}
              </Content>
            </Layout>
          )}
        </Layout>
        {children}
      </Conditions>
    );
  }
}
