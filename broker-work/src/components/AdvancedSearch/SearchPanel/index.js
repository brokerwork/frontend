import { Button } from 'react-bootstrap';
import Modal from 'components/Modal';
import Dropdown, { DropdownForCode } from 'components/Dropdown';
import i18n from 'utils/i18n';
import cs from '../AdvancedSearch.less';
import NationalitySearchInput from 'components/NationalitySearchInput';
import DateRangePicker from 'components/DateRangePicker';
import { deepCopy } from 'utils/simpleDeepCopy';
import { dateRange } from 'utils/config';
import CustomerSelector from 'components/CustomerSelector';
import UserSelector from 'components/UserSelector';
import DatePicker from 'components/DatePicker';
import ArrayInput from 'components/ArrayInput';

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
        const rangeKeys = rangeConditions.map(condition => {
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
      value
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
    this.updateSelectedAdvancedSearchConditions(copyData);
  };

  changeValue = (idx, type, value) => {
    const { selectedAdvancedSearchConditions, advancedLogicType } = this.state;
    const copyData = deepCopy(selectedAdvancedSearchConditions);
    copyData[idx].value = value;
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
      item => uniqueFields.includes(item.field) && current !== item.field
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
    switch (type.fieldType) {
      case 'select':
        return (
          <Dropdown
            selectAllButton={attrs.checkbox}
            {...attrs}
            value={item.value}
            className={cs['value']}
            data={type.optionList}
            disabled={valueDisabled}
            onSelect={this.changeValue.bind(this, idx, type.fieldType)}
          />
        );
      case 'userTree':
      case 'user':
        return (
          <UserSelector
            className={cs['value']}
            value={item.value}
            {...attrs}
            searchByField
            disabled={valueDisabled}
            withRight={true}
            onSelect={this.changeValue.bind(this, idx, type.fieldType)}
          />
        );
      case 'customer':
        return (
          <CustomerSelector
            {...attrs}
            value={item.value}
            disabled={valueDisabled}
            className={cs['value']}
            onSelect={this.changeValue.bind(this, idx, type.fieldType)}
          />
        );
      case 'date':
        if (rangeFields.includes(fieldConditionKey)) {
          return (
            <DateRangePicker
              className={cs['value']}
              onApply={this.changeValue.bind(this, idx, type.fieldType)}
              startDate={item.value.startDate}
              endDate={item.value.endDate}
              ranges={defaultRanges}
              format="YYYY-MM-DD"
              disabled={valueDisabled}
            />
          );
        } else {
          return (
            <DatePicker
              className={cs['value']}
              value={item.value}
              onChange={this.changeValue.bind(this, idx, type.fieldType)}
            />
          );
        }
      case 'city':
        return (
          <NationalitySearchInput
            disabled={item.disabled}
            value={item.value}
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
          />
        );
    }
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
            <DropdownForCode
              className={cs['dropdown-mini']}
              data={logics}
              disabled={disabled}
              value={advancedLogicType}
              onChange={this.changeLogic}
            />
          </div>
        ) : (
          undefined
        )}
        <div>
          <DropdownForCode
            className={idx ? cs['dropdown'] : cs['dropdown-lg']}
            data={this.filterSearchType(item.field)}
            disabled={disabled}
            value={item.field}
            onChange={this.changeField.bind(this, idx)}
          />
        </div>
        <div>
          <DropdownForCode
            className={cs['dropdown-mini']}
            data={this.filterSearchConditions(type.conditions)}
            disabled={disabled}
            value={item.condition}
            onChange={this.changeCondition.bind(this, idx)}
          />
        </div>
        <div>{this.renderField(item, type, idx)}</div>
        <div>
          {disabled || (idx === 0 && length <= 1) ? (
            undefined
          ) : (
            <button
              type="button"
              className={cs['remove-btn']}
              onClick={this.removeRow.bind(this, idx)}
            >
              <span className="fa fa-times-circle" />
            </button>
          )}
        </div>
      </div>
    );
  };
  render() {
    const {
      advancedLogicType,
      advancedSearchType,
      selectedAdvancedSearchConditions
    } = this.state;
    const { onClose = () => {}, justForm, disabled } = this.props;
    return (
      <div className={cs['stage-content']}>
        <div>
          {/* <p className={cs['tips']}>
            {advancedLogicType === 'AND'
              ? i18n['advanced_search.tabs.and.tips']
              : i18n['advanced_search.tabs.or.tips']}
          </p> */}
          <div className={cs['list']}>
            <div className={cs['fields']}>
              {selectedAdvancedSearchConditions.map(this._renderRow)}
            </div>
            <div>
              {!disabled ? (
                <div colSpan="4">
                  <a className={cs['create-btn']} onClick={this.newRow}>
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
