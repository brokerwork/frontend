import ConditionFilter from 'components/v2/ConditionFilter';
import { ADVANCED_SEARCH_TYPE, ADVANCED_SEARCH_CONFIG } from '../../constant';
import { deepCopy } from 'utils/simpleDeepCopy';
import i18n from 'utils/i18n';
import getQueryString from 'utils/queryString';

export default class ActionsBar extends PureComponent {
  getList = () => {
    const { getCustomerList } = this.props;
    getCustomerList();
  };

  onAdvancedSearch = (data, logicType, viewId, resetType) => {
    const {
      updateFieldConditions,
      updateCondition,
      location: { state, search },
      history: { replace },
      match: { url },
      searchFieldConditions,
      advancedSearchType,
      searchTypes
    } = this.props;
    let copyData = deepCopy(data);
    // 判断是否有需要固定存在的选项。
    if (resetType === 'reset') {
      replace({ pathname: `${url}`, state: { ...state } });
    }
    if (!viewId && resetType === 'reset') {
      copyData.push({
        field: 'filterType',
        opt: 'EQ',
        originValue: searchTypes[0],
        value: searchTypes[0].value
      });
    }
    if (search && resetType !== 'reset') {
      const query = getQueryString(location.search);
      const ownId = query.get('userId') || '';
      const ownName = query.get('userName') || '';
      let copyItem = [
        {
          field: 'oweId',
          opt: 'IN',
          value: ownId,
          originValue: { label: ownName, value: ownId }
        }
      ];
      copyData = copyData.concat(copyItem);
    }
    Promise.all([
      updateFieldConditions(copyData),
      updateCondition(viewId)
    ]).then(() => {
      this.getList();
    });
  };

  injectDataToAdvancedSearchType = () => {
    const {
      advancedSearchType,
      customerSearchSource,
      searchTypes,
      customerStates,
      userRights
    } = this.props;
    const copyData = deepCopy(customerSearchSource);
    let types = deepCopy(advancedSearchType);
    //大版本权限控制
    if (!userRights['BW_CUSTOMER_GROUP']) {
      types = types.filter(item => item.value !== 'openState');
    }
    if (!userRights['BW_ACCOUNT_GROUP']) {
      types = types.filter(item => item.value !== 'dealState');
    }
    const customSource = types.find(item => item.value === 'customSource');
    const searchType = types.find(item => item.value === 'filterType');
    const customerState = types.find(item => item.value === 'customerState');
    if (customSource) {
      customSource.optionList = copyData;
    }
    if (searchType) {
      searchType.optionList = searchTypes;
    }
    if (searchType) {
      customerState.optionList = customerStates;
    }
    console.log(types, 'debug');
    return types;
  };

  beforeConditionChange = (key, { value = '' }, condition) => {
    if (key !== 'customerState') {
      return condition;
    }
    switch (value) {
      case 'Potential': {
        //潜在客户
        delete condition.dealState;
        break;
      }
      case 'Deal': {
        //交易客户
        delete condition.openState;
        break;
      }
      default: {
        delete condition.openState;
        delete condition.dealState;
        break;
      }
    }
    return condition;
  };

  afterConditionChange = data => {
    const { toggleFieldEnable } = this.props;
    if (!data['customerState']) {
      //重置
      toggleFieldEnable({ openState: true, dealState: true });
      return;
    }
    const customerState = data['customerState'];
    const { value } = customerState.value;
    switch (value) {
      case 'Potential': {
        //潜在客户
        toggleFieldEnable({ openState: true, dealState: false });
        break;
      }
      case 'Deal': {
        //交易客户
        toggleFieldEnable({ openState: false, dealState: true });
        break;
      }
      default: {
        toggleFieldEnable({ openState: false, dealState: false });
        break;
      }
    }
  };

  render() {
    const {
      advancedSearchConditions,
      searchFieldConditions,
      children,
      currentCondition
    } = this.props;
    return (
      <ConditionFilter.Container
        types={this.injectDataToAdvancedSearchType()}
        conditions={advancedSearchConditions}
        onSearch={this.onAdvancedSearch}
        data={searchFieldConditions}
        viewId={currentCondition}
        beforeConditionChange={this.beforeConditionChange}
        afterConditionChange={this.afterConditionChange}
        targetName={i18n['customer.detail.opreate_type_customer']}
        {...ADVANCED_SEARCH_CONFIG}
      >
        {children}
      </ConditionFilter.Container>
    );
  }
}
