import cs from './ActionBar.less';
import moment from 'moment';
import { Select, Button, DatePicker, Input, Icon } from 'lean-ui';
import DateRangePicker from 'components/v2/DateRangePicker';
import i18n from 'utils/i18n';
import { dateRange } from 'utils/config';
const Option = Select.Option;

const ranges = {
  [i18n['general.date_range_picker.option.last7days']]: dateRange.last7days,
  [i18n['general.date_range_picker.option.last30days']]: dateRange.last30days
};

export default class ActionBar extends Component {
  constructor(props) {
    super(props);
    const { userRights } = props;
    const productIdOptions = [
      { label: i18n['setting.log.option.crm'], value: 'BW' }
    ];
    if (userRights['TAUSER_ENABLE']) {
      productIdOptions.push({
        label: i18n['setting.log.option.trader_client'],
        value: 'TW'
      });
    }
    this.state = {
      fuzzyItem: 'fromName',
      fuzzyValue: '',
      productIdOptions,
      showMoreOptions: false,
      moreOptions: {}
    };
  }

  onFieldChanged = (field, v) => {
    let __obj = {
      [field]: v.target ? v.target.value : v
    };

    if (field === 'type') {
      __obj['fuzzyItem'] = 'fromName';
    }

    //时间范围改变
    if (field === 'date') {
      __obj = {
        start: v.startDate,
        end: v.endDate
      };
    }

    //在搜索下拉条件改变时，清空搜索内容
    if (field !== 'fuzzyValue' && field !== 'fuzzyItem') {
      __obj['fuzzyValue'] = '';
      this.setState({
        fuzzyValue: ''
      });
    }

    // 页码设置为第一页
    __obj['page'] = 1;

    return __obj;
  };

  modifyParams = (field, v) => {
    const { params, modifyParams } = this.props;
    const __obj = this.onFieldChanged(field, v);
    modifyParams({
      ...params,
      ...__obj
    });
  };

  modifyMoreOptions = (field, v) => {
    const { moreOptions } = this.state;
    const options = this.onFieldChanged(field, v);
    this.setState({ moreOptions: { ...moreOptions, ...options } });
  };

  handleMoreOptions = (moreOptions = {}) => {
    const { params, modifyParams } = this.props;
    modifyParams({ ...params, ...moreOptions });
    this.setState({ showMoreOptions: false });
  };

  modifySearchType(field, e) {
    const v = e.target ? e.target.value : e;
    this.setState({
      [field]: v
    });
  }

  applySearchKey = e => {
    if (e.keyCode !== 13) return;
    const { fuzzyItem, fuzzyValue } = this.state;
    const { modifyParams, params } = this.props;
    modifyParams({
      ...params,
      fuzzyItem,
      fuzzyValue,
      pageNo: 1
    });
  };

  renderMoreOptions = () => {
    const { logType = [] } = this.props;
    const { productIdOptions, moreOptions } = this.state;
    return (
      <div className={cs.popContent}>
        <div>
          <div className={cs.fieldLabel}>{i18n['setting.log.opType']}</div>
          <Select
            value={moreOptions.type}
            placeholder={i18n['general.default.select']}
            onSelect={this.modifyMoreOptions.bind(this, 'type')}
          >
            {logType.map((item, index) => {
              return (
                <Option key={index} value={item.value}>
                  {item.label}
                </Option>
              );
            })}
          </Select>
        </div>
        <div>
          <div className={cs.fieldLabel}>{i18n['setting.log.opTime']}</div>
          <DateRangePicker
            ranges={ranges}
            defaultValue={{
              startDate: moreOptions.start,
              endDate: moreOptions.end
            }}
            className={cs['log-picker-left']}
            onChange={this.modifyMoreOptions.bind(this, 'date')}
          />
        </div>
        <div>
          <div className={cs.fieldLabel}>{i18n['setting.log.opSystem']}</div>
          <Select
            value={moreOptions.productId}
            onSelect={this.modifyMoreOptions.bind(this, 'productId')}
          >
            {productIdOptions.map((item, index) => {
              return (
                <Option key={index} value={item.value}>
                  {item.label}
                </Option>
              );
            })}
          </Select>
        </div>
        <div className={cs.popupFooter}>
          <Button type="default" onClick={this.hideMoreOptions}>
            {i18n['general.cancel']}
          </Button>
          <Button
            type="primary"
            onClick={this.handleMoreOptions.bind(this, moreOptions)}
          >
            {i18n['general.confirm']}
          </Button>
        </div>
      </div>
    );
  };

  toggleMoreOptions = () => {
    const { params } = this.props;
    this.setState({ showMoreOptions: true, moreOptions: { ...params } });
  };
  hideMoreOptions = () => {
    this.setState({ showMoreOptions: false });
  };

  render() {
    const { searchOptions, title } = this.props;
    const {
      fuzzyValue,
      fuzzyItem,
      productIdOptions,
      showMoreOptions
    } = this.state;
    return (
      <div className={cs['container']}>
        <div className={cs.info}>
          <Icon fontType="bw" icon="setting-color" className={cs.icon} />
          <div>
            <div className={cs.infoLabel}>{i18n['settings.left_menu.log']}</div>
            <div className={cs.infoTitle}>{title}</div>
          </div>
        </div>
        <div className={cs.actionBar}>
          <Input
            value={fuzzyValue}
            className={cs['search-box-input']}
            onPressEnter={this.applySearchKey}
            placeholder={i18n['account.search.placeholder']}
            onChange={this.modifySearchType.bind(this, 'fuzzyValue')}
            addonBefore={
              <Select
                className={cs['search-options']}
                value={fuzzyItem}
                onSelect={this.modifySearchType.bind(this, 'fuzzyItem')}
              >
                {searchOptions.map((item, index) => {
                  return (
                    <Option key={index} value={item.value}>
                      {item.label}
                    </Option>
                  );
                })}
              </Select>
            }
            suffix={<Icon icon="search" />}
          />
          <div className={cs.dropDown}>
            <div
              className={`${cs.button} lean-select ${showMoreOptions &&
                'lean-select-focused'}`}
              onClick={this.toggleMoreOptions}
            >
              <i className="fa fa-filter" />
            </div>
            {showMoreOptions ? (
              <div className={cs.popupWrapper}>{this.renderMoreOptions()}</div>
            ) : null}
          </div>
        </div>
      </div>
    );
  }
}
