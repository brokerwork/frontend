import { shallow } from 'enzyme';
import SplitView from '../index.js';

const customerDetailInfo = {
  revisitTime: 11111111
};
describe('回访时间测试', () => {
  const wrap = shallow(<SplitView customerDetailInfo={customerDetailInfo} />);
  wrap.setState({ queryType: 'NAME' });
  it('state从customerDetailInfo读取revisitTime', () => {
    expect(wrap.state('followTime')).toEqual(customerDetailInfo.revisitTime);
  });
  describe('当客户回访时间更新', () => {
    beforeEach(() => {
      wrap.setProps({
        customerDetailInfo: {
          revisitTime: 222222
        }
      });
    });
    it('更新state中的revisitTime', () => {
      expect(wrap.state('followTime')).toEqual(222222);
    });
  });
});
