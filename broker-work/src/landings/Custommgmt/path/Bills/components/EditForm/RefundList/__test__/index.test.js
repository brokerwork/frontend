import { shallow } from 'enzyme';
import BillForm from '../index.js';

// const isDisabled =
//       (type === 'edit' && !userRights.CUSTOMER_BILLPAYMENT_EDITBILL) || //修改时无修改权限
//       (type === 'add' && !userRights.CUSTOMER_BILLPAYMENT_ADDBILL) || //添加时无添加权限
//       !enable || //被产出时
//       justForm || // 用于导出预览时
//       (type === 'edit' && isLostCustomer); // 流失客户

const defaultProps = {
  enable: true,
  userRights: {
    CUSTOMER_BILLPAYMENT_ADDPAYMENT: true
  }
};
describe('回款测试', () => {
  const wrap = shallow(<BillForm {...defaultProps} />);

  describe('disable条件验证', () => {
    describe('添加无添加权限', () => {
      beforeEach(() => {
        wrap.setProps({
          userRights: {
            CUSTOMER_BILLPAYMENT_ADDPAYMENT: false
          }
        });
        wrap.update();
      });
      it('不可编辑', () => {
        expect(wrap.find('[data-test="add-button"]').exists()).toBe(false);
      });
    });
    describe('被删除时', () => {
      beforeEach(() => {
        wrap.setProps({
          enable: false
        });
        wrap.update();
      });
      it('不可编辑', () => {
        expect(wrap.find('[data-test="add-button"]').exists()).toBe(false);
      });
    });
    describe('流失客户', () => {
      beforeEach(() => {
        wrap.setProps({
          isLostCustomer: true
        });
        wrap.update();
      });
      it('不可编辑', () => {
        expect(wrap.find('[data-test="add-button"]').exists()).toBe(false);
      });
    });
  });
});
