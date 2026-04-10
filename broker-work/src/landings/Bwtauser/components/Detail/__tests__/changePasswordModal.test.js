import { shallow } from 'enzyme';
import ChangePasswordModal from '../changePasswordModal.js';

describe('ta用户修改密码模态框', () => {
  const wrap = shallow(<ChangePasswordModal onHide={fn} />);
  it('应该有一个密码输入框', () => {
    expect(wrap.find('#changePasswordInput').exists()).toBe(true);
  });
  it('应该有一个提交新密码的按钮', () => {
    expect(wrap.find('#saveNewPassword').exists()).toBe(true);
  });
  it('当密码输入框改变时state应该跟着一起改变', () => {
    wrap
      .find('#changePasswordInput')
      .simulate('change', { target: { value: 'Hello' } });
    expect(wrap.state().newPassword).toEqual('Hello');
  });
});

function fn() {}
