import React, { PureComponent } from 'react';
import SettingActionBar from 'landings/Settings/components/SettingActionBar';
import i18n from 'utils/i18n';
import { Icon, Button, Card, Table, Message } from 'lean-ui';
import cs from './index.less';
import NoDataView from 'components/v2/NoDataView';
import { FormattedMessage } from 'react-intl';
import EditRuleModal from '../EditRuleModal';
import {
  createAccountGroupDefault,
  ACCOUNT_GROUP_DEFAULT_RULE
} from '../../constant';
import { getBrandInfo } from 'utils/brandInfo';
import { getUserInfo } from 'utils/userInfo';

export class AccountGroup extends PureComponent {
  columns = [
    {
      key: 'classifyName',
      name: i18n['settings.account_group_manager.classifyName']
    },
    {
      key: 'classifyRules',
      name: i18n['settings.account_group_manager.classifyRules']
    },
    {
      key: 'op',
      name: i18n['settings.account_group_manager.op']
    }
  ];

  state = {
    showEditModal: false,
    ruleData: {}
  };

  componentDidMount() {
    const { getAccountGroupConfig, brandInfo } = this.props;
    getAccountGroupConfig();
  }

  onEditRule = data => {
    this.setState({ showEditModal: true, ruleData: { ...data } });
  };

  toggleAddModal = () => {
    const { tenantId = '' } = getUserInfo() || {};
    this.setState({
      showEditModal: true,
      ruleData: { ...ACCOUNT_GROUP_DEFAULT_RULE }
    });
  };

  parseRule = ({ conditionA, conditionB, operator, ruleType }) => {
    return (
      <div>
        {
          <FormattedMessage
            id="settings.account_group_manager.condition.format"
            defaultMessage={
              i18n['settings.account_group_manager.condition.format']
            }
            values={{
              conditionA: <span className="main-color">{conditionA}</span>,
              ruleType:
                i18n[`settings.account_group_manager.ruleType.${ruleType}`],
              operatorWithConditionB: (
                <span className="main-color">
                  {i18n[`settings.account_group_manager.operator.${operator}`]}
                  {conditionB}
                </span>
              )
            }}
          />
        }
      </div>
    );
  };

  onSave = data => {
    const {
      groupConfig = [],
      updateAccountGroupConfig,
      getAccountGroupConfig
    } = this.props;
    const { tenantId } = getUserInfo();
    const config = groupConfig.length
      ? { ...groupConfig[0] }
      : createAccountGroupDefault(tenantId);
    config.classifyRules = [{ ...data }];
    updateAccountGroupConfig(config).then(res => {
      if (!res.result) {
        Message.error(i18n['settings.account_group_manager.saveFail']);
        return;
      }
      Message.success(i18n['settings.account_group_manager.saveSuccess']);
      getAccountGroupConfig();
      this.onCancel();
    });
  };

  onCancel = () => {
    this.setState({ showEditModal: false });
  };

  renderCell = ({ key, data, index, rowData }) => {
    let content = data;
    switch (key) {
      case 'classifyRules':
        content = this.parseRule(data[0]);
        break;
      case 'op':
        content = (
          <div
            className={`${cs.button} main-color`}
            onClick={this.onEditRule.bind(this, rowData.classifyRules[0])}
          >
            {i18n['settings.account_group_manager.editUserRules']}
          </div>
        );
        break;
      default:
        break;
    }

    return <Table.Td key={index}>{content}</Table.Td>;
  };

  render() {
    const { groupConfig = [] } = this.props;
    const { showEditModal, ruleData } = this.state;
    return (
      <div className={cs.body}>
        <SettingActionBar title={i18n['settings.account_group_manager.header']}>
          {!groupConfig.length && (
            <Button type="primary" onClick={this.toggleAddModal}>
              <Icon icon="add-outline" />
              {i18n['settings.account_group_manager.addrule']}
            </Button>
          )}
        </SettingActionBar>
        <Card>
          {groupConfig.length ? (
            <Table
              renderCell={this.renderCell}
              columns={this.columns}
              data={groupConfig}
            />
          ) : (
            <NoDataView />
          )}
        </Card>
        {showEditModal && (
          <EditRuleModal
            visible={showEditModal}
            onSave={this.onSave}
            onCancel={this.onCancel}
            ruleData={ruleData}
          />
        )}
      </div>
    );
  }
}

export default AccountGroup;
