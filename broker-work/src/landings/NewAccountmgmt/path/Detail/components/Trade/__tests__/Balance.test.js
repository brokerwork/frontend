import { shallow } from 'enzyme';
import Balance from '../Balance.js';

const fn = jest.fn();

describe('账户交易记录 出入金记录', () => {
  const wrap = shallow(<Balance list={{}} load={fn} dateChanged={false} />);

  describe('当dateChanged为true时', () => {
    beforeEach(() => {
      wrap.setProps({ dateChanged: true });
      wrap.update();
    });

    it('需重新请求数据', () => {
      expect(wrap.state('desc')).toBe(true);
      expect(wrap.state('pageNo')).toBe(1);
      expect(fn).toHaveBeenCalled();
    });
  });

  describe('改变排序时', () => {
    const desc = wrap.state('desc');

    beforeEach(() => {
      wrap.instance().changeOrderBy();
    });

    it('state的desc为!desc', () => {
      expect(wrap.state('desc')).toEqual(!desc);
      expect(fn).toHaveBeenCalled();
    });
  });

  describe('改变页码时', () => {
    const pageNo = 2;

    beforeEach(() => {
      wrap.instance().onSelect(pageNo);
    });

    it('state的pageNo为变量pageNo的值', () => {
      expect(wrap.state('pageNo')).toEqual(pageNo);
      expect(fn).toHaveBeenCalled();
    });
  });
});
