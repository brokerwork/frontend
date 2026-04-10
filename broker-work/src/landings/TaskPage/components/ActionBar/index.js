import { post } from 'utils/ajax';
import i18n from 'utils/i18n';
import { Icon, Button, Input } from 'lean-ui';
import { Link } from 'react-router-dom';
import { Summary } from 'components/v2/PageWraper';
import columns from '../ObjectDetails/columns';

import cs from './ActionBar.less';
import {
  TASK_BOARD_CLOSED,
  TASK_BOARD_COMPLETED,
  TASK_TYPES,
  allowsSetting
} from '../../contants';
import { dateRange } from 'utils/config';
import ConditionFilter from 'components/v2/ConditionFilter';
import {
  EXPORT_FIELDS_AGENCY_WITHDRAW,
  EXPORT_FIELDS_WITHDRAW,
  EXPORT_FIELDS_DEPOSIT,
  EXPORT_FIELDS_TELEGRAPHIC_DEPOSIT
} from './contants';

const EXPORT_TRY_LIMIT = 5; //尝试下载次数

export default class ActionBar extends PureComponent {
  state = {
    showDepositOpitons: false
  };

  componentDidMount() {
    const { getWithdrawFormField } = this.props;
    getWithdrawFormField();
  }

  isDoneStatusBoard = taskBoard => {
    return [TASK_BOARD_CLOSED, TASK_BOARD_COMPLETED].includes(taskBoard);
  };
  modifySearchType(field, v, data) {
    const { onChange, params } = this.props;
    let { showDepositOpitons } = this.state;
    let __obj = { [field]: v };
    if (field === 'date') {
      __obj = {
        searchStart: v.startDate,
        searchEnd: v.endDate
      };
    }
    if (field === 'categoryId') {
      if (data.jobType === 'JOB_TYPE_TA_DEPOSIT') {
        __obj['payStatus'] = '';
        showDepositOpitons = true;
      } else {
        showDepositOpitons = false;
        __obj['payStatus'] = undefined;
      }
    }

    if (field === 'taskBoard') {
      if (
        !this.isDoneStatusBoard(v) &&
        this.isDoneStatusBoard(params.taskBoard)
      ) {
        __obj['searchDate'] = 'CreateTime';
        __obj['searchStart'] = dateRange.last30days.start;
        __obj['searchEnd'] = dateRange.last30days.end;
        if (params.sortby === 'modifyTime') {
          __obj['sortby'] = 'createTime';
          __obj['orderDesc'] = true;
        }
      }
    }

    // 重置页码
    __obj['nowPage'] = 1;
    const searchParams = {
      ...params,
      ...__obj
    };
    onChange(searchParams);
    this.setState({ showDepositOpitons });
  }
  changeFuzzy(field, v) {
    const { onChange, params } = this.props;
    const value = v.target ? v.target.value : v;
    const s = { [field]: value };
    const { fuzzyItem } = params;
    if (
      field === 'fuzzyItem' &&
      ((fuzzyItem === 'processor' || v === 'processor') && fuzzyItem !== v)
    ) {
      s['fuzzyVal'] = '';
    }
    onChange(
      {
        ...params,
        ...s
      },
      true
    );
    this.setState(s);
  }
  applyFuzzy = e => {
    if (e.keyCode !== 13) return;
    const { onChange, params } = this.props;
    onChange({
      ...params,
      nowPage: 1
    });
  };
  selectFuzzy = v => {
    const { onChange, params } = this.props;
    onChange({
      ...params,
      nowPage: 1,
      fuzzyVal: v
    });
  };
  getData = value => {
    if (!value) {
      return Promise.resolve({
        result: true,
        data: { list: [] }
      });
    }
    return post({
      url: '/v1/user/findSimpleByPage',
      data: {
        queryType: 'NAME',
        queryContent: value
      }
    });
  };
  handleData = res => {
    if (!res.result) return [];
    const { list } = res.data;
    return list.map(item => {
      const __arr = [];
      if (item.roleName) __arr.push(item.roleName);
      if (item.entityNo) __arr.push(item.entityNo);
      const label =
        __arr.length > 0 ? `${item.name} (${__arr.join('/')})` : item.name;
      return {
        value: item.pubUserId,
        label
      };
    });
  };
  createCategorysDropdownItem(item) {
    return (
      <span className={cs['category-item']}>
        <span className={cs['category']} title={item.label}>
          {item.label}
        </span>
        {item.todoCount ? (
          <span className={cs['todo-count']}>{item.todoCount}</span>
        ) : (
          undefined
        )}
      </span>
    );
  }
  toggleModal = (type, toggle) => {
    this.setState({
      [`show${type}Modal`]: toggle
    });
  };

  onClickExport = () => {
    const {
      categoryIdDetailMap,
      params: { categoryId },
      categorys
    } = this.props;

    const categoryItem =
      categoryIdDetailMap[categoryId || (categorys[0] && categorys[0].value)];
    const jobType = categoryItem && categoryItem.jobType;

    this.submitExport(jobType);
  };

  onFuzzySearchTextChange = evt => {
    const { updateFuzzySearchText } = this.props;
    updateFuzzySearchText(evt.target.value);
  };

  onFuzzySearchBoxEnter = evt => {
    const {
      searchParams,
      refreshTasks,
      paginationInfo: { pageSize },
      modifyParams
    } = this.props;

    const params = {
      ...searchParams,
      nowPage: 1,
      pageSize: pageSize
    };

    modifyParams(params);

    refreshTasks({
      ...params,
      fuzzyVal: evt.target.value
    });
  };

  submitExport = jobType => {
    const { params } = this.props;
    const submitData = {
      ...params,
      searchStart: params.searchStart && params.searchStart.valueOf(),
      exportKey: this.getExportFields(jobType).reduce(
        (obj, item) => ({
          ...obj,
          [item.value]: item.label
        }),
        {}
      )
    };

    this.doExport(submitData);
  };

  getExportFields = jobType => {
    const { withdrawFormField = [] } = this.props;
    console.log('withdrawFormField',withdrawFormField)
    let fields = [];
    switch (jobType) {
      case 'JOB_TYPE_AGENCY_WITHDRAW':
        fields = fields.concat(
          EXPORT_FIELDS_AGENCY_WITHDRAW,
          withdrawFormField.map(item => ({
            value: item.key,
            label: item.label
          }))
        );
        break;
      case 'JOB_TYPE_TA_DEPOSIT':
        fields = fields.concat(EXPORT_FIELDS_DEPOSIT);
        break;
      case 'JOB_TYPE_TA_TELEGRAPHIC_DEPOSIT':
        fields = fields.concat(EXPORT_FIELDS_TELEGRAPHIC_DEPOSIT);
        break;
      case 'JOB_TYPE_TA_WITHDRAW':
        fields = fields.concat(
          EXPORT_FIELDS_WITHDRAW,
          withdrawFormField.map(item => ({
            value: item.key,
            label: item.label
          }))
        );
        break;
    }

    return fields;
  };

  doExport = exportData => {
    const { exportTask, showTipsModal, onHide } = this.props;
    showTipsModal({
      content: i18n['task.export.tips.creating'],
      noConfirm: true,
      closeButton: false,
      onCanCel: cb => {
        this.tryCount = EXPORT_TRY_LIMIT + 1; //取消时直接设置为超过阀值，不再弹出下载框
      }
    });
    exportTask(exportData).then(res => {
      if (res.result) {
        if (this.tryCount > EXPORT_TRY_LIMIT) {
          return;
        }
        if (res.data === 'QPS-LIMIT') {
          this.tryCount++;
          setTimeout(this.doExport.bind(this, exportData), EXPORT_TRY_DELAY);
        } //需要等待的结果
        else {
          if (this.tryCount > EXPORT_TRY_LIMIT) return;
          showTipsModal({
            content: i18n['task.export.tips.download'],
            confirmBtnText: i18n['general.download'],
            onConfirm: cb => {
              window.open(res.data);
              cb();
            }
          });
        }
      } else {
        showTipsModal({
          content: i18n.mcode(res.mcode)
        });
        return Promise.reject(); //不走中间件， 避免反复弹出错误
      }
    });
  };

  getSearchHint = jobType => {
    if ('JOB_TYPE_AGENCY_REGISTER' === jobType) {
      return i18n['task.search.agent.register.hint'];
    }
    if ('JOB_TYPE_AGENCY_WITHDRAW' === jobType) {
      return i18n['task.search.agent.register.with_draw'];
    }
    if ('JOB_TYPE_TA_RESET_TRADE' === jobType) {
      return i18n['task.search.ta.hint.reset_trade'];
    }

    return i18n['task.search.ta.hint'];
  };

  allowsSetting = () => {
    const { userRights, taskType } = this.props;
    return allowsSetting(userRights, taskType);
  };

  render() {
    const {
      categorys,
      match: { url },
      objectDetails: { itemName },
      params: { categoryId, sortby },
      taskType,
      categoryIdDetailMap,
      paginationInfo,
      listUpdateTime
    } = this.props;

    const sortLabel = (columns.find(item => item.key === sortby) || {}).label;

    const categoryItem =
      categoryIdDetailMap[categoryId || (categorys[0] && categorys[0].value)];
    const jobType = categoryItem && categoryItem.jobType;
    return (
      <div className={cs['actions-bar']}>
        <div className={cs['left-part']}>
          <div className={cs['primary-top-title']}>
            <Icon
              icon="task-color"
              className={`main-color ${cs['customer-icon']}`}
              fontType={'bw'}
            />
            <div className={cs['module-info']}>
              <div className={cs['module-name']}>{itemName}</div>
              <ConditionFilter.ViewList />
            </div>
          </div>
          <Summary.Info
            total={`${paginationInfo.total}`}
            orderBy={sortLabel}
            updateTime={listUpdateTime}
          />
        </div>
        <div className={cs['right-part']}>
          <div className={cs['button-area']}>
            {[
              'JOB_TYPE_TA_DEPOSIT',
              'JOB_TYPE_BW_DEPOSIT',
              'JOB_TYPE_TA_TELEGRAPHIC_DEPOSIT',
              'JOB_TYPE_TA_WITHDRAW',
              'JOB_TYPE_BW_WITHDRAW',
              'JOB_TYPE_AGENCY_WITHDRAW'
            ].includes(jobType) ? (
              <Button onClick={this.onClickExport} type="primary">
                <Icon icon={'download'} />
                {i18n['task.export.label.export']}
              </Button>
            ) : (
              undefined
            )}
            {/** 拥有 投资者任务设置 或者 代理任务设置 的权限才可以看到设置的入口 */}
            {this.allowsSetting() && (
              <Link to={`${url}/setting`}>
                <Button type="primary">{i18n['task.object_setting']}</Button>
              </Link>
            )}
          </div>
          <div className={cs['search-input']}>
            <Input
              suffix={<Icon icon="search" />}
              onPressEnter={this.onFuzzySearchBoxEnter}
              placeholder={this.getSearchHint(jobType)}
              onChange={this.onFuzzySearchTextChange}
            />
          </div>
        </div>
      </div>
    );
  }
}
