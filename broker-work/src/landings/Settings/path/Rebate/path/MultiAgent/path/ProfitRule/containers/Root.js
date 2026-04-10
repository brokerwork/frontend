import { connect } from 'react-redux';
import ProfitRuleSetting from '../components/Root';
import { showTipsModal } from 'commonActions/actions';
import i18n from 'utils/i18n';

import {
  getRuleList,
  selectRule,
  createRule,
  updateRule,
  removeRule,
  getRuleDetail,
  createRuleDetail,
  updateRuleDetail,
  removeRuleDetail
} from '../controls/actions';
import {
  getDepositBasicResource,
  checkRuleDetail,
  checkParameter
} from '../../../../../../../controls/actions';
import { changeRulePriority } from '../../../controls/actions';

export default connect(
  ({
    settings: {
      rebate: {
        multiAgent: { profitRule }
      },
      base: {
        group_list,
        account_list,
        server_group_list,
        deposit_balance_unit,
        level_list,
        server_symbols,
        profitType
      }
    }
  }) => {
    return {
      accountList: account_list,
      serverGroupList: server_group_list,
      balanceUnit: deposit_balance_unit,
      levelList: level_list,
      serverSymbols: server_symbols,
      profitType: [
        ...profitType,
        {
          label: i18n['settings.rebate_setting.net_profit'],
          value: 2
        }
      ], // 新增净盈利
      ruleList: profitRule.rule_list,
      ruleListTime: profitRule.rule_list_time,
      selectedRule: profitRule.selected_rule,
      ruleDetail: profitRule.rule_detail
    };
  },
  {
    getDepositBasicResource,
    showTipsModal,

    getRuleList,
    selectRule,
    createRule,
    updateRule,
    removeRule,
    getRuleDetail,
    createRuleDetail,
    updateRuleDetail,
    removeRuleDetail,
    checkRuleDetail,
    checkParameter,
    changeRulePriority
  }
)(ProfitRuleSetting);
