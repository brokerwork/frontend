import i18n from 'utils/i18n';
import { dateRange } from 'utils/config';
import cs from './components/CustomerDetail/ApproveModal/ApproveForm.less';

/**
 * 获得默认审批人和抄送人
 * @param auditType 审批类型
 * @param dept 所属部门
 * @param deployType 产品部署类型
 */
export const getDefaultApprover = (auditType, dept, deployType) => {
  if (!['cn', 'hk'].includes(dept)) {
    return {};
  }
  let result = DEFAULT_APPROVER_MAP[auditType][dept];
  if (auditType === 'DEPLOY') {
    //产品部署多了一个层级
    result = result[deployType];
  }

  return result;
};

// 高级搜索条件
export const DEFAULT_APPROVER_MAP = {
  CONTRACTS: {
    cn: {
      approver: ['Bo', 'Vivian'],
      cc: ['Darren', 'Bo', 'Lv', 'summer', 'Vivian', 'ClaireGu']
    },
    hk: {
      approver: ['Sun', 'Vivian', 'Sun'],
      cc: ['Darren', 'Sun', 'summer', 'Vivian', 'ClaireGu']
    }
  },
  DEPLOY: {
    cn: {
      BW_TW: {
        approver: ['Bo', 'jjzhang'],
        cc: [
          'Darren',
          'Bo',
          'Tiny',
          'Lv',
          'jjzhang',
          'ClaireGu',
          'Candice',
          'summer',
          'Vivian'
        ]
      },
      FW_GW: {
        approver: ['Bo', 'jjzhang'],
        cc: [
          'Darren',
          'Bo',
          'Tiny',
          'Lv',
          'jjzhang',
          'ClaireGu',
          'Candice',
          'summer',
          'Vivian'
        ]
      },
      DW: {
        approver: ['Bo', 'Lie'],
        cc: [
          'Darren',
          'Bo',
          'Tiny',
          'Lv',
          'jjzhang',
          'ClaireGu',
          'Candice',
          'summer',
          'Vivian'
        ]
      }
    },
    hk: {
      BW_TW: {
        approver: ['Sun', 'jjzhang'],
        cc: [
          'Darren',
          'Sun',
          'Tiny',
          'jjzhang',
          'ClaireGu',
          'Candice',
          'summer',
          'Vivian'
        ]
      },
      FW_GW: {
        approver: ['Sun', 'jjzhang'],
        cc: [
          'Darren',
          'Sun',
          'Tiny',
          'jjzhang',
          'ClaireGu',
          'Candice',
          'summer',
          'Vivian'
        ]
      },
      DW: {
        approver: ['Sun', 'Lie'],
        cc: [
          'Darren',
          'Sun',
          'Tiny',
          'jjzhang',
          'ClaireGu',
          'Candice',
          'summer',
          'Vivian'
        ]
      }
    }
  },
  REFUND: {
    cn: {
      approver: ['Bo', 'summer', 'leo', 'Vivian'],
      cc: [
        'Darren',
        'Bo',
        'Tiny',
        'Lv',
        'jjzhang',
        'ClaireGu',
        'Candice',
        'summer',
        'Vivian'
      ]
    },
    hk: {
      approver: ['Sun', 'summer', 'leo', 'Vivian'],
      cc: [
        'Darren',
        'Sun',
        'Tiny',
        'jjzhang',
        'ClaireGu',
        'Candice',
        'summer',
        'Vivian'
      ]
    }
  }
};
