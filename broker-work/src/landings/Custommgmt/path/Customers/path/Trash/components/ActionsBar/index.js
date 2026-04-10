import { Button } from 'react-bootstrap';
import Dropdown from 'components/Dropdown';
import Modal from 'components/Modal';
import cs from './ActionsBar.less';
import moment from 'moment';
import i18n from 'utils/i18n';
import DateRangePicker from 'components/DateRangePicker';
import { FormattedMessage } from 'react-intl';
import { post } from 'utils/ajax';
// import AdvancedSearch from 'components/AdvancedSearch';
// import { CardPanelWrapper } from 'components/CardPanel';
import BatchActionBar from './BatchActionsBar';
import { TRANSH_TIME_SEARCH_TYPE, FUZZY_SEARCH_TYPES } from '../../constant';
import { DEFAULT_RANGES } from '../../../../constant';
import { deepCopy } from 'utils/simpleDeepCopy';
import { Link } from 'react-router-dom';
import { Icon, Breadcrumb } from 'lean-ui';
import { Summary } from 'components/v2/PageWraper';
export default class ActionsBar extends PureComponent {
  componentDidMount() {}
  getList = () => {
    const { getCustomerList } = this.props;
    getCustomerList();
  };

  onStateTypeChange = item => {
    const { updateStateType } = this.props;
    Promise.resolve(updateStateType(item)).then(() => {
      this.getList();
    });
  };

  onFuzzySearchTypeChange = item => {
    const { updateFuzzySearchType } = this.props;
    updateFuzzySearchType(item);
  };

  onFuzzySearchTextChange = evt => {
    const { updateFuzzySearchText } = this.props;
    updateFuzzySearchText(evt.target.value);
  };

  onFuzzySearchBoxEnter = e => {
    const { doFuzzySearch } = this.props;
    if (e.keyCode !== 13) return;
    Promise.resolve(doFuzzySearch()).then(() => {
      this.getList();
    });
  };

  onDateRangeSelect = ({ startDate, endDate }) => {
    const { updateDateRange } = this.props;
    Promise.resolve(updateDateRange({ startDate, endDate })).then(() => {
      this.getList();
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
      paginationInfo,
      match: { path }
    } = this.props;
    const isShowBatchActions = Object.keys(selectedItemsMap).length;
    const { startDate, endDate } = dateRange;
    return (
      <div className={cs['actions-bar']}>
        <div className={cs['left-part']}>
          <div className={cs['primary-top-title']}>
            <Icon icon="customer" className={cs['customer-icon']} />
            <div className={cs['module-info']}>
              <Breadcrumb>
                <Breadcrumb.Item>
                  <Link to={path.replace('/trash', '')}>
                    {i18n['navigation.customer.module_name']}
                  </Link>
                </Breadcrumb.Item>

                <Breadcrumb.Item>
                  {i18n['customer.trash.title']}
                </Breadcrumb.Item>
              </Breadcrumb>
              <div className={cs['sumary-title']}>
                {i18n['customer.trash.title']}
              </div>
            </div>
          </div>
          <Summary.Info
            total={paginationInfo.total}
            // updateTime={listUpdateTime}
          />
        </div>
      </div>
    );
  }
}
