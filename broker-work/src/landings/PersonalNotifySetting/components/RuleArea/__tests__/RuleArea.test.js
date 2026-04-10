import { shallow } from 'enzyme';
import RuleArea from '../index';
import UpdateRule from '../../../containers/UpdateRule';

function fn() {
  return Promise.resolve({});
}
const fakeSettings = [
  {
    enable: false,
    noticeType: ['SystemMsg', 'Popup', 'Email', 'SMS'],
    rule: '10',
    scope: ['My', 'Sub', 'Participate', 'Concerned'],
    subUserScope: ['71', '72', '337'],
    tenantId: 'T001117',
    type: 'BALANCE_CHANGE',
    userId: '4'
  },
  {
    enable: false,
    noticeType: ['SMS', 'Email', 'SystemMsg', 'Popup'],
    rule: '10',
    scope: ['Sub', 'My', 'Participate', 'Concerned'],
    subUserScope: [],
    tenantId: 'T001117',
    type: 'DEPOSIT_TASK',
    userId: '4'
  },
  {
    enable: false,
    noticeType: ['SMS', 'SystemMsg', 'Popup'],
    rule: '10',
    scope: ['Sub', 'My', 'Participate', 'Concerned'],
    subUserScope: [],
    tenantId: 'T001117',
    type: 'WITHDRAWAL_TASK',
    userId: '4'
  },
  {
    enable: false,
    noticeType: ['SystemMsg', 'Popup', 'SMS', 'Email'],
    rule: '10',
    scope: ['Sub', 'My', 'Participate', 'Concerned'],
    subUserScope: [],
    tenantId: 'T001117',
    type: 'WITHDRAWAL_BALANCE',
    userId: '4'
  },
  {
    enable: false,
    noticeType: ['Email'],
    rule: [
      'JOB_TYPE_TA_OPEN',
      'JOB_TYPE_TA_SAME_OPEN',
      'JOB_TYPE_TA_LEVERAGE',
      'JOB_TYPE_TA_DEPOSIT',
      'JOB_TYPE_TA_WITHDRAW',
      'JOB_TYPE_TA_TRANSFER',
      'JOB_TYPE_TA_BIND',
      'JOB_TYPE_TA_RESET_TRADE',
      'JOB_TYPE_TA_UPDATE_OWNER'
    ],
    scope: ['Sub', 'My', 'Participate', 'Concerned'],
    subUserScope: [],
    tenantId: 'T001117',
    type: 'TASK_HANDLE',
    userId: '4'
  },
  {
    enable: false,
    noticeType: ['SMS', 'Email'],
    rule: '10',
    scope: ['Sub', 'My', 'Participate', 'Concerned'],
    subUserScope: ['71', '72', '337'],
    tenantId: 'T001117',
    type: 'CREDIT_CHANGE',
    userId: '4'
  },
  {
    enable: true,
    noticeType: ['SMS', 'Email', 'SystemMsg', 'Popup'],
    rule: '100',
    scope: ['Sub', 'My'],
    subUserScope: ['71', '105', '233', '337'],
    tenantId: 'T001117',
    type: 'MARGIN_LEVEL',
    userId: '4'
  }
];
const systemSettings = {
  emailEnable: true,
  enable: true,
  id: 'T001117',
  personalDailyReportEnable: false,
  rules: [
    {
      noticeType: ['SystemMsg', 'Popup', 'Email', 'SMS'],
      roles: ['4', '7', '8', '9', '1', '2'],
      type: 'WITHDRAWAL_BALANCE'
    },
    {
      noticeType: ['Popup', 'SystemMsg', 'SMS', 'Email'],
      roles: ['1', '2', '3', '4', '7', '8', '9'],
      type: 'WITHDRAWAL_TASK'
    },
    {
      noticeType: ['SystemMsg', 'Popup', 'Email', 'SMS'],
      roles: ['7', '8', '9', '4', '2', '1'],
      type: 'DEPOSIT_TASK'
    },
    {
      noticeType: ['SystemMsg', 'SMS', 'Popup', 'Email'],
      roles: ['1', '2', '3', '4', '7', '8', '9'],
      type: 'TASK_HANDLE'
    },
    {
      noticeType: ['SystemMsg', 'Popup'],
      roles: ['1', '2', '3', '4', '7', '8', '9'],
      type: 'CREDIT_CHANGE'
    },
    {
      noticeType: [],
      roles: ['1', '2', '3', '7', '4', '8', '9'],
      type: 'MARGIN_LEVEL'
    },
    {
      noticeType: ['SystemMsg', 'Popup'],
      roles: ['1', '2'],
      type: 'BALANCE_CHANGE'
    },
    {
      noticeType: ['SystemMsg', 'Popup'],
      roles: ['1', '2'],
      type: 'TRANSFER_TASK'
    }
  ],
  smsEnable: true,
  tenantId: 'T001117'
};

describe('个人通知的规则区域', () => {
  const wrap = shallow(
    <RuleArea
      personalRules={fakeSettings}
      getSubUserTree={fn}
      systemSettings={systemSettings}
      userRights={{}}
    />
  );
  describe('编辑按钮', () => {
    it('点击编辑时出现modal', () => {
      wrap
        .find('[data-test="edit-button"]')
        .at(1)
        .simulate('click');
      expect(wrap.find(UpdateRule).exists()).toBe(true);
    });
  });
});
