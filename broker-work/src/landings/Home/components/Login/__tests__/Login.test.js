import { shallow } from 'enzyme';
import Login from '../index.js';

describe('登录页 Component', () => {
  const wrap = shallow(
    <Login getLanguage={fn} getBrandInfo={fn} brandInfo={{}} loginParams={{}} />
  );
  it('必须有账号输入框', () => {
    expect(wrap.find('#userName').exists()).toBe(true);
  });
  it('必须有密码输入框', () => {
    expect(wrap.find('#passWord').exists()).toBe(true);
  });
});

function fn() {}
