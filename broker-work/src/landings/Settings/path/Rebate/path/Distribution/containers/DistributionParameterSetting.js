import { connect } from 'react-redux';
import { submit, reset } from 'redux-form';
import DistributionParameterSetting from '../components/DistributionParameterSetting';
import { showTipsModal } from 'commonActions/actions';
import { getRuleDetail, updateRuleDetail } from '../controls/actions';

export default connect(
  ({
    settings: {
      rebate: { distributionRule },
      base: {
        parentSubRelationList,
        distributionCommissionTypeList,
        distributionIndiCommissionTypeList,
        parentDirSubRelationList,
        subSubRelationList,
        level_list,
        multiSubRelationList,
        multiCommissionTypeList
      }
    }
  }) => {
    return {
      selectedRule: distributionRule.selected_rule,
      ruleDetail: distributionRule.rule_detail,
      parentSubRelationList,
      distributionCommissionTypeList,
      distributionIndiCommissionTypeList,
      parentDirSubRelationList,
      subSubRelationList,
      levelList: level_list,
      multiSubRelationList,
      multiCommissionTypeList
    };
  },
  {
    showTipsModal,
    getRuleDetail,
    updateRuleDetail,
    submitForm: submit,
    resetForm: reset
  }
)(DistributionParameterSetting);
