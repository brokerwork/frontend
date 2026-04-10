import { Button } from 'react-bootstrap';
import Dropdown from 'components/Dropdown';
import Modal from 'components/Modal';
// import cs from './ActionsBar.less';
import moment from 'moment';
import i18n from 'utils/i18n';
import DateRangePicker from 'components/DateRangePicker';
import { FormattedMessage } from 'react-intl';
import { post } from 'utils/ajax';
// import AdvancedSearch from 'components/AdvancedSearch';
// import { CardPanelWrapper } from 'components/CardPanel';
// import BatchActionBar from './BatchActionsBar';
import { TRANSH_TIME_SEARCH_TYPE, FUZZY_SEARCH_TYPES } from '../../constant';
import { DEFAULT_RANGES } from '../../../../constant';
import { deepCopy } from 'utils/simpleDeepCopy';
import { Link } from 'react-router-dom';
import {
  ADVANCED_SEARCH_TYPE,
  ADVANCED_SEARCH_CONDITIONS,
  ADVANCED_SEARCH_CONFIG
} from '../../constant';
import ConditionFilter from 'components/v2/ConditionFilter';

export default class ActionsBar extends PureComponent {
  onAdvancedSearch = (data, logicType, viewId) => {
    const { updateFieldConditions, getCustomerList } = this.props;
    Promise.resolve(updateFieldConditions(data)).then(() => {
      getCustomerList();
    });
  };

  render() {
    const {
      searchTypes,
      userRights,
      dateRange,
      typesOptions,
      searchDate,
      currentSource,
      customerSearchSource,
      customerConditionsList,
      advancedSearchType,
      advancedSearchConditions,
      currentCondition,
      customerStates,
      currentCustomerState,
      fuzzySearchType,
      selectedItemsMap,
      selectabledCustomerStateTypes,
      searchFieldConditions
    } = this.props;
    const isShowBatchActions = Object.keys(selectedItemsMap).length;
    const { startDate, endDate } = dateRange;
    return (
      <ConditionFilter.Container
        types={ADVANCED_SEARCH_TYPE}
        conditions={ADVANCED_SEARCH_CONDITIONS}
        onSearch={this.onAdvancedSearch}
        data={searchFieldConditions}
        {...ADVANCED_SEARCH_CONFIG}
      >
        <ConditionFilter.Panel />
      </ConditionFilter.Container>
    );
  }
}
