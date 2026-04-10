import { shallow } from 'enzyme';
import UpdateAccountModal from '../index';
function fn() {}
describe('交易模式设置添加代理弹窗', () => {
  const wrap = shallow(<UpdateAccountModal accountList={[]} />);
  it('交易模式设置有一个确认按钮', () => {
    expect(wrap.find('.btn-primary').exists()).toBe(true);
  });
});
