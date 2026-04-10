import { shallow } from 'enzyme';
import Detail from '../index.js';

describe('ta用户详情card的重置用户密码功能', () => {
  const wrap = shallow(<Detail userInfo={{}} />);
  it('必须有重置密码按钮', () => {
    expect(wrap.find('#changePasswordButton').exists()).toBe(true);
  });
  it('未点击重置密码前state应该为false', () => {
    expect(wrap.state().showChangePasswordModal).toEqual(false);
  });
  it('点击重置密码后state变为true', () => {
    wrap.find('#changePasswordButton').simulate('click');
    expect(wrap.state().showChangePasswordModal).toEqual(true);
  });
});
