import { shallow } from 'enzyme';
import RuleArea from '../index';
import UpdateNotification from '../../../containers/UpdateNotification';

function fn() {
  return Promise.resolve({});
}
const fakeSettings = {
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

describe('通知中心的规则区域', () => {
  const wrap = shallow(
    <RuleArea systemSettings={fakeSettings} roleOptions={[]} />
  );
  describe('添加按钮逻辑', () => {
    it('当rules有8条设置时，添加按钮应该不出现', () => {
      expect(wrap.find('[data-test="add-button"]').exists()).toBe(false);
    });
    it('当rules有小于8条设置时，添加按钮应该出现', () => {
      wrap.setProps({
        systemSettings: Object.assign({}, { rules: [] })
      });
      expect(wrap.find('[data-test="add-button"]').exists()).toBe(true);
    });
    it('点击添加按钮时出现添加框', () => {
      wrap.find('[data-test="add-button"]').simulate('click');
      expect(wrap.find(UpdateNotification).exists()).toBe(true);
    });
  });
});
