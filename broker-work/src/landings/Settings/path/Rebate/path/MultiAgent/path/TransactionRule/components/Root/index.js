import OperateRule from '../OperateRule';
import DetailModal from '../DetailModal';
import CountSetting from '../CountSetting';
import PvmapSetting from '../../containers/PvmapSetting';
import ParameterSetting from '../../../../components/ParameterSetting';
import RealTimeRebate from '../../../../../RealTimeRebate';
import { Button, Icon, Message, Tooltip } from 'lean-ui';
import i18n from 'utils/i18n';
import { DEFAULT_RULE, TRANSACTION_RULE_HEADER } from '../../constant';
import CommonHeader from 'components/v2/CommonHeader';
import moment from 'moment';
import Table from 'components/v2/SortableTable';
import _ from 'lodash';

import cs from './TransactionRuleSetting.less';

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
                  <a href={`/usermgmt#/users/${user.userId}`} target="_blank">
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

export default class TransactionRuleSetting extends PureComponent {
  state = {
    showDetailModal: false,
    showOperateModal: false,
    showPvmapModal: false,
    showParameterModal: false,
    showOpenRealTimeConfirmModal: false,
    showCountSettingModal: false,
    updateTime: ''
  };

  componentDidMount() {
    const { getRuleList, getBasicResource, getPVmapList } = this.props;

    getBasicResource().then(() => {
      getRuleList().then(res => {
        if (res.result) {
          this.setState({
            updateTime: res.time
          });
        }
      });
      getPVmapList();
    });
  }

  toggleModal = (type, toggle, selected = DEFAULT_RULE) => {
    const { selectRule, getRuleDetail, getMinSeconds } = this.props;

    selectRule(selected);

    if (type === 'Parameter') {
      selected.id && getRuleDetail(selected.id);
    }
    if (type === 'CountSetting') {
      getMinSeconds().then(() => {
        this.setState({
          [`show${type}Modal`]: toggle
        });
      });
      return;
    }

    this.setState({
      [`show${type}Modal`]: toggle
    });
  };

  operateRule = rule => {
    const {
      createRule,
      updateRule,
      getRuleList,
      ruleList,
      showTipsModal,
      userRights
    } = this.props;
    let isCreate = false;
    const action = !!rule.id ? updateRule : ((isCreate = true), createRule);
    // 添加顺序字段
    if (isCreate) rule.priority = ruleList.length - 1;
    rule.priority = rule.priority > 0 ? rule.priority : 0;
    if (
      !rule.id &&
      rule.balanceLevelId &&
      userRights['SYSTEM_REBATE_AUTO-ADJUST']
    ) {
      showTipsModal({
        content: i18n['settings.rebate_setting.add_rule.auto_just.tip'],
        onConfirm: cb => {
          action(rule).then(res => {
            if (res.result) {
              getRuleList();
            }
            this.toggleModal('Operate', false);
          });
          cb();
        }
      });
      return;
    }
    action(rule).then(res => {
      if (res.result) {
        getRuleList();
      }
      this.toggleModal('Operate', false);
    });
  };

  showConfirmModal = selected => {
    const {
      showTipsModal,
      removeRule,
      getRuleList,
      checkRuleDetail,
      showTopAlert
    } = this.props;

    checkRuleDetail(selected.id).then(({ data }) => {
      showTipsModal({
        content: content(data),
        onConfirm: cb => {
          removeRule(selected.id).then(res => {
            if (res.result) {
              showTopAlert({
                bsStyle: 'success',
                content: i18n['settings.rebate_setting.remove_rule_success']
              });
              getRuleList();
            }
            cb();
          });
        }
      });
    });
  };

  onRemoveParameter = id => {
    const {
      showTipsModal,
      removeRuleDetail,
      getRuleDetail,
      selectedRule,
      checkParameter
    } = this.props;

    checkParameter(id).then(({ data }) => {
      showTipsModal({
        content: content(data),
        onConfirm: cb => {
          removeRuleDetail(id).then(res => {
            if (res.result) {
              Message.success(
                i18n['settings.rebate_setting.remove_rule_success']
              );
              getRuleDetail(selectedRule.id);
            }
            cb();
          });
        }
      });
    });
  };

  getLevelList = () => {
    const { levelList, selectedRule } = this.props;
    const endLevelIdx = levelList.findIndex(
      level => parseInt(level.id) === parseInt(selectedRule.balanceLevelId)
    );

    return selectedRule.balanceLevelId
      ? levelList.slice(0, endLevelIdx + 1)
      : levelList;
  };

  onSaveParameter = parameter => {
    const { createRuleDetail, getRuleDetail, selectedRule } = this.props;

    createRuleDetail(parameter).then(res => {
      res.result && getRuleDetail(selectedRule.id);
    });
  };

  onEditParameter = parameter => {
    const { updateRuleDetail, getRuleDetail, selectedRule } = this.props;

    updateRuleDetail(parameter).then(res => {
      res.result && getRuleDetail(selectedRule.id);
    });
  };
  saveMinSeconds = v => {
    const { saveMinSeconds, getMinSeconds } = this.props;
    saveMinSeconds(v).then(res => {
      if (res.result) {
        Message.success(i18n['general.save_success']);
        this.toggleModal('CountSetting', false, undefined);
      }
    });
  };
  gotoParamsSetting = item => {
    window.open(
      `/settings/rebate/transactionRuleSetting/rebateParams?id=${item.id}${
        item.balanceLevelId ? `&balanceLevelId=${item.balanceLevelId}` : ''
      }`
    );
  };
  renderMTGroupCell = (value, rowData) => {
    const { serverGroupList } = this.props;
    const copyData = _.cloneDeep(rowData);
    const serverGroupListContent =
      serverGroupList.length === 1
        ? copyData.mt4Groups[0].groups.length === 0
          ? i18n['settings.rebate_setting.all_group']
          : copyData.mt4Groups[0].groups &&
            copyData.mt4Groups[0].groups.join('， ')
        : copyData.mt4Groups &&
          copyData.mt4Groups
            .filter(group => parseInt(group.groups[0]) !== -1)
            .map((group, idx) => {
              return `${group.serverName}: ${
                group.groups.length === 0
                  ? i18n['settings.rebate_setting.all_group']
                  : group.groups.join('，')
              }`;
            });
    return (
      <div className={cs['ellipsis']} title={serverGroupListContent}>
        <a onClick={this.toggleModal.bind(this, 'Detail', true, copyData)}>
          {serverGroupListContent &&
          Array.isArray(serverGroupListContent) &&
          serverGroupListContent.length
            ? serverGroupListContent.join('，')
            : serverGroupListContent}
        </a>
      </div>
    );
  };
  renderActionCell = (value, rowData) => {
    return (
      <div className={cs['options']}>
        <Icon
          icon="edit-outline"
          className="main-color"
          onClick={this.toggleModal.bind(this, 'Operate', true, rowData)}
        />
        <Tooltip
          trigger="hover"
          placement="left"
          title={
            <div className={cs['ques-content']}>
              {i18n['settings.rebate_setting.parameter_setting']}
            </div>
          }
        >
          <div style={{ display: 'inline-block' }}>
            <Icon
              icon="set-outline"
              className="main-color"
              onClick={this.gotoParamsSetting.bind(this, rowData)}
            />
          </div>
        </Tooltip>
        <Icon
          icon="delete-outline"
          className="main-color"
          onClick={this.showConfirmModal.bind(this, rowData)}
        />
      </div>
    );
  };
  configColumns = () => {
    const {
      balanceType,
      levelList,
      balanceUnit,
      accountList,
      groupList
    } = this.props;
    const columns = [
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
        title: i18n['settings.rebate_setting.rule_name'],
        key: 'name',
        fixed: 'left',
        width: 130,
        dataIndex: 'name'
      },
      {
        title: i18n['settings.rebate_setting.mt_group'],
        key: 'mt_group',
        render: (value, rowData) => {
          return this.renderMTGroupCell(value, rowData);
        }
      },
      {
        title: i18n['settings.rebate_setting.account_group'],
        key: 'account_group',
        render: (value, rowData) => {
          const accountContent = !rowData.accountGroups
            ? i18n['settings.rebate_setting.all_account']
            : rowData.accountGroups
                .split(',')
                .map(accountId => {
                  const _account = accountList.find(
                    account => parseInt(account.id) === parseInt(accountId)
                  );
                  return _account
                    ? _account.groupName
                    : i18n['settings.rebate_setting.account_error'];
                })
                .join(', ');
          return (
            <div className={cs['ellipsis']} title={accountContent}>
              {accountContent}
            </div>
          );
        }
      },
      {
        title: i18n['settings.rebate_setting.symbol_group'],
        key: 'symbol_group',
        render: (value, rowData) => {
          const symbolContent = !rowData.symbolGroups
            ? i18n['settings.rebate_setting.all_symbol']
            : rowData.symbolGroups
                .split(',')
                .map(groupId => {
                  const _group = groupList.find(
                    group => parseInt(group.id) === parseInt(groupId)
                  );
                  return _group
                    ? _group.name
                    : i18n['settings.rebate_setting.symbol_error'];
                })
                .join(', ');
          return (
            <div className={cs['ellipsis']} title={symbolContent}>
              {symbolContent}
            </div>
          );
        }
      },
      {
        title: i18n['settings.rebate_setting.balance_type'],
        key: 'balance_type',
        render: (value, rowData) => {
          return (
            balanceType.find(
              type => parseInt(type.value) === parseInt(rowData.balanceType)
            ) || {}
          ).label;
        }
      },
      {
        title: i18n['settings.rebate_setting.balance_unit'],
        key: 'balance_unit',
        render: (value, rowData) => {
          return (
            balanceUnit.find(
              unit => parseInt(unit.value) === parseInt(rowData.balanceUnit)
            ) || {}
          ).label;
        }
      },
      {
        title: i18n['settings.rebate_setting.balance_level'],
        key: 'balance_level',
        render: (value, rowData) => {
          return rowData.balanceLevelId !== undefined
            ? (
                levelList.find(
                  level =>
                    parseInt(level.id) === parseInt(rowData.balanceLevelId)
                ) || {}
              ).name
            : '';
        }
      },
      {
        title: i18n['settings.rebate_setting.user_count'],
        key: 'user_count',
        render: (value, rowData) => {
          return rowData.userCount;
        }
      },
      {
        title: i18n['settings.rebate_setting.action'],
        key: 'action',
        fixed: 'right',
        width: 100,
        className: cs['operate_td'],
        render: (value, rowData) => {
          return this.renderActionCell(value, rowData);
        }
      }
    ];
    return columns;
  };
  moveRow = (dragIndex, hoverIndex) => {
    const { ruleList, changeRulePriority, getRuleList } = this.props;
    let copyData = _.cloneDeep(ruleList);
    const dragRow = ruleList[dragIndex];
    copyData.splice(dragIndex, 1);
    copyData.splice(hoverIndex, 0, dragRow);
    const sortedData = copyData.map((item, index) => ({
      id: item.id,
      priority: index
    }));
    // 进行排序数据请求
    changeRulePriority({
      data: sortedData
    }).then(({ result }) => {
      if (result) {
        // update 数据层
        getRuleList();
      }
    });
  };
  render() {
    const {
      ruleList,
      groupList,
      accountList,
      serverGroupList,
      balanceType,
      balanceUnit,
      levelList,
      selectedRule,
      ruleDetail,
      minSeconds,
      versionRights,
      userRights,
      ...props
    } = this.props;
    const {
      showOperateModal,
      showDetailModal,
      showPvmapModal,
      showParameterModal,
      showCountSettingModal,
      updateTime
    } = this.state;
    const parameterlevelList = this.getLevelList();
    // 去重
    // const parsedMT4Groups = this.parseMT4Groups(ruleList, serverGroupList, selectedRule);
    const columns = this.configColumns();
    let limit = 200;
    // pro 版本 500 条
    if (versionRights['BW_COMISSION_EXPAND']) {
      limit = 500;
    }
    return (
      <div>
        <CommonHeader
          total={ruleList.length}
          time={moment(updateTime).format('YYYY-MM-DD HH:mm')}
          menus={[
            { value: i18n['page.title.settings'] },
            { value: i18n['settings.left_menu.rebate_setting'] },
            { value: i18n['settings.left_menu.rebate_setting.level_setting'] }
          ]}
          title={
            i18n[
              'settings.left_menu.rebate_setting.sub_menu.transaction_rule_setting'
            ]
          }
        >
          <div className={`pull-right ${cs['action-area']}`}>
            {ruleList.length < limit ? (
              <Button
                type="primary"
                className={cs['btn-right']}
                onClick={this.toggleModal.bind(
                  this,
                  'Operate',
                  true,
                  undefined
                )}
              >
                <Icon icon="add-outline" />
                {i18n['settings.rebate_setting.add_rule']}
              </Button>
            ) : null}
            <div className={cs.operate_btn}>
              <RealTimeRebate ruleList={ruleList} />
              <Button
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
              <Button
                className={cs['btn-right']}
                onClick={this.toggleModal.bind(this, 'Pvmap', true, undefined)}
              >
                {i18n['settings.rebate_setting.pvmap_setting']}
              </Button>
            </div>
          </div>
        </CommonHeader>
        <Table
          columns={columns}
          data={ruleList}
          scroll={{ x: 1300 }}
          moveRow={this.moveRow}
          align="left"
        />
        {showDetailModal ? (
          <DetailModal
            data={selectedRule}
            show={showDetailModal}
            onHide={this.toggleModal.bind(this, 'Detail', false, undefined)}
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
        {showOperateModal ? (
          <OperateRule
            data={selectedRule}
            show={showOperateModal}
            ruleList={ruleList}
            groupList={groupList}
            accountList={accountList}
            serverGroupList={serverGroupList}
            balanceType={balanceType}
            balanceUnit={balanceUnit}
            levelList={levelList}
            onSave={this.operateRule}
            onHide={this.toggleModal.bind(this, 'Operate', false, undefined)}
          />
        ) : (
          undefined
        )}

        {showPvmapModal ? (
          <PvmapSetting
            show={showPvmapModal}
            onHide={this.toggleModal.bind(this, 'Pvmap', false, undefined)}
          />
        ) : (
          undefined
        )}
        {showParameterModal ? (
          <ParameterSetting
            {...props}
            userRights={userRights}
            data={ruleDetail}
            selected={selectedRule}
            show={showParameterModal}
            parameterlevelList={parameterlevelList}
            onEdit={this.onEditParameter}
            onSave={this.onSaveParameter}
            onRemove={this.onRemoveParameter}
            onHide={this.toggleModal.bind(this, 'Parameter', false, undefined)}
          />
        ) : (
          undefined
        )}
      </div>
    );
  }
}
