import { shallow } from 'enzyme';
import AccountOwnerInfo from '../AccountOwnerInfo';
const customerDetailInfo = {
  enable: true
};
const accountOwnerInfo = {
  state: 'NOT_CHECK'
};
describe('客户账户所有人资料测试', () => {
  const wrap = shallow(
    <AccountOwnerInfo
      customerDetailInfo={customerDetailInfo}
      accountOwnerInfo={accountOwnerInfo}
      accountOwnerFormColumns={{
        t_account_profiles: [],
        t_account_finacial: [],
        t_account_id_info: []
      }}
    />
  );
  describe('当测试结果关闭', () => {
    it('不显示测试结果', () => {
      expect(wrap.find('[data-test="adapt-content"]').exists()).toBe(false);
    });
  });
  describe('当测试结果开启', () => {
    beforeEach(() => {
      wrap.setProps({
        isAdaptOn: true
      });
    });
    it('显示测试结果', () => {
      expect(wrap.find('[data-test="adapt-content"]').exists()).toBe(true);
    });
  });
});
