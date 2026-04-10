import { shallow } from 'enzyme';
import AutoJumper from '../index.js';

describe('登陆跳转页面 Component', () => {
  const wrap = shallow(<AutoJumper />);
  it('正确渲染', () => {
    expect(wrap.find('#auto-jumper').exists()).toBe(true);
  });
});

function fn() {}
