import Root from '../../container/Root';
import Dropdown from 'components/Dropdown';
import i18n from 'utils/i18n';

const ADVANCED_SEARCH_CONFIG = {
  searchType: 'BW_ACCOUNT',
  arraySplit: '@#$', //数组分隔符
  dataSplit: '~', // 时间分隔符
  rangeSplit: '@#$'
};

const ADVANCED_SEARCH_CONDITIONS = [
  { label: i18n['account.advanced_search.conditions.eq'], value: 'EQ' },
  { label: i18n['account.advanced_search.conditions.neq'], value: 'NEQ' },
  {
    label: i18n['account.advanced_search.conditions.contain'],
    value: 'CONTAIN'
  },
  { label: i18n['account.advanced_search.conditions.gt'], value: 'GT' },
  { label: i18n['account.advanced_search.conditions.lt'], value: 'LT' },
  { label: i18n['account.advanced_search.conditions.nin'], value: 'NIN' },
  {
    label: i18n['account.advanced_search.conditions.empty'],
    value: 'EMPTY',
    valueDisabled: true
  },
  {
    label: i18n['account.advanced_search.conditions.between'],
    value: 'BETWEEN'
  }
];

export default class CustomerSelectConditions extends PureComponent {
  componentDidMount() {
    const { getServerList, getFormColumnsAccount } = this.props;
    Promise.resolve(getServerList()).then(res => {
      const { serverList } = this.props;
      const vendor = serverList && serverList[0] && serverList[0].vendor;
      getFormColumnsAccount(vendor);
      this.getResource();
    });
  }
  getResource = () => {
    const {
      currentServer,
      getLeverageList,
      getMTGroupList,
      getUserGroupList
    } = this.props;
    getLeverageList(currentServer.value);
    getUserGroupList(currentServer.value);
    getMTGroupList(currentServer.value);
  };
  filterAdvancedSearchType = injectedTypes => {
    const { userRights } = this.props;
    const types = [];

    injectedTypes.forEach(item => {
      if (item.value === 'group') {
        if (
          userRights[
            'ACCOUNT_SELECT_DIRECTLY_MTG' ||
              userRights['ACCOUNT_SELECT_SUBORDINATE_MTG']
          ] ||
          userRights['ACCOUNT_SELECT_WILD_MTG'] ||
          userRights['ACCOUNT_SELECT_ALL_MTG']
        ) {
          types.push(item);
        }
      } else if (item.value === 'userGroup') {
        if (
          userRights['ACCOUNT_SELECT_DIRECTLY_GRP'] ||
          userRights['ACCOUNT_SELECT_SUBORDINATE_GRP'] ||
          userRights['ACCOUNT_SELECT_WILD_GRP'] ||
          userRights['ACCOUNT_SELECT_ALL_GRP']
        ) {
          types.push(item);
        }
      } else {
        types.push(item);
      }
    });

    return types;
  };
  getDropdownData = item => {
    const { userGroupList, mtGroupList, leverageList } = this.props;
    switch (item.value) {
      case 'userGroup':
        return userGroupList;
      case 'group':
        return mtGroupList.map(group => ({ label: group, value: group }));
      case 'leverage':
        return leverageList;
      default:
        return [];
    }
  };
  injectDataToAdvancedSearchType = () => {
    const { advancedSearchTypeAccount } = this.props;
    return advancedSearchTypeAccount.map(type => {
      if (type.fieldType === 'select') {
        type.optionList = this.getDropdownData(type);
        type.additions = {
          ...type.additions,
          checkbox: true,
          selectAllButton: true
        };
      }
      if (type.value === 'customerName') {
        type.additions = {
          ...type.additions,
          searchable: 'customer'
        };
      }
      return type;
    });
  };
  onServerSelect = selected => {
    const { updateCurrentServer, getFormColumnsAccount } = this.props;
    Promise.resolve(updateCurrentServer(selected)).then(() => {
      const vendor = selected && selected.value && selected.value.vendor;
      getFormColumnsAccount(vendor);
      this.getResource();
    });
  };
  render() {
    const { currentServer, serverList } = this.props;
    const searchKey = `BW_ACCOUNT_${currentServer &&
      currentServer.value &&
      currentServer.value.serverId}`;
    if (!currentServer) {
      return <div />;
    }
    const advancedSearchType = this.filterAdvancedSearchType(
      this.injectDataToAdvancedSearchType()
    );
    return (
      <div>
        {currentServer ? (
          <Root
            searchType={searchKey}
            searchConfig={ADVANCED_SEARCH_CONFIG}
            advancedSearchType={advancedSearchType}
            advancedSearchConditions={ADVANCED_SEARCH_CONDITIONS}
          >
            <div>
              <Dropdown
                icon="fa fa-angle-down"
                data={serverList}
                value={currentServer}
                className={'focus'}
                onSelect={this.onServerSelect}
              />
            </div>
          </Root>
        ) : (
          undefined
        )}
      </div>
    );
  }
}
