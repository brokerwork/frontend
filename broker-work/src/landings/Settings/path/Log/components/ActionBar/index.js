import cs from './ActionBar.less';
import i18n from 'utils/i18n';
import moment from 'moment';
import { Select, Button, DatePicker, Input, Dropdown, Icon } from 'lean-ui';

const Option = Select.Option;
const { RangePicker } = DatePicker;

const PRODUCT_TYPE = [
  { label: i18n['setting.log.option.crm'], value: 'BW' },
  { label: i18n['setting.log.option.trader_client'], value: 'TW' }
];

export default class ActionBar extends Component {
  state = {
    fuzzyItem: this.props.params.fuzzyItem,
    fuzzyValue: '',
    showMoreOptions: false,
    moreOptions: {}
  };

  onFieldChanged = (field, v) => {
    const { module, getLogType } = this.props;
    let __obj = {
      [field]: v.target ? v.target.value : v
    };

    if (module === 'BASIC' && field === 'productId') {
      __obj[this.typeField] = '';
      getLogType(module, __obj[field]);
    }

    //时间范围改变
    if (field === 'date') {
      __obj = {
        start: v[0],
        end: v[1]
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

  handleMoreOptions = (moreOptions = {}) => {
    const { params, modifyParams } = this.props;
    modifyParams({ ...params, ...moreOptions });
    this.setState({ showMoreOptions: false });
  };

  modifyMoreOptions = (field, v) => {
    const { moreOptions } = this.state;
    const options = this.onFieldChanged(field, v);
    this.setState({ moreOptions: { ...moreOptions, ...options } });
  };

  modifySearchType(field, e) {
    const v = e.target ? e.target.value : e;
    this.setState({
      [field]: v
    });
  }

  fuzzyItemOptions = [
    { label: i18n['setting.log.operator'], value: 'userName' },
    { label: i18n['setting.log.ip'], value: 'clientIp' }
  ];

  getFuzzyItemOptions = () => {
    const { module } = this.props;
    switch (module) {
      case 'ACCOUNT':
        return this.fuzzyItemOptions.concat([
          { label: i18n['setting.log.objectId'], value: 'objectId' }
        ]);
      case 'CUSTOMER':
        return this.fuzzyItemOptions.concat([
          { label: i18n['setting.log.opName'], value: 'objectName' },
          { label: i18n['setting.log.objectId'], value: 'objectId' }
        ]);
      case 'USER':
        return this.fuzzyItemOptions.concat([
          { label: i18n['setting.log.opName'], value: 'objectName' },
          { label: i18n['setting.log.objectId'], value: 'objectId' }
        ]);
      case 'BASIC':
        return this.fuzzyItemOptions.concat([
          { label: i18n['setting.log.extraInfo'], value: 'addOn' }
        ]);
      default:
        return this.fuzzyItemOptions;
    }
  };

  typeField = 'event';

  applySearchKey = () => {
    const { fuzzyItem, fuzzyValue } = this.state;
    const { modifyParams, params } = this.props;
    modifyParams({
      ...params,
      fuzzyItem,
      fuzzyValue,
      page: 1
    });
  };

  renderMoreOptions = () => {
    const { logType = [], module } = this.props;
    const { fuzzyValue, fuzzyItem, moreOptions } = this.state;
    const fuzzySearchOptions = this.getFuzzyItemOptions();
    // 是否显示 项目类型选项
    const showProductTypeOptions = module === 'BASIC';
    const ranges = {
      [i18n['general.date_range_picker.option.last7days']]: [
        moment().subtract(7, 'days'),
        moment()
      ],
      [i18n['general.date_range_picker.option.last30days']]: [
        moment().subtract(30, 'days'),
        moment()
      ]
    };
    console.log('logType', logType);
    return (
      <div className={cs.popContent}>
        <div>
          <div className={cs.fieldLabel}>{i18n['setting.log.opType']}</div>
          <Select
            value={moreOptions[this.typeField]}
            placeholder={i18n['general.default.select']}
            onSelect={this.modifyMoreOptions.bind(this, this.typeField)}
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
          <RangePicker
            ranges={ranges}
            value={[moreOptions.start, moreOptions.end]}
            className={cs['log-picker-left']}
            onChange={this.modifyMoreOptions.bind(this, 'date')}
          />
        </div>
        {showProductTypeOptions ? (
          <div>
            <div className={cs.fieldLabel}>{i18n['setting.log.opSystem']}</div>
            <Select
              value={moreOptions['productId']}
              onSelect={this.modifyMoreOptions.bind(this, 'productId')}
            >
              {PRODUCT_TYPE.map((item, index) => {
                return (
                  <Option key={index} value={item.value}>
                    {item.label}
                  </Option>
                );
              })}
            </Select>
          </div>
        ) : null}
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
    const { fuzzyValue, fuzzyItem, showMoreOptions } = this.state;
    const fuzzySearchOptions = this.getFuzzyItemOptions();
    const { title } = this.props;
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
                value={fuzzyItem}
                onSelect={this.modifySearchType.bind(this, 'fuzzyItem')}
              >
                {fuzzySearchOptions.map((item, index) => {
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
