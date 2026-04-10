import { connect } from 'react-redux';
import DistributionParameterSetting2 from '../components/DistributionParameterSetting2';
import { showTipsModal } from 'commonActions/actions';
import { getRuleDetail, updateRuleDetail } from '../controls/actions';

export default connect(
  ({
    settings: {
      rebate: { distributionRule },
      base: { level_list }
    }
  }) => {
    return {
      selectedRule: distributionRule.selected_rule,
      ruleDetail: distributionRule.rule_detail,
      levelList: level_list
    };
  },
  {
    showTipsModal,
    getRuleDetail,
    updateRuleDetail
  }
)(DistributionParameterSetting2);
