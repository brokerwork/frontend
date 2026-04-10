import { shallow } from 'enzyme';
import ActionBar from '../index';
import { BILL_REFUND_VIEWS } from '../../../contants';

const defaultProps = {};

describe('客户付费报表报表的actionbar', () => {
  const wrap = shallow(<ActionBar billRefundViews={BILL_REFUND_VIEWS} />);
  it('默认显示产品选项不显示视图切换选项', () => {
    expect(wrap.find('[data-test="dropdown-products"]').exists()).toBe(true);
    expect(wrap.find('[data-test="dropdown-views"]').exists()).toBe(false);
  });
  describe('当类型为income时', () => {
    beforeEach(() => {
      wrap.setProps({
        params: {
          type: 'income'
        }
      });
      wrap.update();
    });
    it('不显示产品选项', () => {
      expect(wrap.find('[data-test="dropdown-products"]').exists()).toBe(false);
    });
  });

  describe('当类型为refund_bill时', () => {
    beforeEach(() => {
      wrap.setProps({
        params: {
          type: 'refund_bill'
        }
      });
      wrap.update();
    });
    it('显示视图切换选项', () => {
      expect(wrap.find('[data-test="dropdown-views"]').exists()).toBe(true);
    });
    it('显示视图切换选项有两个选项', () => {
      expect(
        wrap.find('[data-test="dropdown-views"]').prop('data')
      ).toHaveLength(2);
    });
    describe('当选择了产品', () => {
      beforeEach(() => {
        wrap.setProps({
          params: {
            product: '1',
            type: 'refund_bill'
          }
        });
        wrap.update();
      });
      it('显示视图切换只有MRR选项', () => {
        expect(
          wrap.find('[data-test="dropdown-views"]').prop('data')
        ).toHaveLength(1);
        expect(
          wrap.find('[data-test="dropdown-views"]').prop('data')[0].value
        ).toBe('MRR');
      });
    });
  });
});
