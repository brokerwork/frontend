import Dropdown from 'components/Dropdown';
import { post } from 'utils/ajax';
import Badge from 'components/Badge';
import i18n from 'utils/i18n';
import { get as getQuery, set as setQuery } from 'utils/cacheQuery';
import {
  CUSTOMER_SIGNING_TYPE,
  PAYMENT_STATUS,
  ACTION_BAR_SEARCH_TYPE,
  PAYMENT_TIME_OPTIONS,
  PAYMENT_SEARCH_OPTIONS
} from '../../constant';
import DateRangePicker from 'components/DateRangePicker';

import cs from './ActionsBar.less';

export default class ActionsBar extends PureComponent {
  componentDidMount() {
    const {
      getCustomerSigningList,
      params,
      updateNeedRefresh,
      modifyParams
    } = this.props;
    getCustomerSigningList(params);
  }
  render() {
    const { params, searchTypes } = this.props;
    return (
      <div className={cs['action-bar']}>
        <div className={cs['wrapper']}>
          <Dropdown
            autoWidth
            icon={'fa fa-angle-down'}
            className={`${cs['dropdown']} ${cs['item']} focus`}
            data={CUSTOMER_SIGNING_TYPE}
            value={params.customerState}
            onSelect={this.modifyParams.bind(this, 'customerState')}
          />
          <Dropdown
            autoWidth
            icon={'fa fa-angle-down'}
            className={`${cs['dropdown']} ${cs['item']} focus`}
            data={searchTypes}
            value={params.filterType}
            onSelect={this.modifyParams.bind(this, 'filterType')}
          />
          <Dropdown
            autoWidth
            icon={'fa fa-angle-down'}
            className={`${cs['dropdown']} ${cs['item']} focus`}
            data={PAYMENT_STATUS}
            value={params.payState}
            onSelect={this.modifyParams.bind(this, 'payState')}
          />
          <div className={cs['date-time-picker']}>
            <Dropdown
              className={cs['date-time-text']}
              data={PAYMENT_TIME_OPTIONS}
              icon={'fa fa-angle-down'}
              value={params.searchDate}
              onSelect={this.modifyParams.bind(this, 'searchDate')}
            />
            <DateRangePicker
              className={cs['picker']}
              inline
              format="YYYY-MM-DD"
              onApply={this.modifyParams.bind(this, 'date')}
              startDate={params.searchStart}
              endDate={params.searchEnd}
            />
          </div>
          <div className={`${cs['search-bar']} ${cs['item']}`}>
            <Dropdown
              className={`${cs['dropdown']}  focus`}
              buttonClassName={cs['typing-select']}
              data={PAYMENT_SEARCH_OPTIONS}
              icon={'fa fa-angle-down'}
              value={params.fuzzyItem}
              onSelect={this.modifyParams.bind(this, 'fuzzyItem')}
            />
            <input
              type="text"
              data-test={'search-Input'}
              placeholder={i18n['account.search.placeholder']}
              className={`${cs['typing-input']} form-control focus`}
              value={params.fuzzyVal}
              onChange={this.modifyParams.bind(this, 'fuzzyVal')}
              onKeyPress={this.onSearch}
            />
          </div>
        </div>
      </div>
    );
  }

  modifyParams = (field, v) => {
    const { params, modifyParams } = this.props;
    let __obj = {
      [field]: v.target ? v.target.value : v
    };
    //时间范围改变
    if (field === 'date') {
      __obj['searchStart'] = v.startDate;
      __obj['searchEnd'] = v.endDate;
    }

    //在搜索下拉条件改变时，清空搜索内容
    if (field !== 'fuzzyItem' && field !== 'fuzzyVal') {
      __obj['fuzzyVal'] = '';
      this.setState({
        fuzzyVal: ''
      });
    }

    // 页码设置为第一页
    __obj['pageNo'] = 1;

    modifyParams({
      ...params,
      ...__obj
    });
  };
}
