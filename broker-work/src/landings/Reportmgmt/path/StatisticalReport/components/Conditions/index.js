import ConditionFilter from 'components/v2/ConditionFilter';
import _ from 'lodash';
import i18n from 'utils/i18n';
import {
  ADVANCED_SEARCH_CONFIG,
  MTG_RIGHTS,
  GRP_RIGHTS,
  REPORT_SORT_INTIAL
} from '../../constant';
import {
  ADVANCED_SEARCH_CONDITIONS,
  CTRADER_NOSHOW_TYPE,
  CTRADER_COLUMNS_FILTER
} from '../../../../constant';
import { dateRange } from 'utils/config';

export default class Conditions extends PureComponent {
  resetConditions = () => {
    const { privilegeType } = this.props;
    const newConditions = [
      {
        key: 'objectType',
        type: 'equals',
        originValue: privilegeType.find(el => el.value === 'all'),
        value: privilegeType.find(el => el.value === 'all').value
      },
      {
        key: 'filterDate',
        type: 'between',
        originValue: {
          startDate: dateRange.today.start,
          endDate: dateRange.today.end
        },
        value: {
          startDate: dateRange.today.start,
          endDate: dateRange.today.end
        }
      }
    ];
    return newConditions;
  };
  onAdvancedSearch = (data, logicType, viewId, resetType, isFirstset) => {
    const {
      updateCondition,
      privilegeType,
      modifyParams,
      updateFieldConditions,
      currentStatisticalReportType,
      updateCurrentSortParam
    } = this.props;
    let copyData = _.cloneDeep(data);

    if (!viewId && resetType === 'reset') {
      copyData.push({
        key: 'objectType',
        type: 'equals',
        originValue: privilegeType[0],
        value: privilegeType[0].value
      });
    }
    const {
      params,
      currentServer,
      match: { params: { type } = {} }
    } = this.props;
    // 处理sort参数
    const currentSortInfo = REPORT_SORT_INTIAL.find(item => item.type === type);
    const sortParams = {
      sortby:
        type === 'HistoryOrder'
          ? currentSortInfo[`${currentServer.vendor}sortColumn`]
          : _.get(currentSortInfo, 'sortColumn', ''),
      orderDesc: true
    };
    // 是否是第一次加载
    if (isFirstset) {
      copyData = this.resetConditions();
    }
    Promise.all([
      updateCondition(viewId),
      updateFieldConditions(copyData)
    ]).then(() => {
      updateCurrentSortParam(sortParams);
      modifyParams({
        ...params,
        nowPage: 1,
        conditions: copyData,
        id: '',
        reportType: currentStatisticalReportType.value
      });
    });
  };
  ctreaderColumnFilter = columns => {
    const { currentStatisticalReportType } = this.props;
    const type =
      currentStatisticalReportType &&
      currentStatisticalReportType.value.toUpperCase();
    const filterArray = CTRADER_COLUMNS_FILTER[type];
    //挂单查询 初始手数和交易量一个字段，此处特殊处理，显示初始手数;
    if (type === 'ORDER') {
      columns = columns.filter(item => {
        if (item.value === 'volume') {
          return item.ctrader;
        } else {
          return true;
        }
      });
    }
    return filterArray
      ? columns.filter(item => !filterArray.includes(item.value))
      : columns;
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
      case 'ctrader':
        //ctrader时执行
        copyData = copyData.filter(item => {
          return !CTRADER_NOSHOW_TYPE.includes(item.value);
        });
        copyData = this.ctreaderColumnFilter(copyData);
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

  injectDataToAdvancedSearchType = () => {
    const {
      advancedSearchType,
      privilegeType,
      getReportSubLevelUsers,
      symbolGroup,
      serverSymbols,
      currentServer,
      userRights,
      getTreeSearch,
      getSubTreeUsersById
    } = this.props;
    const columns = this.setColumn();
    const types = _.cloneDeep(advancedSearchType);

    const copyTypes = [];
    const mtRight = MTG_RIGHTS.find(item => userRights[item]);
    const gtRight = GRP_RIGHTS.find(item => userRights[item]);
    types.forEach(item => {
      if (item.keepOpen || item.default) {
        copyTypes.push(item);
      } else {
        if (item.value === 'group' && mtRight) {
          const groupItem = _.cloneDeep(item);
          if (currentServer.vendor === 'CTRADER') {
            groupItem.label = i18n['task.details.field.ct_group'];
          }
          copyTypes.push(groupItem);
        }
        if (item.value === 'account_group' && gtRight) {
          copyTypes.push(item);
        }
        if (!!columns.find(ob => ob.value === item.value)) {
          copyTypes.push(item);
        }
      }
      // 如果存在权限 REPOPR_SELECT 则筛选时间最大范围为一年
      if (userRights['REPOPR_SELECT']) {
        // 筛选出时间控件
        if (
          item.fieldType === 'date' &&
          _.get(item, 'additions.dateLimit.months', 0)
        ) {
          _.set(item, 'additions.dateLimit.months', 12);
        }
      }
    });
    const searchType = copyTypes.find(item => item.value === 'objectType');
    const symbolgroup = copyTypes.find(item => item.value === 'symbol_group');
    const symbol = copyTypes.find(item => item.value === 'symbol');
    if (searchType) {
      searchType.optionList = privilegeType;
      searchType.additions = searchType.additions || {};
      searchType.additions.getData = getReportSubLevelUsers;
      searchType.additions.searchable = true;
      searchType.additions.onFilter = getTreeSearch;
      searchType.additions.getSearchTree = getSubTreeUsersById;
    }
    if (symbolgroup) {
      symbolgroup.optionList = symbolGroup;
    }
    if (symbol) {
      symbol.optionList = serverSymbols[currentServer.value] || [];
    }
    return copyTypes;
  };
  render() {
    const {
      searchFieldConditions,
      children,
      advancedConditions,
      currentServer,
      match: { params: { type } = {} }
    } = this.props;
    let searchType = ADVANCED_SEARCH_CONFIG.searchType;
    if (currentServer && currentServer.value !== undefined) {
      searchType = `BW_REPORT_${currentServer &&
        currentServer.value}_${type.toUpperCase()}`;
    }
    return (
      <ConditionFilter.Container
        types={this.injectDataToAdvancedSearchType()}
        conditions={ADVANCED_SEARCH_CONDITIONS}
        onSearch={this.onAdvancedSearch}
        data={searchFieldConditions}
        viewId={advancedConditions}
        {...ADVANCED_SEARCH_CONFIG}
        searchType={searchType}
      >
        {children}
      </ConditionFilter.Container>
    );
  }
}
