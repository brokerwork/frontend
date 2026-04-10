import { shallow } from 'enzyme';
import ActionBar from '../index.js';
const userRightsWithTW = {
  MESSAGE_SEND_OBJECT_TW: true
};
const userItem = {
  email: 'sunny20130129@163.com',
  emailVerified: true,
  isEnable: true,
  lastLoginTime: 1506418235217,
  phoneVerified: false,
  pubUserId: '8a2aa55c-1657-4456-9e08-0f572da19c97',
  realName: 'sunnysunny',
  registerTime: 1506406466882,
  userNo: 202
};
describe('tw用户管理actionBar', () => {
  const wrap = shallow(
    <ActionBar
      params={{}}
      userRights={{}}
      selectedUsers={{}}
      searchTypes={[]}
      typesOptions={['MAIL', 'SMS']}
    />
  );
  describe('当有选中用户时', () => {
    wrap.setProps({
      selectedUsers: userItem
    });
    wrap.update();
    it('隐藏一般选项', () => {
      expect(wrap.find('[data-test="taNoSelectedView"]').exists()).toBe(false);
    });
    it('显示多选选项', () => {
      expect(wrap.find('[data-test="taSelectedView"]').exists()).toBe(true);
    });
    describe('当没有tw用户权限时', () => {
      beforeEach(() => {
        wrap.setProps({
          userRights: {}
        });
        wrap.update();
      });
      it('不显示发送消息按钮', () => {
        expect(wrap.find('[data-test="taSendMessageButton"]').exists()).toBe(
          false
        );
      });
    });
    describe('当有tw用户权限时', () => {
      beforeEach(() => {
        wrap.setProps({
          userRights: userRightsWithTW
        });
        wrap.update();
      });
      it('显示发送消息按钮', () => {
        expect(wrap.find('[data-test="taSendMessageButton"]').exists()).toBe(
          true
        );
      });
    });
  });
});
