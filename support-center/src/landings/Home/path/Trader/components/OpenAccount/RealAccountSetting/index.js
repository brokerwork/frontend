import Panel from 'components/Panel';
import Button from 'components/Button';
import StepList from './StepList';
import cs from '../index.less';
import i18n from 'utils/i18n';
import _ from 'lodash';
import Modal from 'components/Modal';
import Select from 'components/Select';
import SearchList from './SearchList';
import NameEdit from './NameEdit';
import language from 'utils/language';
import { FormattedMessage } from 'react-intl';
import Tab from 'components/Tab';
const TabPanel = Tab.Panel;

export default class RealAccountSetting extends PureComponent {
  constructor(props) {
    super(props);
    this.state = this.initialState();
  }
  selectKeys = new Set();
  stepOptionList = [];
  initialState = () => {
    const { platformSetting: { accountStepSettings = [], poolFieldList = [] } = {} } = this.props;
    return {
      steps: accountStepSettings.map(el => ({ ...el })), //deep copy
      fieldsPool: poolFieldList.concat(),
      openSteps: {},
      showFieldsSelect: false,
      showStepEdit: false,
      isVisible: false,
      selectType: 0,
      filterOptionList: [],
      deleteType: '', //删除行还是步骤 row,step,
      activeKey: 0
    };
  };
  firstSet = false;
  componentWillReceiveProps(nextProps) {
    const {
      platformSetting: { accountStepSettings = [], poolFieldList = [] }
    } = nextProps;
    const { activeKey, openSteps } = this.state;
    if (!_.isEqual(nextProps.platformSetting, this.props.platformSetting) && !this.firstSet) {
      this.setState({
        steps: _.cloneDeep(accountStepSettings),
        fieldsPool: _.cloneDeep(poolFieldList)
      });
      this.firstSet = true;
    }
  }

  /**
   * 从列表中移除某个字段
   */
  isEnabled = (listDelete, listPush, params) => {
    const {
      type,
      item: { uuid },
      item
    } = params;
    const { fieldsPool, steps } = this.state;
    const { fieldList, ...others } = steps[type];
    const newFieldList = fieldList.filter(el => el.uuid !== uuid);
    steps[type] = {
      fieldList: newFieldList,
      ...others
    };
    const newPool = fieldsPool.concat();
    newPool.push({ ...item });
    this.setState({
      fieldsPool: newPool,
      steps: steps.concat()
    });
  };
  // 移动姓名字段
  moveStep = (from, to) => {
    const { steps } = this.state;
    const copySteps = _.cloneDeep(steps);
    const accountName = copySteps[from].fieldList.find(item => item.key === 'accountName');
    _.remove(copySteps[from].fieldList, function(n) {
      return n.uuid === accountName.uuid;
    });
    copySteps[to].fieldList.unshift(accountName);
    this.setState({
      steps: copySteps
    });
  };
  arrTans(arr, oldIndex, newIndex) {
    const oldId = arr[oldIndex];
    arr.splice(oldIndex, 1);
    arr.splice(newIndex, 0, oldId);
    return arr;
  }
  onSort = currentStep => event => {
    const { steps = [] } = this.state;
    if (currentStep > steps.length - 1) {
      //out of range
      return;
    }
    const data = steps[currentStep].fieldList;
    const { oldIndex, newIndex } = event;
    const copy = _.cloneDeep(data);
    const end = this.arrTans(copy, oldIndex, newIndex);
    steps[currentStep].fieldList = end;
    if (oldIndex !== newIndex) {
      this.setState({
        steps: steps.concat()
      });
    }
  };

  lang = () => {
    return language.getLang();
  };

  onSave = () => {
    const { steps = [], fieldsPool = [], activeKey } = this.state;
    const { savePlatformSetting, showTopAlert, plat, accountTypeConfig } = this.props;
    let accountTypeInfos = [];
    if (accountTypeConfig) {
      accountTypeInfos = accountTypeConfig.accountTypeInfos;
    }
    if (!steps.length) {
      showTopAlert({
        content: (
          <FormattedMessage id="field.setting.field.nostep" defaultMessage={i18n['field.setting.field.nostep']} />
        )
      });
      return;
    }
    for (const step of steps) {
      if (!step.fieldList.length) {
        showTopAlert({
          content: (
            <FormattedMessage
              id="field.setting.field.noFieldsTips"
              defaultMessage={i18n['field.setting.field.noFieldsTips']}
              values={{ step: step.languageSettingMap[this.lang()] }}
            />
          )
        });
        return;
      }
    }

    //save steps
    savePlatformSetting(plat, steps, accountTypeInfos.length && accountTypeInfos[activeKey].customerAccountType).then(
      res => {
        if (res.result) {
          showTopAlert({
            style: 'success',
            content: i18n['general.save_success']
          });
        } else {
          showTopAlert({
            content: i18n['general.save_failure']
          });
        }
      }
    );
  };
  onReset = () => {
    // const state = this.initialState();
    const { getPlatformSetting, plat, accountTypeConfig } = this.props;
    const { activeKey } = this.state;
    let accountTypeInfos = [];
    if (accountTypeConfig) {
      accountTypeInfos = accountTypeConfig.accountTypeInfos;
    }
    getPlatformSetting(plat, _.get(accountTypeInfos[activeKey], 'customerAccountType', '')).then(res => {
      if (res.result) {
        const { accountStepSettings = [], poolFieldList = [] } = res.data;
        this.props.showTopAlert({
          style: 'success',
          content: i18n['general.reset_success']
        });
        this.setState({
          steps: accountStepSettings.map(el => ({ ...el })), //deep copy
          fieldsPool: poolFieldList.concat(),
          showFieldsSelect: false,
          showStepEdit: false,
          isVisible: false,
          selectType: 0,
          filterOptionList: [],
          deleteType: '' //删除行还是步骤 row,step,
        });
      }
    });
  };

  onEditStepName = step => {
    this.step = step;
    this.setState({ showStepEdit: true });
  };

  onDeleteStep = step => {
    const { showTipsModal } = this.props;
    const { steps } = this.state;
    const isNameAccount = steps[step].fieldList.some(item => item.key === 'accountName');
    if (isNameAccount) {
      this.openNameMove(step, 'step');
    } else {
      showTipsModal({
        content: i18n['field.setting.field.deleteStepTips'],
        onConfirm: this.removeStep.bind(this, step)
      });
    }
  };

  removeStep = (step, close) => {
    const { steps = [], fieldsPool = [] } = this.state;
    const { showTopAlert } = this.props;
    let newSteps = steps.concat();
    const removed = newSteps[step];
    const newFieldsPool = fieldsPool.concat();
    const { fieldList = [] } = removed;
    if (fieldList.length) {
      //add all field to pool
      newFieldsPool.push(...fieldList);
    }
    //remove
    newSteps.splice(step, 1);
    //update index
    newSteps = newSteps.map((item, index) => ({ ...item, index: index + 1 }));
    this.setState({
      steps: newSteps,
      fieldsPool: newFieldsPool
    });
    showTopAlert({
      content: i18n['field.setting.field.deleteStepSuccess'],
      style: 'success'
    });
    close();
  };

  onAddField = step => {
    this.step = step;
    this.setState({ showFieldsSelect: true });
  };

  renderItem = ({ fieldList = [], index = 1, languageSettingMap }) => {
    const { steps = [] } = this.state;
    const { versionRights } = this.props;
    return (
      <StepList
        key={index}
        title={languageSettingMap[this.lang()]}
        sortableData={fieldList}
        type={index - 1}
        isEnabled={this.isEnabled}
        onSort={this.onSort}
        isVisibleShow={this.openNameMove}
      >
        {versionRights && !versionRights['SC_ACCOUNTFROM_SET'] ? null : (
          <i
            title={i18n['field.setting.field.title.editName']}
            className="fa fa-pencil"
            onClick={this.onEditStepName.bind(this, index - 1)}
          />
        )}
        {(versionRights && !versionRights['SC_ACCOUNTFROM_SET']) || steps.length === 1 ? null : (
          <i
            title={i18n['field.setting.field.title.delete']}
            className="fa fa-trash-o"
            onClick={this.onDeleteStep.bind(this, index - 1)}
          />
        )}
        <i
          title={i18n['field.setting.field.title.editField']}
          className="fa fa-cog fa-gear"
          onClick={this.onAddField.bind(this, index - 1)}
        />
      </StepList>
    );
  };

  renderSteps = () => {
    const { steps = [] } = this.state;
    const list = steps.map(step => ({ label: step.languageSettingMap[this.lang()], value: step.index }));
    this.stepOptionList = list;
    return steps.map(this.renderItem);
  };

  onSelectFields = () => {
    if (!this.selectKeys || !this.selectKeys.size) {
      const { showTopAlert } = this.props;
      showTopAlert({
        content: i18n['field.setting.field.selectField']
      });
      return;
    }
    const { steps, fieldsPool = [] } = this.state;
    const data = steps[this.step];
    const { fieldList = [], ...others } = data;
    const newFieldsPool = [];
    const newFieldList = fieldList.concat();
    fieldsPool.forEach(item => {
      if (this.selectKeys.has(item.uuid)) {
        newFieldList.push({ ...item });
      } else {
        newFieldsPool.push({ ...item });
      }
    });
    steps[this.step] = { fieldList: newFieldList, ...others };
    this.setState({
      steps: steps.concat(),
      fieldsPool: newFieldsPool,
      showFieldsSelect: false
    });
  };

  onClose = () => {
    this.setState({ showFieldsSelect: false });
  };

  onChangeSelect = selectKeys => {
    this.selectKeys = selectKeys;
  };

  createStep = () => {
    const { steps, fieldsPool } = this.state;
    const index = steps.length + 1;
    const { languageSettingMap } = steps.length ? steps[0] : {};
    let map = {};
    let fieldList = [];
    // 如果是新增的第一步，则默认添加姓名字段
    if (index === 1) {
      // 筛选出name 添加到默认字段里面
      const nameItem = fieldsPool.find(item => item.key === 'accountName');
      fieldList.push(nameItem);
    }
    languageSettingMap &&
      Object.keys(languageSettingMap).forEach(key => {
        map[key] = '';
      });
    map[this.lang()] = i18n['field.setting.field.defaultStepName'];
    return {
      fieldList,
      index,
      languageSettingMap: map
    };
  };

  addNewStep = () => {
    const newStep = this.createStep();
    const steps = this.state.steps.concat();
    steps.push(newStep);
    this.setState({ steps });
  };

  onSaveName = () => {
    const { steps = [] } = this.state;
    const { showTopAlert } = this.props;
    if (!this.languageSettingMap) {
      //未进行任何修改
      this.setState({
        showStepEdit: false
      });
      return;
    }
    const hasValue = Object.keys(this.languageSettingMap).some(key => !!this.languageSettingMap[key]);
    if (!hasValue) {
      showTopAlert({
        content: i18n['field.setting.field.inputMoreLanguage']
      });
      return;
    }
    let newSteps = steps.concat();
    newSteps[this.step].languageSettingMap = this.languageSettingMap;
    this.languageSettingMap = null;
    this.setState({
      steps: newSteps,
      showStepEdit: false
    });
  };

  onCloseNameEdit = () => {
    this.setState({ showStepEdit: false });
  };

  onChangeName = nameMap => {
    this.languageSettingMap = nameMap;
  };
  isVisibleShow = (name, visible) => {
    this.setState({
      [name]: visible
    });
  };
  openNameMove = (type, deleteType) => {
    this.isVisibleShow('isVisible', true);
    this.stepOptionList = this.stepOptionList.filter(item => item.value !== type + 1);
    this.step = type;
    this.setState({
      selectType: this.stepOptionList.length && this.stepOptionList[0].value,
      filterOptionList: this.stepOptionList,
      deleteType
    });
  };
  onNameSave = () => {
    const { selectType } = this.state;
    // from to
    this.moveStep(this.step, selectType - 1);
    this.isVisibleShow('isVisible', false);
  };
  handleSelect = val => {
    this.setState({
      selectType: val
    });
  };
  handleActiveChange = key => {
    const { getPlatformSetting, plat, accountTypeConfig, platformSetting } = this.props;
    const { openSteps, steps, activeKey } = this.state;
    let accountTypeInfos = [];
    if (accountTypeConfig) {
      accountTypeInfos = accountTypeConfig.accountTypeInfos;
    }
    if (key === activeKey) {
      return;
    }
    const accountType = _.get(accountTypeInfos[key], 'customerAccountType', '');
    const beforeAccountType = _.get(accountTypeInfos[activeKey], 'customerAccountType', '');
    // if (openSteps[accountType]) {
    //   openSteps[beforeAccountType] = _.cloneDeep(steps);
    //   this.setState({
    //     steps: openSteps[accountType],
    //     fieldsPool: _.cloneDeep(platformSetting.poolFieldList),
    //     activeKey: key,
    //     openSteps
    //   });
    //   return;
    // }
    getPlatformSetting(plat, accountType).then(res => {
      if (res.result) {
        const { accountStepSettings = [], poolFieldList = [] } = res.data;
        // 如果存在多账户，切换tab时把当前tab的状态保存下来，在未保存时切回tab会显示之前编辑的内容
        // 该功能放弃
        // if (accountType) {
        //   openSteps[beforeAccountType] = _.cloneDeep(steps);
        // }
        // 保留修改后的数据
        this.setState({
          steps: _.cloneDeep(accountStepSettings),
          fieldsPool: _.cloneDeep(poolFieldList),
          activeKey: key,
          openSteps
        });
      }
    });
  };
  render() {
    const {
      steps = [],
      fieldsPool = [],
      showFieldsSelect,
      showStepEdit,
      isVisible,
      selectType,
      filterOptionList,
      deleteType,
      activeKey
    } = this.state;
    const { versionRights, accountTypeConfig } = this.props;
    let accountTypeInfos = [];
    if (accountTypeConfig) {
      accountTypeInfos = accountTypeConfig.accountTypeInfos;
    }
    console.log('fieldsPool', fieldsPool);
    return (
      <div>
        <Panel className={cs.margin_15} header={i18n['platform.tab.open.account.real']}>
          {versionRights['SC_CUSTOM_ACCOUNT_TYPE'] ? (
            <div>
              <Tab activeKey={activeKey} id="realOpenAccount" onChange={this.handleActiveChange}>
                {accountTypeInfos.map((item, index) => {
                  const Lang = language.getLang();
                  const title = item.accountTypeName[Lang] || (Lang === 'zh-CN' ? '未命名' : 'unknown');
                  return (
                    <TabPanel
                      key={index}
                      className={cs.setting_tabpanel}
                      eventKey={index}
                      title={
                        <span className={cs.tab_title} title={title}>
                          {title}
                        </span>
                      }
                    ></TabPanel>
                  );
                })}
              </Tab>
              {this.renderSteps()}
              {steps.length >= 10 || (versionRights && !versionRights['SC_ACCOUNTFROM_SET']) ? null : (
                <Button style="primary" className={cs.button} onClick={this.addNewStep}>
                  {i18n['field.setting.field.addStep']}
                </Button>
              )}
              <div>
                <Button style="primary" className={cs.margin_right} onClick={this.onSave}>
                  {i18n['app.btn.save']}
                </Button>
                <Button onClick={this.onReset}> {i18n['app.btn.reset']}</Button>
              </div>
            </div>
          ) : (
            <div>
              {this.renderSteps()}
              {steps.length >= 10 || (versionRights && !versionRights['SC_ACCOUNTFROM_SET']) ? null : (
                <Button style="primary" className={cs.button} onClick={this.addNewStep}>
                  {i18n['field.setting.field.addStep']}
                </Button>
              )}
              <div>
                <Button style="primary" className={cs.margin_right} onClick={this.onSave}>
                  {i18n['app.btn.save']}
                </Button>
                <Button onClick={this.onReset}> {i18n['app.btn.reset']}</Button>
              </div>
            </div>
          )}
        </Panel>

        {showFieldsSelect ? (
          <Modal onClose={this.onClose}>
            <Modal.Header>{i18n['field.setting.field.selectTips']}</Modal.Header>
            <Modal.Body>
              <SearchList listData={fieldsPool} onChangeSelect={this.onChangeSelect} />
            </Modal.Body>
            <Modal.Footer>
              <Button style="primary" onClick={this.onSelectFields}>
                {i18n['general.apply']}
              </Button>
              <Button onClick={this.onClose}>{i18n['app.btn.cancel']}</Button>
            </Modal.Footer>
          </Modal>
        ) : null}

        {showStepEdit ? (
          <Modal onClose={this.onCloseNameEdit}>
            <Modal.Header>{i18n['field.setting.field.editName']}</Modal.Header>
            <Modal.Body>
              <NameEdit data={steps[this.step].languageSettingMap} onChange={this.onChangeName} />
            </Modal.Body>
            <Modal.Footer>
              <Button style="primary" onClick={this.onSaveName}>
                {i18n['general.apply']}
              </Button>
              <Button onClick={this.onCloseNameEdit}>{i18n['app.btn.cancel']}</Button>
            </Modal.Footer>
          </Modal>
        ) : null}
        {isVisible && (
          <Modal onClose={this.isVisibleShow.bind(this, 'isVisible', false)} size="sm">
            <Modal.Header>{i18n['trader.plat.setting.basicInfo.account.notice']}</Modal.Header>
            <Modal.Body className={cs.modalBody}>
              <p>
                {deleteType === 'row'
                  ? i18n['field.setting.field.accountName.tips']
                  : i18n['field.setting.field.accountName.delete.tips']}
              </p>
              <div className={cs.move_accountName}>
                <span className={cs.text}>{i18n['field.setting.field.accountName.move']}</span>
                {filterOptionList && filterOptionList.length && (
                  <Select options={filterOptionList} value={selectType} onChange={this.handleSelect}></Select>
                )}
                {/* <Select
                  options={[{ value: 0, label: 's' }, { value: 1, label: 'sss' }]}
                  value={selectType}
                  onChange={this.handleSelect}
                ></Select> */}
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button style="primary" onClick={this.onNameSave}>
                {i18n['general.save']}
              </Button>
              <Button onClick={this.isVisibleShow.bind(this, 'isVisible', false)}> {i18n['general.cancel']}</Button>
            </Modal.Footer>
          </Modal>
        )}
      </div>
    );
  }
}
