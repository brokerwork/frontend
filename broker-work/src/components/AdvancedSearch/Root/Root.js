import PropTypes from 'prop-types';
import SearchPanel from '../SearchPanel';
import cs from '../AdvancedSearch.less';
import Tags from '../Tags';
import i18n from 'utils/i18n';
import { deepCopy } from 'utils/simpleDeepCopy';
import SaveModal from '../SaveModal';
import Modal from 'components/Modal';
import { Button } from 'react-bootstrap';

export default class Container extends Component {
  state = {
    showPanel: false,
    showTags: false,
    lastState: 0,
    data: [],
    disableValueConditions: {},
    logicType: '',
    closeCallback: () => {},
    isShowSaveModal: false
  };
  registedFuncs = {};
  getChildContext() {
    return {
      onOpen: this.onOpen,
      openWithSearchId: this.openWithSearchId,
      registFunction: this.registFunction,
      searchType: this.props.searchType
    };
  }
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
    const { justForm, initData, logicType } = this.props;
    if (justForm) this.onOpen();
    this.getDisableValueConditions();
    if (initData && initData.length && logicType) {
      const _data = this.convertToCommonFormat(initData);
      this.setState({
        data: _data,
        logicType,
        showTags: true
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
      this.onClose();
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
    const { onSearch, justForm } = this.props;
    const _state = justForm
      ? {
          showPanel: true
        }
      : {
          showPanel: false,
          showTags: true
        };
    this.setState({
      data: copyData,
      logicType,
      ..._state
    });
    if (onSearch) {
      onSearch(searchData, logicType, originData, isDataUpdate);
    }
    if (!(copyData && copyData.length) && !justForm) {
      this.setState({
        showPanel: false,
        showTags: false
      });
    }
  };
  onClose = () => {
    const panel = this.refs.searchPanel;
    if (panel) {
      Promise.resolve(panel.reset(true)).then(() => {
        panel.search();
        this.setState({
          showPanel: false,
          showTags: false
        });
      });
    } else {
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
  openWithSearchId = (conditionId, noSearch) => {
    const { getConditionsListDetail, types } = this.props;
    const __resolve = conditionId
      ? getConditionsListDetail(conditionId)
      : Promise.resolve();
    return __resolve.then(res => {
      let state = {};
      if (res && res.data) {
        const { logicType = 'AND', condition = [] } = res.data;
        state = {
          ...state,
          logicType,
          data: this.convertToCommonFormat(condition)
        };
      } else {
        state = {
          logicType: '',
          data: []
        };
      }
      const invalidField = state.data.find(
        item => !types.some(type => type.value === item.field)
      );
      if (invalidField) {
        return Promise.reject();
      }
      return Promise.resolve(this.setState(state)).then(() => {
        if (noSearch) return;
        setTimeout(() => {
          this.onSearch();
        });
      });
    });
  };
  onOpen = () => {
    const { onOpen, list, justForm } = this.props;
    this.setState({
      showPanel: true
    });
    if (onOpen) {
      onOpen();
    }
  };
  onHide = () => {
    const panel = this.refs.searchPanel;
    if (panel) {
      panel.setInitialFields();
    }
    this.setState({
      showPanel: false
    });
  };
  cleanTags = isRemove => {
    const panel = this.refs.searchPanel;
    if (panel) {
      Promise.resolve(panel.reset(true)).then(() => {
        panel.search();
      });
    }
  };
  toggleSaveModal = toggle => {
    this.setState({
      isShowSaveModal: toggle
    });
  };
  onSaveConditions = name => {
    const { createCondition, searchType, showTopAlert, list } = this.props;
    const {
      ConditionGetList = () => {},
      ConditionOnSelect = () => {}
    } = this.registedFuncs;
    if (!searchType) return;
    const { data, logicType } = this.state;
    const params = {
      logicType,
      condition: this.convertToSearchFormat(data, true),
      name,
      searchLevel: 'USER',
      searchType
    };
    createCondition(params).then(res => {
      if (res.result) {
        showTopAlert({
          bsStyle: 'success',
          content: i18n['general.save_success']
        });
        this.toggleSaveModal(false);
        ConditionGetList().then(() => {
          if (res.data && res.data.searchId) {
            const { name: label, searchId: value } = res.data;
            ConditionOnSelect({ label, value }, true);
          }
        });
      }
    });
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
            originValue: fieldItem.value
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
    const { children, justForm, disabled } = this.props;
    const {
      showPanel,
      showTags,
      data,
      disableValueConditions,
      logicType,
      isShowSaveModal
    } = this.state;
    const isOpened = showPanel || showTags;
    const panelStateStyle = showPanel ? 'show' : 'hide';
    const SearchPanelComponent = (
      <SearchPanel
        ref="searchPanel"
        {...this.props}
        data={data}
        logicType={logicType}
        disabled={disabled}
        disableValueConditions={disableValueConditions}
        onClose={this.onClose}
        onSearch={this.onSearch}
      />
    );
    return (
      <div className={cs['container']}>
        <div className={cs['state-0']}>{children}</div>
        {isOpened ? (
          <div className={cs['state-1']}>
            {justForm ? (
              SearchPanelComponent
            ) : (
              <Modal
                bsSize="lg"
                className={`${cs['modal-container']} ${panelStateStyle}`}
                show={true}
                onHide={this.onHide}
              >
                <Modal.Header>
                  <button
                    type="button"
                    className="close"
                    onClick={this.onHide}
                  />
                  <Modal.Title id="tips-modal">
                    {i18n['advanced_search.btn_name']}
                  </Modal.Title>
                </Modal.Header>
                <Modal.Body>{SearchPanelComponent}</Modal.Body>
                <Modal.Footer>
                  {!justForm ? (
                    <div className={cs['button-bar']}>
                      <Button
                        bsStyle="primary"
                        onClick={this.reset.bind(this, false)}
                      >
                        <span className="fa fa-rotate-left" />
                        {i18n['advanced_search.reset']}
                      </Button>
                      <Button bsStyle="primary" onClick={this.submitForm}>
                        <span className="fa fa-search" />
                        {i18n['advanced_search.search']}
                      </Button>
                      <Button onClick={this.onHide}>
                        {i18n['general.cancel']}
                      </Button>
                    </div>
                  ) : (
                    undefined
                  )}
                </Modal.Footer>
              </Modal>
            )}
          </div>
        ) : (
          undefined
        )}
        {showTags && !justForm ? (
          <div className={cs['state-2']}>
            <Tags
              {...this.props}
              data={data}
              logicType={logicType}
              disableValueConditions={disableValueConditions}
              onClean={this.cleanTags}
              goAdvanceSearch={this.onOpen}
              goGeneralSearch={this.onClose}
              toggleSaveModal={this.toggleSaveModal.bind(this, true)}
              onRemoveItem={this.onRemoveItem}
            />
          </div>
        ) : (
          undefined
        )}
        {isShowSaveModal ? (
          <SaveModal
            {...this.props}
            data={data}
            logicType={logicType}
            disableValueConditions={disableValueConditions}
            onHide={this.toggleSaveModal.bind(this, false)}
            onSave={this.onSaveConditions}
          />
        ) : (
          undefined
        )}
      </div>
    );
  }
}

Container.childContextTypes = {
  onOpen: PropTypes.func,
  openWithSearchId: PropTypes.func,
  registFunction: PropTypes.func,
  searchType: PropTypes.string
};
