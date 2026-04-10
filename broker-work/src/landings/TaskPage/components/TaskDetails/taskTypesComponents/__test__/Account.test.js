import { shallow } from 'enzyme';
import Account from '../Account';

const normalIdentical = {
  jobType: 'JOB_TYPE_AGENCY_WITHDRAW',
  jobNo: '12445',
  currency: 'USD',
  withdrawAmount: 1000
};

describe('开户任务测试', () => {
  const initialValues = {
    vendor: 'MT4'
  };

  const wrap = shallow(
    <Account
      data={{
        t_account_finacial: [],
        t_account_id_info: [],
        t_account_account: []
      }}
      initialValues={initialValues}
    />
  );
  describe('如果是同名开户任务', () => {
    beforeEach(() => {
      wrap.setProps({
        jobType: 'JOB_TYPE_TA_SAME_OPEN'
      });
      wrap.setState({
        accountInfoDataReady: true
      });
    });
    wrap.update();
    it('显示备注字段', () => {
      expect(wrap.find('[data-test="same-open-comment"]').exists()).toBe(true);
    });
  });
});
