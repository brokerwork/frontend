import { shallow } from 'enzyme';
import ApplyModal from '../index.js';

describe('代理出金申表单弹框', () => {
  const wrap = shallow(
    <ApplyModal
      show={true}
      onCompleted={() => {}}
      onHide={() => {}}
      defaultValues={{}}
      bankList={[{ label: 'bankName', value: 1 }]}
    />
  );
  describe('根据默认值显隐修改银行字段', () => {
    describe('当没有银行默认值时', () => {
      beforeEach(() => {
        wrap.setProps({
          defaultValues: {}
        });
        wrap.update();
      });
      it('不显示修改银行按钮', () => {
        expect(wrap.find('[data-test="modify-bank-btn"]').exists()).toBe(false);
      });
    });
    describe('当有银行默认值时', () => {
      beforeEach(() => {
        wrap.setProps({
          defaultValues: {
            bankAccountName: 'bankAccountName',
            bankName: 'bankName'
          }
        });
        wrap.update();
      });
      it('显示修改银行按钮', () => {
        expect(wrap.find('[data-test="modify-bank-btn"]').exists()).toBe(true);
      });
    });
  });
});
