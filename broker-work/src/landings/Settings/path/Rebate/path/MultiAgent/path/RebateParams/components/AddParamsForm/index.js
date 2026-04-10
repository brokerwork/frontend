import { Form, Input } from 'lean-ui';
import i18n from 'utils/i18n';
import cs from './index.less';
import CheckboxInput from 'components/v2/CheckboxInput';
import _ from 'lodash';

export default class AddParamsModalForm extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      newParameter:
        props.type === 'edit'
          ? this.initialNewParameter(props.editData, props)
          : this.initialNewParameter(props.selected, props),
      errormsg: new Map()
    };
  }
  initialNewParameter = (data, props) => {
    const { result, rebateTotal } = this.formatterNewParameterLevelList(props);
    return {
      ruleType: data.ruleType,
      ruleId: data.id,
      comment: data.comment || '',
      levelIdValues: result,
      rebateTotal
    };
  };
  componentWillReceiveProps(props) {
    this.setState({
      newParameter:
        props.type === 'edit'
          ? this.initialNewParameter(props.editData, props)
          : this.initialNewParameter(props.selected, props)
    });
  }

  formatterNewParameterLevelList = props => {
    const { parameterlevelList, editData, type } = props;
    let result = [];
    if (type === 'edit') {
      result = parameterlevelList.map(level => {
        const _level = editData.levelIdValues.find(
          _v => parseInt(_v.levelId) === parseInt(level.id)
        );
        return {
          levelId: level.id,
          value: _level.value
        };
      });
    } else {
      result = parameterlevelList.map(level => {
        return {
          levelId: level.id,
          value: 'NA'
        };
      });
    }
    const rebateTotal = this.computedRebateTotal(result);
    return { result, rebateTotal };
  };
  computedRebateTotal = datalist => {
    let rebateTotal = 0;
    datalist &&
      datalist.length &&
      datalist.forEach(item => {
        if (item && item.value && !isNaN(item.value)) {
          rebateTotal += Number(item.value);
        }
      });
    return rebateTotal;
  };
  toggleInput = (levelIdx, evt) => {
    const { newParameter } = this.state;
    const copyData = _.cloneDeep(newParameter);
    const checked = evt.target.checked;
    const startIdx = checked ? 0 : levelIdx;
    const endIdx = checked ? levelIdx + 1 : newParameter.levelIdValues.length;

    for (let i = startIdx; i < endIdx; i++) {
      copyData.levelIdValues[i].value = checked
        ? copyData.levelIdValues[i].value === 'NA'
          ? 0
          : copyData.levelIdValues[i].value
        : 'NA';
    }
    copyData.rebateTotal = this.computedRebateTotal(copyData.levelIdValues);
    this.setState({
      newParameter: copyData
    });
  };
  onChange = (levelIdx, evt) => {
    const { newParameter } = this.state;
    const copyData = _.cloneDeep(newParameter);
    const regexp = /^\+?\d+(\.\d+)?$/;
    let value = evt.target.value;
    const isError = !regexp.test(value);

    if (!isError) {
      const dotIdx = value.indexOf('.');
      value = dotIdx === -1 ? value : value.substr(0, dotIdx + 4);
    }

    copyData.levelIdValues[levelIdx].value = value;
    copyData.levelIdValues[levelIdx].error = isError;
    copyData.rebateTotal = this.computedRebateTotal(copyData.levelIdValues);
    this.setState({
      newParameter: copyData
    });
  };
  // 大小限制错误提示
  getLimitsErrorTip() {
    const { limits } = this.props;
    return (
      i18n['settings.rebate_setting.number_limits_error'] ||
      'Only accept number in {min}~{max}'
    )
      .replace(/{min}/, limits.min)
      .replace(/{max}/, limits.max);
  }
  onCommentChange = evt => {
    const { newParameter } = this.state;
    const copyData = _.cloneDeep(newParameter);
    copyData.comment = evt.target.value;
    this.setState({
      newParameter: copyData
    });
  };
  outTotalLimit(data, limits) {
    let isOutTotalLimit = false,
      _total = 0;
    if (limits.total) {
      data.levelIdValues.forEach(level => {
        let _numabl = Number(level.value);
        if (_numabl === _numabl) {
          _total = math.add(_total, _numabl);
        }
      });
      if (_total > limits.total) isOutTotalLimit = true;
    }
    return isOutTotalLimit;
  }
  onSubmit = () => {
    const { data, limits, type, editData } = this.props;
    const { newParameter } = this.state;
    const copyData = _.cloneDeep(newParameter);
    let _order = data.length - 1;
    _order = _order < 0 ? 0 : _order;
    const isError =
      copyData.levelIdValues.some(level => level.error) ||
      copyData.levelIdValues.every(level => level.value === 'NA');
    const isOutTotalLimit = this.outTotalLimit(copyData, limits || {});
    if (isOutTotalLimit) {
      Message.error(
        i18n[
          'settings.rebate_setting.number_limits_percent_total_warning'
        ].replace(/{total}/, limits.total)
      );
    }

    if (isError || isOutTotalLimit) return;

    // Add current order
    if (type === 'add') {
      copyData.priority = _order;
    }
    if (type === 'edit') {
      copyData.id = editData.id;
    }
    return copyData;
  };
  renderFormItem = parameterlevelList => {
    const { isPercentRule, limits, sortable } = this.props;
    const { newParameter } = this.state;
    let copyList = [];
    const formList = parameterlevelList.map((level, idx) => {
      return (
        <Form.Item>
          <Form.Label>{level.name}</Form.Label>
          <Form.Control
            errorMsg={
              newParameter.levelIdValues[idx].error
                ? !!limits
                  ? this.getLimitsErrorTip()
                  : i18n['settings.rebate_setting.number_error']
                : null
            }
          >
            <CheckboxInput
              showPercentUnit={isPercentRule}
              className={cs['text']}
              limits={limits}
              checked={newParameter.levelIdValues[idx].value !== 'NA'}
              value={
                newParameter.levelIdValues[idx].value === 'NA'
                  ? ''
                  : newParameter.levelIdValues[idx].value
              }
              onCheckboxChange={this.toggleInput.bind(this, idx)}
              onChange={this.onChange.bind(this, idx)}
            />
          </Form.Control>
        </Form.Item>
      );
    });
    copyList = formList;
    if (!sortable) {
      copyList.reverse();
    }
    const commentField = (
      <Form.Item>
        <Form.Label>
          {i18n['settings.rebate_setting.parameter_comment']}
        </Form.Label>
        <Form.Control>
          <Input
            maxLength={50}
            value={newParameter.comment}
            onChange={this.onCommentChange}
          />
        </Form.Control>
      </Form.Item>
    );
    const totalField = (
      <Form.Item>
        <Form.Label>{i18n['settings.rebate_setting.rebate_total']}</Form.Label>
        <Form.Control>
          <Input value={newParameter.rebateTotal} disabled />
        </Form.Control>
      </Form.Item>
    );
    return [...copyList, totalField, commentField];
  };
  render() {
    const { parameterlevelList } = this.props;
    return (
      <div className={cs.add_params_form}>
        <Form>{this.renderFormItem(parameterlevelList)}</Form>
      </div>
    );
  }
}
