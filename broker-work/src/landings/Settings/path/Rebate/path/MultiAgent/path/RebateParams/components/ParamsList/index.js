import { PureComponent } from 'react';
import { Icon, Button, Input } from 'lean-ui';
import i18n from 'utils/i18n';
import Table from 'components/v2/SortableTable';
import cs from './index.less';
import math from 'utils/math';
import OptionItem from '../OptionItem';
import CheckboxInput from 'components/v2/CheckboxInput';

import _ from 'lodash';
export default class ParamsList extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      data: this.formatterData(props),
      leftShadow: true,
      rightShadow: true,
      isEdit: false,
      editingItem: null,
      originEditItem: null
    };
  }
  componentWillReceiveProps(props) {
    this.setState({
      data: this.formatterData(props)
    });
  }
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
  // 是否设置单位
  setUnit(num) {
    if (this.props.isPercentRule && !(num == 'NA' || num == 0))
      return num + '%';
    else return num;
  }
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
  arrTans(arr, oldIndex, newIndex) {
    const oldId = arr[oldIndex];
    arr.splice(oldIndex, 1);
    arr.splice(newIndex, 0, oldId);
    return arr;
  }
  onSort = e => {
    const {
      changeRuleParamsPriority,
      getRuleDetail,
      selected,
      getRuleList
    } = this.props;
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
          getRuleList(selected.id);
        }
      });
    }
  };
  options = new Set([]);
  getOptionItemRefs = r => {
    if (!r) {
      return;
    }

    this.options.add(r);
  };
  onRemoveOptionRef = ref => {
    this.options.delete(ref);
  };
  // 单个操作的地方
  onActionsSelect = (item, { key }) => {
    const { openEditModal, onRemove, openConditionSetting } = this.props;
    switch (key) {
      case 'edit':
        // openEditModal(item);
        this.onEditParams(item);
        break;
      case 'delete':
        onRemove(item.id);
        break;
      case 'paramsSetting':
        openConditionSetting(item);
        break;
    }
  };
  // 编辑操作
  onEditParams = item => {
    const copyItem = _.cloneDeep(item);
    this.setState({
      originEditItem: copyItem,
      editingItem: item,
      isEdit: true
    });
  };
  renderCondition = param => {
    return (
      param.params &&
      param.params.map((item, key) => (
        <span key={item.key}>
          {item.min}
          {item.min && '≤'}
          {
            i18n[
              `settings.rebate_setting.params_setting.conditon_setting.${
                item.key
              }`
            ]
          }
          {item.max && '<'}
          {item.max}
          {key < param.params.length - 1 && (
            <span style={{ margin: '0 3px' }}>
              {
                i18n[
                  `${
                    param.logicType === 'AND'
                      ? 'advanced_search.tabs.and'
                      : 'advanced_search.tabs.or'
                  }`
                ]
              }
            </span>
          )}
        </span>
      ))
    );
  };
  cancel = id => {
    const { originEditItem, data } = this.state;
    const copyData = _.cloneDeep(data);
    const idx = copyData.findIndex(
      _data => parseInt(_data.id) === parseInt(id)
    );

    copyData[idx] = originEditItem;
    this.setState({
      isEdit: false,
      data: copyData,
      editingItem: null,
      originEditItem: null
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
  onSave = async () => {
    const { limits, onSave, getRuleList, selected } = this.props;
    const copyData = this.state.editingItem;
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
    const { result } = await onSave(copyData, 'edit');
    if (result) {
      getRuleList(selected.id);
      this.setState({
        isEdit: false,
        editingItem: null,
        originEditItem: null
      });
    }
  };
  isEditOperation = row => {
    const { isEdit, editingItem } = this.state;
    if (row && editingItem) {
      return row.id === editingItem.id && isEdit;
    } else {
      return false;
    }
  };
  toggleEditInput = (levelIdx, evt) => {
    const { editingItem, data } = this.state;
    const copyData = _.cloneDeep(data);
    const copyEditingItem = _.cloneDeep(editingItem);
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
    const copyData = _.cloneDeep(data);
    const copyEditingItem = _.cloneDeep(editingItem);
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
  onEditComment = e => {
    const { editingItem, data } = this.state;
    const copyData = _.cloneDeep(data);
    const copyEditingItem = _.cloneDeep(editingItem);
    copyEditingItem.comment = e.target.value;
    const idx = copyData.findIndex(
      _data => parseInt(_data.id) === parseInt(copyEditingItem.id)
    );
    copyData[idx] = copyEditingItem;
    this.setState({
      editingItem: copyEditingItem,
      data: copyData
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
  configColumns = () => {
    const {
      parameterlevelList,
      isPercentRule,
      params,
      autoAjustRight,
      balanceLevelId,
      limits
    } = this.props;
    const { isEdit, editingItem } = this.state;
    const columnsOne = [
      {
        title: i18n['general.index'],
        key: 'index',
        fixed: 'left',
        width: 50,
        render: (value, row, index) => {
          return index + 1;
        }
      },
      {
        title: i18n['general.sort'],
        key: 'sort',
        fixed: 'left',
        width: 50,
        render: () => (
          <Icon fontType="bw" icon="drag" className={cs['light_color']} />
        )
      },
      {
        title: i18n['settings.rebate_setting.action'],
        key: 'action',
        fixed: 'left',
        width: 100,
        render: (value, row) => {
          return this.isEditOperation(row) ? (
            <div>
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
                onClick={this.cancel.bind(this, row.id)}
              />
            </div>
          ) : (
            <OptionItem
              balanceLevelId={balanceLevelId}
              ref={this.getOptionItemRefs}
              onActionsSelect={this.onActionsSelect.bind(this, row)}
              onRemoveRef={this.onRemoveOptionRef}
              params={params}
              autoAjustRight={autoAjustRight}
            />
          );
        }
      },
      {
        title: i18n['settings.rebate_setting.user_count'],
        dataIndex: 'userCount',
        key: 'userCount'
      }
    ];
    const columns = parameterlevelList.map((level, _idx) => {
      return {
        title: level.name,
        key: level.id,
        render: (value, row) => {
          const _level = row.levelIdValues.find(
            _v => parseInt(_v.levelId) === parseInt(level.id)
          );
          return this.isEditOperation(row) ? (
            <div className={_level.error ? 'has-error' : ''}>
              <CheckboxInput
                showPercentUnit={isPercentRule}
                limits={limits}
                className={cs['text']}
                checked={_level.value !== 'NA'}
                value={_level.value === 'NA' ? '' : _level.value}
                onCheckboxChange={this.toggleEditInput.bind(this, _idx)}
                onChange={this.onEditChange.bind(this, _idx)}
              />
              <div className={cs['help-text']}>
                {!!limits
                  ? this.getLimitsErrorTip()
                  : i18n['settings.rebate_setting.number_error']}
              </div>
            </div>
          ) : (
            <span>{_level.value}</span>
          );
        }
      };
    });
    const columnsRight = [
      {
        title: isPercentRule
          ? i18n['settings.rebate_setting.rebate_percent_total']
          : i18n['settings.rebate_setting.rebate_total'],
        key: 'total',
        render: (value, row) => {
          return this.setUnit(this.total(row));
        }
      },
      {
        title: i18n['settings.rebate_setting.parameter_comment'],
        dataIndex: 'comment',
        key: 'comment',
        width: 150,
        fixed: 'right',
        render: (value, row, index) => {
          return this.isEditOperation(row) ? (
            <Input value={value} onChange={this.onEditComment} />
          ) : (
            value
          );
        }
      }
    ];
    if (autoAjustRight && !balanceLevelId) {
      columnsRight.splice(1, 0, {
        title: i18n['settings.rebate_setting.parameter_condition'],
        key: 'condition',
        render: (value, row) => {
          return row.param && this.renderCondition(row.param);
        }
      });
    }
    return [...columnsOne, ...columns, ...columnsRight];
  };

  moveRow = (dragIndex, hoverIndex) => {
    const {
      changeRuleParamsPriority,
      getRuleDetail,
      selected,
      getRuleList
    } = this.props;
    const { data } = this.state;
    let copyData = _.cloneDeep(data);
    const dragRow = data[dragIndex];
    copyData.splice(dragIndex, 1);
    copyData.splice(hoverIndex, 0, dragRow);
    const sortedData = copyData.map((item, index) => ({
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
        getRuleList(selected.id);
      }
    });
  };
  render() {
    const { data, editingItem } = this.state;
    const columns = this.configColumns();
    // 350 4
    // const scrollX = columns.length * 100 < 1500 ? 1500 : columns.length * 100;
    const scrollX = (columns.length - 4) * 100 - 350;
    return (
      <div>
        <div className={cs['wrapper']}>
          <Table
            columns={columns}
            data={data}
            scroll={{ x: scrollX }}
            moveRow={this.moveRow}
            align="center"
            rowClass={cs.table_row_style}
            editingItem={editingItem}
          />
        </div>
      </div>
    );
  }
}
