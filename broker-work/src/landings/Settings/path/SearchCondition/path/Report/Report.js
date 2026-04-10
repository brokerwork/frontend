import Root from '../../container/Root';
import {
  ADVANCED_SEARCH_CONFIG,
  REPORT_ADVANCED_SEARCH_CONDITIONS,
  REPORT_ADVANCED_SEARCH_CMD_OPTION,
  OPEN_CLOSE_SEARCH_TYPE
} from '../../../../../Reportmgmt/constant';
import Dropdown from 'components/Dropdown';

export default class CustomerSelectConditions extends PureComponent {
  componentDidMount() {
    const { getServerList } = this.props;
    getServerList().then(res => {
      this.getResource();
    });
  }
  getResource = () => {
    const {
      getUserGroupList,
      getMTGroupList,
      currentServer,
      getServerSymbols
    } = this.props;
    getUserGroupList(currentServer.value);
    getMTGroupList(currentServer.value);
    getServerSymbols();
  };
  onServerSelect = selected => {
    const { updateCurrentServer } = this.props;
    Promise.resolve(updateCurrentServer(selected)).then(() => {
      this.getResource();
    });
  };
  onStatisticalReportTypeSelect = selected => {
    const { updateCurrentStatisticalReportType } = this.props;
    updateCurrentStatisticalReportType(selected);
  };
  getDropdownData = item => {
    const {
      userGroupList,
      mtGroupList,
      serverSymbols,
      currentServer
    } = this.props;
    switch (item.value) {
      case 'symbol':
        return (
          (currentServer &&
            currentServer.value &&
            currentServer.value.serverId &&
            serverSymbols[currentServer.value.serverId]) ||
          []
        );
      case 'group':
        return mtGroupList.map(group => ({ label: group, value: group }));
      case 'cmd':
        return REPORT_ADVANCED_SEARCH_CMD_OPTION;
      case 'account_group':
        return userGroupList;
      case 'open_close':
        return OPEN_CLOSE_SEARCH_TYPE;
      default:
        return [];
    }
  };
  injectDataToAdvancedSearchType = () => {
    const {
      advancedSearchTypeReport,
      userRights,
      currentStatisticalReportType
    } = this.props;
    const conditions = [];

    advancedSearchTypeReport.forEach(item => {
      if (item.value === 'user_id') {
        if (currentStatisticalReportType.value !== 'SymbolGroup') {
          conditions.push(item);
        }
      } else if (item.value === 'group') {
        if (
          currentStatisticalReportType.value !== 'SymbolGroup' &&
          (userRights[
            'ACCOUNT_SELECT_DIRECTLY_MTG' ||
              userRights['ACCOUNT_SELECT_SUBORDINATE_MTG']
          ] ||
            userRights['ACCOUNT_SELECT_WILD_MTG'] ||
            userRights['ACCOUNT_SELECT_ALL_MTG'])
        ) {
          conditions.push(item);
        }
      } else if (item.value === 'account_group') {
        if (
          currentStatisticalReportType.value !== 'SymbolGroup' &&
          (userRights['ACCOUNT_SELECT_DIRECTLY_GRP'] ||
            userRights['ACCOUNT_SELECT_SUBORDINATE_GRP'] ||
            userRights['ACCOUNT_SELECT_WILD_GRP'] ||
            userRights['ACCOUNT_SELECT_ALL_GRP'])
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
  render() {
    const {
      statisticalReportTypeList,
      serverList,
      currentStatisticalReportType,
      currentServer
    } = this.props;
    const advancedSearchType = this.injectDataToAdvancedSearchType();
    const searchKey = `BW_REPORT_${currentServer &&
      currentServer.value &&
      currentServer.value.serverId}_${currentStatisticalReportType &&
      currentStatisticalReportType.value &&
      currentStatisticalReportType.value.toUpperCase()}`;
    if (!currentServer || !currentStatisticalReportType) {
      return <div />;
    }
    return (
      <div>
        <Root
          searchType={searchKey}
          searchConfig={ADVANCED_SEARCH_CONFIG}
          advancedSearchType={advancedSearchType}
          advancedSearchConditions={REPORT_ADVANCED_SEARCH_CONDITIONS}
        >
          <div>
            <Dropdown
              icon="fa fa-angle-down"
              data={serverList}
              value={currentServer}
              className={'focus'}
              autoWidth
              onSelect={this.onServerSelect}
            />{' '}
            <Dropdown
              icon="fa fa-angle-down"
              autoWidth
              className={'focus'}
              data={statisticalReportTypeList}
              value={currentStatisticalReportType}
              onSelect={this.onStatisticalReportTypeSelect}
            />
          </div>
        </Root>
      </div>
    );
  }
}
