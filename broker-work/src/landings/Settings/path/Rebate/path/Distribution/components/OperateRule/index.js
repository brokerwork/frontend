import Modal from 'components/Modal';
import Dropdown from 'components/Dropdown';
import Checkbox from 'components/Checkbox';
import Table from 'components/Table';
import { FormattedMessage } from 'react-intl';
import i18n from 'utils/i18n';
import cs from './OperateRule.less';
import NumberInput from 'components/NumberInput';

const parseDropdownData = (data, labelKey, valueKey) => {
  const copyData = data.concat();

  return copyData.map(_data => {
    return {
      label: _data[labelKey] || '',
      value: _data[valueKey]
    };
  });
};

const parseDropdownDataList = data => {
  const copyData = data.concat();
  let result = {};

  copyData.forEach(_data => {
    result[_data.serverId] =
      parseInt(_data.groups[0]) === -1
        ? -1
        : _data.groups.map(group => {
            return {
              label: group,
              value: group
            };
          });
  });

  return result;
};

export default class OperateRule extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      nameError: false,
      mt4GroupsError: false,
      levelsError: false,
      data: this.formatterData(props)
    };
  }

  componentWillReceiveProps(props) {
    this.setState({
      nameError: false,
      mt4GroupsError: false,
      levelsError: false,
      data: this.formatterData(props)
    });
  }

  formatterData = props => {
    const { data, serverGroupList } = props;
    const copyData = JSON.parse(JSON.stringify(data));
    const isEditing = copyData.id !== undefined;

    serverGroupList.forEach(server => {
      if (
        !copyData.mt4Groups.find(
          group => parseInt(group.serverId) === parseInt(server.serverId)
        )
      ) {
        copyData.mt4Groups.push({
          serverId: server.serverId,
          serverName: server.serverName,
          groups: isEditing ? ['-1'] : []
        });
      }
    });

    return copyData;
  };

  parseData = data => {
    const {
      groupList,
      accountList,
      balanceType,
      balanceUnit,
      cycleLevelList
    } = this.props;
    const copyData = JSON.parse(JSON.stringify(data));

    copyData.symbolGroups = !copyData.symbolGroups
      ? undefined
      : copyData.symbolGroups.split(',').map(symbolId => {
          return {
            label: groupList.find(group => group.id == symbolId).name,
            value: symbolId
          };
        });
    copyData.accountGroups = !copyData.accountGroups
      ? undefined
      : copyData.accountGroups
          .split(',')
          .filter(accountId =>
            accountList.some(account => account.id == accountId)
          )
          .map(accountId => {
            return {
              label:
                accountList.find(account => account.id == accountId)
                  .groupName || '',
              value: accountId
            };
          });
    copyData.mt4Groups = parseDropdownDataList(copyData.mt4Groups);
    copyData.balanceType = balanceType.find(
      type => type.value == copyData.balanceType
    );
    copyData.balanceUnit = balanceUnit.find(
      unit => unit.value == copyData.balanceUnit
    );
    // copyData.cycleLevel = cycleLevelList.find(
    //   level => level.value == copyData.cycleLevel
    // );

    return copyData;
  };

  setName = evt => {
    const { data, nameError } = this.state;
    const { ruleList } = this.props;
    const copyData = JSON.parse(JSON.stringify(data));

    copyData.name = evt.target.value;

    this.setState({
      data: copyData,
      nameError:
        nameError &&
        (!copyData.name ||
          ruleList.some(
            rule => rule.name === copyData.name && rule.id !== copyData.id
          ))
    });
  };

  select = (type, isSingle, selected) => {
    const { data } = this.state;
    const copyData = JSON.parse(JSON.stringify(data));

    copyData[type] = isSingle
      ? selected.value
      : selected.map(item => item.value).join(',');

    this.setState({
      data: copyData
    });
  };

  selectMt4Groups = (server, selected) => {
    const { data } = this.state;
    const copyData = JSON.parse(JSON.stringify(data));
    const idx = copyData.mt4Groups.findIndex(
      group => parseInt(group.serverId) === parseInt(server.serverId)
    );

    copyData.mt4Groups[idx].groups = selected.map(item => item.value);

    this.setState({
      data: copyData
    });
  };

  toggleMt4Groups = (serverId, evt) => {
    const { data } = this.state;
    const copyData = JSON.parse(JSON.stringify(data));
    const checked = evt.target.checked;

    copyData.mt4Groups.find(
      group => parseInt(group.serverId) === parseInt(serverId)
    ).groups = checked ? [] : ['-1'];

    this.setState({
      data: copyData,
      mt4GroupsError: false
    });
  };

  setCycleLevel = value => {
    const { data } = this.state;
    const copyData = JSON.parse(JSON.stringify(data));

    copyData.cycleLevel = value;

    this.setState({
      data: copyData
    });
  };
  getMaxCycleLevel = v => {
    const { brandInfo } = this.props;
    const tenantId = brandInfo.tenantId;
    if (`${tenantId}` === 'T001861' && v === 2) {
      return 50;
    } else return 3;
  };
  onSave = () => {
    const { data } = this.state;
    const copyData = JSON.parse(JSON.stringify(data));
    const { onSave, ruleList, modeValue } = this.props;
    const nameError =
      !copyData.name ||
      ruleList.some(
        rule => rule.name === copyData.name && rule.id !== copyData.id
      );
    const mt4GroupsError = copyData.mt4Groups.every(
      group => parseInt(group.groups[0]) === -1
    );
    const levelsError =
      copyData.cycleLevel <= 0 ||
      copyData.cycleLevel > this.getMaxCycleLevel(modeValue);

    if (nameError || mt4GroupsError || levelsError) {
      this.setState({
        nameError,
        mt4GroupsError,
        levelsError
      });

      return;
    }
    onSave(copyData);
  };

  onHide = () => {
    const { onHide } = this.props;

    onHide();
  };

  render() {
    const {
      show,
      groupList,
      accountList,
      serverGroupList,
      balanceType,
      balanceUnit,
      modeValue,
      cycleLevelList
    } = this.props;
    const { nameError, mt4GroupsError, levelsError } = this.state;
    const groupListDropdownData = parseDropdownData(groupList, 'name', 'id');
    const accountListDropdownData = parseDropdownData(
      accountList,
      'groupName',
      'id'
    );
    const serverGroupListDropdownData = parseDropdownDataList(serverGroupList);
    const copyData = this.parseData(this.state.data);
    const isEditing = copyData.id !== undefined;
    const maxLevel = this.getMaxCycleLevel(modeValue);
    return (
      <Modal
        backdrop="static"
        bsSize="large"
        show={show}
        onHide={this.onHide}
        className={cs['modal']}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {isEditing
              ? i18n['settings.rebate_setting.edit_rule']
              : i18n['settings.rebate_setting.add_rule']}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className={cs['body']}>
          <Table className={cs['table']}>
            <Table.Header>
              <th>{i18n['settings.rebate_setting.rule_name']}</th>
              <th>{i18n['settings.rebate_setting.symbol_group']}</th>
              <th width="200">
                {i18n['settings.rebate_setting.account_group']}
              </th>
              <th width="200">{i18n['settings.rebate_setting.mt_group']}</th>
              <th width="200">{i18n['settings.rebate_setting.cycle_level']}</th>
              <th width="100">
                {i18n['settings.rebate_setting.balance_type']}
              </th>
              <th width="100">
                {i18n['settings.rebate_setting.balance_unit']}
              </th>
            </Table.Header>
            <Table.Body>
              <tr>
                <td className={nameError ? 'has-error' : ''}>
                  <input
                    type="text"
                    className={`form-control ${cs['text']}`}
                    maxLength="40"
                    value={copyData.name}
                    onChange={this.setName}
                  />
                  <div className={cs['help-text']}>
                    {copyData.name
                      ? i18n[
                          'settings.rebate_setting.rule_name.duplicate_error'
                        ]
                      : i18n['settings.rebate_setting.rule_name.null_error']}
                  </div>
                </td>
                <td>
                  <Dropdown
                    className={cs['dropdown']}
                    data={groupListDropdownData}
                    value={copyData.symbolGroups}
                    placeholder={i18n['settings.rebate_setting.all_symbol']}
                    checkbox
                    onSelect={this.select.bind(this, 'symbolGroups', false)}
                  />
                </td>
                <td>
                  <Dropdown
                    className={cs['dropdown']}
                    data={accountListDropdownData}
                    value={copyData.accountGroups}
                    placeholder={i18n['settings.rebate_setting.all_account']}
                    checkbox
                    onSelect={this.select.bind(this, 'accountGroups', false)}
                  />
                </td>
                <td className={mt4GroupsError ? 'has-error' : ''}>
                  {serverGroupList.length === 1 ? (
                    <Dropdown
                      className={cs['dropdown']}
                      data={
                        serverGroupListDropdownData[serverGroupList[0].serverId]
                      }
                      value={copyData.mt4Groups[serverGroupList[0].serverId]}
                      placeholder={i18n['settings.rebate_setting.all_group']}
                      onSelect={this.selectMt4Groups.bind(
                        this,
                        serverGroupList[0]
                      )}
                      checkbox
                    />
                  ) : (
                    <table className={cs['dropdown-group']}>
                      <tbody>
                        {serverGroupList.map((server, idx) => {
                          const isEnabled =
                            parseInt(copyData.mt4Groups[server.serverId]) !==
                            -1;
                          const placeholder = isEnabled
                            ? i18n['settings.rebate_setting.all_group']
                            : i18n['settings.rebate_setting.null'];

                          return (
                            <tr key={idx} title={server.title ? server.title : ''}>
                              <td>
                                <Checkbox
                                  checked={server.enable === false ? false : isEnabled}
                                  disabled={server.enable === false}
                                  onChange={this.toggleMt4Groups.bind(
                                    this,
                                    server.serverId
                                  )}
                                >
                                  {server.serverName}:{' '}
                                </Checkbox>
                              </td>
                              <td>
                                <Dropdown
                                  className={cs['dropdown']}
                                  data={
                                    serverGroupListDropdownData[server.serverId]
                                  }
                                  value={
                                    !isEnabled
                                      ? []
                                      : copyData.mt4Groups[server.serverId]
                                  }
                                  disabled={server.enable === false || !isEnabled}
                                  checkbox
                                  placeholder={placeholder}
                                  onSelect={this.selectMt4Groups.bind(
                                    this,
                                    server
                                  )}
                                />
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  )}
                  <div className={cs['help-text']}>
                    {i18n['settings.rebate_setting.mt_group.error']}
                  </div>
                </td>
                <td className={levelsError ? 'has-error' : ''}>
                  {/* <Dropdown
                    className={cs['dropdown']}
                    data={cycleLevelList}
                    value={copyData.cycleLevel}
                    onSelect={this.select.bind(this, 'cycleLevel', true)}
                  /> */}
                  <NumberInput
                    value={copyData.cycleLevel}
                    nonDecimal="{1,2}"
                    decimal="{0,0}"
                    onChange={this.setCycleLevel}
                    onBlur={this.setCycleLevel}
                    disabled={isEditing}
                  />
                  <div className={cs['help-text']}>
                    <FormattedMessage
                      id="setting.rebate_setting.distribution.level_error"
                      defaultMessage={
                        i18n['setting.rebate_setting.distribution.level_error']
                      }
                      values={{ maxLevel }}
                    />
                  </div>
                </td>
                <td>
                  <Dropdown
                    className={cs['dropdown']}
                    data={balanceType}
                    value={copyData.balanceType}
                    onSelect={this.select.bind(this, 'balanceType', true)}
                  />
                </td>
                <td>
                  <Dropdown
                    className={cs['dropdown']}
                    data={balanceUnit}
                    value={copyData.balanceUnit}
                    onSelect={this.select.bind(this, 'balanceUnit', true)}
                  />
                </td>
              </tr>
            </Table.Body>
          </Table>
        </Modal.Body>
        <Modal.Footer>
          <button
            type="button"
            className="btn btn-primary"
            onClick={this.onSave}
          >
            {i18n['general.confirm']}
          </button>
          <button
            type="button"
            className="btn btn-default"
            onClick={this.onHide}
          >
            {i18n['general.cancel']}
          </button>
        </Modal.Footer>
      </Modal>
    );
  }
}
