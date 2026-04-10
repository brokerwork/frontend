import i18n from 'utils/i18n';
import {
  Table as UiTable,
  Button,
  Dialog,
  Checkbox,
  Select,
  Picklist
} from 'lean-ui';
const { Td, Th } = UiTable;

import cs from './OperateRule.less';

const parseDropdownData = (data, labelKey, valueKey) => {
  const copyData = data.concat();

  return copyData.map(_data => {
    return {
      label: _data[labelKey] || '',
      value: _data[valueKey]
    };
  });
};
const parseDropdownDataValue = data => {
  let result = [];
  data &&
    data.forEach(item => {
      result.push(item.value);
    });
  return result;
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
      data: this.formatterData(props)
    };
  }

  componentWillReceiveProps(props) {
    this.setState({
      nameError: false,
      mt4GroupsError: false,
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
    const { accountList, commissionType, balanceUnit, levelList } = this.props;
    const copyData = JSON.parse(JSON.stringify(data));

    copyData.accountGroups = !copyData.accountGroups
      ? undefined
      : copyData.accountGroups
          .split(',')
          .filter(accountId =>
            accountList.find(account => account.id == accountId)
          )
          .map(accountId => {
            return {
              label:
                accountList.find(
                  account => parseInt(account.id) === parseInt(accountId)
                ).groupName || '',
              value: accountId
            };
          });
    copyData.mt4Groups = parseDropdownDataList(copyData.mt4Groups);
    copyData.commissionType = commissionType.find(
      type => parseInt(type.value) === parseInt(copyData.commissionType)
    );
    copyData.balanceType = balanceUnit.find(
      unit => parseInt(unit.value) === parseInt(copyData.balanceType)
    );
    copyData.balanceLevelId = parseDropdownData(levelList, 'name', 'id').find(
      level => parseInt(level.value) === parseInt(copyData.balanceLevelId)
    );

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

  select = (type, isSingle, key, selected) => {
    const { data } = this.state;
    const copyData = JSON.parse(JSON.stringify(data));

    copyData[type] = isSingle
      ? selected.value
      : selected.map(item => item.value).join(',');

    this.setState({
      data: copyData
    });
  };

  selectMt4Groups = (server, key, selected) => {
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

  onSave = () => {
    const { data } = this.state;
    const copyData = JSON.parse(JSON.stringify(data));
    const { onSave, serverGroupList, ruleList } = this.props;
    const nameError =
      !copyData.name ||
      ruleList.some(
        rule => rule.name === copyData.name && rule.id !== copyData.id
      );
    const mt4GroupsError = copyData.mt4Groups.every(
      group => parseInt(group.groups[0]) === -1
    );

    if (nameError || mt4GroupsError) {
      this.setState({
        nameError,
        mt4GroupsError
      });

      return;
    }

    copyData.mt4Groups = copyData.mt4Groups.map(item => {
      const currentServer = serverGroupList.find(
        server => server.serverId === item.serverId
      );
      return {
        ...item,
        groups: item.groups.filter(group => {
          return currentServer.groups.includes(group) || group === '-1';
        })
      };
    });

    onSave(copyData);
  };

  onHide = () => {
    const { onHide } = this.props;

    onHide();
  };

  render() {
    const copyData = this.parseData(this.state.data);
    const isEditing = copyData.id !== undefined;
    const {
      accountList,
      serverGroupList,
      commissionType,
      balanceUnit,
      levelList
    } = this.props;
    const { nameError, mt4GroupsError } = this.state;
    const accountListDropdownData = parseDropdownData(
      accountList,
      'groupName',
      'id'
    );
    const serverGroupListDropdownData = parseDropdownDataList(serverGroupList);
    const levelListDropdownData = parseDropdownData(levelList, 'name', 'id');
    console.log(
      'serverGroupListDropdownData',
      serverGroupListDropdownData,
      serverGroupList,
      copyData.mt4Groups
    );
    const singleServerValue = copyData.mt4Groups[serverGroupList[0].serverId];
    return (
      <Dialog
        title={
          isEditing
            ? i18n['settings.rebate_setting.edit_rule']
            : i18n['settings.rebate_setting.add_rule']
        }
        visible={true}
        className={cs['pvmap-modal']}
        onCancel={this.onHide}
        footer={
          <div>
            <Button type="primary" onClick={this.onSave}>
              {i18n['general.confirm']}
            </Button>
            <Button onClick={this.onHide}>{i18n['general.cancel']}</Button>
          </div>
        }
      >
        <div className={cs['title']}>
          {i18n['settings.rebate_setting.rule_name']}
        </div>
        <div className={nameError ? 'has-error' : ''}>
          <input
            type="text"
            className={`form-control ${cs['text']}`}
            maxLength="40"
            value={copyData.name}
            onChange={this.setName}
          />
          <div className={cs['help-text']}>
            {copyData.name
              ? i18n['settings.rebate_setting.rule_name.duplicate_error']
              : i18n['settings.rebate_setting.rule_name.null_error']}
          </div>
        </div>
        <div className={cs['title']}>
          {i18n['settings.rebate_setting.mt_group']}
        </div>
        <div
          className={`${cs['mt-group']} ${mt4GroupsError ? 'has-error' : ''}`}
        >
          {serverGroupList.length === 1 ? (
            <Picklist
              className={cs['dropdown']}
              data={serverGroupListDropdownData[serverGroupList[0].serverId]}
              defaultSelectedKeys={
                Array.isArray(singleServerValue)
                  ? singleServerValue.map(d => d.value)
                  : []
              }
              placeholder={i18n['settings.rebate_setting.all_group']}
              disabled={
                serverGroupList[0].enable === false ||
                parseInt(singleServerValue) === -1
              }
              onChange={this.selectMt4Groups.bind(this, serverGroupList[0])}
              searchable
            />
          ) : (
            <div className={cs['dropdown-group']}>
              {serverGroupList.map((server, idx) => {
                const isEnabled =
                  parseInt(copyData.mt4Groups[server.serverId]) !== -1;
                const placeholder = isEnabled
                  ? i18n['settings.rebate_setting.all_group']
                  : i18n['settings.rebate_setting.null'];
                const defaultGroups =
                  copyData.mt4Groups[server.serverId] === -1
                    ? -1
                    : parseDropdownDataValue(
                        copyData.mt4Groups[server.serverId]
                      );
                return (
                  <div key={idx}>
                    <div className={cs['title']}>
                      <Checkbox
                        checked={isEnabled}
                        onChange={this.toggleMt4Groups.bind(
                          this,
                          server.serverId
                        )}
                      >
                        {server.serverName}:{' '}
                      </Checkbox>
                    </div>
                    <div>
                      <Picklist
                        className={cs['dropdown']}
                        data={serverGroupListDropdownData[server.serverId]}
                        defaultSelectedKeys={!isEnabled ? [] : defaultGroups}
                        disabled={!isEnabled}
                        placeholder={placeholder}
                        onChange={this.selectMt4Groups.bind(this, server)}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          <div className={cs['help-text']}>
            {i18n['settings.rebate_setting.mt_group.error']}
          </div>
        </div>
        <div className={cs['flex-wrap']}>
          <div>
            <div className={cs['title']}>
              {i18n['settings.rebate_setting.account_group']}
            </div>
            <div>
              <Picklist
                className={cs['dropdown']}
                defaultSelectedKeys={
                  copyData.accountGroups && copyData.accountGroups !== undefined
                    ? parseDropdownDataValue(copyData.accountGroups)
                    : []
                }
                data={accountListDropdownData}
                onChange={this.select.bind(this, 'accountGroups', false)}
                placeholder={i18n['settings.rebate_setting.all_account']}
              />
            </div>
          </div>
          <div>
            <div className={cs['title']}>
              {i18n['settings.rebate_setting.commission_type']}
            </div>
            <div>
              <Select
                className={cs['dropdown']}
                value={copyData.commissionType && copyData.commissionType.value}
                onSelect={this.select.bind(this, 'commissionType', true)}
              >
                {commissionType.map(d => {
                  return (
                    <Select.Option key={d.value} value={d.value}>
                      {d.label}
                    </Select.Option>
                  );
                })}
              </Select>
            </div>
          </div>
          <div>
            <div className={cs['title']}>
              {i18n['settings.rebate_setting.balance_unit']}
            </div>
            <div>
              <Select
                value={copyData.balanceType && copyData.balanceType.value}
                className={cs['dropdown']}
                onSelect={this.select.bind(this, 'balanceType', true)}
                placeholder={i18n['general.default_select']}
              >
                {balanceUnit.map(d => (
                  <Select.Option key={d.value} value={d.value}>
                    {d.label}
                  </Select.Option>
                ))}
              </Select>
            </div>
          </div>
          <div>
            <div className={cs['title']}>
              {i18n['settings.rebate_setting.balance_level']}
            </div>
            <div>
              <Select
                value={copyData.balanceLevelId && copyData.balanceLevelId.value}
                className={cs['dropdown']}
                onSelect={this.select.bind(this, 'balanceLevelId', true)}
                disabled={isEditing}
              >
                {levelListDropdownData.map(d => (
                  <Select.Option key={d.value} value={d.value}>
                    {d.label}
                  </Select.Option>
                ))}
              </Select>
            </div>
          </div>
        </div>
      </Dialog>
    );
  }
}
