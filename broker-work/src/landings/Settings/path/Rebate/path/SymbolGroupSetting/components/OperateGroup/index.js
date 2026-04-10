import Dropdown from 'components/v2/Dropdown';
import i18n from 'utils/i18n';
import {
  Table as UiTable,
  Dialog,
  Button,
  Input,
  Picklist,
  TreeSelect,
  Popover,
  Icon
} from 'lean-ui';
const { TreeNode } = TreeSelect;
import { EDIT_SYMBOL_GROUP_HEADER } from '../../constant';
const { Td, Th } = UiTable;
import cs from './OperateGroup.less';
import CustomField, { validate } from 'components/v2/CustomField';

const parseDropdownDataValue = data => {
  let result = [];
  data &&
    data.forEach(item => {
      result.push(item.value);
    });
  return result;
};
const parseDropdownData = (data, mt5) => {
  let copyData = data.concat();
  let result = {};

  copyData.forEach(_data => {
    if (!mt5 || (mt5 && _data.serverId !== mt5)) {
      result[_data.serverId] = _data.symbols.map(symbol => {
        return {
          label: symbol,
          value: symbol
        };
      });
    }
    if (mt5 && _data.serverId === mt5) {
      result[_data.serverId] = _data.symbols.map(symbol => {
        return {
          value: symbol
        };
      });
    }
  });
  return result;
};

const treeDataFilter = (selected, treeData) => {
  const end = [];
  _.forEach(treeData, t => {
    const d = _.cloneDeep(t);
    const selfInclude = _.includes(selected, d.path);
    if (!selfInclude) {
      if (d.children) {
        d.children = treeDataFilter(selected, d.children);
      }
      end.push(d);
    }
  });
  return end;
};
const mt5SymbolsFilter = (
  mt5Symbols,
  mt5ServerId,
  selectedGroup,
  groupList
) => {
  const otherSelectedMt5 = _.chain(groupList)
    .filter(g => (selectedGroup ? g.id !== selectedGroup.id : true)) //这里有 selectedGroup 是编辑，没有 selectedGroup 是新增所以不过滤了全部做互斥
    .map(g =>
      _.chain(g)
        .get('symbols')
        .find({ serverId: mt5ServerId })
        .get('symbols', [])
        .value()
    )
    .flatten()
    .value();

  const filterMt5Symbols = treeDataFilter(otherSelectedMt5, mt5Symbols);

  return { filterMt5Symbols, otherSelectedMt5 };
};
export default class OperateGroup extends PureComponent {
  constructor(props) {
    super(props);
    const { serverSymbols, mt5Symbols, data, groupList } = props;
    const mt5 = _.find(serverSymbols, { vendor: 'MT5' });
    let state = {
      nameError: false,
      symbolsError: false,
      data: props.data,
      treeData: []
    };
    if (mt5) {
      const selected = _.chain(data.symbols)
        .find({ serverId: mt5.serverId })
        .get('symbols', [])
        .value();
      this.mt5ServerId = mt5.serverId;
      const { filterMt5Symbols, otherSelectedMt5 } = mt5SymbolsFilter(
        mt5Symbols,
        mt5.serverId,
        data,
        groupList
      );
      Object.assign(state, {
        treeData: this.formatTreeData(
          filterMt5Symbols,
          _.union(selected, otherSelectedMt5)
        ),
        mt5Symbols: filterMt5Symbols,
        otherSelectedMt5
      });
    }
    state.options = parseDropdownData(serverSymbols, mt5 && mt5.serverId);
    this.state = state;
  }

  componentWillReceiveProps(props) {
    const { filterMt5Symbols, otherSelectedMt5 } = mt5SymbolsFilter(
      props.mt5Symbols,
      this.mt5ServerId,
      props.data,
      props.groupList
    );
    const selected = _.chain(props.data.symbols)
      .find({ serverId: this.mt5ServerId })
      .get('symbols', [])
      .value();

    const treeData = this.formatTreeData(
      filterMt5Symbols,
      _.union(selected, otherSelectedMt5)
    );
    this.setState({
      nameError: false,
      symbolsError: false,
      data: props.data,
      mt5Symbols: filterMt5Symbols,
      treeData,
      otherSelectedMt5
    });
  }

  setName = evt => {
    const { groupList } = this.props;
    const { nameError, data } = this.state;
    let copyData = Object.assign({}, data);

    copyData.name = evt.target.value;

    this.setState({
      data: copyData,
      nameError:
        nameError &&
        (!copyData.name ||
          groupList.some(
            group => group.name === copyData.name && group.id !== copyData.id
          ))
    });
  };
  // 这个是处理mt5选项减少
  onMt5Change = (server, selected, current) => {
    if (current.length < selected.length) {
      this.onSelect(server, current);
      this.onMt5ChangeTreeData(current);
    }
  };
  // 这个是处理mt5选项增加
  onMt5Select = (server, selected, current) => {
    const copyData = _.cloneDeep(selected);
    const curVal = current.value;
    if (selected.length) {
      _.forEach(selected, (s, index) => {
        const { value } = s;
        const compare = this.levelCompare(curVal, value);
        let include = false;
        if (compare === '>') {
          include = _.includes(curVal, value);
        }
        if (compare === '<') {
          include = _.includes(value, curVal);
        }
        if (include) {
          copyData.splice(index, 1);
        }
      });
    }
    const selectedEnd = [...copyData, current];
    this.onSelect(server, selectedEnd);
    this.onMt5ChangeTreeData(selectedEnd);
  };
  onMt5ChangeTreeData = selected => {
    const { mt5Symbols, otherSelectedMt5 } = this.state;
    const selectedEndVals = selected.map(s => s.value);
    const treeData = this.formatTreeData(
      mt5Symbols,
      _.union(otherSelectedMt5, selectedEndVals)
    );
    this.setState({
      treeData
    });
  };
  onSelect = (server, selected) => {
    const { symbolsError, data } = this.state;
    const copyData = JSON.parse(JSON.stringify(data));
    const { serverId, serverName, vendor } = server;
    const { symbols } = copyData;
    const existServerIdx = symbols.findIndex(
      symbol => parseInt(symbol.serverId) === parseInt(serverId)
    );
    const newSymbols = vendor === 'MT5' ? selected.map(s => s.value) : selected;

    if (existServerIdx !== -1) {
      if (newSymbols.length) {
        copyData.symbols[existServerIdx].symbols = newSymbols;
      } else {
        copyData.symbols.splice(existServerIdx, 1);
      }
    } else {
      if (newSymbols.length) {
        copyData.symbols.push({
          vendor,
          serverId,
          serverName,
          symbols: newSymbols
        });
      }
    }
    this.setState({
      data: copyData,
      symbolsError:
        symbolsError &&
        copyData.symbols.every(symbol => symbol.symbols.length === 0)
    });
  };

  onSave = () => {
    const { data } = this.state;
    const { onSave, groupList, serverSymbols } = this.props;
    const nameError =
      !data.name ||
      groupList.some(group => group.name === data.name && group.id !== data.id);
    const symbolsError = data.symbols.every(
      symbol => symbol.symbols.length === 0
    );

    if (nameError || symbolsError) {
      this.setState({
        nameError,
        symbolsError
      });

      return;
    }

    const copyData = JSON.parse(JSON.stringify(data));

    copyData.symbols = copyData.symbols.map(item => {
      const currentServer = serverSymbols.find(
        server => server.serverId === item.serverId
      );

      return {
        ...item,
        symbols: item.symbols.filter(symbol => {
          if (currentServer.vendor === 'MT5') return true;
          return currentServer.symbols.includes(symbol);
        })
      };
    });

    onSave(copyData);
  };

  onHide = () => {
    const { onHide } = this.props;

    this.setState({
      nameError: false,
      symbolsError: false
    });

    onHide();
  };
  levelCompare = (a, b) => {
    const aSplit = a.split('\\');
    const bSplit = b.split('\\');
    const aLen = aSplit.length;
    const bLen = bSplit.length;
    const aLevel = !aSplit[aLen - 1] ? aLen - 1 : aLen;
    const bLevel = !bSplit[bLen - 1] ? bLen - 1 : bLen;
    if (aLevel === bLevel) {
      return '=';
    }
    if (aLevel < bLevel) {
      return '<';
    }
    return '>';
  };
  // 给 mt5 指标树加 disable
  formatTreeData = (data, selected = []) => {
    return data.map(d => {
      let item = {
        label: d.symbolName,
        value: d.path,
        key: d.path
      };
      let disabled = false;
      for (let i = 0, l = selected.length; i < l; i++) {
        const sel = selected[i];
        const selLevel = sel.split('\\').length;
        const itemLevel = item.value.split('\\').length;
        const compare = this.levelCompare(sel, item.value);
        // 选中项是当前项的子孙
        if (compare === '<') {
          disabled = _.includes(item.value, sel);
          if (disabled) break;
        }
        // 选中项是当前项的parents
        if (compare === '>') {
          disabled = _.includes(sel, item.value);
          if (disabled) break;
        }
      }
      item.disabled = disabled;
      if (d.children) {
        item.children = this.formatTreeData(d.children, selected);
      }
      return item;
    });
  };
  render() {
    const { show, serverSymbols } = this.props;
    const { data, nameError, symbolsError, treeData, options } = this.state;
    let copyData = _.cloneDeep(data);
    const copyDataArr = [copyData];
    const dataServerSymbolsData = parseDropdownData(
      copyData.symbols,
      this.mt5ServerId
    );
    return (
      <Dialog
        title={
          !!copyData.id
            ? i18n['settings.rebate_setting.edit_symbol_group']
            : i18n['settings.rebate_setting.add_symbol_group']
        }
        visible={show}
        onCancel={this.onHide}
        className={cs['detail-body']}
        footer={
          <div>
            <Button type="primary" onClick={this.onSave}>
              {i18n['general.confirm']}
            </Button>
            <Button onClick={this.onHide}>{i18n['general.cancel']}</Button>
          </div>
        }
      >
        <div className="op-form">
          <div>
            <label>{i18n['settings.rebate_setting.symbol_group_name']}</label>
            <div className={nameError ? 'has-error' : ''}>
              <Input
                maxLength="40"
                value={copyData.name}
                onChange={this.setName}
                errorText={
                  nameError
                    ? data.name
                      ? i18n[
                          'settings.rebate_setting.symbol_group_name.duplicate_error'
                        ]
                      : i18n[
                          'settings.rebate_setting.symbol_group_name.null_error'
                        ]
                    : ''
                }
              />
            </div>
          </div>
          <header>{i18n['settings.rebate_setting.transaction_symbol']}</header>
          <div className={cs['symbol']}>
            {serverSymbols.map((server, idx) => {
              const val = dataServerSymbolsData[server.serverId]
                ? Array.isArray(dataServerSymbolsData[server.serverId])
                  ? dataServerSymbolsData[server.serverId]
                  : [dataServerSymbolsData[server.serverId]]
                : [];
              return (
                <div className={cs['item']}>
                  <label>
                    {server.serverName}:
                    {server.vendor === 'MT5' ? (
                      <Popover
                        placement="topRight"
                        trigger="click"
                        content={i18n['settings.rebate_setting.mt5_tips']}
                        overlayStyle={{
                          width: '430px'
                        }}
                        overlayClassName={cs.popoverStyle}
                      >
                        <Icon icon="question" className="main-color" />
                      </Popover>
                    ) : null}
                  </label>
                  
                  {server.vendor === 'MT5' ? (
                    <TreeSelect
                      treeData={treeData}
                      value={val}
                      treeCheckStrictly
                      dropdownStyle={{ maxHeight: 320, overflow: 'auto' }}
                      allowClear
                      treeDefaultExpandAll
                      multiple
                      treeCheckable
                      className={cs['tree-select']}
                      onSelect={this.onMt5Select.bind(this, server, val)}
                      onChange={this.onMt5Change.bind(this, server, val)}
                    />
                  ) : (
                    <Picklist
                      data={options[server.serverId]}
                      searchable
                      selectall={true}
                      selectallText={
                        i18n['general.date_range_picker.option.all']
                      }
                      className={
                        symbolsError
                          ? `has-error ${cs['dropdown']}`
                          : `${cs['dropdown']}`
                      }
                      defaultSelectedKeys={val.map(
                        item => `${item.value ? item.value : item}`
                      )}
                      onChange={this.onSelect.bind(this, server)}
                    />
                  )}
                </div>
              );
            })}
            <div className={cs['help-text']}>
              {i18n['settings.rebate_setting.transaction_symbol.null_error']}
            </div>
          </div>
        </div>
      </Dialog>
    );
  }
}
