import Dropdown from 'components/Dropdown';
import AdvancedSearch from 'components/AdvancedSearch';
import DateRangePicker from 'components/DateRangePicker';
import moment from 'moment';
import { dateRange } from 'utils/config';
import { deepCopy } from 'utils/simpleDeepCopy';
import i18n from 'utils/i18n';
import cs from './StatisticalReport.less';
import { get as getQuery, set as setQuery } from 'utils/cacheQuery';
import getQueryString from 'utils/queryString';
import {
  POSITION_HEADER,
  HISTORYORDER_HEADER,
  CTRADER_NOSHOW_TYPE,
  DEFAULT_SEARCH_TYPE,
  REPORT_ADVANCED_SEARCH_CMD_OPTION,
  ADVANCED_SEARCH_CONFIG
} from '../../../../constant';

export default class ActionsBar extends PureComponent {
  state = {
    showAdvancedSearchModal: false,
    showAdvancedSearchModal: false,
    ranges: {
      [i18n['general.date_range_picker.option.today']]: dateRange.today,
      [i18n['general.date_range_picker.option.yestoday']]: dateRange.yestoday,
      [i18n['general.date_range_picker.option.last7days']]: dateRange.last7days,
      [i18n['general.date_range_picker.option.last30days']]:
        dateRange.last30days,
      [i18n['general.date_range_picker.option.currentMonth']]:
        dateRange.currentMonth,
      [i18n['general.date_range_picker.option.lastMonth']]: dateRange.lastMonth
    },
    currentAdvancedSearchConfig: {
      ...ADVANCED_SEARCH_CONFIG,
      searchType: 'BW_REPORT_POSITION'
    }
  };
  componentDidMount() {
    const {
      getSearchType,
      getServerList,
      updateDateRange,
      updateNeedRefresh,
      updateCurrentServer,
      updateSearchType,
      updatePagination,
      updateCurrentSortParam,
      updateHeader,
      getSearchField,
      updateFieldConditions,
      updateCondition,
      updateAdvancedLogicType,
      updateSearchText,
      type,
      currentServer
    } = this.props;
    const { currentAdvancedSearchConfig } = this.state;
    const oldaccountQueryItem = this.props.accountQueryItem;
    Promise.all([
      getServerList(),
      getSearchType(DEFAULT_SEARCH_TYPE),
      updateSearchText(''),
      updateNeedRefresh(i18n['report.date_range_type.default_tints']),
      updateHeader(this.parseListHeader()),
      updateFieldConditions([]),
      updateAdvancedLogicType(''),
      getSearchField(this.parseListHeader())
    ]).then(() => {
      const preKey = type;
      this.setState({
        currentAdvancedSearchConfig: {
          ...currentAdvancedSearchConfig,
          currentHeader: this.parseListHeader()
        }
      });
      this.dealSearch(oldaccountQueryItem);
      let result = getQuery();
      Promise.all([
        result[`${preKey}dateRanges`] &&
          result[`${preKey}dateRanges`].startDate &&
          result[`${preKey}dateRanges`].endDate &&
          updateDateRange({
            startDate: moment(result[`${preKey}dateRanges`].startDate),
            endDate: moment(result[`${preKey}dateRanges`].endDate)
          }),
        result[`${preKey}currentServer`] &&
          updateCurrentServer(
            result[`${preKey}currentServer`] || this.props.serverList[0]
          ),
        result[`${preKey}accountQueryItem`] &&
          updateSearchType(result[`${preKey}accountQueryItem`]),
        result[`${preKey}accountQueryValue`] &&
          updateSearchText(result[`${preKey}accountQueryValue`]),
        result[`${preKey}currentPagination`] &&
          updatePagination(result[`${preKey}currentPagination`]),
        result[`${preKey}currentSortParam`] &&
          updateCurrentSortParam(result[`${preKey}currentSortParam`]),
        result[`${preKey}currentCondition`] &&
          updateCondition(result[`${preKey}currentCondition`])
      ]).then(() => {
        this.getReportList();
      });
    });
    updateDateRange({
      startDate: moment().startOf('day'),
      endDate: moment().endOf('day')
    });
  }
  dealSearch = accountQueryItem => {
    if (!accountQueryItem) return;
    const { searchType, updateSearchType, updateSearchText } = this.props;
    if (
      searchType.some(
        item => accountQueryItem && item.value === accountQueryItem.value
      )
    ) {
      updateSearchType(accountQueryItem);
    } else {
      updateSearchText('');
    }
  };
  onSearchTypeSelect = selected => {
    const { updateSearchType, type } = this.props;
    setQuery('accountQueryItem')(this.props, type);
    updateSearchType(selected);
  };
  onSearchTextChange = evt => {
    const { updateSearchText } = this.props;
    updateSearchText(evt.target.value);
  };
  getQuery = () => {
    const { updateNeedRefresh } = this.props;
    updateNeedRefresh('');
    this.getReportList();
  };
  onDateRangeSelect = ({ startDate, endDate }) => {
    const { updateDateRange } = this.props;
    Promise.all([updateDateRange({ startDate, endDate })]).then(() => {
      this.getQuery();
    });
  };
  onConditionChange = selected => {
    const { updateCondition } = this.props;
    updateCondition(selected);
  };
  getReportList = () => {
    const {
      getReportList,
      dateRanges,
      currentPagination,
      currentServer,
      updateNeedRefresh,
      accountQueryItem,
      accountQueryValue,
      currentSortParam,
      type,
      userId,
      searchFieldConditions,
      currentCondition,
      advancedLogicType
    } = this.props;
    const { startDate, endDate } = dateRanges;
    const { pageNo, pageSize } = currentPagination;
    setQuery(
      'currentServer',
      'accountQueryItem',
      'accountQueryValue',
      'dateRanges',
      'currentPagination',
      'currentSortParam',
      'currentCondition'
    )(this.props, type);
    getReportList({
      objectType: userId,
      accountQueryItem: accountQueryItem.value,
      accountQueryValue: accountQueryValue,
      reportType: type,
      searchStart: startDate ? startDate.format('YYYY-MM-DD') : null,
      searchEnd: endDate ? endDate.format('YYYY-MM-DD') : null,
      serverId: currentServer.value,
      nowPage: pageNo,
      pageSize: pageSize,
      conditions: searchFieldConditions,
      isConditionAnd: advancedLogicType === 'AND',
      sortingDirection: currentSortParam.orderDesc ? 'asc' : 'desc',
      sortingColumn: currentSortParam.sortby,
      searchId: currentCondition.value,
      isMarginMode: true
    }).then(res => {
      if (res.result) {
        if (res.data.list.length === 0) {
          updateNeedRefresh(i18n['report.date_range_type.default_no_results']);
        } else {
          updateNeedRefresh('');
        }
      }
    });
  };

  parseListHeader = () => {
    const { type, currentServer } = this.props;
    const currentVendor =
      currentServer.vendor === 'MT4'
        ? 'mt4'
        : currentServer.vendor === 'CTRADER'
          ? 'ctrader'
          : 'mt5';
    let data = [];
    if (type === 'Position') {
      if (currentVendor === 'ctrader') {
        data = POSITION_HEADER.filter(item => {
          return item['mt5'];
        });
        data = data.filter(item => {
          return !CTRADER_NOSHOW_TYPE.includes(item.value);
        });
        return data;
      } else {
        data = POSITION_HEADER.filter(item => {
          return item[currentVendor];
        });

        return data;
      }
    }

    if (type === 'HistoryOrder') {
      if (currentVendor === 'ctrader') {
        data = HISTORYORDER_HEADER.filter(item => {
          return item['mt4'];
        });
        return data;
      } else {
        data = HISTORYORDER_HEADER.filter(item => {
          return item[currentVendor];
        });
        return data;
      }
    }
  };

  componentWillReceiveProps(nextProps) {
    const newId = nextProps.userId;
    const { currentServer } = this.props;
    if (newId && newId !== this.props.userId && currentServer.value) {
      setTimeout(() => {
        this.getReportList();
      }, 0);
    }
  }
  onSearch = evt => {
    if (evt.which === 13) {
      this.getReportList();
    }
  };
  //切换server
  onServerSelect = selected => {
    const { updateCurrentServer, updateFieldConditions } = this.props;
    Promise.all([
      updateCurrentServer(selected),
      updateFieldConditions([])
    ]).then(() => {
      this.getReportList();
    });
  };
  toggleModal = (type, show) => {
    this.setState({
      [`show${type}Modal`]: show
    });
  };
  // 高级搜索相关
  onAdvancedSearch = (data, logicType, originData, isUpdate) => {
    const {
      updateFieldConditions,
      showTopAlert,
      updateAdvancedLogicType,
      updateCondition
    } = this.props;
    let isChecked = true;
    const copyData = deepCopy(originData);
    copyData.forEach((fieldItem, index) => {
      if (fieldItem.key === 'd' && parseInt(fieldItem.value) < 0) {
        isChecked = false;
        showTopAlert({
          content: i18n['report.advanced_search_conditions.d_tips'],
          bsStyle: 'danger'
        });
      }

      if (fieldItem.key === 'w' && parseInt(fieldItem.value) > 0) {
        isChecked = false;
        showTopAlert({
          content: i18n['report.advanced_search_conditions.w_tips'],
          bsStyle: 'danger'
        });
      }
    });

    if (isChecked) {
      Promise.all([
        updateFieldConditions(copyData),
        isUpdate && updateCondition(''),
        updateAdvancedLogicType(logicType)
      ]).then(() => {
        this.getReportList();
        this.toggleModal('AdvancedSearch', false);
      });
    }
  };

  injectDataToAdvancedSearchType = () => {
    const { advancedSearchType, userRights } = this.props;
    let conditions = [];
    advancedSearchType.forEach(item => {
      if (item.value === 'group') {
        if (
          userRights['ACCOUNT_SELECT_DIRECTLY_MTG'] ||
          userRights['ACCOUNT_SELECT_SUBORDINATE_MTG'] ||
          userRights['ACCOUNT_SELECT_WILD_MTG'] ||
          userRights['ACCOUNT_SELECT_ALL_MTG']
        ) {
          conditions.push(item);
        }
      } else if (item.value === 'account_group') {
        if (
          userRights['ACCOUNT_SELECT_DIRECTLY_GRP'] ||
          userRights['ACCOUNT_SELECT_SUBORDINATE_GRP'] ||
          userRights['ACCOUNT_SELECT_WILD_GRP'] ||
          userRights['ACCOUNT_SELECT_ALL_GRP']
        ) {
          conditions.push(item);
        }
      } else {
        conditions.push(item);
      }
    });
    return conditions.map(type => {
      if (/elect/.test(type.fieldType)) {
        type.optionList = this.getDropdownData(type);
      }
      return type;
    });
  };

  getDropdownData = item => {
    const { userGroupList, mtGroupList, currentServer } = this.props;
    switch (item.value) {
      case 'group':
        return mtGroupList.map(group => ({ label: group, value: group }));
      case 'cmd':
        return REPORT_ADVANCED_SEARCH_CMD_OPTION;
      case 'account_group':
        return userGroupList.map(group => ({
          label: group.groupName || '',
          value: group.id
        }));
      default:
        return [];
    }
  };
  render() {
    const {
      accountQueryItem,
      accountQueryValue,
      currentServer,
      serverList,
      dateRanges,
      type,
      currentCondition,
      advancedSearchConditions
    } = this.props;
    const { startDate, endDate } = dateRanges;
    const dateLimit = { months: 6 };
    const {
      ranges,
      currentAdvancedSearchConfig,
      showAdvancedSearchModal
    } = this.state;
    const advancedSearchType = this.injectDataToAdvancedSearchType();
    const searchKey = `BW_REPORT_${currentServer &&
      currentServer.value}_${type && type.toUpperCase()}`;
    return (
      <div className={cs['action-bar']}>
        <AdvancedSearch.Container
          {...currentAdvancedSearchConfig}
          searchType={searchKey}
          types={advancedSearchType}
          conditions={advancedSearchConditions}
          show={showAdvancedSearchModal}
          onSearch={this.onAdvancedSearch}
          ref="advancedSearch"
          onOpen={this.advancedSearchPromise}
          list={this.refs.conditionList}
        >
          <div className={cs['wrapper']}>
            <Dropdown
              autoWidth
              className={`${`${cs['dropdown']} focus`} focus`}
              data={serverList}
              value={currentServer}
              onSelect={this.onServerSelect}
            />
            <div className={cs['date-time-picker']}>
              <DateRangePicker
                className={cs['picker']}
                inputClassName={'focus'}
                dateLimit={dateLimit}
                ranges={ranges}
                inline
                format="YYYY-MM-DD"
                onApply={this.onDateRangeSelect}
                startDate={startDate}
                endDate={endDate}
              />
            </div>
            <AdvancedSearch.ConditionList
              className={`${cs['dropdown']} focus`}
              onSelect={this.onConditionChange}
              searchType={searchKey}
              value={currentCondition}
              container={this.refs.advancedSearch}
              ref="conditionList"
            />
            <div className={cs['tool-right']}>
              <AdvancedSearch.SearchButton
                container={this.refs.advancedSearch}
              />
              <div className={cs['search-bar']}>
                <Dropdown
                  className={`${cs['search-dropdown']} focus`}
                  data={DEFAULT_SEARCH_TYPE}
                  value={accountQueryItem}
                  onSelect={this.onSearchTypeSelect}
                />
                <input
                  type="text"
                  placeholder={i18n['account.search.placeholder']}
                  className="form-control focus"
                  value={accountQueryValue}
                  onChange={this.onSearchTextChange}
                  onKeyPress={this.onSearch}
                />
              </div>
            </div>
          </div>
        </AdvancedSearch.Container>
      </div>
    );
  }
}
