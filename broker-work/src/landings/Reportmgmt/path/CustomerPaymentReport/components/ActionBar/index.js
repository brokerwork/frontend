import Dropdown, { DropdownForCode } from 'components/Dropdown';
import UserSelector from 'components/UserSelector';
import DateRangePicker from 'components/DateRangePicker';
import ButtonRadio from 'components/ButtonRadio';
import cs from './index.less';
import i18n from 'utils/i18n';
import { modifyParams } from '../../controls/actions';
import { DEFAULT_DATE_PICKER_RANGES, BILL_REFUND_VIEWS } from '../../contants';
export default class ActionBar extends PureComponent {
  onParamsChange = (key, value) => {
    const { modifyParams, params } = this.props;
    modifyParams({ [key]: value }, params);
  };
  onEnterFuzzyVal = e => {
    if (e.keyCode !== 13) return;
    const { modifyParams, params } = this.props;
    modifyParams({ triggerFuzzy: true }, params);
  };

  onBillRefundViewChange = selected => {
    const { updateBillRefundView } = this.props;
    updateBillRefundView(selected.value);
  };

  render() {
    const {
      params = {},
      customerStateTypes,
      productList,
      reportTypes,
      timeUnits,
      fuzzyItemList,
      filterTypes,
      billRefundViewKey,
      billRefundViews
    } = this.props;
    return (
      <div className={cs['action-bar-container']}>
        <div className={cs['action-bar-main']}>
          <div className={cs['action-item']}>
            <DropdownForCode
              className="focus"
              data={customerStateTypes}
              value={params.customerState}
              onChange={this.onParamsChange.bind(this, 'customerState')}
            />
          </div>
          <div className={cs['action-item']}>
            <DropdownForCode
              className="focus"
              data={filterTypes}
              value={params.filterType}
              onChange={this.onParamsChange.bind(this, 'filterType')}
            />
          </div>
          {params.type === 'income' ? (
            undefined
          ) : (
            <div className={cs['action-item']}>
              <DropdownForCode
                data-test="dropdown-products"
                className="focus"
                data={productList}
                value={params.product}
                disabled={params.type === 'income'}
                onChange={this.onParamsChange.bind(this, 'product')}
              />
            </div>
          )}
          <div className={cs['action-item']}>
            <DropdownForCode
              className="focus"
              data={reportTypes}
              value={params.type}
              onChange={this.onParamsChange.bind(this, 'type')}
            />
          </div>
          <div className={cs['action-item']}>
            <DateRangePicker
              className={cs['picker']}
              inputClassName={'focus'}
              inline
              format="YYYY-MM-DD"
              onApply={this.onParamsChange.bind(this, 'searchDateRange')}
              startDate={params.startDate}
              endDate={params.endDate}
              ranges={DEFAULT_DATE_PICKER_RANGES[params.timeUnit] || []}
              minPanel={params.timeUnit === 'year' ? 'year' : 'month'}
            />
          </div>
          <div className={cs['action-item']}>
            <ButtonRadio
              focus
              onSelect={selected =>
                this.onParamsChange('timeUnit', selected.value)
              }
              code={params.timeUnit}
              data={timeUnits}
            />
          </div>
          {params.type === 'refund_bill' ? (
            <div className={cs['action-item']}>
              <ButtonRadio
                focus
                data-test="dropdown-views"
                onSelect={this.onBillRefundViewChange}
                code={billRefundViewKey}
                data={params.product ? [billRefundViews[0]] : billRefundViews}
              />
            </div>
          ) : (
            undefined
          )}
        </div>
        <div className={cs['action-bar-right']}>
          <div className={cs['action-item']}>
            <div className={cs['btn-group']}>
              <DropdownForCode
                data={fuzzyItemList}
                value={params.fuzzyItem}
                onChange={this.onParamsChange.bind(this, 'fuzzyItem')}
              />
              <input
                className={cs['input']}
                onChange={evt => {
                  this.onParamsChange('fuzzyVal', evt.target.value);
                }}
                value={params.fuzzyVal}
                onKeyUp={this.onEnterFuzzyVal}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
