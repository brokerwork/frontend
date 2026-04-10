import PropTypes from 'prop-types';
import SearchPanel from '../SearchPanel';
import cs from '../AdvancedSearch.less';
import i18n from 'utils/i18n';
import SaveModal from '../SaveModal';
import Modal from 'components/Modal';
import { Button } from 'lean-ui';
import { Content, Layout } from 'components/v2/PageWraper';
import { WITH_ORIGIN } from '../constants';
import _ from 'lodash';

import { formatterFieldCondition } from '../utils';
import moment from 'moment';
const DEFAULT_VIEW_DATA = {
  logicType: 'AND',
  data: [],
  name: ''
};
export default class Container extends Component {
  state = {
    showPanel: false,
    showTags: false,
    lastState: 0,
    data: [],
    disableValueConditions: {},
    logicType: 'AND',
    closeCallback: () => {},
    isShowSaveModal: false,
    viewId: this.props.viewId,
    viewData: {
      logicType: 'AND',
      data: [],
      name: ''
    },
    saveType: 'add'
  };
  registedFuncs = {};
  getChildContext() {
    return {
      registFunction: this.registFunction,
      onSave: this.toggleSaveModal.bind(this, true),
      onSearch: this.onSearch,
      data: this.state.data,
      disableValueConditions: this.state.disableValueConditions,
      types: this.props.types,
      conditions: this.props.conditions,
      rangeSplit: this.props.rangeSplit,
      searchType: this.props.searchType,
      mergeConditions: this.mergeConditions,
      getConditions: this.props.getConditions,
      editCondition: this.toggleSaveModal.bind(this, true),
      getViewDetail: this.props.getConditionsListDetail,
      convertToCommonFormat: this.convertToCommonFormat,
      updateViewData: this.updateViewData,
      viewData: this.state.viewData,
      removeCondition: this.props.removeCondition,
      showTipsModal: this.props.showTipsModal,
      showTopAlert: this.props.showTopAlert,
      viewId: this.state.viewId,
      targetName: this.props.targetName,
      onConditionChange: this.onConditionChange,
      updateData: this.updateData,
      getOriginValue: this.convertValueToOriginValue,
      beforeConditionChange: this.beforeConditionChange,
      afterConditionChange: this.afterConditionChange
    };
  }
  mergeConditions = (
    { value, type, fieldKey, extras, originValue, isFirstset },
    noTriger,
    condition = []
  ) => {
    const isViewId = type === 'view';
    const { data } = this.state;

    const { types } = this.props;
    const mainFilters = this.getMainFilterList();
    let newData = _.cloneDeep(data);
    newData = newData.filter(
      item =>
        'value' in item &&
        !mainFilters.some(filter => filter.value === item.field)
    );
    let newViewId = '';
    if (type === 'view') {
      newViewId = value;
    } else {
      const newCondition = formatterFieldCondition(
        this.getMainFilter(fieldKey)
      );
      newCondition.value = value;
      if (originValue) {
        newCondition.originValue = originValue;
      }
      newData.unshift(newCondition);
      newData = this.onConditionChange(newCondition, newData, extras);
    }
    //没有searchId要传条件去查
    !!condition.length &&
      condition.forEach(el => {
        el.condition = el.type;
        el.field = el.key;
        return el;
      });
    if (!condition.some(el => el.key === 'filterDate')) {
      condition = [...data, condition];
    }
    this.setState(
      {
        data: !!condition.length && newViewId ? condition : newData,
        viewId: newViewId
      },
      () => {
        if (!noTriger) {
          this.onSearch(undefined, undefined, undefined, isFirstset);
        }
      }
    );
  };

  getMainFilterList = () => {
    const { types } = this.props;
    return types.filter(item => item.mainFilter);
  };
  getMainFilter = (key, fallbackFirstSelect = true) => {
    const { types } = this.props;
    return (
      types.find(item => item.mainFilter && item.value === key) ||
      types.find(item => item.mainFilter && item.fieldType === 'select')
    );
  };
  getFilterTypes = (key, name) => {
    const { types } = this.props;
    return types.find(item => item[name] && item.value === key);
  };
  updateViewData = (data = DEFAULT_VIEW_DATA) => {
    this.setState({ viewData: { ...DEFAULT_VIEW_DATA, ...data } });
  };

  registFunction = (funcName, func) => {
    if (typeof funcName === 'object') {
      //registFunction({funcName: func})
      this.registedFuncs = Object.assign(this.registedFuncs, funcName);
    } else {
      //registFunction(funcName, func)
      this.registedFuncs[funcName] = func;
    }
  };

  getDisableValueConditions = () => {
    const { conditions } = this.props;
    const disableValueConditions = conditions.reduce((map, item) => {
      if (item.valueDisabled) {
        map[item.value] = true;
      } else if (item.value in map) {
        delete map[item.value];
      }
      return map;
    }, {});
    this.setState({
      disableValueConditions
    });
  };
  componentDidMount() {
    const { justForm, data } = this.props;
    if (justForm) this.onOpen();
    this.getDisableValueConditions();
    if (data && data.length) {
      const _data = this.convertToCommonFormat(data);
      this.setState({
        data: _data
      });
    }
  }

  afterConditionChange = data => {
    const { afterConditionChange } = this.props;
    afterConditionChange && afterConditionChange(data);
  };

  beforeConditionChange = (key, value, condition) => {
    const { beforeConditionChange } = this.props;
    return beforeConditionChange
      ? beforeConditionChange(key, value, condition)
      : condition;
  };

  onConditionChange = (condition, data, extras) => {
    const {
      onConditionChange,
      conditionKey = 'condition',
      fieldKey = 'field',
      types
    } = this.props;
    if (onConditionChange) {
      const matchedType = types.find(type => type.value === condition['field']);
      const result = onConditionChange(
        this.convertToSearchFormat([condition])[0],
        this.convertToSearchFormat(data),
        extras
      );
      return (result && this.convertToCommonFormat(result)) || data;
      //如果没有return新值，视作未修改
    } else {
      return data;
    }
  };
  componentWillReceiveProps(nextProps) {
    const {
      searchType: nextSearchType,
      logicType: nextLogicType,
      data: nextData,
      types: nextTypes,
      viewId: nextViewId
    } = nextProps;
    const { searchType, logicType, data, types, viewId } = this.props;
    if (
      !_.isEqual(data, nextData)
      //  ||
      // JSON.stringify(types) !== JSON.stringify(nextTypes)
    ) {
      const _data = this.convertToCommonFormat(nextData, nextTypes);
      this.setState({
        data: _data
      });
    }

    if (viewId !== nextViewId) {
      this.setState({
        viewId: nextViewId
      });
    }
  }
  setCloseHandle = closeCallback => {
    this.setState({
      closeCallback
    });
  };
  getfieldValue = (data, type, condition, spit) => {
    const { arraySplit, dateSplit, dateFormat, rangeSplit } = this.props;
    if (!data || !condition || !type) return;
    const rangeConditions =
      type && type.rangeConditions === true
        ? type.conditions
        : type.rangeConditions || [];
    if (
      rangeSplit &&
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
      } else if (data.format && data.valueOf) {
        return data.valueOf();
      } else return data && moment(data).valueOf();
    }
    return typeof data === 'object' && 'value' in data ? data.value : data;
  };
  submitForm = () => {
    const panel = this.refs.searchPanel;
    if (panel) {
      panel.search();
    }
  };
  reset = (clearMainFilter, noTriger = false) => {
    const { panelReset } = this.registedFuncs;
    if (panelReset) {
      panelReset(clearMainFilter === true, noTriger);
    }
  };
  updateData = data => {
    const { types } = this.props;
    const newData = data.map(item => {
      if ('stashValue' in item) {
        const matchedType = types.find(type => type.value === item.field);
        const originValue = this.convertValueToOriginValue(
          item.stashValue,
          matchedType,
          item.condition
        );
        const result = {
          ...item,
          value: originValue
        };
        delete result.stashValue;
        return result;
      } else {
        return item;
      }
    });

    this.setState({
      data: newData
    });
  };
  onSearch = (_data, _logicType, resetType, isFirstset) => {
    const { data: stateData, viewId } = this.state;
    const data = _data || stateData;
    const logicType = _logicType || this.state.logicType;
    const isDataUpdate = !!_data;
    const copyData = _.cloneDeep(data); //用于储存筛选条件的冗余数据
    const originData = this.convertToSearchFormat(copyData);
    const { onSearch, justForm } = this.props;
    this.setState({
      data: copyData,
      logicType
    });
    if (onSearch) {
      onSearch(originData, logicType, viewId, resetType, isFirstset);
    }
    if (!(copyData && copyData.length) && !justForm) {
      this.setState({
        showPanel: false,
        showTags: false
      });
    }
  };

  onRemoveItem = idx => {
    const panel = this.refs.searchPanel;
    Promise.resolve(panel.removeRow(idx)).then(() => {
      panel.search();
    });
  };

  toggleSaveModal = (toggle, type) => {
    const { data } = this.state;
    if (!toggle) {
      this.setState({
        isShowSaveModal: false
      });
      return;
    }
    if (type === 'add') {
      this.setState({
        isShowSaveModal: true,
        saveType: 'add'
      });
    } else if (type === 'edit') {
      this.setState({
        isShowSaveModal: true,
        saveType: 'edit'
      });
    } else if (type === 'save') {
      this.setState({
        isShowSaveModal: true,
        saveType: 'save'
      });
    } else {
      this.setState({
        isShowSaveModal: toggle,
        saveType: 'saveAs'
      });
    }
  };
  onSaveConditions = (name, data, logicType) => {
    const {
      createCondition,
      updateCondition,
      searchType,
      showTopAlert,
      list
    } = this.props;
    const { saveType, viewData = DEFAULT_VIEW_DATA } = this.state;
    const {
      conditionGetList = () => {},
      conditionOnSelectView = () => {}
    } = this.registedFuncs;
    if (!searchType) return;
    const target = ['edit', 'save'].includes(saveType) ? 'update' : 'create';

    const params = {
      ...(target === 'update' ? viewData : undefined),
      logicType,
      condition: data,
      name,
      searchLevel: 'USER',
      searchType
    };
    const func = {
      create: createCondition,
      update: updateCondition
    }[target];
    func(params).then(res => {
      if (res.result) {
        showTopAlert({
          bsStyle: 'success',
          content: i18n['general.save_success']
        });
        this.toggleSaveModal(false);
        if (target === 'update') {
          if (saveType === 'edit') {
            conditionGetList().then(() => {
              this.reset(true, true);
              conditionOnSelectView(params.searchId); //更新并刷新
            });
          } else {
            this.reset(true); //重置左侧
            conditionOnSelectView(params.searchId); //更新选择
          }
        } else {
          conditionGetList().then(() => {
            if (res.data && res.data.searchId) {
              const { searchId } = res.data;
              this.reset(true);
              conditionOnSelectView(searchId);
            }
          });
        }
      }
    });
  };
  convertValueToOriginValue = (data, type, condition) => {
    const { fields, fieldKey = 'field' } = this.state;
    const { arraySplit, dateSplit, dateFormat, rangeSplit } = this.props;
    //type未传入时无法得到OriginValue
    if (type) {
      if (typeof data === 'undefined') return data;
      const rangeConditions =
        type && type.rangeConditions === true
          ? type.conditions
          : type.rangeConditions || [];
      if (
        rangeSplit &&
        type &&
        type.fieldType !== 'date' &&
        rangeConditions.includes(condition)
      ) {
        return data.split(rangeSplit);
      } else if (
        arraySplit &&
        typeof data === 'string' &&
        data.includes(arraySplit)
      ) {
        return data.split(arraySplit).map(item => {
          return this.convertValueToOriginValue(item, type, condition);
        });
      } else if (type && type.fieldType === 'date') {
        if (typeof data === 'string' && data.includes(dateSplit)) {
          const [startDate, endDate] = data.split(dateSplit);
          return {
            startDate: this.convertValueToOriginValue(
              startDate,
              type,
              condition
            ),
            endDate: this.convertValueToOriginValue(endDate, type, condition)
          };
        } else if (data.startDate) {
          return {
            startDate: this.convertValueToOriginValue(
              data.startDate,
              type,
              condition
            ),
            endDate: this.convertValueToOriginValue(
              data.endDate,
              type,
              condition
            )
          };
        } else if (data) {
          return Number(data) ? moment(Number(data)) : moment(data);
        } else {
          return data;
        }
      } else if (type.fieldType === 'select' && type.optionList) {
        return type.optionList.find(item => item.value === data);
      }
      return data;
    }
  };

  convertToCommonFormat = data => {
    const {
      conditionKey = 'condition',
      fieldKey = 'field',
      types
    } = this.props;
    const _data = _.cloneDeep(data) || [];
    return _data.map(item => {
      const matchedType = types.find(type => type.value === item[fieldKey]);
      const originValue = this.convertValueToOriginValue(
        item.value,
        matchedType,
        item[conditionKey]
      );
      const result = {
        ...item,
        value: originValue,
        field: item[fieldKey],
        condition: item[conditionKey]
      };
      if (typeof originValue === 'undefined') {
        result.stashValue = item.value; //未获取到originValue时 将 value暂存下来，下一个生命周期会继续查找；
      }
      return result;
    });
  };
  convertToSearchFormat = (data, withOriginal) => {
    const { types } = this.props;
    const { conditionKey = 'condition', fieldKey = 'field' } = this.props;
    const { disableValueConditions } = this.state;
    const filterData = data.filter(d => (d.field ? true : false));
    const _data = _.cloneDeep(filterData) || [];
    return _data
      .map((fieldItem, index) => {
        const matchedType = types.find(type => type.value === fieldItem.field);
        let item = {
          [fieldKey]: fieldItem.field,
          value:
            typeof fieldItem === 'undefined' && 'stashValue' in fieldItem
              ? fieldItem.stashValue
              : this.getfieldValue(
                  fieldItem.value,
                  matchedType,
                  fieldItem.condition
                ),
          [conditionKey]: fieldItem.condition,
          originValue: fieldItem.originValue
            ? fieldItem.originValue
            : fieldItem.value
        };
        if (WITH_ORIGIN.includes(fieldItem.field)) {
          item = {
            ...item,
            originValue: fieldItem.originValue // 为客户归属做特殊处理
          };
        }
        return item;
      })
      .filter(
        item =>
          ('value' in item || disableValueConditions[item[conditionKey]]) &&
          fieldKey in item
      );
  };
  getSaveViewProps = () => {
    const {
      saveType,
      viewData = DEFAULT_VIEW_DATA,
      viewId,
      data,
      logicType
    } = this.state;
    let editData = [];
    let editLogicType = 'AND';
    switch (saveType) {
      case 'edit':
        editLogicType = viewData.logicType;
        editData = viewData.data;
        break;
      case 'save':
      case 'saveAs':
        editData = viewData.data.concat(data);
        break;
      case 'add':
      default:
        break;
    }
    return { logicType: editLogicType, data: editData };
  };

  onRemoveCondition = (...args) => {
    const { viewId } = this.state;
    const { conditionRemove } = this.registedFuncs;
    if (conditionRemove) {
      conditionRemove(viewId, ...args).then(res => {
        this.toggleSaveModal(false);
      });
    }
  };

  render() {
    const { children, justForm, ...otherProps } = this.props;
    const {
      showPanel,
      showTags,
      disableValueConditions,
      isShowSaveModal,
      saveType,
      viewData = DEFAULT_VIEW_DATA
    } = this.state;
    const isOpened = showPanel || showTags;
    const panelStateStyle = showPanel ? 'show' : 'hide';
    const { logicType, data } = this.getSaveViewProps();
    return (
      <Layout>
        {children}
        {isShowSaveModal ? (
          <SaveModal
            {...otherProps}
            data={data}
            name={['edit', 'save'].includes(saveType) ? viewData.name : ''}
            logicType={logicType}
            disableValueConditions={disableValueConditions}
            onHide={this.toggleSaveModal.bind(this, false)}
            onSave={this.onSaveConditions}
            disabled={!!viewData.isSystem && saveType !== 'add'}
            saveType={saveType}
            onRemoveCondition={this.onRemoveCondition}
          />
        ) : (
          undefined
        )}
      </Layout>
    );
  }
}

Container.childContextTypes = {
  registFunction: PropTypes.func,
  onSave: PropTypes.func,
  onSearch: PropTypes.func,
  data: PropTypes.array,
  disableValueConditions: PropTypes.object,
  types: PropTypes.array,
  conditions: PropTypes.array,
  rangeSplit: PropTypes.string,
  searchType: PropTypes.string,
  mergeConditions: PropTypes.func,
  getConditions: PropTypes.func,
  editCondition: PropTypes.func,
  getViewDetail: PropTypes.func,
  convertToCommonFormat: PropTypes.func,
  updateViewData: PropTypes.func,
  viewData: PropTypes.object,
  viewId: PropTypes.string,
  removeCondition: PropTypes.func,
  showTipsModal: PropTypes.func,
  showTopAlert: PropTypes.func,
  onConditionChange: PropTypes.func,
  beforeConditionChange: PropTypes.func,
  afterConditionChange: PropTypes.func,
  targetName: PropTypes.string,
  updateData: PropTypes.func,
  getOriginValue: PropTypes.func
};
//   <SearchPanel
//   ref="searchPanel"
//   {...this.props}
//   data={data}
//   logicType={logicType}
//   disableValueConditions={disableValueConditions}
//   onClose={this.onClose}
//   onSearch={this.onSearch}
// />
