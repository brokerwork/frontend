import i18n from 'utils/i18n';
import cs from '../AdvancedSearch.less';
import NationalitySearchInput from 'components/v2/NationalitySearchInput';
import DateRangePicker from 'components/v2/DateRangePicker';
import _ from 'lodash';
import { dateRange } from 'utils/config';
import CustomerSelector from 'components/v2/CustomerSelector';
import UserSelector from 'components/v2/UserSelector';
import DatePicker from 'components/v2/DatePicker';
import ArrayInput from 'components/v2/ArrayInput';
import { Content, Layout } from 'components/v2/PageWraper';
import difference from 'utils/difference.js';
import {
  Checkbox,
  Select,
  Button,
  Dropdown,
  Menu,
  Icon,
  Input,
  Picklist
} from 'lean-ui';
import PropTypes from 'prop-types';
import { findDOMNode } from 'react-dom';
import { formatterFieldCondition } from '../utils';
import moment, { isMoment } from 'moment';

import { defineMessages, IntlProvider } from 'react-intl';
import { WITH_ORIGIN } from '../constants';

const intlProvider = new IntlProvider({ locale: 'en' }, {});
const { intl } = intlProvider.getChildContext();

const defaultRanges = {
  [i18n['general.date_range_picker.option.all']]: dateRange.all,
  [i18n['general.date_range_picker.option.today']]: dateRange.today,
  [i18n['general.date_range_picker.option.yestoday']]: dateRange.yestoday,
  [i18n['general.date_range_picker.option.last7days']]: dateRange.last7days,
  [i18n['general.date_range_picker.option.last30days']]: dateRange.last30days,
  [i18n['general.date_range_picker.option.currentMonth']]:
    dateRange.currentMonth,
  [i18n['general.date_range_picker.option.lastMonth']]: dateRange.lastMonth
};

const defaultDate = {
  startDate: dateRange.all.start,
  endDate: dateRange.all.end
};
const logics = [
  { label: i18n['advanced_search.tabs.and'], value: 'AND' },
  { label: i18n['advanced_search.tabs.or'], value: 'OR' }
];
export default class SearchPanel extends Component {
  constructor(props) {
    super(props);

    this.state = {
      advancedLogicType: 'AND',
      selectedAdvancedSearchConditions: [],
      // advancedSearchType: [defaultCondition].concat(this.context.types),
      // advancedSearchConditions: this.context.conditions,
      arrayFields: [],
      dateArray: [],
      rangeFields: [],
      selectedConditionMap: {},
      filterInputKey: '',
      lastSearchConditionMap: null
    };
  }

  componentDidMount() {
    const { registFunction } = this.context;
    registFunction({
      panelReset: this.reset
    });
    this.setInitialFields();
  }

  componentWillReceiveProps(nextProps, nextContext) {
    // 切换服务器时，如果选择条件和之前服务器相同，则会出现保存搜索条件，为了避免这个问题产生，在切换服务器时，
    if (
      _.get(nextProps, 'currentServer.vendor', '') !==
      _.get(this.props, 'currentServer.vendor', '')
    ) {
      this.setState({
        lastSearchConditionMap: null
      });
    }
    const { data, types } = nextContext;
    const isDataChanged =
      JSON.stringify(data) !== JSON.stringify(this.context.data);
    const isTypeChanged =
      JSON.stringify(types) !== JSON.stringify(this.context.types);
    if (isDataChanged) {
      this.updateSelectedConditionMap(data, true, d => {
        // 所有的保存操作都会经过 willReceiveProps
        // 所在这里更新最后一次提交的数据缓存比较合理
        this.lastSubmitData = d;

        // 初始化的时候会有情况是在搜索中有选中的,这时候需要显示底部按钮
        const typesMap = {};
        types.forEach(item => (typesMap[item.value] = item));
        for (let k in d) {
          const item = typesMap[k];
          if (item && !item.mainFilter) {
            this.allwaysShowSearchable = true;
            break;
          }
        }
        //当两个判断都为true的时候，执行updateData需要使用第一个执行改变过后的selectedConditionMap
        if (isTypeChanged) {
          this.doUpdateData();
          setTimeout(() => {
            this.getArrayFieldsAndDataArray();
          });
        }
      });
    }

    if (isTypeChanged && !isDataChanged) {
      this.doUpdateData();
      setTimeout(() => {
        this.getArrayFieldsAndDataArray();
      });
    }
  }

  doUpdateData = () => {
    const { updateData } = this.context;
    const { selectedConditionMap } = this.state;
    updateData(this.convertSelectedMapToArray(selectedConditionMap));
  };

  setInitialFields = () => {
    const { data } = this.context;
    this.getArrayFieldsAndDataArray();
    if (data && data.length) {
      this.updateSelectedConditionMap(data, true);
    }
  };

  getArrayFieldsAndDataArray = () => {
    const { types } = this.context;
    const result = types.reduce(
      (obj, type) => {
        if (type.fieldType === 'date') {
          obj.dateArray.push(type.value);
        } else if (
          (type.additions && type.additions.checkbox) ||
          type.rangeConditions
        ) {
          obj.arrayFields.push(type.value);
        }
        const rangeConditions =
          type.rangeConditions === true
            ? type.conditions
            : type.rangeConditions || [];
        const rangeKeys =
          rangeConditions &&
          rangeConditions.map(condition => {
            return [type.value, condition].join('_');
          });
        obj.rangeFields = obj.rangeFields.concat(rangeKeys);
        return obj;
      },
      { arrayFields: [], dateArray: [], rangeFields: [] }
    );
    this.setState({
      ...result
    });
  };

  updateSelectedConditionMap = (data, arrayData, stateCallback) => {
    const selectedConditionMap = arrayData
      ? this.formatSelectedDatatoMap(data)
      : data;
    const { afterConditionChange } = this.context;
    return new Promise((resolve, reject) => {
      this.setState(
        {
          selectedConditionMap
        },
        () => {
          resolve(selectedConditionMap);
          stateCallback && stateCallback(selectedConditionMap);
          afterConditionChange && afterConditionChange(selectedConditionMap);
        }
      );
    });
  };

  formatSelectedDatatoMap = data =>
    data && data.reduce((map, item) => ({ ...map, [item.field]: item }), {});

  getDetailByKey = key => {
    const { types } = this.context;
    const field = types.find(type => type.value === key);
    return field;
  };

  changeLogic = advancedLogicType => {
    this.setState({
      advancedLogicType
    });
  };

  changeValue = (key, type, value) => {
    const { beforeConditionChange, onConditionChange } = this.context;
    const { selectedConditionMap, advancedLogicType } = this.state;
    let copyData = _.cloneDeep(selectedConditionMap);
    if (beforeConditionChange) {
      copyData = beforeConditionChange(key, value, copyData);
    }
    // 这里是兼容 picklist 的代码，用户里的 oweId participant,账户杠杆、用户组和mt组
    if (WITH_ORIGIN.includes(key)) {
      copyData[key].originValue = [];
      copyData[key].value = [];
      if (Array.isArray(value)) {
        value.forEach(v => {
          copyData[key].originValue.push({ value: v.value, label: v.label });
          copyData[key].value.push(v.value);
        });
      } else {
        copyData[key].originValue = [
          { value: value.value, label: value.label }
        ];
        copyData[key].value = [value.value];
      }
    } else if (type === 'date' && value && value.startDate) {
      copyData[key].value = value;
      copyData[key].originValue = value;
    } else {
      copyData[key].value = value;
    }
    const result =
      onConditionChange &&
      onConditionChange(
        copyData[key],
        this.convertSelectedMapToArray(copyData),
        {}
      );
    this.updateSelectedConditionMap(this.formatSelectedDatatoMap(result));
  };
  convertSelectedMapToArray = selectedConditionMap => {
    const { disableValueConditions } = this.context;
    const copyData = _.cloneDeep(
      Object.keys(selectedConditionMap).map(key => selectedConditionMap[key])
    );
    return copyData;
  };

  changeCondition = (key, value) => {
    const { selectedConditionMap, advancedLogicType } = this.state;
    const copyData = _.cloneDeep(selectedConditionMap);
    copyData[key].condition = value;
    copyData[key].value = this.getInitValue(copyData[key]);
    this.updateSelectedConditionMap(copyData);
  };

  getInitValue = item => {
    const { disableValueConditions } = this.context;
    const { arrayFields, rangeFields, dateArray } = this.state;
    const { field, value, condition } = item;
    const result = disableValueConditions[value] // disabled的情况
      ? ''
      : arrayFields.includes(field) // 数组
        ? []
        : '';
    return result;
  };

  search = ({ resetType = '', reset }) => {
    const { selectedConditionMap, advancedLogicType } = this.state;
    const { onSearch, disableValueConditions } = this.context;
    const copyData = _.cloneDeep(
      Object.keys(selectedConditionMap).map(key => selectedConditionMap[key])
    );
    const vaildData = copyData.filter(this.getFieldVaildData);
    if (!reset) {
      this.allwaysShowSearchable = true;
    }
    onSearch(vaildData, advancedLogicType, resetType);
    this.setState({
      lastSearchConditionMap: reset
        ? null
        : this.getLastValue(selectedConditionMap)
    });
  };

  getLastValue = data => {
    const { originValue, value, ...others } = data;
    return { ...others };
  };
  getFieldVaildData = data => {
    const { disableValueConditions } = this.context;
    if (!data) {
      return false;
    } else if (!data.field) {
      return false;
    } else if (disableValueConditions[data.condition]) {
      return true;
    } else if (Array.isArray(data.value)) {
      return data.value.length;
    } else {
      return data.value;
    }
  };
  // noSearchUpdate 不触发 onsearch 更新列表
  reset = (clearMainFilter, noSearchUpdate, resetType) => {
    let resetData = {};
    const { selectedConditionMap } = this.state;
    const { types } = this.context;
    if (clearMainFilter !== true) {
      const mainFilters = types.filter(item => item.mainFilter) || {};
      mainFilters.forEach(item => {
        const mainKey = item.value;
        if (selectedConditionMap[mainKey]) {
          resetData[mainKey] = selectedConditionMap[mainKey];
        }
      });
    }
    const keepOpens = types.filter(item => item.keepOpen);
    const resetedData = keepOpens.reduce((obj, item) => {
      const result = {
        ...obj,
        [item.value]: selectedConditionMap[item.value]
      };
      return result;
    }, resetData);
    this.allwaysShowSearchable = false;
    return this.updateSelectedConditionMap(resetedData).then(d => {
      this.lastSubmitData = d;
      this.setState({
        filterInputKey: ''
      });
      if (!noSearchUpdate) {
        this.search({ resetType, reset: true });
      }
    });
  };

  filterSearchConditions = (current = []) => {
    const { conditions } = this.context;
    return conditions.filter(item => current.includes(item.value));
  };

  renderField = (item, fieldValue, idx) => {
    const { rangeFields } = this.state;
    const { disableValueConditions, rangeSplit } = this.context;
    const valueDisabled = disableValueConditions[fieldValue.condition];
    const attrs = item.additions || {};
    const fieldConditionKey = [fieldValue.field, fieldValue.condition].join(
      '_'
    );
    switch (item.fieldType) {
      case 'select':
        if (attrs.checkbox) {
          const oriVal =
            fieldValue && fieldValue.originValue
              ? Array.isArray(fieldValue.originValue)
                ? fieldValue.originValue
                : [fieldValue.originValue]
              : [];

          return (
            <Picklist
              data={item.optionList || []}
              searchable={attrs.searchable}
              disabled={valueDisabled}
              getPopupContainer={() => findDOMNode(this.scrollerNode)}
              defaultSelectedKeys={oriVal.map(item => `${item.value}`)}
              placeholder={i18n['general.default_select']}
              selectall={attrs.selectAllButton}
              selectallText={i18n['general.select_all']}
              onChange={selectedItem => {
                this.changeValue(
                  item.value,
                  item.fieldType,
                  item.optionList.filter(
                    opt => selectedItem && selectedItem.includes(`${opt.value}`)
                  )
                );
              }}
            />
          );
        } else {
          return (
            <Select
              placeholder={i18n['general.default_select']}
              size="small"
              value={fieldValue && fieldValue.value && fieldValue.value.value}
              // getPopupContainer={() => findDOMNode(this.scrollerNode)}
              onSelect={value => {
                this.changeValue(
                  item.value,
                  item.fieldType,
                  item.optionList.find(opt => opt.value == value)
                );
              }}
              disabled={valueDisabled}
            >
              {item.optionList &&
                item.optionList.map(opt => (
                  <Select.Option key={opt.value} value={opt.value}>
                    {opt.label}
                  </Select.Option>
                ))}
            </Select>
          );
        }
      case 'user':
        return (
          <UserSelector
            className={cs['value']}
            value={fieldValue && fieldValue.value}
            originValue={
              fieldValue.originValue
                ? Array.isArray(fieldValue.originValue)
                  ? fieldValue.originValue
                  : [fieldValue.originValue]
                : []
            }
            {...attrs}
            placeholder={i18n['general.default_select']}
            option
            size="small"
            searchByField
            disabled={valueDisabled}
            withRight={true}
            getPopupContainer={() => findDOMNode(this.scrollerNode)}
            onSelect={this.changeValue.bind(this, item.value, item.fieldType)}
          />
        );
      case 'customer':
        return (
          <CustomerSelector
            {...attrs}
            value={fieldValue && fieldValue.value}
            originValue={
              fieldValue.originValue
                ? Array.isArray(fieldValue.originValue)
                  ? fieldValue.originValue
                  : [fieldValue.originValue]
                : []
            }
            disabled={valueDisabled}
            className={cs['value']}
            size="small"
            getPopupContainer={() => findDOMNode(this.scrollerNode)}
            onSelect={this.changeValue.bind(this, item.value, item.fieldType)}
          />
        );
      case 'date':
        if (rangeFields.includes(fieldConditionKey)) {
          return (
            <div>
              <DateRangePicker
                className={cs['value']}
                onChange={this.changeValue.bind(
                  this,
                  item.value,
                  item.fieldType
                )}
                defaultValue={fieldValue && fieldValue.value}
                ranges={defaultRanges}
                getCalendarContainer={() => document.body}
                format="YYYY-MM-DD"
                size={'small'}
                value={fieldValue && fieldValue.originValue}
                disabled={valueDisabled}
                placeholder={i18n['general.date_picker.placeholder']}
                {...attrs}
              />
            </div>
          );
        } else {
          return (
            <DatePicker
              className={cs['value']}
              value={fieldValue && fieldValue.value && moment(fieldValue.value)}
              onChange={this.changeValue.bind(this, item.value, item.fieldType)}
              placeholder={i18n['general.date_picker.placeholder']}
              {...attrs}
            />
          );
        }
      case 'city':
        return (
          <NationalitySearchInput
            disabled={item.disabled}
            value={fieldValue && fieldValue.value}
            originValue={
              fieldValue.originValue
                ? Array.isArray(fieldValue.originValue)
                  ? fieldValue.originValue
                  : [fieldValue.originValue]
                : []
            }
            inputClassName={cs['value']}
            disabled={valueDisabled}
            onSelect={this.changeValue.bind(this, item.value, item.fieldType)}
          />
        );
      case 'text':
      case 'number':
      default:
        const Inputtype = item.fieldType === 'number' ? 'number' : 'text';
        const { placeholder = i18n['general.input_placeholder'] } = item;
        return (
          <ArrayInput
            type={Inputtype}
            className={cs['value']}
            inputClassName={cs['condition-input']}
            count={rangeFields.includes(fieldConditionKey) ? 2 : 1}
            disabled={valueDisabled}
            value={fieldValue && fieldValue.value}
            onChange={this.changeValue.bind(this, item.value, 'input')}
            autoUnArray={true}
            split="-"
            size="small"
            placeholder={placeholder}
          />
        );
    }
  };
  activeField = item => {
    const { selectedConditionMap } = this.state;
    const { beforeConditionChange, afterConditionChange } = this.context;
    let copyData = _.cloneDeep(selectedConditionMap);
    if (copyData[item.value]) {
      delete copyData[item.value];
      //todo cleardata
    } else {
      copyData[item.value] = formatterFieldCondition(item);
    }
    if (beforeConditionChange) {
      copyData = beforeConditionChange(item.value, {}, copyData);
    }
    this.setState(
      {
        selectedConditionMap: copyData
      },
      () => {
        afterConditionChange && afterConditionChange(copyData);
      }
    );
  };

  _renderRow = (item, idx) => {
    const {
      advancedLogicType,
      selectedConditionMap,
      filterInputKey
    } = this.state;
    const conditions = this.filterSearchConditions(item.conditions);
    const selectedValue = selectedConditionMap[item.value];

    // mainFilter 不输出到高级搜索到列表中 会在页面的其他地方展示
    if (item.mainFilter) return <div key={idx} />;
    if (
      filterInputKey &&
      !(item.label && item.label.includes(filterInputKey))
    ) {
      return <div key={idx} />;
    }
    return (
      <div key={idx} className={cs['row']}>
        <div className={cs['field-title']}>
          <Checkbox
            disabled={item.disabled}
            checked={item.keepOpen || !!selectedConditionMap[item.value]}
            onClick={
              item.keepOpen ? undefined : this.activeField.bind(this, item)
            }
          >
            {item.label}
          </Checkbox>
        </div>
        {selectedConditionMap[item.value] ? (
          <div className={cs['field-content']}>
            {conditions.length > 1 ? (
              <div className={cs['field-content-item']}>
                <Select
                  size="small"
                  defaultValue={conditions[0].value}
                  dropdownMatchSelectWidth={true}
                  getPopupContainer={() => findDOMNode(this.scrollerNode)}
                  onSelect={this.changeCondition.bind(this, item.value)}
                >
                  {conditions.map(con => {
                    return (
                      <Select.Option key={con.value} value={con.value}>
                        {con.label}
                      </Select.Option>
                    );
                  })}
                </Select>
              </div>
            ) : (
              undefined
            )}
            {selectedConditionMap[item.value].stashValue ? (
              undefined
            ) : (
              <div className={cs['field-content-item']}>
                {this.renderField(item, selectedValue, idx)}
              </div>
            )}
          </div>
        ) : (
          undefined
        )}
      </div>
    );
  };

  getFieldValue = (data = '') => (data.value !== undefined ? data.value : data);

  isSameFieldData = (left, right) => {
    if (!left || !right) {
      return false;
    }
    const leftValue = this.getFieldValue(left.value);
    const rightValue = this.getFieldValue(right.value);
    let isSame = false;
    if (isMoment(leftValue) && isMoment(rightValue)) {
      isSame = leftValue.isSame(rightValue);
    } else {
      isSame = _.isEqual(leftValue, rightValue);
    }
    return isSame && left.condition === right.condition;
  };

  isSameCondition = (last, current) => {
    if (!last) {
      return false;
    }
    const lastKeys = Object.keys(last);
    const currentKeys = Object.keys(current);
    if (lastKeys.length !== currentKeys.length) {
      return false;
    }

    for (const key of lastKeys) {
      if (!this.isSameFieldData(last[key], current[key])) {
        return false;
      }
    }
    return true;
  };

  // 缓存最后一次提交的数据用于对比, 当前最后一次选择的选项与现在不同时, 显示底部的 重置, 搜索按钮
  lastSubmitData = {};
  allwaysShowSearchable = false;
  getConditionViewState = () => {
    const { selectedConditionMap, lastSearchConditionMap } = this.state;
    const { data, types, viewData, searchType } = this.context;
    const mainFilterKeys = types
      .filter(item => item.mainFilter)
      .reduce((map, item) => ({ ...map, [item.value]: item }), {});
    let saveable = false;
    let searchable = this.allwaysShowSearchable;
    // const selectedData = Object.keys(selectedConditionMap).reduce(
    //   (array, key) => {
    //     if (selectedConditionMap[key] && 'value' in selectedConditionMap[key]) {
    //       return array.concat(selectedConditionMap[key]);
    //     } else {
    //       return array;
    //     }
    //   },
    //   []
    // );
    // const businessData = data.filter(item => item.value);
    // .filter(item => item.field !== mainFilter.value);
    if (viewData.logicType === 'OR' || !searchType) {
      saveable = false;
    } else {
      // saveable =
      //   selectedData.length === businessData.length &&
      //   data.every(item => {
      //     const key = item.field;
      //     const matchedSelected = selectedConditionMap[key];
      //     return (
      //       matchedSelected &&
      //       item.condition === matchedSelected.condition &&
      //       JSON.stringify(item.value) === JSON.stringify(matchedSelected.value)
      //     );
      //   });
      saveable = this.isSameCondition(
        lastSearchConditionMap,
        selectedConditionMap
      );
    }
    if (!searchable) {
      const diffData = difference(selectedConditionMap, this.lastSubmitData);
      if (Object.keys(diffData).length) {
        searchable = true;
      }
    }

    // searchable = Object.keys(selectedConditionMap).some(key =>
    //   this.getFieldVaildData(selectedConditionMap[key])
    // );
    // if (selectedData.every(item => mainFilterKeys[item.field])) {
    //   if (!businessData.length) {
    //     searchable = false;
    //   } else if (businessData.every(item => mainFilterKeys[item.field])) {
    //     searchable = false;
    //   }
    // }

    return { searchable, saveable };
  };

  onSave = ({ key: saveType }) => {
    const { onSave } = this.context;
    if (onSave) {
      onSave(saveType);
    }
  };
  onFilterInputChange = e => {
    const {
      target: { value }
    } = e;
    this.setState({
      filterInputKey: value && value.trim()
    });
  };
  saveScroller = node => {
    this.scrollerNode = node;
  };

  render() {
    const { filterInputKey } = this.state;
    const { types, viewId, targetName } = this.context;
    const { saveable, searchable } = this.getConditionViewState();
    return (
      <Layout>
        <div>
          <Input
            className={cs['condition-filter-input']}
            suffix={<Icon icon="search" />}
            placeholder={intl.formatMessage(
              {
                id: 'advanced_search.filter.search_target',
                defaultMessage: i18n['advanced_search.filter.search_target']
              },
              { name: targetName }
            )}
            value={filterInputKey}
            onChange={this.onFilterInputChange}
          />
        </div>
        <Content className={cs['condiiton-filter-content']}>
          <div className={cs['list']} ref={this.saveScroller}>
            <div className={cs['fields']}>{types.map(this._renderRow)}</div>
          </div>
        </Content>
        {searchable ? (
          <div className={cs['button-bar']}>
            {saveable ? (
              viewId ? (
                <Dropdown
                  placement="topLeft"
                  trigger="click"
                  overlay={
                    <Menu onClick={this.onSave}>
                      <Menu.Item key="saveAs">
                        {i18n['advanced_search.save_conditions.save_as']}
                      </Menu.Item>
                      <Menu.Item key="save">
                        {i18n['advanced_search.save_conditions.save']}
                      </Menu.Item>
                    </Menu>
                  }
                >
                  <Button type="primary">
                    {i18n['advanced_search.save_conditions.save']}{' '}
                    <Icon icon="caret-bottom" />
                  </Button>
                </Dropdown>
              ) : (
                <Button type="primary" onClick={this.onSave}>
                  {i18n['advanced_search.save_conditions']}
                </Button>
              )
            ) : (
              <Button type="primary" onClick={this.search}>
                {i18n['advanced_search.search']}
              </Button>
            )}

            <Button onClick={this.reset.bind(this, true, false, 'reset')}>
              {i18n['advanced_search.reset']}
            </Button>
          </div>
        ) : (
          undefined
        )}
      </Layout>
    );
  }
}

SearchPanel.contextTypes = {
  onSave: PropTypes.func,
  onSearch: PropTypes.func,
  data: PropTypes.array,
  disableValueConditions: PropTypes.object,
  types: PropTypes.array,
  conditions: PropTypes.array,
  rangeSplit: PropTypes.string,
  searchType: PropTypes.string,
  viewData: PropTypes.object,
  registFunction: PropTypes.func,
  viewId: PropTypes.string,
  targetName: PropTypes.string,
  onConditionChange: PropTypes.func,
  updateData: PropTypes.func,
  beforeConditionChange: PropTypes.func, //可以实现该方法返回新的数据
  afterConditionChange: PropTypes.func //可以实现该方法启用或者禁用字段
};
