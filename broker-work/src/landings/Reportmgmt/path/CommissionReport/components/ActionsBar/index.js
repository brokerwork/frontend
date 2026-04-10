import i18n from 'utils/i18n';
import cs from './ActionsBar.less';
import {
  Icon,
  Dropdown,
  Menu,
  Button,
  Input,
  Message,
  Popover,
  Badge,
  Select,
  Tooltip
} from 'lean-ui';
import Server from '../../containers/Server';
import ConditionFilter from 'components/v2/ConditionFilter';
import { Summary } from 'components/v2/PageWraper';
import { dateRange } from 'utils/config';
import _ from 'lodash';
import { isNumber } from 'utils/validate';
import moment from 'moment';
import { FormattedMessage } from 'react-intl';
import { rebateSearchParamsConfig } from '../../controls/actions';
import { NEW_REPORTTYPE_FILTER } from '../../constants';
const Option = Select.Option;
const exportSpecialReport = ['LotsNew', 'RTCommission', 'CommissionCharge'];
const SPLIT = '@#$';
export default class ActionsBar extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      recomputedDisabled: false
    };
  }
  getReportList = unReset => {
    // const resolve = [];
    // if (!unReset) {
    //   resolve.push(this.resetPageAndSort());
    // }
    const { getReportList, updateNeedRefresh, params } = this.props;
    if (!unReset) {
      if (params.nowPage) {
        params.nowPage = 1;
      }
      if (params.pager) {
        params.pager = 1;
      }
    }
    Promise.resolve(getReportList(params)).then(res => {
      if (res && res.result) {
        if (res.data.list.length === 0) {
          updateNeedRefresh(i18n['report.date_range_type.default_no_results']);
        } else {
          updateNeedRefresh('');
        }
      }
    });
  };

  onServerSelect = selected => {
    this.props.checkFailNum();
    this.getReportList();
  };

  onSearchTextChange = evt => {
    const { updateSearchText, currentCommissionReportType } = this.props;
    const v = evt.target.value;
    updateSearchText(v);
  };

  onSearch = evt => {
    const { currentCommissionReportType, accountQueryValue } = this.props;
    // if (!isNumber(accountQueryValue) && accountQueryValue.length) {
    //   Message.error(i18n['report.fuzzy_search.warning']);
    //   return;
    // }
    this.getReportList();
  };
  handleReportChange = value => {
    const { modifyParams, params } = this.props;
    const copyParams = _.cloneDeep(params);
    copyParams.profitCalcType = value;
    modifyParams({ ...copyParams, nowPage: 1 });
  };
  resetPageAndSort() {
    const { updatePagination, updateCurrentSortParam } = this.props;
    return Promise.all([updateCurrentSortParam({})]);
  }

  toggleModal = (type, show) => {
    this.setState({
      [`show${type}Modal`]: show
    });
  };
  showDownLoadButton = type => {
    const { userRights } = this.props;
    switch (type) {
      case 'LotsNew':
        return userRights['STAT_VIEW_COMMISSION_EXPOT_TC'];
      case 'LotsNewSearch':
        return userRights['STAT_VIEW_COMMISSION_EXPOT_TC'];
      case 'Deposit':
        return userRights['STAT_VIEW_COMMISSION_EXPOT_DP'];
      case 'NetDeposit':
        return userRights['STAT_VIEW_COMMISSION_EXPOT_ND'];
      case 'Profit':
        return userRights['STAT_VIEW_COMMISSION_EXPOT_PS'];
      case 'NetProfit':
        return userRights['STAT_VIEW_COMMISSION_EXPOT_NETPROFIT'];
      case 'CommissionCharge':
        return userRights['STAT_VIEW_COMMISSION_EXPOT_COMMISSION'];
      case 'RealTime':
        return userRights['STAT_VIEW_COMMISSION_EXPOT_DAY'];
      case 'RTCommission':
        return userRights['STAT_VIEW_COMMISSION_EXPOT_RT'];
    }
  };

  downLoadReport = ({ key }) => {
    const {
      postDownloadRequest,
      rebateSearchDownloadRequest,
      params,
      showTipsModal,
      currentCommissionReportType
    } = this.props;
    let copyData = _.cloneDeep(params);
    if (key === 'reDo') {
      const filterDate = params.conditions.find(
        item => item.key === 'filterDate'
      );

      let reDoTimeLimit =
        !!filterDate &&
        !!filterDate.value &&
        moment(filterDate.value.endDate, 'YYYY-MM-DD').diff(
          moment(filterDate.value.startDate, 'YYYY-MM-DD')
        ) <
          31 * 24 * 60 * 60 * 1000; //是否达到重算明细显示的时间限制

      if (!reDoTimeLimit) {
        //超出了限制
        showTipsModal({
          content: i18n['report.download_tips_modal.time_limit.tips'],
          noCancel: true
        });
        return;
      }

      copyData.reDo = true;
      Promise.resolve(postDownloadRequest(copyData)).then(res => {
        if (res.result) {
          showTipsModal({
            content: i18n['report.download_tips_modal.jump_content'],
            header: i18n['report.download_tips_modal.jump_tips'],
            onConfirm: cb => {
              window.open('/reportmgmt/downloadcenter');
              cb();
            }
          });
        }
      });
    } else {
      const value = key === 'false' ? false : true;
      if (exportSpecialReport.includes(currentCommissionReportType.value)) {
        copyData.isSummary = value;
      } else {
        const originCondition = params.conditions.find(
          item => item.key === 'objectType'
        );
        let nowCondition = copyData.conditions.find(
          item => item.key === 'objectType'
        );
        nowCondition.value = value ? originCondition.value : 'all';
        nowCondition.originValue = value
          ? originCondition.originValue
          : {
              label: i18n['report.download_tips_modal.summary_user'],
              value: 'all'
            };
      }
      let downLoadReport = postDownloadRequest;
      let downLoadParams = copyData;
      const newReportType =
        NEW_REPORTTYPE_FILTER[currentCommissionReportType.value];
      if (newReportType) {
        downLoadReport = rebateSearchDownloadRequest;
        downLoadParams = rebateSearchParamsConfig(copyData);
        if (copyData.isSummary === true) {
          downLoadParams.exportType = 'Summary';
        }
        if (copyData.isSummary === false) {
          downLoadParams.exportType = 'Detail';
        }
      }
      Promise.resolve(downLoadReport(downLoadParams, newReportType)).then(
        res => {
          if (res.result) {
            showTipsModal({
              content: i18n['report.download_tips_modal.jump_content'],
              header: i18n['report.download_tips_modal.jump_tips'],
              onConfirm: cb => {
                window.open('/reportmgmt/downloadcenter');
                cb();
              }
            });
          }
        }
      );
    }
  };

  moreMenu = () => {
    const {
      currentDownloadOptions,
      userInfo,
      params,
      currentCommissionReportType
    } = this.props;

    let objectType = params.conditions.find(item => item.key === 'objectType');
    let copycurrentDownloadOptions = _.cloneDeep(currentDownloadOptions);
    if (
      currentCommissionReportType.value === 'LotsNew' &&
      userInfo.id === 1 &&
      objectType &&
      objectType.value === 'all'
    ) {
      copycurrentDownloadOptions.push({
        label: i18n['report.download_tips_modal.redo'],
        value: 'reDo'
      });
    }
    return (
      <Menu triggerSubMenuAction="click" onClick={this.downLoadReport}>
        {copycurrentDownloadOptions.map(item => {
          return <Menu.Item key={item.value}>{item.label}</Menu.Item>;
        })}
      </Menu>
    );
  };

  reload = () => {
    const { modifyParams, params } = this.props;
    modifyParams({ ...params, nowPage: 1 });
  };
  getFailList = () => {
    const { updateFieldConditions, modifyParams, setParams } = this.props;
    updateFieldConditions(setParams().conditions);
    modifyParams(setParams());
  };
  isShowRecomputed = () => {
    const { currentCommissionReportType, params, userRights } = this.props;
    const conditions = _.get(params, 'conditions', []);
    const objectType =
      conditions &&
      conditions.length &&
      conditions.find(condition => condition.key === 'objectType');
    return (
      userRights['STAT_VIEW_COMMISSION_OPERAT_RECALCULATE'] &&
      currentCommissionReportType.value === 'LotsNew' &&
      _.get(objectType, 'value', '').indexOf(SPLIT) > -1
    ); // 目前是通过判断 参数中objectType的传参格式：**@#$** 来判断是否是选择某一个账户或直属
  };
  recomputedRebate = () => {
    const {
      showTipsModal,
      params,
      reComputedRebate,
      commissionReportList
    } = this.props;
    this.setState({
      recomputedDisabled: true
    });
    if (_.get(commissionReportList, 'total', 0) > 1000) {
      showTipsModal({
        content: (
          <FormattedMessage
            id="report.recomputed.tips"
            defaultMessage={i18n['report.recomputed.tips']}
            values={{
              number: 1000
            }}
          />
        ),
        header: i18n['tipsmodal.title'],
        onConfirm: cb => {
          cb();
        }
      });
    } else {
      const conditions = _.get(params, 'conditions', []);
      const filterDate = conditions.find(item => item.key === 'filterDate');
      const objectType = conditions.find(item => item.key === 'objectType');
      const [ownerType, userId] = _.get(objectType, 'value', '').split(SPLIT);
      // 重算条件
      const endParams = {
        from: _.get(filterDate, 'value.startDate', ''),
        ownerType,
        serverId: params.serverId,
        to: _.get(filterDate, 'value.endDate', ''),
        userId
      };
      reComputedRebate(endParams).then(res => {
        this.setState({
          recomputedDisabled: false
        });
        if (res.result) {
          Message.success(i18n['report.recomputed.success']);
          this.getReportList();
        }
      });
    }
  };
  // 设置或者取消常用
  setAndCancelUsual = () => {
    const {
      match: { params: { type } = {} },
      setOrCancelUsual,
      usualReportList
    } = this.props;
    let copydata = _.cloneDeep(usualReportList);
    copydata[type] = !copydata[type];
    localStorage.setItem('usual', JSON.stringify(copydata));
    setOrCancelUsual(copydata);
  };
  render() {
    const {
      accountQueryValue,
      commissionReportList,
      listUpdateTime,
      currentCommissionReportType,
      currentSortParam: { sortby, orderDesc },
      getSimpleUsers,
      failNum,
      match: { params: { type } = {} },
      usualReportList,
      currentDownloadOptions,
      versionRights
    } = this.props;
    const { recomputedDisabled } = this.state;
    const showDownLoadButton = this.showDownLoadButton(
      currentCommissionReportType.value
    );
    // 盈利分成 和净盈利分成报表新增了报表类型，因此需要在原有页面上新增报表切换，此处用于判断是否展示，还是保持原样
    const isShowReportSelect =
      versionRights['REPORT_NEW_TYPE'] &&
      ['Profit', 'NetProfit'].includes(currentCommissionReportType.value);
    return (
      <div className={cs['action-bar']}>
        <div className={cs['left-part']}>
          <div className={cs['primary-top-title']}>
            <Icon
              icon="report-color"
              className={`main-color ${cs['customer-icon']}`}
              fontType={'bw'}
            />
            <div className={cs['module-info']}>
              <Server onChange={this.onServerSelect} />
              <ConditionFilter.ViewList
                reportType="commissionReports"
                currentReportType={currentCommissionReportType}
                getData={getSimpleUsers}
                sub={true}
                showSearch={true}
              />
            </div>
          </div>
          <div className={cs['info-box']}>
            {/* 满足报表切换展示条件才展示 */}
            {isShowReportSelect && (
              <div className={cs['info-select']}>
                <Select
                  value={
                    this.props.params.profitCalcType
                      ? this.props.params.profitCalcType
                      : 'PROFIT'
                  }
                  onSelect={this.handleReportChange}
                >
                  <Option value="PROFIT">
                    {
                      i18n[
                        `report.commission_table_type.${
                          this.props.params.reportType
                        }`
                      ]
                    }
                  </Option>
                  <Option value="PROFIT_COMMISSION_SWAP">
                    {
                      i18n[
                        `report.commission_table_type.${
                          this.props.params.reportType
                        }New`
                      ]
                    }
                  </Option>
                </Select>
                {this.props.params.profitCalcType ===
                  'PROFIT_COMMISSION_SWAP' && (
                  <div className={cs['info-help-tips']}>
                    <Tooltip
                      trigger="hover"
                      placement="right"
                      title={
                        i18n['report.commission_table_type.ProfitNew.tips']
                      }
                    >
                      <span>
                        <Icon className={cs['tip']} icon="question" />
                      </span>
                    </Tooltip>
                  </div>
                )}
              </div>
            )}

            <Summary.Info
              total={commissionReportList.total || 0}
              updateTime={listUpdateTime}
              moduleName={
                !isShowReportSelect
                  ? i18n[
                      `report.commission_table_type.${
                        currentCommissionReportType.value
                      }`
                    ]
                  : ''
              }
              children={
                <Icon
                  className={`main-color ${cs['refresh-icon']}`}
                  icon="refresh"
                  onClick={this.reload}
                  fontType={'bw'}
                />
              }
            />
          </div>
        </div>
        <div className={cs['right-part']}>
          <div className={cs['button-area']}>
            {(type === 'RTCommission' || type === 'RealTime') && (
              <Badge className={cs['badge']} showZero count={failNum}>
                <Button onClick={this.getFailList}>
                  {i18n['report.retry_deposit.header']}
                </Button>
              </Badge>
            )}

            {showDownLoadButton ? (
              currentDownloadOptions ? (
                <Dropdown overlay={this.moreMenu()} trigger="click">
                  <Button type="primary">
                    <Icon icon={'download'} />
                    {i18n['report.date_range_type.export']}
                  </Button>
                </Dropdown>
              ) : (
                <Button type="primary" onClick={this.downLoadReport}>
                  <Icon icon={'download'} />
                  {i18n['report.date_range_type.export']}
                </Button>
              )
            ) : (
              undefined
            )}
            {this.isShowRecomputed() && (
              <Button
                className={cs['margin-l-10']}
                onClick={this.recomputedRebate}
                disabled={recomputedDisabled}
              >
                {i18n['report.recomputed']}
              </Button>
            )}
            <div className={cs['button-actions']}>
              <Popover
                trigger="hover"
                placement="left"
                overlayClassName={cs['usual-report-popover']}
                content={
                  usualReportList[type]
                    ? i18n['report.general.cancel_usual']
                    : i18n['report.general.set_usual']
                }
              >
                <div
                  className={cs['more-menu']}
                  onClick={this.setAndCancelUsual}
                >
                  <Icon
                    className={cs['follow-star']}
                    icon={
                      usualReportList[type]
                        ? 'collection-soild'
                        : 'collection-outline'
                    }
                  />
                </div>
              </Popover>
            </div>
          </div>
          <div className={cs['search-input']}>
            <Input
              suffix={<Icon onClick={this.onSearch} icon="search" />}
              placeholder={i18n['report.fuzzy_search.placeholder']}
              value={accountQueryValue}
              onChange={this.onSearchTextChange}
              onPressEnter={this.onSearch}
            />
          </div>
        </div>
      </div>
    );
  }
}
