import Root from '../../container/Root';
import {
  ADVANCED_SEARCH_CONFIG,
  ADVANCED_SEARCH_TYPE,
  ADVANCED_SEARCH_CONDITIONS
} from '../../../../../Custommgmt/path/Customers/constant.js';
import { deepCopy } from 'utils/simpleDeepCopy';
import i18n from 'utils/i18n';

export default class CustomerSelectConditions extends PureComponent {
  componentDidMount() {
    const {
      getCustomerSource,
      getCustomerFormFields,
      getFollowWayOptions
    } = this.props;
    getCustomerFormFields();
    getFollowWayOptions();
    getCustomerSource();
  }
  injectDataToAdvancedSearchType = () => {
    const { advancedSearchTypeCustomer, customerSource } = this.props;
    const copyData = deepCopy(customerSource);
    const types = deepCopy(advancedSearchTypeCustomer);
    const customSource = types.find(item => item.value === 'customSource');
    if (customSource) {
      customSource.optionList = copyData;
    }
    return types;
  };
  render() {
    const advancedSearchType = this.injectDataToAdvancedSearchType();
    return (
      <div>
        {i18n['settings.conditions_setting.customer_temp_ui_tips']}
        {/*<Root
          searchType="BW_CUSTOMER"
          searchConfig={ADVANCED_SEARCH_CONFIG}
          advancedSearchType={advancedSearchType}
          advancedSearchConditions={ADVANCED_SEARCH_CONDITIONS}
        />*/}
      </div>
    );
  }
}
