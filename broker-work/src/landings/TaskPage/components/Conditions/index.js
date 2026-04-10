import ConditionFilter from 'components/v2/ConditionFilter';
import {
  ADVANCED_SEARCH_CONFIG,
  ADVANCED_SEARCH_TYPE,
  TASK_BOARDS,
  TASK_STATE_SUBMITED,
  SEARCH_TYPES,
  TASK_TIME_SEARCH_TYPE,
  TASK_BOARD_CLOSED,
  TASK_BOARD_COMPLETED
} from '../../contants';
import { deepCopy } from 'utils/simpleDeepCopy';
import { Badge } from 'lean-ui';
import cs from './index.less';
export default class ActionsBar extends PureComponent {
  state = {
    showDepositOptions: false,
    currentConditions: this.props.params.advanceConditions //未提交给action的高级搜索条件， 用于UI的联动
  };

  isDoneStatusBoard = taskBoard => {
    return [TASK_BOARD_CLOSED, TASK_BOARD_COMPLETED].includes(taskBoard);
  };
  componentWillReceiveProps(nextProps) {
    this.setState({
      currentConditions: nextProps.params.advanceConditions
    });
  }
  onAdvancedSearch = (data, logicType, viewId = '', resetType) => {
    const {
      onChange,
      params,
      updateFieldConditions,
      modifyParams,
      getTaskGroupTasks,
      categorys
    } = this.props;
    let copyData = _.cloneDeep(data);

    if (!viewId && resetType === 'reset') {
      copyData.push({
        field: 'categoryId',
        opt: 'EQ',
        originValue: [categorys[0]],
        value: categorys[0].value
      });
    }

    const newTypes = this.injectDataToAdvancedSearchType(copyData);
    copyData = copyData.filter(item =>
      newTypes.some(type => type.value === item.field)
    );

    this.setState(
      {
        currentConditions: copyData
      },
      () => {
        Promise.resolve(
          modifyParams({ ...params, nowPage: 1, advanceConditions: copyData })
        ).then(res => {
          const { params } = this.props;
          getTaskGroupTasks(params);
        });
      }
    );
  };
  onConditionChange = (condition, data, extras) => {
    setTimeout(() => {
      this.setState({
        currentConditions: data
      });
    });
  };

  /**
   * 根据不同任务类型得到constants中保存的对应条件的key
   * @param taskType
   * @param jobType
   * @return {*}
   */
  getSearchTypeKey = (taskType, jobType) => {
    if (taskType !== 'TA') {
      return jobType;
    }

    if (jobType === 'JOB_TYPE_TA_RESET_TRADE') {
      return jobType;
    }

    return taskType;
  };

  injectDataToAdvancedSearchType = (
    conditions = this.state.currentConditions
  ) => {
    const { categorys, taskType, userRights } = this.props;

    const currentJob = conditions.find(con => con.field === 'categoryId');
    const jobType =
      (currentJob &&
        currentJob.originValue &&
        currentJob.originValue.jobType) ||
      (categorys[0] && categorys[0].jobType) ||
      '';
    const searchTypeKey = this.getSearchTypeKey(taskType, jobType);
    const types = deepCopy(ADVANCED_SEARCH_TYPE[searchTypeKey] || []).filter(
      item => {
        if (item.filterTaskBoards) {
          const currentTaskBoard = (
            conditions.find(con => con.field === 'taskBoard') || {}
          ).value;
          return item.filterTaskBoards.includes(currentTaskBoard);
        }
        if (item.filterJobType) {
          return jobType === item.filterJobType;
        }
        return true;
      }
    );

    const searchType = types.find(item => item.value === 'categoryId');
    if (searchType) {
      searchType.optionList = categorys;
      searchType.renderItem = item => {
        return (
          <div className={cs['filter-item']}>
            <span className={cs['filter-name']}>{item.label}</span>{' '}
            <Badge count={item.todoCount}> </Badge>
          </div>
        );
      };
    }
    let haveRight = false;
    if (taskType === 'TA') {
      haveRight = userRights['TASK_TRADER_DEAL'] || userRights['TASK_TRADER_DEALALL'];
    }
    if (taskType === 'AGENCY') {
      haveRight = userRights['TASK_IB_DEAL'] || userRights['TASK_IB_DEALALL'];
    }
    // 如果没有多重任务审批的权限就要去掉抄送我
    if (!haveRight && _.find(types, { value: 'cctome' })) {
      _.remove(types, { value: 'cctome' });
    }
    // 审批状态
    const { currentConditions } = this.state;
    const taskBoard = _.find(currentConditions, { field: 'taskBoard' });
    if (taskBoard) {
      const needShow =
        taskBoard.value === 'BOARD_STATE_TODO' ||
        taskBoard.value === 'BOARD_STATE_PROCESSING';
      // 如果没有权限或者状态不是上面两种就要干掉这一项
      if (!haveRight || !needShow) {
        if (_.find(types, { value: 'approve' })) {
          _.remove(types, { value: 'approve' });
        }
      }
    }
    return types;
  };

  render() {
    const {
      advancedSearchType,
      advancedSearchConditions,
      searchFieldConditions,
      children,
      currentCondition,
      selectedConditions,
      params
    } = this.props;
    const currentSearchFields = this.injectDataToAdvancedSearchType();
    return (
      <ConditionFilter.Container
        types={currentSearchFields}
        conditions={advancedSearchConditions}
        onSearch={this.onAdvancedSearch}
        data={params.advanceConditions}
        viewId={currentCondition}
        onConditionChange={this.onConditionChange}
        {...ADVANCED_SEARCH_CONFIG}
      >
        {children}
      </ConditionFilter.Container>
    );
  }
}
