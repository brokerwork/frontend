import i18n from 'utils/i18n';
import cs from './ActionsBar.less';
import { Icon, Button, Input, Tooltip, Message, Popover } from 'lean-ui';
import Server from '../../containers/Server';
import ConditionFilter from 'components/v2/ConditionFilter';
import { Summary } from 'components/v2/PageWraper';
import { ADVANCED_SEARCH_CONFIG, REPORT_SORT_INTIAL } from '../../constant';
import { CTRADER_NOSHOW_TYPE } from '../../../../constant';
import _ from 'lodash';
export default class ActionsBar extends PureComponent {
  componentDidMount() {
    const {
      getSymbolGroup,
      updateNeedRefresh,
      updateAdvancedLogicType,
      match: { params: { type } = {} }
    } = this.props;
    getSymbolGroup();
    updateAdvancedLogicType('');
    updateNeedRefresh(i18n['report.date_range_type.default_tints']);
  }
  getReportList = unReset => {
    const {
      getReportList,
      updateNeedRefresh,
      params,
      currentStatisticalReportType,
      updateCurrentSortParam,
      currentServer
    } = this.props;
    if (!unReset) {
      params.nowPage = 1;
    }
    const type = this.props.match.params.type;
    const currentSortInfo = REPORT_SORT_INTIAL.find(item => item.type === type);
    const sortParams = {
      sortby:
        type === 'HistoryOrder'
          ? currentSortInfo[`${currentServer.vendor}sortColumn`]
          : _.get(currentSortInfo, 'sortColumn', ''),
      orderDesc: true
    };
    Promise.resolve(updateCurrentSortParam(sortParams))
      .then(() => {
        getReportList({
          ...params,
          sortingColumn: sortParams.sortby,
          sortingDirection: sortParams.orderDesc ? 'desc' : 'asc',
          reportType: currentStatisticalReportType.value
        });
      })
      .then(res => {
        if (res && res.result) {
          if (res.data.list.length === 0) {
            updateNeedRefresh(
              i18n['report.date_range_type.default_no_results']
            );
          } else {
            updateNeedRefresh('');
          }
        }
      });
  };

  onServerSelect = selected => {
    this.getReportList();
  };

  onSearchTextChange = evt => {
    const { updateSearchText } = this.props;
    updateSearchText(evt.target.value);
  };

  onSearch = evt => {
    this.getReportList();
  };

  resetPageAndSort() {
    const { updatePagination, updateCurrentSortParam } = this.props;
    return Promise.all([
      updateCurrentSortParam({}),
      updatePagination({ pageNo: 1 })
    ]);
  }

  toggleModal = (type, show) => {
    this.setState({
      [`show${type}Modal`]: show
    });
  };

  showDownLoadButton = type => {
    const { userRights } = this.props;
    switch (type) {
      case 'AccountSummary':
        return userRights['STAT_VIEW_ACC_EXPOT_ZACC'];
      case 'AccountDw':
        return userRights['STAT_VIEW_ACC_EXPOT_FUND'];
      case 'Position':
        return userRights['STAT_VIEW_ACC_EXPOT_POSITION'];
      case 'Order':
        return userRights['STAT_VIEW_ACC_EXPOT_GUADAN'];
      case 'HistoryOrder':
        return userRights['STAT_VIEW_ACC_EXPOT_HISTORY'];
      case 'SymbolGroup':
        return userRights['STAT_VIEW_ACC_EXPOT_VCR'];
      case 'StopLimit':
        return userRights['STAT_VIEW_ACC_EXPOT_SLCS'];
      case 'NewUser':
        return userRights['STAT_VIEW_ACC_EXPOT_NAR'];
    }
  };

  downLoadReport = () => {
    const {
      postDownloadRequest,
      params,
      showTipsModal,
      currentStatisticalReportType
    } = this.props;
    Promise.resolve(
      postDownloadRequest(params, currentStatisticalReportType.value)
    ).then(res => {
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
  };
  getToolTips = () => {
    const { currentStatisticalReportType } = this.props;
    if (currentStatisticalReportType.value === 'AccountSummary') {
      return (
        <div className={cs['glossary-tips']}>
          <div className={cs['glossary-header']}>
            {i18n['report.account_summary_Header.glossary.header']}
          </div>
          <div className={cs['glossary-content']}>
            <table className={cs['glossary-list']}>
              <tbody>
                {i18n['report.account_summary_Header.glossary']
                  .split('</br>')
                  .map((item, idx) => {
                    const attrs = item.split('</title>');

                    return (
                      <tr key={idx}>
                        <th>{attrs[0]}</th>
                        <td>{attrs[1]}</td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      );
    }

    if (currentStatisticalReportType.value === 'AccountDw') {
      return (
        <div>
          <div className={cs['glossary-header']}>
            {i18n['report.account_dw_Header.glossary.header']}
          </div>
          <div className={cs['glossary-content']}>
            <div className={cs['glossary-sub-header']}>
              {i18n['report.account_dw_Header.glossary.sub_header']}
            </div>
            <table className={cs['glossary-list']}>
              <tbody>
                {i18n['report.account_dw_Header.glossary']
                  .split('</br>')
                  .map((item, idx) => {
                    const attrs = item.split('</title>');

                    return (
                      <tr key={idx}>
                        <th>{attrs[0]}</th>
                        <td>{attrs[1]}</td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
          <div className={cs['glossary-warning']}>
            {i18n['report.account_dw_Header.glossary.tips']}
          </div>
        </div>
      );
    }
  };

  setColumn = () => {
    const {
      statisticalListColumns,
      currentServer,
      currentStatisticalReportType
    } = this.props;
    let copyData = _.cloneDeep(statisticalListColumns);
    const currentVendor =
      currentServer.vendor === 'MT4'
        ? 'mt4'
        : currentServer.vendor === 'CTRADER'
          ? 'ctrader'
          : 'mt5';
    switch (currentVendor) {
      case 'mt4':
        //mt4时执行
        if (
          ['Position', 'Order', 'HistoryOrder'].includes(
            currentStatisticalReportType.value
          )
        ) {
          copyData = copyData.filter(item => {
            return item[currentVendor];
          });
          return copyData;
        }
        return copyData;
      case 'mt5':
        //mt5时执行
        if (
          ['Position', 'Order', 'HistoryOrder'].includes(
            currentStatisticalReportType.value
          )
        ) {
          copyData = copyData.filter(item => {
            return item[currentVendor];
          });
          return copyData;
        }
        return copyData;
      case 'mt5':
      case 'ctrader':
        //ctrader时执行
        copyData = copyData.filter(item => {
          return !CTRADER_NOSHOW_TYPE.includes(item.value);
        });
        if (currentStatisticalReportType.value === 'AccountDw') {
          copyData.push({
            label: i18n['report.account_dw_Header.outer_comment'],
            value: 'comment',
            fieldType: 'input'
          });
        }
        return copyData;
    }
  };

  getSortLabel = () => {
    const {
      currentStatisticalReportType,
      currentSortParam: { sortby, orderDesc }
    } = this.props;
    let sortLabel = '';
    const column = this.setColumn();
    const sortInfo = sortby
      ? column.find(item => `${item.value}` === `${sortby}`)
      : undefined;
    if (currentStatisticalReportType.value === 'SymbolGroup') return;
    if (currentStatisticalReportType.value === 'HistoryOrder' && sortInfo) {
      sortLabel = sortInfo.label;
      return sortLabel;
    }
    return sortInfo && sortInfo.label;
  };
  reload = () => {
    const { modifyParams, params, currentStatisticalReportType } = this.props;
    modifyParams({
      ...params,
      nowPage: 1,
      id: '',
      reportType: currentStatisticalReportType.value
    });
  };
  // 用于传入高级搜索新增搜索账户时是否有权限查看其本身的数据和其下属的数据,
  //right:STAT_VIEW_ACC_RANGE_MY,STAT_VIEW_ACC_RANGE_SUB 同时没有时传sub,其他情况传subbelong
  canIHaveRights = () => {
    const { userRights } = this.props;
    if (
      userRights &&
      !userRights['STAT_VIEW_ACC_RANGE_ALL'] &&
      !userRights['STAT_VIEW_ACC_RANGE_SUB']
    ) {
      return 'sub'; // sub
    } else {
      return 'subBelong'; //subbelong
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
      reportList,
      listUpdateTime,
      currentStatisticalReportType,
      currentServer,
      match: { params: { type } = {} },
      getSimpleUserList,
      usualReportList
    } = this.props;
    const showTipsTypes = ['AccountDw', 'AccountSummary'];
    const showDownLoadButton = this.showDownLoadButton(
      currentStatisticalReportType.value
    );
    let searchType = ADVANCED_SEARCH_CONFIG.searchType;
    if (currentServer && currentServer.value !== undefined) {
      searchType = `BW_REPORT_${currentServer &&
        currentServer.value}_${type.toUpperCase()}`;
    }
    // 啃爹不啃爹，本来好好的，现在吧国际化key是小写，路由是首字母大写，改成一致不就行了，jimmy要求专门给Position,Order特殊处理成小写，所以写了这么一段多余代码。
    let moduleName =
      i18n[`report.account_table_type.${currentStatisticalReportType.value}`];
    if (['Order', 'Position'].includes(currentStatisticalReportType.value)) {
      moduleName =
        i18n[
          `report.account_table_type.${currentStatisticalReportType.value.toLowerCase()}`
        ];
    }
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
                searchType={searchType}
                getData={getSimpleUserList}
                showSearch={true}
                right={this.canIHaveRights()}
                dataType="AccountReport"
                currentReport={currentStatisticalReportType.value}
              />
            </div>
          </div>
          <Summary.Info
            total={reportList.total}
            orderBy={this.getSortLabel()}
            updateTime={listUpdateTime}
            moduleName={moduleName}
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
        <div className={cs['right-part']}>
          <div className={cs['button-area']}>
            {showDownLoadButton ? (
              <Button
                onClick={this.downLoadReport}
                type="primary"
                disabled={!reportList.total}
              >
                <Icon icon={'download'} />{' '}
                {i18n['report.date_range_type.export']}
              </Button>
            ) : (
              undefined
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

              {showTipsTypes.includes(currentStatisticalReportType.value) ? (
                <div className={cs['more-menu']}>
                  <Tooltip
                    trigger="click"
                    placement="topLeft"
                    title={this.getToolTips}
                  >
                    <Icon icon="info-outline" />
                  </Tooltip>
                </div>
              ) : (
                undefined
              )}
            </div>
          </div>
          <div className={cs['search-input']}>
            <Input
              suffix={<Icon onClick={this.onSearch} icon="search" />}
              placeholder={
                i18n[
                  `${
                    currentStatisticalReportType.value
                  }_report.fuzzy_search.placeholder`
                ]
              }
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
