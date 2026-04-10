import { shallow } from 'enzyme';
import Ranking from '../index';

const searchParams = {
  timeRange: 'DAY',
  fromTime: '2017-11-28T00:00:00+08:00',
  toTime: '2017-12-04T23:59:59+08:00'
};

function getCustomerRankings() {
  return Promise.resolve({});
}

function getAccountRankings() {
  return Promise.resolve({});
}

describe('账户排行榜', () => {
  const wrap = shallow(
    <Ranking
      searchParams={searchParams}
      accountRankings={{}}
      customerRankings={{}}
      userRights={{ CUSTOMER_SELECT: true }}
      match={{ url: '/dashboard/customer-data/customer-rankings' }}
      getCustomerRankings={getCustomerRankings}
      getAccountRankings={getAccountRankings}
    />
  );
  describe('切换排行类型', () => {
    it('切换到 customer', () => {
      wrap.find('[data-test="customer"]').simulate('click');
      expect(wrap.find('[data-test="customer"]').hasClass('active'));
    });
  });
});
