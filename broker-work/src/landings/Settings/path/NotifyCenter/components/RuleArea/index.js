import React, { PureComponent } from 'react';
import { Icon, Button, Table } from 'lean-ui';
import UpdateNotification from '../../containers/UpdateNotification';
import UpdateTrader from '../../containers/UpdateTrader';
import cs from './RuleArea.less';
import i18n from 'utils/i18n';
import { getUserRight, saveUserRight } from 'utils/userRight';
import { FormattedMessage } from 'react-intl';
import {
  TRADER_TYPE_OPTIONS,
  TRADER_TYPE_MAP,
  LOGIC_SILENT_MAP
} from '../UpdateTrader/constants';
import {
  NOTIFY_TASK_TYPE,
  NOTIFY_TASK_CONTENT,
  NOTIFY_WAY
} from '../../../../constant';

export default class RuleArea extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      showUpdateRuleModal: false,
      type: '',
      currentRule: {},
      addTraderRule: false,
      traderType: '',
      currentTraderRule: {},
      ...this.processData(props)
    };
  }

  processData = props => {
    const {
      systemSettings: { rules = [] }
    } = props;

    const data = [];
    const traderData = [];
    rules.forEach(el => {
      const { type } = el;
      if (type === 'CUSTOMER_REVISIT') {
        return;
      }
      if (type.startsWith('TRADER_')) {
        traderData.push(el);
      } else {
        data.push(el);
      }
    });
    const existTypes = new Set(traderData.map(el => el.type));
    return { data, traderData, existTypes };
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.systemSettings !== this.props.systemSettings) {
      this.setState({ ...this.processData(nextProps) });
    }
  }

  toggleModal = (type, toggle, item) => {
    // 如果是交易者通知类型，走另一个方法
    if (item && item.type.indexOf('TRADER') !== -1) {
      this.onToggleTraderModal(type, item, true);
      return;
    }
    this.setState({
      showUpdateRuleModal: toggle,
      type: type,
      currentRule: item
    });
  };
  updateRole = data => {
    const { addRule, editRule, showTopAlert } = this.props;
    const { type, traderType, addTraderRule } = this.state;
    if (type === 'Add' || (addTraderRule && traderType === 'Add')) {
      addRule(data).then(res => {
        if (res.result) {
          showTopAlert({
            bsStyle: 'success',
            content: i18n['general.create_success']
          });
          this.toggleModal('', false, undefined);
          this.onToggleTraderModal(type, undefined, false);
        }
      });
    } else {
      editRule(data).then(res => {
        if (res.result) {
          showTopAlert({
            bsStyle: 'success',
            content: i18n['general.modify_success']
          });
          this.toggleModal('', false, undefined);
          this.onToggleTraderModal(type, undefined, false);
        }
      });
    }
  };
  deleteRule = item => {
    const { deleteRule, showTopAlert, showTipsModal } = this.props;
    showTipsModal({
      content: i18n['settings.notify_center.remove_tips'],
      onConfirm: cb => {
        deleteRule(item).then(res => {
          if (res.result) {
            showTopAlert({
              bsStyle: 'success',
              content: i18n['general.remove_success']
            });
            cb();
            this.toggleModal(undefined, false, undefined);
          }
        });
      }
    });
  };
  getNoticeType = data => {
    let noticeType = [];
    data &&
      data.forEach((item, index) => {
        noticeType.push(NOTIFY_WAY.find(ob => ob.value === item).label);
      });
    return noticeType.join(',');
  };
  getRole = roles => {
    const { roleOptions } = this.props;
    let copyRole = [];
    roles &&
      roles.forEach((item, index) => {
        let role = roleOptions.find(ob => `${ob.value}` === `${item}`) || {};
        copyRole.push(role.label && role.label);
      });

    return (
      copyRole.join(',') || i18n['report.download_tips_modal.summary_user']
    );
  };

  getRuleDetail = ({ type, ruleDetail = {} }) => {
    switch (type) {
      case 'TRADER_MARGIN_LEVEL':
        const { ratioType, unifiedRatio } = ruleDetail;
        return ratioType === 'unify' ? (
          <FormattedMessage
            id="settings.update_notify.rule.margin_level"
            defaultMessage={i18n['settings.update_notify.rule.margin_level']}
            values={{ unifiedRatio }}
          />
        ) : (
          i18n['settings.notify_center.setScale.group']
        );
      case 'TRADER_OPEN_DEMO':
        const { registerTimeScope } = ruleDetail;
        return (
          <FormattedMessage
            id="settings.update_notify.rule.open_demo"
            defaultMessage={i18n['settings.update_notify.rule.open_demo']}
            values={{ day: registerTimeScope }}
          />
        );
      case 'TRADER_OPEN_REAL':
        const logicType =
          i18n[`settings.update_notify.rule.logic.${ruleDetail.logicType}`];
        return (
          <FormattedMessage
            id="settings.update_notify.rule.open_rule"
            defaultMessage={i18n['settings.update_notify.rule.open_rule']}
            values={{
              ...ruleDetail,
              logicType
            }}
          />
        );
      case 'TRADER_OPEN_REAL_FORM':
        return i18n['settings.update_notify.rule.open_real_form'];
      case 'TRADER_SILENT_CLIENT':
        const condition = LOGIC_SILENT_MAP[ruleDetail.condition];
        return (
          <FormattedMessage
            id="settings.update_notify.rule.silent_client"
            defaultMessage={i18n['settings.update_notify.rule.silent_client']}
            values={{ ...ruleDetail, condition }}
          />
        );
      default:
        break;
    }
    return null;
  };
  _renderTableRow = ({ key, rowData, data, index }) => {
    const item = rowData || {};
    let d = null;
    switch (key) {
      case 'type':
        const t = NOTIFY_TASK_TYPE.find(ob => ob.value === item.type);
        d = t && t.label;
        break;
      case 'amount':
        d = (
          <FormattedMessage
            id="settings.notify_task.withdrawal"
            defaultMessage={NOTIFY_TASK_CONTENT[item.type && item.type]}
            values={{
              amount: <div className={cs['remain-blank']} />
            }}
          />
        );
        break;
      case 'ruleType':
        d = TRADER_TYPE_MAP[rowData.type];
        break;
      case 'ruleDetail':
        d = this.getRuleDetail(rowData);
        break;
      case 'roles':
        d = this.getRole(item.roles && item.roles);
        break;
      case 'noticeType':
        d = this.getNoticeType(item.noticeType && item.noticeType);
        break;
      case 'notificationFrequency':
        d = data ? (
          data === 'Once' ? (
            <div>{i18n['settings.update_notify.rate.only_once']}</div>
          ) : (
            <FormattedMessage
              id="settings.update_notify.rule.notificationFrequency"
              defaultMessage={
                i18n['settings.update_notify.rule.notificationFrequency']
              }
              values={{ day: rowData.notificationInterval }}
            />
          )
        ) : (
          '——'
        );
        break;
      case 'operation':
        d = (
          <div className={cs['operation']}>
            <span title={i18n['general.edit']}>
              <Icon
                className={`${cs['operationIcon']} main-color`}
                icon="edit-outline"
                onClick={this.toggleModal.bind(this, 'Edit', true, item)}
              />
            </span>
            <span title={i18n['general.delete']}>
              <Icon
                icon="delete-outline"
                className={`${cs['operationIcon']} main-color`}
                onClick={this.deleteRule.bind(this, item)}
              />
            </span>
          </div>
        );
        break;
    }
    return <Table.Td>{d}</Table.Td>;
  };
  columns = [
    { name: i18n['settings.notify_rule_area.header_type'], key: 'type' },
    { name: i18n['settings.update_nofity.rule_label'], key: 'amount' },
    { name: i18n['settings.update_nofity.available_role'], key: 'roles' },
    { name: i18n['settings.update_nofity.notify_way'], key: 'noticeType' },
    { name: i18n['settings.notify_rule_area.header_action'], key: 'operation' }
  ];
  traderColumns = [
    { name: i18n['settings.notify_rule_area.header_type'], key: 'ruleType' },
    { name: i18n['settings.update_nofity.rule_label'], key: 'ruleDetail' },
    { name: i18n['settings.update_notify.rate'], key: 'notificationFrequency' },
    { name: i18n['settings.update_nofity.available_role'], key: 'roles' },
    { name: i18n['settings.update_nofity.notify_way'], key: 'noticeType' },
    { name: i18n['settings.notify_rule_area.header_action'], key: 'operation' }
  ];
  onClose = () => {
    this.setState({
      addTraderRule: false,
      currentTraderRule: {}
    });
  };
  onToggleTraderModal = (type, item = {}, open) => {
    let currentTraderRule = { ...item };
    if (type === 'Add') {
      currentTraderRule = {
        type: 'TRADER_MARGIN_LEVEL'
      };
    }
    currentTraderRule.roles = ['all'];
    this.setState({
      addTraderRule: open,
      traderType: type,
      currentTraderRule
    });
  };
  render() {
    const {
      showUpdateRuleModal,
      type,
      currentRule,
      addTraderRule,
      traderType,
      currentTraderRule,
      data,
      traderData,
      existTypes
    } = this.state;
    const { userRights } = this.props;
    let traderRight = getUserRight()['SYSTEM_NOTICE_TRADER'];
    return (
      <div>
        {userRights['SYSTEM_NOTICE_MOREMSG'] && (
          <div className={cs['panel']}>
            <div className={cs['header']}>
              <div>{i18n['settings.notify_center.inner']}</div>
              {parseInt(data && data.length) < 8 && (
                <div>
                  <Button
                    bsStyle="primary"
                    data-test="add-button"
                    onClick={this.toggleModal.bind(
                      this,
                      'Add',
                      true,
                      undefined
                    )}
                  >
                    <Icon icon="add-outline" className={cs['add']} />
                    {i18n['settings.update_nofity.add_rule']}
                  </Button>
                </div>
              )}
            </div>
            <div className={cs['body']}>
              <Table
                className={cs['table']}
                data={data}
                columns={this.columns}
                renderCell={this._renderTableRow}
              />
            </div>
            {showUpdateRuleModal && (
              <UpdateNotification
                onClose={this.toggleModal.bind(this, '', false, undefined)}
                onSave={this.updateRole}
                type={type}
                currentRule={currentRule}
              />
            )}
          </div>
        )}
        {traderRight && (
          <div className={cs['panel']}>
            <div className={cs['header']}>
              <div>{i18n['settings.notify_center.trader']}</div>
              {traderData.length < 5 && (
                <div className={cs['add-rule-area']}>
                  <Button
                    bsStyle="primary"
                    data-test="add-button"
                    onClick={this.onToggleTraderModal.bind(
                      this,
                      'Add',
                      undefined,
                      true
                    )}
                  >
                    <Icon icon="add-outline" className={cs['add']} />
                    {i18n['settings.update_nofity.add_rule']}
                  </Button>
                </div>
              )}
            </div>
            <div className={cs['body']}>
              <Table
                className={cs.traderTable}
                data={traderData}
                columns={this.traderColumns}
                renderCell={this._renderTableRow}
              />
            </div>
          </div>
        )}
        {addTraderRule && (
          <UpdateTrader
            type={traderType}
            visible={addTraderRule}
            onClose={this.onClose}
            existTypes={existTypes}
            onSave={this.updateRole}
            currentRule={currentTraderRule}
          />
        )}
      </div>
    );
  }
}
