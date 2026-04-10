import PropTypes from 'prop-types';
import SearchPanel from '../SearchPanel';
import cs from '../AdvancedSearch.less';
import i18n from 'utils/i18n';
import { deepCopy } from 'utils/simpleDeepCopy';
import { WITH_ORIGIN } from './../../ConditionFilter/constants';

export default class Container extends Component {
  state = {
    lastState: 0,
    data: [],
    disableValueConditions: {},
    logicType: '',
    closeCallback: () => {}
  };

  getDisableValueConditions = () => {
    const { conditions } = this.props;
    const disableValueConditions = conditions.reduce((map, item) => {
      if (item.valueDisabled) {
        map[item.value] = true;
      } else if (map[item.value]) {
        delete map[item.value];
      }
      return map;
    }, {});
    this.setState({
      disableValueConditions
    });
  };

  componentDidMount() {
    const { initData, logicType } = this.props;
    this.onOpen();
    this.getDisableValueConditions();
    if (initData && initData.length && logicType) {
      const _data = this.convertToCommonFormat(initData);
      this.setState({
        data: _data,
        logicType
      });
    }
  }
  componentWillReceiveProps(nextProps) {
    const {
      searchType: nextSearchType,
      logicType: nextLogicType,
      initData: nextInitData
    } = nextProps;
    const { searchType, logicType } = this.props;
    if (nextSearchType !== searchType) {
      return;
    }
    if (logicType !== nextLogicType) {
      const _data = this.convertToCommonFormat(nextInitData);
      this.setState({
        data: _data,
        logicType: nextLogicType
      });
    }
  }

  getfieldValue = (data, type, condition, spit) => {
    const { arraySplit, dateSplit, dateFormat, rangeSplit } = this.props;
    if (!data || !condition || !type) return;
    const rangeConditions =
      type && type.rangeConditions === true
        ? type.conditions
        : type.rangeConditions || [];
    if (
      type &&
      type.fieldType !== 'date' &&
      rangeConditions.includes(condition)
    ) {
      return data.sort((a, b) => a - b).join(rangeSplit);
    }
    if (Array.isArray(data)) {
      const arr = data.map(v => this.getfieldValue(v, type, condition));
      if (spit || arraySplit) {
        return arr.join(spit || arraySplit);
      } else {
        return arr;
      }
    }
    if (type && type.fieldType === 'date') {
      if (data.startDate) {
        if (dateSplit) {
          return this.getfieldValue(
            [data.startDate, data.endDate],
            type,
            condition,
            dateSplit
          );
        } else {
          return {
            startDate: this.getfieldValue(data.startDate, type, condition),
            endDate: this.getfieldValue(data.endDate, type, condition)
          };
        }
      } else if (dateFormat && data.format) {
        return data.format(dateFormat);
      } else if (data.valueOf) {
        return data.valueOf();
      }
    }
    return data.value || data;
  };
  submitForm = () => {
    const panel = this.refs.searchPanel;
    if (panel) {
      panel.search();
    }
  };
  reset = () => {
    const panel = this.refs.searchPanel;
    if (panel) {
      panel.reset(false);
    }
  };
  onSearch = (_data, _logicType) => {
    const data = _data || this.state.data;
    const logicType = _logicType || this.state.logicType;
    const isDataUpdate = !!_data;
    const copyData = deepCopy(data); //用于储存筛选条件的冗余数据
    const searchData = this.convertToSearchFormat(copyData);
    const originData = this.convertToSearchFormat(copyData, true);
    const { onSearch } = this.props;

    this.setState({
      data: copyData,
      logicType
    });
    if (onSearch) {
      onSearch(searchData, logicType, originData, isDataUpdate);
    }
  };

  onOpen = () => {
    const { onOpen, list } = this.props;
    if (onOpen) {
      onOpen();
    }
  };

  convertToCommonFormat = data => {
    const {
      conditionKey = 'condition',
      fieldKey = 'field',
      inner
    } = this.props;
    if (inner) return data;
    const _data = deepCopy(data) || [];
    return _data.map(item => {
      return {
        ...item,
        value: item.originValue,
        field: item[fieldKey],
        condition: item[conditionKey]
      };
    });
  };
  convertToSearchFormat = (data, withOriginal) => {
    const {
      conditionKey = 'condition',
      fieldKey = 'field',
      types
    } = this.props;
    const { disableValueConditions } = this.state;
    const _data = deepCopy(data) || [];
    return _data
      .map((fieldItem, index) => {
        const matchedType = types.find(type => type.value === fieldItem.field);
        let item = {
          [fieldKey]: fieldItem.field,
          value: this.getfieldValue(
            fieldItem.value,
            matchedType,
            fieldItem.condition
          ),
          [conditionKey]: fieldItem.condition
        };
        if (withOriginal) {
          item = {
            ...item,
            originValue:
              // 为客户归属做特殊处理
              WITH_ORIGIN.includes(fieldItem.field)
                ? fieldItem.originValue
                : fieldItem.value
          };
        }
        return item;
      })
      .filter(
        item =>
          (item.value || disableValueConditions[item[conditionKey]]) &&
          item[fieldKey]
      );
  };
  render() {
    const { children, disabled } = this.props;
    const { data, disableValueConditions, logicType } = this.state;
    return (
      <SearchPanel
        ref="searchPanel"
        {...this.props}
        data={data}
        logicType={logicType}
        disabled={disabled}
        disableValueConditions={disableValueConditions}
        onSearch={this.onSearch}
      />
    );
  }
}
