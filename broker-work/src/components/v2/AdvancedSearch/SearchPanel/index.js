// import { Button } from 'react-bootstrap';
// import Modal from 'components/Modal';
// import Dropdown, { DropdownForCode } from 'components/Dropdown';
import i18n from 'utils/i18n';
import cs from '../AdvancedSearch.less';
import NationalitySearchInput from 'components/v2/NationalitySearchInput';
import DateRangePicker from 'components/v2/DateRangePicker';
import { deepCopy } from 'utils/simpleDeepCopy';
import { dateRange } from 'utils/config';
import ArrayInput from 'components/v2/ArrayInput';
import {
  Checkbox,
  Select,
  Button,
  Dropdown,
  Menu,
  Icon,
  Input,
  Picklist,
  DatePicker
} from 'lean-ui';
import CustomerSelector from 'components/v2/CustomerSelector';
import UserSelector from 'components/v2/UserSelector';
import moment from 'moment';
import UserLevelSelector from 'components/v2/UserLevelSelector';
import { WITH_ORIGIN } from './../../ConditionFilter/constants';
import { findDOMNode } from 'react-dom';

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
export default class SearchPanel extends PureComponent {
  constructor(props) {
    super(props);
    const defaultCondition = {
      label: i18n['advanced_search.field_placeholder'],
      value: '',
      fieldType: 'input',
      conditions: [this.props.conditions[0].value],
      defaultCondition: true
    };

    this.state = {
      advancedLogicType: 'AND',
      selectedAdvancedSearchConditions: [],
      advancedSearchType: [defaultCondition].concat(this.props.types),
      advancedSearchConditions: this.props.conditions,
      arrayFields: [],
      dateArray: [],
      rangeFields: [],
      uniqueFields: []
    };
  }
  getArrayFieldsAndDataArray = () => {
    const { types } = this.props;
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
        if (type.unique) {
          obj.uniqueFields.push(type.value);
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
      { arrayFields: [], dateArray: [], rangeFields: [], uniqueFields: [] }
    );
    this.setState({
      ...result
    });
  };
  updateSelectedAdvancedSearchConditions = selectedAdvancedSearchConditions => {
    return new Promise((resolve, reject) => {
      this.setState(
        {
          selectedAdvancedSearchConditions
        },
        () => {
          resolve();
        }
      );
    });
  };
  componentDidMount() {
    this.setInitialFields();
  }
  setInitialFields = () => {
    const {
      advancedSearchType,
      selectedAdvancedSearchConditions,
      defaultCondition
    } = this.state;
    const { logicType, data } = this.props;
    this.getArrayFieldsAndDataArray();
    if (logicType && (data && data.length)) {
      const condition = data;
      this.changeLogic(logicType);
      this.updateSelectedAdvancedSearchConditions(condition);
    } else {
      let copyData = deepCopy(selectedAdvancedSearchConditions);
      const conditions = [this.formatterFieldCondition(advancedSearchType[0])];
      if (!copyData.length) {
        copyData = conditions;
      }
      this.updateSelectedAdvancedSearchConditions(copyData);
    }
  };
  componentWillReceiveProps(nextProps) {
    const { logicType, data } = nextProps;
    if (
      !logicType ||
      !(data && data.length) ||
      JSON.stringify(data) === JSON.stringify(this.props.data)
    )
      return;
    const condition = data;
    this.changeLogic(logicType);
    this.updateSelectedAdvancedSearchConditions(condition);
  }
  getDetailByKey = key => {
    const { advancedSearchType } = this.state;
    const field = advancedSearchType.find(type => type.value === key);
    return field;
  };
  formatterFieldCondition = item => {
    const typeItem = this.getDetailByKey(item.value);
    const value = (type => {
      if (type.additions && type.additions.checkbox) {
        return [];
      } else {
        return '';
      }
    })(typeItem);
    return {
      field: item.value,
      condition: item.conditions[0],
      value,
      originValue: item.originValue || []
    };
  };

  changeLogic = advancedLogicType => {
    this.setState({
      advancedLogicType
    });
  };

  changeField = (idx, field) => {
    const {
      selectedAdvancedSearchConditions,
      advancedSearchType,
      advancedLogicType
    } = this.state;
    const copyData = deepCopy(selectedAdvancedSearchConditions);
    copyData[idx].field = field;
    copyData[idx].condition = advancedSearchType.find(
      item => item.value === field
    ).conditions[0];
    copyData[idx].value = this.getInitValue(copyData[idx]);
    if (copyData[idx].originValue && copyData[idx].originValue.length) {
      copyData[idx].originValue = [];
    }
    this.updateSelectedAdvancedSearchConditions(copyData);
  };

  changeValue = (idx, type, value) => {
    const { selectedAdvancedSearchConditions, advancedLogicType } = this.state;
    const copyData = deepCopy(selectedAdvancedSearchConditions);
    // 为客户归属做特殊处理
    if (WITH_ORIGIN.includes(copyData[idx].field)) {
      copyData[idx].originValue = [];
      copyData[idx].value = [];
      if (Array.isArray(value)) {
        value.forEach(v => {
          copyData[idx].originValue.push({ value: v.value, label: v.label });
          copyData[idx].value.push(v.value);
        });
      } else {
        copyData[idx].originValue = [
          { value: value.value, label: value.label }
        ];
        copyData[idx].value = [value.value];
      }
    } else if (type === 'date' && value && value.startDate) {
      copyData[idx].value = value;
      copyData[idx].originValue = value;
    } else {
      copyData[idx].value = value;
    }
    this.updateSelectedAdvancedSearchConditions(copyData);
  };

  changeCondition = (idx, value) => {
    const { selectedAdvancedSearchConditions, advancedLogicType } = this.state;
    const copyData = deepCopy(selectedAdvancedSearchConditions);
    copyData[idx].condition = value;
    copyData[idx].value = this.getInitValue(copyData[idx]);
    this.updateSelectedAdvancedSearchConditions(copyData);
  };

  getInitValue = item => {
    const { disableValueConditions } = this.props;
    const { arrayFields, rangeFields, dateArray } = this.state;
    const { field, value, condition } = item;
    const result = disableValueConditions[value] // disabled的情况
      ? ''
      : arrayFields.includes(field) // 数组
        ? []
        : '';
    return result;
  };

  search = () => {
    const { selectedAdvancedSearchConditions, advancedLogicType } = this.state;
    const { onSearch, disableValueConditions } = this.props;
    const copyData = deepCopy(selectedAdvancedSearchConditions);
    const vaildData = copyData.filter(data => {
      if (!data.field) {
        return false;
      } else if (disableValueConditions[data.condition]) {
        return true;
      } else if (Array.isArray(data.value)) {
        return data.value.length;
      } else {
        return data.value;
      }
    });
    onSearch(vaildData, advancedLogicType);
  };

  reset = isRemove => {
    const { selectedAdvancedSearchConditions } = this.state;
    let copyData = deepCopy(selectedAdvancedSearchConditions);
    copyData = isRemove
      ? []
      : copyData.map(item => {
          return {
            ...item,
            value: this.getInitValue(item)
          };
        });
    return this.updateSelectedAdvancedSearchConditions(copyData);
  };

  onHide = () => {
    const { onHide } = this.props;

    this.reset();
    onHide();
  };

  newRow = () => {
    const {
      advancedSearchType,
      selectedAdvancedSearchConditions,
      advancedLogicType
    } = this.state;
    const copyData = deepCopy(selectedAdvancedSearchConditions);
    const newRow = advancedSearchType[0];

    copyData.push(this.formatterFieldCondition(newRow));

    this.updateSelectedAdvancedSearchConditions(copyData);
  };

  removeRow = idx => {
    const { selectedAdvancedSearchConditions, advancedLogicType } = this.state;
    const copyData = deepCopy(selectedAdvancedSearchConditions);

    copyData.splice(idx, 1);

    this.updateSelectedAdvancedSearchConditions(copyData);
  };

  filterSearchType = current => {
    const {
      advancedSearchType,
      selectedAdvancedSearchConditions,
      advancedLogicType,
      uniqueFields
    } = this.state;

    // if (advancedLogicType === 'OR') return advancedSearchType;
    // return advancedSearchType;
    const ignoreConditions = selectedAdvancedSearchConditions.filter(
      item =>
        !item.field ||
        (uniqueFields.includes(item.field) && current !== item.field)
    );
    return advancedSearchType.filter(
      item => !ignoreConditions.some(_item => _item.field === item.value)
    );
  };

  filterSearchConditions = current => {
    const { advancedSearchConditions } = this.state;

    return advancedSearchConditions.filter(item =>
      current.includes(item.value)
    );
  };

  renderField = (item, type, idx) => {
    const { rangeFields } = this.state;
    const { disableValueConditions, rangeSplit, disabled } = this.props;
    const valueDisabled = disabled || disableValueConditions[item.condition];
    const attrs = type.additions || {};
    const fieldConditionKey = [item.field, item.condition].join('_');
    let oriVal = [];
    switch (type.fieldType) {
      case 'select':
        if (attrs.checkbox) {
          const oriVal =
            item && item.originValue
              ? Array.isArray(item.originValue)
                ? item.originValue
                : [item.originValue]
              : [];
          return (
            <Picklist
              data={type.optionList}
              searchable={attrs.searchable}
              disabled={valueDisabled}
              getPopupContainer={() => findDOMNode(this.domNode)}
              defaultSelectedKeys={oriVal.map(item => `${item.value}`)}
              placeholder={i18n['general.default_select']}
              selectall={attrs.selectAllButton}
              selectallText={i18n['general.select_all']}
              onChange={selectedItem => {
                this.changeValue(
                  idx,
                  type.fieldType,
                  type.optionList.filter(
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
              value={item && item.value && item.value.value}
              // getPopupContainer={() => findDOMNode(this.scrollerNode)}
              onSelect={value => {
                this.changeValue(
                  idx,
                  type.fieldType,
                  type.optionList.find(opt => opt.value == value)
                );
              }}
              disabled={valueDisabled}
            >
              {type.optionList &&
                type.optionList.map(opt => (
                  <Select.Option key={opt.value} value={opt.value}>
                    {opt.label}
                  </Select.Option>
                ))}
            </Select>
          );
        }
      case 'userLevel':
        let selectedItems = [];
        if (item && item.originValue) {
          selectedItems = Array.isArray(item.originValue)
            ? item.originValue
            : [item.originValue];
        }
        return (
          <Dropdown
            trigger="click"
            overlay={
              <Menu
                selectedKeys={selectedItems.map(v => v.value)}
                onSelect={({ key }) => {
                  if (key != '__select_user__') {
                    const matchedOpt = type.optionList.find(
                      opt => opt.value === key
                    );
                    this.changeValue(idx, type.fieldType, [matchedOpt]);
                  }
                }}
                selectable
              >
                {type.optionList
                  .map(levelOpt => (
                    <Menu.Item key={levelOpt.value}>{levelOpt.label}</Menu.Item>
                  ))
                  .concat(<Menu.Divider key="divider" />)
                  .concat(
                    <Menu.Item key={'__select_user__'}>
                      <UserLevelSelector
                        className={cs['user-selector']}
                        {...attrs}
                        type="searchType"
                        onSubmit={(data, isDirect) => {
                          this.changeValue(idx, type.fieldType, [
                            isDirect
                              ? {
                                  label: i18n['user_level_selector.direct'],
                                  value: 'sub'
                                }
                              : {
                                  label: i18n['user_level_selector.no_direct'],
                                  value: 'subBelong'
                                },
                            data
                          ]);
                        }}
                      />
                    </Menu.Item>
                  )}
              </Menu>
            }
          >
            <Button className={cs['user-level-btn']}>
              {selectedItems
                .map(v => v.label)
                .sort(() => 1)
                .join('-') || i18n['general.default_select']}
            </Button>
          </Dropdown>
        );
      case 'user':
        oriVal = item.originValue || [];
        return (
          <UserSelector
            className={cs['value']}
            value={item && item.value}
            originValue={Array.isArray(oriVal) ? oriVal : [oriVal]}
            {...attrs}
            searchByField
            disabled={valueDisabled}
            withRight={true}
            onSelect={this.changeValue.bind(this, idx, type.fieldType)}
            getPopupContainer={() => findDOMNode(this.domNode)}
          />
        );
        break;
      case 'customer':
        oriVal = item.originValue || [];
        return (
          <CustomerSelector
            value={item.value}
            originValue={Array.isArray(oriVal) ? oriVal : [oriVal]}
            {...attrs}
            disabled={valueDisabled}
            className={cs['value']}
            onSelect={this.changeValue.bind(this, idx, type.fieldType)}
          />
        );
        break;
      case 'date':
        if (rangeFields.includes(fieldConditionKey)) {
          return (
            <DateRangePicker
              className={cs['value']}
              onChange={this.changeValue.bind(this, idx, type.fieldType)}
              defaultValue={item && item.value}
              ranges={defaultRanges}
              format="YYYY-MM-DD"
              disabled={valueDisabled}
              value={item && item.originValue}
              placeholder={i18n['general.date_picker.placeholder']}
              {...attrs}
            />
          );
        } else {
          return (
            <DatePicker
              className={cs['value']}
              value={item.value && moment(item.value)}
              onChange={this.changeValue.bind(this, idx, type.fieldType)}
              placeholder={i18n['general.date_picker.placeholder']}
            />
          );
        }
      case 'city':
        oriVal = item.originValue || [];
        return (
          <NationalitySearchInput
            disabled={item.disabled}
            value={item.value}
            originValue={Array.isArray(oriVal) ? oriVal : [oriVal]}
            inputClassName={cs['value']}
            disabled={valueDisabled}
            onChange={this.changeValue.bind(this, idx, type.fieldType)}
          />
        );
      case 'text':
      case 'number':
      default:
        const Inputtype = type.fieldType === 'number' ? 'number' : 'text';
        return (
          <ArrayInput
            type={Inputtype}
            className={cs['value']}
            count={rangeFields.includes(fieldConditionKey) ? 2 : 1}
            disabled={valueDisabled}
            value={item.value}
            onChange={this.changeValue.bind(this, idx, 'input')}
            autoUnArray={true}
            split="-"
            placeholder={i18n['general.input_placeholder']}
          />
        );
    }
  };
  saveRef = node => {
    this.triger = node;
  };
  _renderRow = (item, idx) => {
    const {
      advancedSearchType,
      selectedAdvancedSearchConditions,
      advancedLogicType
    } = this.state;
    const { disabled } = this.props;
    const type = advancedSearchType.find(_item => _item.value === item.field);
    if (!type) return undefined;
    const length =
      selectedAdvancedSearchConditions &&
      selectedAdvancedSearchConditions.length;
    return (
      <div key={idx} className={cs['row']}>
        {idx ? (
          <div className={cs['mini']}>
            <Select
              value={advancedLogicType}
              // getPopupContainer={() => findDOMNode(this.scrollerNode)}
              onSelect={this.changeLogic}
              dropdownMatchSelectWidth={true}
              placeholder={i18n['advanced_search.field_placeholder']}
              disabled={disabled}
            >
              {logics.map(con => {
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
        <div className={idx ? cs['after-mini'] : ''}>
          <Select
            value={item.field}
            // getPopupContainer={() => findDOMNode(this.scrollerNode)}
            onSelect={this.changeField.bind(this, idx)}
            dropdownMatchSelectWidth={true}
            disabled={disabled}
            placeholder={i18n['advanced_search.field_placeholder']}
          >
            {this.filterSearchType(item.field).map(con => {
              return (
                <Select.Option key={con.value} value={con.value}>
                  {con.label}
                </Select.Option>
              );
            })}
          </Select>
        </div>
        <div className={cs['mini']}>
          <Select
            value={item.condition}
            // getPopupContainer={() => findDOMNode(this.scrollerNode)}
            onSelect={this.changeCondition.bind(this, idx)}
            dropdownMatchSelectWidth={true}
            disabled={disabled}
          >
            {this.filterSearchConditions(type.conditions).map(con => {
              return (
                <Select.Option key={con.value} value={con.value}>
                  {con.label}
                </Select.Option>
              );
            })}
          </Select>
        </div>
        <div ref={this.saveRef}>{this.renderField(item, type, idx)}</div>
        <div className={cs['btn']}>
          {disabled || (idx === 0 && length <= 1) ? (
            undefined
          ) : (
            <button
              type="button"
              className={cs['remove-btn']}
              onClick={this.removeRow.bind(this, idx)}
            >
              <Icon icon="error" />
            </button>
          )}
        </div>
      </div>
    );
  };
  saveDom = node => {
    this.domNode = node;
  };
  render() {
    const {
      advancedLogicType,
      advancedSearchType,
      selectedAdvancedSearchConditions
    } = this.state;
    const { justForm, disabled } = this.props;
    return (
      <div className={cs['stage-content']}>
        <div>
          <div className={cs['list']}>
            <div className={cs['fields']} ref={this.saveDom}>
              {selectedAdvancedSearchConditions.map(this._renderRow)}
            </div>
            <div>
              {!disabled ? (
                <div colSpan="4">
                  <a
                    className={`main-color cs['create-btn']`}
                    onClick={this.newRow}
                  >
                    {i18n['advanced_search.create_btn']}
                  </a>
                </div>
              ) : (
                undefined
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
