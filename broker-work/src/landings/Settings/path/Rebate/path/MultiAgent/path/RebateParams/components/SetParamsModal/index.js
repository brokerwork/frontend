import { Button, Dialog, Icon, Form, Input, Select } from 'lean-ui';
import i18n from 'utils/i18n';
import cs from './index.less';
import { CONDITION_LIST, CONDITIONS } from '../../constant';
import NumberInput from 'components/v2/NumberInput';
import _ from 'lodash';

export default class SetParamsModal extends PureComponent {
  constructor(props) {
    super(props);
    this.state = this.initState();
  }
  initState = () => {
    return {
      sort: true,
      logicType: '',
      conditionList: [
        {
          key: '',
          opt: 'between',
          max: '',
          min: '',
          optionList: CONDITION_LIST, //辅助字段
          error: false, //辅助字段
          errormsg: '' //辅助字段
        }
      ]
    };
  };

  componentWillReceiveProps(nextprops) {
    const { editConditionData } = nextprops;
    if (editConditionData && editConditionData.param) {
      const { copyConditionList } = this.optionListFormate(
        editConditionData.param.params
      );
      this.setState({
        conditionList: copyConditionList,
        logicType: editConditionData.param.logicType
      });
    } else {
      this.setState({
        logicType: this.initState().logicType,
        conditionList: this.initState().conditionList
      });
    }
  }
  onSave = () => {
    const {
      setCondition,
      editConditionData,
      getRuleList,
      ruleDetail,
      onHide
    } = this.props;
    const { logicType, conditionList } = this.state;
    const copyConditionList = _.cloneDeep(conditionList);
    // 验证
    copyConditionList.forEach(condition => {
      if (condition.max === '' && condition.min === '') {
        condition.error = true;
        condition.errormsg = '';
        return;
      } else if (condition.key === '') {
        condition.error = true;
        condition.errormsg =
          i18n[
            'settings.rebate_setting.params_setting.conditon_setting.choose_key_tips'
          ];
        return;
      } else if (condition.max && condition.min && condition.key) {
        if (Number(condition.max) <= Number(condition.min)) {
          condition.error = true;
          condition.errormsg =
            i18n[
              'settings.rebate_setting.params_setting.conditon_setting.max_min_tips'
            ];
          return;
        } else if (Number(condition.max) <= 0) {
          condition.error = true;
          condition.errormsg =
            i18n[
              'settings.rebate_setting.params_setting.conditon_setting.max_more_tips'
            ];
          return;
        }
      }
      condition.error = false;
      condition.errormsg = '';
    });
    this.setState({
      conditionList: copyConditionList
    });
    if (copyConditionList.some(item => item.error)) return;
    const endConditionList = copyConditionList.map(v => ({
      key: v.key,
      opt: v.opt,
      max: v.max,
      min: v.min
    }));
    const params = {
      logicType,
      params: endConditionList
    };
    setCondition(editConditionData.id, params).then(res => {
      if (res.result) {
        onHide();
        getRuleList(ruleDetail.id);
      }
    });
  };

  onHide = () => {
    this.props.onHide();
  };
  // 所有条件只能选择一次，当选择了一个条件后，其他选择列表中此项消失
  optionListFormate = conditionList => {
    const copyConditionList = _.cloneDeep(conditionList);
    const selectedOptions = copyConditionList.map(condition => condition.key); // 前面已选择过的option
    copyConditionList.forEach(v => {
      v.optionList = CONDITION_LIST.filter(
        f => !selectedOptions.includes(f.value) || v.key === f.value
      );
    });
    return {
      copyConditionList,
      selectedOptions
    };
  };
  addCondition = () => {
    const { conditionList } = this.state;
    const { copyConditionList, selectedOptions } = this.optionListFormate(
      conditionList
    );
    const newOptionList = CONDITION_LIST.filter(
      opt => !selectedOptions.includes(opt.value)
    );
    const item = {
      key: '',
      opt: 'between',
      max: '',
      min: '',
      optionList: newOptionList
    };
    const list = [...copyConditionList, item];
    this.setState({
      conditionList: list
    });
  };
  onDelete = key => {
    const list = this.state.conditionList.filter(
      (condition, index) => index !== key
    );
    const { copyConditionList } = this.optionListFormate(list);
    this.setState({
      conditionList: copyConditionList
    });
  };
  onLogicTypeSelect = val => {
    this.setState({
      logicType: val
    });
  };
  onInputChange = (name, item, key) => val => {
    const { conditionList } = this.state;
    const newList = _.cloneDeep(conditionList);
    item[name] = val;
    newList[key] = item;
    if (name === 'key') {
      const { copyConditionList } = this.optionListFormate(newList);
      this.setState({
        conditionList: copyConditionList
      });
      return;
    }
    this.setState({
      conditionList: newList
    });
  };
  renderConditionItem = () => {
    const { conditionList, logicType } = this.state;
    return conditionList.map((item, key) => (
      <Form.Item key={key} className={cs.item}>
        <Form.Control
          className={cs.condition_item}
          errorMsg={
            item.error
              ? item.errormsg
                ? item.errormsg
                : i18n[
                    'settings.rebate_setting.params_setting.conditon_setting.atleast_tips'
                  ]
              : null
          }
        >
          {key === 0 ? (
            <NumberInput
              className={cs.max_input}
              value={item.min}
              decimal={'{0,3}'}
              onChange={this.onInputChange('min', item, key)}
              placeholder={
                i18n[
                  'settings.rebate_setting.params_setting.conditon_setting.placeholder_min'
                ]
              }
            />
          ) : (
            <div className={cs.condition_min}>
              <Select
                className={cs.select_relation}
                value={logicType}
                onSelect={this.onLogicTypeSelect}
              >
                {CONDITIONS.map(n => (
                  <Select.Option value={n.value} key={n.value}>
                    {i18n[`${n.label}`]}
                  </Select.Option>
                ))}
              </Select>
              <NumberInput
                className={cs.min_input}
                value={item.min}
                decimal={'{0,3}'}
                onChange={this.onInputChange('min', item, key)}
                placeholder={
                  i18n[
                    'settings.rebate_setting.params_setting.conditon_setting.placeholder_min'
                  ]
                }
              />
            </div>
          )}
          <span className={cs.margin_12}>≤</span>
          <Select
            className={cs.select}
            value={item.key}
            onSelect={this.onInputChange('key', item, key)}
          >
            {item.optionList.map(n => (
              <Select.Option value={n.value} key={n.value}>
                {i18n[n.label]}
              </Select.Option>
            ))}
          </Select>
          <span className={cs.margin_12}>&lt;</span>
          <NumberInput
            className={cs.max_input}
            value={item.max}
            decimal={'{0,3}'}
            onChange={this.onInputChange('max', item, key)}
            placeholder={
              i18n[
                'settings.rebate_setting.params_setting.conditon_setting.placeholder_max'
              ]
            }
          />
          {conditionList.length > 1 && (
            <Icon
              icon="error"
              className={cs.delete}
              onClick={this.onDelete.bind(this, key)}
            />
          )}
        </Form.Control>
      </Form.Item>
    ));
  };
  render() {
    const { show } = this.props;
    const { conditionList } = this.state;
    return (
      <Dialog
        title={i18n['settings.rebate_setting.params_setting.condition_setting']}
        visible={show}
        className={cs.set_parameter_modal}
        onCancel={this.onHide}
        footer={
          <div>
            <Button onClick={this.onHide}>{i18n['general.cancel']}</Button>
            <Button type="primary" onClick={this.onSave}>
              {i18n['general.confirm']}
            </Button>
          </div>
        }
      >
        <Form>{this.renderConditionItem()}</Form>
        {conditionList.length < CONDITION_LIST.length && (
          <span className={cs.add_more} onClick={this.addCondition}>
            {i18n['advanced_search.create_btn']}
          </span>
        )}
      </Dialog>
    );
  }
}
