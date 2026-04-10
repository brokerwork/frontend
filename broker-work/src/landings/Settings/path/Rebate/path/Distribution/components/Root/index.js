import Table from 'components/Table';
import OperateRule from '../OperateRule';
import DetailModal from '../DetailModal';
import CountSetting from '../CountSetting';
import ModeSelect from './ModeSelect';
import PvmapSetting from '../../../MultiAgent/path/TransactionRule/containers/PvmapSetting';
import DistributionParameterSetting from '../../containers/DistributionParameterSetting';
import DistributionParameterSetting2 from '../../containers/DistributionParameterSetting2';
import i18n from 'utils/i18n';
import { DEFAULT_DISTRIBUTION_RULE, SERVERGROUPFILTER } from '../../constant';
import RealTimeRebate from '../../../RealTimeRebate';
import { deepCopy } from 'utils/simpleDeepCopy';
import { Message } from 'lean-ui';
import cs from './DistributionRuleSetting.less';
import { Button, Icon } from 'lean-ui';

export default class DistributionRuleSetting extends PureComponent {
  state = {
    showDetailModal: false,
    showOperateModal: false,
    showParameterModal: false,
    showPvmapModal: false,
    showCountSettingModal: false,
    serverGroupList: []
  };

  componentDidMount() {
    const {
      getRuleList,
      getDistributionBasicResource,
      getPVmapList
    } = this.props;

    getDistributionBasicResource().then(() => {
      this.getRuleListByType();
      getPVmapList();
    });
  }

  toggleModal = (type, toggle, selected) => {
    const { selectRule, getMinSeconds } = this.props;
    if (type === 'CountSetting') {
      getMinSeconds().then(() => {
        this.setState({
          [`show${type}Modal`]: toggle
        });
      });
      return;
    }
    Promise.resolve(selectRule(selected)).then(() => {
      this.setState({
        [`show${type}Modal`]: toggle
      });
    });
  };

  // 适配模式二新增的BalanceType
  getMode2BalanceType(isMode2) {
    const { getDistributionMode2BalanceType } = this.props;
    getDistributionMode2BalanceType(isMode2);
  }

  getRuleListByType = v => {
    const { getRuleList, selectedRule = {} } = this.props;
    const ruleType = v || selectedRule['ruleType'];
    const isMode2 = ruleType == 4;
    this.getMode2BalanceType(isMode2);
    this.filterServerGroup(isMode2);
    return getRuleList(v || ruleType);
  };

  operateRule = rule => {
    const { createRule, updateRule, getRuleList, ruleList } = this.props;
    let isCreate = false;
    const action = !!rule.id ? updateRule : ((isCreate = true), createRule);
    // 添加顺序字段
    if (isCreate) rule.priority = ruleList.length - 1;
    rule.priority = rule.priority > 0 ? rule.priority : 0;
    action(rule).then(res => {
      if (res.result) {
        this.getRuleListByType();
      }
      this.toggleModal('Operate', false);
    });
  };

  showConfirmModal = selected => {
    const {
      showTipsModal,
      removeRule,
      getRuleList,
      checkRuleDetail
    } = this.props;
    const content = userList => {
      return (
        <div>
          {userList.length ? (
            <div>
              <p>{i18n['settings.rebate_setting.check_rule.tips_title']}</p>
              <p>
                {userList.map((user, idx) => {
                  return [
                    idx === 0 ? '' : ', ',
                    user.edit ? (
                      <a
                        href={`/usermgmt#/users/${user.userId}`}
                        target="_blank"
                      >
                        {user.name}
                      </a>
                    ) : (
                      <span>{user.name}</span>
                    )
                  ];
                })}
              </p>
              <p>{i18n['settings.rebate_setting.check_rule.tips_confirm']}</p>
            </div>
          ) : (
            i18n['general.confirm_remove']
          )}
        </div>
      );
    };

    checkRuleDetail(selected.id).then(({ data }) => {
      showTipsModal({
        content: content(data),
        onConfirm: cb => {
          removeRule(selected.id).then(res => {
            if (res.result) {
              Message.success(
                i18n['settings.rebate_setting.remove_rule_success']
              );
              this.getRuleListByType();
            }
            cb();
          });
        }
      });
    });
  };

  parseMT4Groups = (ruleList, serverGroups, selected) => {
    let copyData = JSON.parse(JSON.stringify(serverGroups));
    const copyRuleServerGroups = JSON.parse(JSON.stringify(ruleList))
      .filter(rule => parseInt(rule.id) !== parseInt(selected.id))
      .map(rule => rule.mt4Groups);

    copyData = copyData.map(server => {
      copyRuleServerGroups.forEach(ruleServerGroups => {
        const existServerGroups = ruleServerGroups.find(
          group => parseInt(group.serverId) === parseInt(server.serverId)
        );

        if (existServerGroups) {
          server.groups = server.groups.filter(
            group => !existServerGroups.groups.some(_group => _group === group)
          );
        }
      });

      return server;
    });

    return copyData;
  };

  _renderTableRow = (item, idx) => {
    const {
      groupList,
      accountList,
      serverGroupList,
      balanceType,
      balanceUnit,
      cycleLevelList
    } = this.props;

    return (
      <tr key={item.id}>
        <td>
          <i className="fa fa-bars sort-handle" />
        </td>
        <td>{item.name}</td>
        <td>
          {!item.symbolGroups
            ? i18n['settings.rebate_setting.all_symbol']
            : item.symbolGroups
                .split(',')
                .map(groupId => {
                  const _group = groupList.find(
                    group => parseInt(group.id) === parseInt(groupId)
                  );
                  return _group
                    ? _group.name
                    : i18n['settings.rebate_setting.symbol_error'];
                })
                .join(', ')}
        </td>
        <td>
          {!item.accountGroups
            ? i18n['settings.rebate_setting.all_account']
            : item.accountGroups
                .split(',')
                .map(accountId => {
                  const _account = accountList.find(
                    account => parseInt(account.id) === parseInt(accountId)
                  );
                  return _account
                    ? _account.groupName
                    : i18n['settings.rebate_setting.account_error'];
                })
                .join(', ')}
        </td>
        <td>
          {serverGroupList.length === 1 ? (
            <a onClick={this.toggleModal.bind(this, 'Detail', true, item)}>
              {item.mt4Groups[0].groups.length === 0
                ? i18n['settings.rebate_setting.all_group']
                : item.mt4Groups[0].groups.join(', ')}
            </a>
          ) : (
            <a onClick={this.toggleModal.bind(this, 'Detail', true, item)}>
              {item.mt4Groups
                .filter(group => parseInt(group.groups[0]) !== -1)
                .map((group, idx) => {
                  return (
                    <span key={idx}>
                      {idx !== 0 ? ',  ' : ''}
                      <strong>{group.serverName}</strong>:{' '}
                      {group.groups.length === 0
                        ? i18n['settings.rebate_setting.all_group']
                        : group.groups.join(', ')}
                    </span>
                  );
                })}
            </a>
          )}
        </td>
        <td>{item.cycleLevel}</td>
        <td>
          {
            (
              balanceType.find(
                type => parseInt(type.value) === parseInt(item.balanceType)
              ) || {}
            ).label
          }
        </td>
        <td>
          {
            (
              balanceUnit.find(
                unit => parseInt(unit.value) === parseInt(item.balanceUnit)
              ) || {}
            ).label
          }
        </td>
        <td>
          <Button
            type="primary"
            icon="edit-outline"
            size="small"
            onClick={this.toggleModal.bind(this, 'Operate', true, item)}
          />
          <Button
            type="primary"
            className="icon"
            size="small"
            className={cs['btn-right']}
            onClick={this.toggleModal.bind(this, 'Parameter', true, item)}
          >
            {i18n['settings.rebate_setting.parameter_setting']}
          </Button>
          <Button
            icon="delete-outline"
            size="small"
            className={cs['btn-right']}
            onClick={this.showConfirmModal.bind(this, item)}
          />
        </td>
      </tr>
    );
  };

  arrTans(arr, oldIndex, newIndex) {
    const oldId = arr[oldIndex];
    arr.splice(oldIndex, 1);
    arr.splice(newIndex, 0, oldId);
    return arr;
  }
  onSort = e => {
    const { ruleList, changeRulePriority } = this.props;
    const { oldIndex, newIndex } = e;
    if (oldIndex !== newIndex) {
      const copyed = [].concat(ruleList);
      const sorted = this.arrTans(copyed, oldIndex, newIndex);
      const sortedData = sorted.map((item, index) => ({
        id: item.id,
        priority: index
      }));
      // 进行排序数据请求
      changeRulePriority({
        data: sortedData
      }).then(({ result }) => {
        if (result) {
          // update 数据层
          this.getRuleListByType();
        }
      });
    }
  };
  // Sort End
  modeChangeConfirm = (v, state) => {
    const { showTipsModal } = this.props;
    showTipsModal({
      header: i18n['settings.rebate_setting.distribution.modeChangeTitle'],
      content: i18n['settings.rebate_setting.distribution.modeChangeContent'],
      onConfirm: cb => {
        cb();
        this.onModeChange(v, state);
      }
    });
  };

  onModeChange = (v, state) => {
    let { updateSelectedRule, switchRuleType, selectedRule } = this.props;
    selectedRule = Object.assign({}, selectedRule, { ruleType: v });
    switchRuleType(v, selectedRule);
    this.getRuleListByType(v);
  };

  // 筛选当前模块可以使用的serverSymbols
  filterServerGroup(isMode2) {
    const { serverGroupList } = this.props;
    const copyList = deepCopy(serverGroupList);
    this.setState({
      serverGroupList: !isMode2
        ? copyList
        : copyList.filter(server => {
            return SERVERGROUPFILTER.some(_server => {
              if (_server.vendor == server.vendor) {
                server.enable = _server.enable;
                server.title = _server.title;
                return true;
              } else return false;
            });
          })
    });
  }
  saveMinSeconds = v => {
    const { saveMinSeconds, getMinSeconds } = this.props;
    saveMinSeconds(v).then(res => {
      if (res.result) {
        Message.success(i18n['general.save_success']);
        this.toggleModal('CountSetting', false, undefined);
      }
    });
  };

  render() {
    const {
      ruleList,
      groupList,
      accountList,
      balanceType,
      balanceUnit,
      cycleLevelList,
      selectedRule,
      realTimeStatus,
      submitForm,
      brandInfo,
      distributionCommissionTypeList,
      distributionPipCommissionTypeList,
      minSeconds
    } = this.props;
    const {
      showOperateModal,
      showDetailModal,
      showParameterModal,
      showPvmapModal,
      serverGroupList,
      showCountSettingModal
    } = this.state;
    const modeValue = selectedRule['ruleType'];
    return (
      <div>
        <ModeSelect value={modeValue} onChange={this.modeChangeConfirm} />
        <Table className="ellipsis">
          <Table.Header>
            <th>{i18n['general.sort']}</th>
            <th>{i18n['settings.rebate_setting.rule_name']}</th>
            <th>{i18n['settings.rebate_setting.symbol_group']}</th>
            <th>{i18n['settings.rebate_setting.account_group']}</th>
            <th>{i18n['settings.rebate_setting.mt_group']}</th>
            <th>{i18n['settings.rebate_setting.cycle_level']}</th>
            <th>{i18n['settings.rebate_setting.balance_type']}</th>
            <th>{i18n['settings.rebate_setting.balance_unit']}</th>
            <th>{i18n['settings.rebate_setting.action']}</th>
          </Table.Header>
          <Table.Body
            sortable
            sortConf={{ handle: '.sort-handle' }}
            onSort={this.onSort}
          >
            {ruleList.map(this._renderTableRow)}
          </Table.Body>
        </Table>
        <div className="actions-bar text-right clearfix">
          <RealTimeRebate ruleType={modeValue} />
          <Button
            type="primary"
            className={cs['btn-right']}
            onClick={this.toggleModal.bind(
              this,
              'CountSetting',
              true,
              undefined
            )}
          >
            {i18n['settings.rebate_setting.count_setting_title']}
          </Button>
          {/* 仅模式二可用 */}
          {modeValue === 4 ? (
            <Button
              type="primary"
              className={cs['btn-right']}
              onClick={this.toggleModal.bind(this, 'Pvmap', true, undefined)}
            >
              {i18n['settings.rebate_setting.pvmap_setting']}
            </Button>
          ) : null}
          {ruleList.length >= 200 ? (
            undefined
          ) : (
            <Button
              type="primary"
              className={cs['btn-right']}
              onClick={this.toggleModal.bind(this, 'Operate', true, undefined)}
            >
              <Icon icon="add-outline" />
              {i18n['settings.rebate_setting.add_rule']}
            </Button>
          )}
        </div>
        <DetailModal
          data={selectedRule}
          show={showDetailModal}
          onHide={this.toggleModal.bind(this, 'Detail', false, undefined)}
        />
        {showPvmapModal ? (
          <PvmapSetting
            onHide={this.toggleModal.bind(this, 'Pvmap', false, undefined)}
          />
        ) : (
          undefined
        )}
        {showCountSettingModal ? (
          <CountSetting
            data={minSeconds}
            onSave={this.saveMinSeconds}
            onHide={this.toggleModal.bind(
              this,
              'CountSetting',
              false,
              undefined
            )}
          />
        ) : (
          undefined
        )}

        <OperateRule
          modeValue={modeValue}
          data={selectedRule}
          show={showOperateModal}
          ruleList={ruleList}
          groupList={groupList}
          accountList={accountList}
          serverGroupList={serverGroupList}
          balanceType={balanceType}
          brandInfo={brandInfo}
          balanceUnit={balanceUnit}
          cycleLevelList={cycleLevelList}
          submitForm={submitForm}
          onSave={this.operateRule}
          onHide={this.toggleModal.bind(this, 'Operate', false, undefined)}
        />
        {showParameterModal &&
          (modeValue === 2 ? (
            <DistributionParameterSetting
              onHide={this.toggleModal.bind(
                this,
                'Parameter',
                false,
                undefined
              )}
            />
          ) : (
            <DistributionParameterSetting2
              onHide={this.toggleModal.bind(
                this,
                'Parameter',
                false,
                undefined
              )}
              distributionCommissionTypeList={distributionCommissionTypeList}
              distributionPipCommissionTypeList={
                distributionPipCommissionTypeList
              }
              balanceType={
                balanceType.filter(
                  balance => balance.value === selectedRule.balanceType
                )[0]
              }
            />
          ))}
      </div>
    );
  }
}
