import Table from 'components/Table';
import CheckboxInput from 'components/v2/CheckboxInput';
import i18n from 'utils/i18n';
import { FormattedMessage } from 'react-intl';
import math from 'utils/math';
import {
  Table as UiTable,
  Button,
  Icon,
  Message,
  Input,
  Dialog
} from 'lean-ui';
import cs from './ParameterSetting.less';
const proRightKey = 'SYSTEM_REBATE_AUTO-ADJUST';

export default class ParameterSetting extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      editingItem: {},
      isCreating: false,
      data: this.formatterData(props),
      newParameter: {
        ruleType: props.selected.ruleType,
        ruleId: props.selected.id,
        levelIdValues: this.formatterNewParameterLevelList(props)
      }
    };
  }

  componentWillReceiveProps(props) {
    this.setState({
      editingItem: {},
      isCreating: false,
      data: this.formatterData(props),
      newParameter: {
        ruleType: props.selected.ruleType,
        ruleId: props.selected.id,
        levelIdValues: this.formatterNewParameterLevelList(props)
      }
    });
  }

  formatterNewParameterLevelList = props => {
    const { parameterlevelList } = props;
    let result = [];

    parameterlevelList.forEach(level => {
      result.push({
        levelId: level.id,
        value: 'NA'
      });
    });

    return result;
  };

  formatterData = props => {
    const { data, parameterlevelList } = props;
    const copyData = JSON.parse(JSON.stringify(data));

    copyData.map(_data => {
      let result = [];

      for (let i = parameterlevelList.length; i--; ) {
        const level = parameterlevelList[i];
        const _level = _data.levelIdValues.find(
          _v => parseInt(_v.levelId) === parseInt(level.id)
        );
        const nextLevel = result.length ? result[0] : undefined;

        result.unshift({
          levelId: level.id,
          value: _level
            ? _level.value
            : nextLevel
              ? nextLevel.value === 'NA'
                ? 'NA'
                : 0
              : 'NA'
        });
      }

      _data.levelIdValues = result;

      return _data;
    });

    return copyData;
  };

  edit = item => {
    this.setState({
      editingItem: item,
      isCreating: false,
      newParameter: {
        ruleType: this.props.selected.ruleType,
        ruleId: this.props.selected.id,
        levelIdValues: this.formatterNewParameterLevelList(this.props)
      }
    });
    this.resetEditingItem();
  };

  new = () => {
    this.setState({
      editingItem: {},
      isCreating: true
    });
    this.resetEditingItem();
  };

  cancel = () => {
    this.setState({
      editingItem: {},
      isCreating: false,
      newParameter: {
        ruleType: this.props.selected.ruleType,
        ruleId: this.props.selected.id,
        levelIdValues: this.formatterNewParameterLevelList(this.props)
      }
    });
    this.resetEditingItem();
  };

  resetEditingItem = () => {
    this.setState({
      data: this.formatterData(this.props)
    });
  };

  toggleInput = (levelIdx, evt) => {
    const { newParameter } = this.state;
    const copyData = JSON.parse(JSON.stringify(newParameter));
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

    this.setState({
      newParameter: copyData
    });
  };

  onChange = (levelIdx, evt) => {
    const { newParameter } = this.state;
    const copyData = JSON.parse(JSON.stringify(newParameter));
    const regexp = /^\+?\d+(\.\d+)?$/;
    let value = evt.target.value;
    const isError = !regexp.test(value);

    if (!isError) {
      const dotIdx = value.indexOf('.');
      value = dotIdx === -1 ? value : value.substr(0, dotIdx + 4);
    }

    copyData.levelIdValues[levelIdx].value = value;
    copyData.levelIdValues[levelIdx].error = isError;

    this.setState({
      newParameter: copyData
    });
  };

  onCommentChange = evt => {
    const { newParameter } = this.state;
    const copyData = JSON.parse(JSON.stringify(newParameter));

    copyData.comment = evt.target.value;

    this.setState({
      newParameter: copyData
    });
  };

  toggleEditInput = (levelIdx, evt) => {
    const { editingItem, data } = this.state;
    const copyData = JSON.parse(JSON.stringify(data));
    const copyEditingItem = JSON.parse(JSON.stringify(editingItem));
    const checked = evt.target.checked;
    const startIdx = checked ? 0 : levelIdx;
    const endIdx = checked
      ? levelIdx + 1
      : copyEditingItem.levelIdValues.length;

    for (let i = startIdx; i < endIdx; i++) {
      copyEditingItem.levelIdValues[i].value = checked
        ? copyEditingItem.levelIdValues[i].value === 'NA'
          ? 0
          : copyEditingItem.levelIdValues[i].value
        : 'NA';
    }

    const idx = copyData.findIndex(
      _data => parseInt(_data.id) === parseInt(copyEditingItem.id)
    );

    copyData[idx] = copyEditingItem;

    this.setState({
      data: copyData,
      editingItem: copyEditingItem
    });
  };

  onEditChange = (levelIdx, evt) => {
    const { editingItem, data } = this.state;
    const copyData = JSON.parse(JSON.stringify(data));
    const copyEditingItem = JSON.parse(JSON.stringify(editingItem));
    const regexp = /^\+?\d+(\.\d+)?$/;
    let value = evt.target.value;
    const isError = !regexp.test(value);

    if (!isError) {
      const dotIdx = value.indexOf('.');
      value = dotIdx === -1 ? value : value.substr(0, dotIdx + 4);
    }

    copyEditingItem.levelIdValues[levelIdx].value = value;
    copyEditingItem.levelIdValues[levelIdx].error = isError;

    const idx = copyData.findIndex(
      _data => parseInt(_data.id) === parseInt(copyEditingItem.id)
    );

    copyData[idx] = copyEditingItem;

    this.setState({
      editingItem: copyEditingItem,
      data: copyData
    });
  };

  onEditCommentChange = evt => {
    const { editingItem, data } = this.state;
    const copyData = JSON.parse(JSON.stringify(data));
    const copyEditingItem = JSON.parse(JSON.stringify(editingItem));

    copyEditingItem.comment = evt.target.value;

    const idx = copyData.findIndex(
      _data => parseInt(_data.id) === parseInt(copyEditingItem.id)
    );

    copyData[idx] = copyEditingItem;

    this.setState({
      editingItem: copyEditingItem,
      data: copyData
    });
  };

  total = parameter => {
    const list = parameter.levelIdValues.filter(
      level => level.value !== 'NA' && !isNaN(parseFloat(level.value))
    );

    return list.length
      ? list
          .map(level => parseFloat(level.value))
          .reduce((p, n) => math.add(p, n))
      : 0;
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

  onSave = () => {
    const { onSave, data, limits } = this.props;
    const { newParameter } = this.state;
    const copyData = JSON.parse(JSON.stringify(newParameter));
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
    copyData.priority = _order;

    onSave(copyData);
  };

  onEditSave = () => {
    const { onEdit, data, limits } = this.props;
    const { editingItem } = this.state;
    const copyData = JSON.parse(JSON.stringify(editingItem));
    const exceptSelf = data.filter(item => item.id !== editingItem.id);

    // check duplication before save
    const isError =
      copyData.levelIdValues.some(level => level.error) ||
      copyData.levelIdValues.every(level => level.value === 'NA');
    // const isDuplicate = exceptSelf.some(item =>
    //   item.levelIdValues.every(level =>
    //     copyData.levelIdValues.some(
    //       _level =>
    //         level.levelId == _level.levelId && level.value == _level.value
    //     )
    //   )
    // );

    // 验证是否超出总数限制
    const isOutTotalLimit = this.outTotalLimit(copyData, limits || {});
    if (isOutTotalLimit) {
      Message.error(
        i18n[
          'settings.rebate_setting.number_limits_percent_total_warning'
        ].replace(/{total}/, limits.total)
      );
    }

    if (isError || isOutTotalLimit) return;
    onEdit(copyData);
  };

  remove = id => {
    const { onRemove } = this.props;

    onRemove(id);
  };

  onHide = () => {
    const { onHide } = this.props;

    onHide();
  };
  arrTans(arr, oldIndex, newIndex) {
    const oldId = arr[oldIndex];
    arr.splice(oldIndex, 1);
    arr.splice(newIndex, 0, oldId);
    return arr;
  }
  onSort = e => {
    const { changeRuleParamsPriority, getRuleDetail, selected } = this.props;
    const { data } = this.state;
    const { oldIndex, newIndex } = e;
    if (oldIndex !== newIndex) {
      const copyed = [].concat(data);
      const sorted = this.arrTans(copyed, oldIndex, newIndex);
      const sortedData = sorted.map((item, index) => ({
        id: item.id,
        priority: index
      }));
      // 进行排序数据请求
      changeRuleParamsPriority({
        data: sortedData
      }).then(({ result }) => {
        if (result) {
          // update 数据层
          getRuleDetail(selected.id);
        }
      });
    }
  };
  // 是否设置单位
  setUnit(num) {
    if (this.props.isPercentRule && !(num == 'NA' || num == 0))
      return num + '%';
    else return num;
  }
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
  render() {
    const {
      show,
      selected,
      parameterlevelList,
      isPercentRule,
      limits,
      userRights
    } = this.props;
    const { isCreating, data, newParameter, editingItem } = this.state;
    return (
      <Dialog
        title={
          <FormattedMessage
            id="settings.rebate_setting.edit_parameter_title"
            defaultMessage={
              i18n['settings.rebate_setting.edit_parameter_title']
            }
            values={{ name: selected.name }}
          />
        }
        visible={true}
        className={cs['parameter-modal']}
        onCancel={this.onHide}
        footer={
          data.length >= 200 ? (
            undefined
          ) : (
            <Button type="primary" onClick={this.new}>
              <Icon className="add-outline" />
              {i18n['settings.rebate_setting.add_parameter']}
            </Button>
          )
        }
      >
        <div className={cs['wrapper']}>
          <div className={cs['fixed-table']}>
            <Table hover={false}>
              <Table.Header>
                <th>
                  {isPercentRule
                    ? i18n['settings.rebate_setting.rebate_percent_total']
                    : i18n['settings.rebate_setting.rebate_total']}
                </th>
                <th>{i18n['settings.rebate_setting.parameter_comment']}</th>
                <th>{i18n['settings.rebate_setting.user_count']}</th>
                <th>{i18n['settings.rebate_setting.action']}</th>
              </Table.Header>
              <Table.Body>
                {data.map((parameter, idx) => {
                  const isEditing =
                    parseInt(parameter.id) === parseInt(editingItem.id);

                  return isEditing ? (
                    <tr key={parameter.id}>
                      <td>{this.setUnit(this.total(parameter))}</td>
                      <td>
                        <Input
                          onChange={this.onEditCommentChange}
                          value={parameter.comment}
                          maxLength={50}
                        />
                      </td>
                      <td>{parameter.userCount}</td>
                      <td>
                        <Button
                          type="primary"
                          icon="save-outline"
                          size="small"
                          fontType={'bw'}
                          onClick={this.onEditSave}
                        />
                        <Button
                          className={cs['btn-right']}
                          icon="reload"
                          onClick={this.cancel}
                          size="small"
                        />
                      </td>
                    </tr>
                  ) : (
                    <tr key={parameter.id}>
                      <td>{this.setUnit(this.total(parameter))}</td>
                      <td>{parameter.comment}</td>
                      <td>{parameter.userCount}</td>
                      <td>
                        <Button
                          type="primary"
                          icon="edit-outline"
                          size="small"
                          onClick={this.edit.bind(this, parameter)}
                        />
                        <Button
                          className={cs['btn-right']}
                          icon="delete-outline"
                          size="small"
                          onClick={this.remove.bind(this, parameter.id)}
                        />
                      </td>
                    </tr>
                  );
                })}
              </Table.Body>
              <Table.Body>
                {isCreating ? (
                  <tr>
                    <td>{this.setUnit(this.total(newParameter))}</td>
                    <td>
                      <Input
                        onChange={this.onCommentChange}
                        value={newParameter.comment}
                        maxLength={50}
                      />
                    </td>
                    <td>0</td>
                    <td>
                      <Button
                        type="primary"
                        icon="save-outline"
                        size="small"
                        fontType={'bw'}
                        onClick={this.onSave}
                      />
                      <Button
                        className={cs['btn-right']}
                        icon="reload"
                        size="small"
                        onClick={this.cancel}
                      />
                    </td>
                  </tr>
                ) : null}
              </Table.Body>
            </Table>
          </div>
          <div className={cs['table']}>
            <Table hover={false}>
              <Table.Header>
                <th>{i18n['general.sort']}</th>
                {parameterlevelList.map((level, idx) => {
                  return <th key={idx}>{level.name}</th>;
                })}
              </Table.Header>

              <Table.Body
                sortable
                sortConf={{ handle: '.sort-handle' }}
                onSort={this.onSort}
              >
                {data.map((parameter, idx) => {
                  const isEditing =
                    parseInt(parameter.id) === parseInt(editingItem.id);

                  return isEditing ? (
                    <tr key={parameter.id}>
                      <td>
                        <i className="fa fa-bars sort-handle" />
                      </td>
                      {parameterlevelList.map((level, _idx) => {
                        const _level = parameter.levelIdValues.find(
                          _v => parseInt(_v.levelId) === parseInt(level.id)
                        );

                        return (
                          <td
                            key={_idx}
                            className={_level.error ? 'has-error' : ''}
                          >
                            <CheckboxInput
                              showPercentUnit={isPercentRule}
                              limits={limits}
                              className={cs['text']}
                              checked={_level.value !== 'NA'}
                              value={_level.value === 'NA' ? '' : _level.value}
                              onCheckboxChange={this.toggleEditInput.bind(
                                this,
                                _idx
                              )}
                              onChange={this.onEditChange.bind(this, _idx)}
                            />
                            <div className={cs['help-text']}>
                              {!!limits
                                ? this.getLimitsErrorTip()
                                : i18n['settings.rebate_setting.number_error']}
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  ) : (
                    <tr key={parameter.id}>
                      <td>
                        <i className="fa fa-bars sort-handle" />
                      </td>
                      {parameterlevelList.map((level, _idx) => {
                        const _level = parameter.levelIdValues.find(
                          _v => parseInt(_v.levelId) === parseInt(level.id)
                        );

                        return <td key={_idx}>{this.setUnit(_level.value)}</td>;
                      })}
                    </tr>
                  );
                })}
              </Table.Body>
              <Table.Body>
                {isCreating ? (
                  <tr>
                    <td />
                    {parameterlevelList.map((level, idx) => {
                      return (
                        <td
                          key={level.id}
                          className={
                            newParameter.levelIdValues[idx].error
                              ? 'has-error'
                              : ''
                          }
                        >
                          <CheckboxInput
                            showPercentUnit={isPercentRule}
                            className={cs['text']}
                            limits={limits}
                            checked={
                              newParameter.levelIdValues[idx].value !== 'NA'
                            }
                            value={
                              newParameter.levelIdValues[idx].value === 'NA'
                                ? ''
                                : newParameter.levelIdValues[idx].value
                            }
                            onCheckboxChange={this.toggleInput.bind(this, idx)}
                            onChange={this.onChange.bind(this, idx)}
                          />
                          <div className={cs['help-text']}>
                            {!!limits
                              ? this.getLimitsErrorTip()
                              : i18n['settings.rebate_setting.number_error']}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ) : null}
              </Table.Body>
            </Table>
          </div>
        </div>
      </Dialog>
    );
  }
}
