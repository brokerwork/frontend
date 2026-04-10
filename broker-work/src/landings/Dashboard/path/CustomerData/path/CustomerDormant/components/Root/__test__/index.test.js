import { shallow } from 'enzyme';
import Root from '../index.js';

const trendData = {
  labels: [
    '2017-11-13',
    '2017-11-14',
    '2017-11-15',
    '2017-11-16',
    '2017-11-17',
    '2017-11-18',
    '2017-11-19',
    '2017-11-20',
    '2017-11-21',
    '2017-11-22',
    '2017-11-23',
    '2017-11-24',
    '2017-11-25',
    '2017-11-26',
    '2017-11-27',
    '2017-11-28',
    '2017-11-29',
    '2017-11-30',
    '2017-12-01',
    '2017-12-02',
    '2017-12-03',
    '2017-12-04',
    '2017-12-05',
    '2017-12-06',
    '2017-12-07',
    '2017-12-08',
    '2017-12-09',
    '2017-12-10',
    '2017-12-11',
    '2017-12-12'
  ],
  data: [
    { NEW_CUSTOMER_TENANT_DORMANT_PAGE: 0 },
    { NEW_CUSTOMER_TENANT_DORMANT_PAGE: 0 },
    { NEW_CUSTOMER_TENANT_DORMANT_PAGE: 0 },
    { NEW_CUSTOMER_TENANT_DORMANT_PAGE: 0 },
    { NEW_CUSTOMER_TENANT_DORMANT_PAGE: 0 },
    { NEW_CUSTOMER_TENANT_DORMANT_PAGE: 0 },
    { NEW_CUSTOMER_TENANT_DORMANT_PAGE: 0 },
    { NEW_CUSTOMER_TENANT_DORMANT_PAGE: 0 },
    { NEW_CUSTOMER_TENANT_DORMANT_PAGE: 0 },
    { NEW_CUSTOMER_TENANT_DORMANT_PAGE: 0 },
    { NEW_CUSTOMER_TENANT_DORMANT_PAGE: 0 },
    { NEW_CUSTOMER_TENANT_DORMANT_PAGE: 0 },
    { NEW_CUSTOMER_TENANT_DORMANT_PAGE: 0 },
    { NEW_CUSTOMER_TENANT_DORMANT_PAGE: 0 },
    { NEW_CUSTOMER_TENANT_DORMANT_PAGE: 0 },
    { NEW_CUSTOMER_TENANT_DORMANT_PAGE: 0 },
    { NEW_CUSTOMER_TENANT_DORMANT_PAGE: 0 },
    { NEW_CUSTOMER_TENANT_DORMANT_PAGE: 0 },
    { NEW_CUSTOMER_TENANT_DORMANT_PAGE: 0 },
    { NEW_CUSTOMER_TENANT_DORMANT_PAGE: 0 },
    { NEW_CUSTOMER_TENANT_DORMANT_PAGE: 0 },
    { NEW_CUSTOMER_TENANT_DORMANT_PAGE: 0 },
    { NEW_CUSTOMER_TENANT_DORMANT_PAGE: 0 },
    { NEW_CUSTOMER_TENANT_DORMANT_PAGE: 0 },
    { NEW_CUSTOMER_TENANT_DORMANT_PAGE: 0 },
    { NEW_CUSTOMER_TENANT_DORMANT_PAGE: 0 },
    { NEW_CUSTOMER_TENANT_DORMANT_PAGE: 0 },
    { NEW_CUSTOMER_TENANT_DORMANT_PAGE: 0 },
    { NEW_CUSTOMER_TENANT_DORMANT_PAGE: 0 },
    { NEW_CUSTOMER_TENANT_DORMANT_PAGE: 1 }
  ]
};

function getTrendDatas() {
  return Promise.resolve(trendData);
}

const searchParams = {
  timeRange: 'DAY',
  fromTime: '2017-11-07T16:00:00.000Z',
  toTime: '2017-12-07T15:59:59.999Z',
  type: 'NEW_CUSTOMER_DORMANT_PANEL'
};

const match = { url: '/dashboard/customer-data/customer-dormant' };
const paginationInfo = { pageSize: 50, total: 30, pageNo: 1 };
function fn() {}

describe('休眠客户 Root', () => {
  const wrap = shallow(
    <Root
      trendData={trendData}
      paginationInfo={paginationInfo}
      match={match}
      dashboardViewRight={{ checkCustomer: true }}
      searchParams={searchParams}
      modifyParams={fn}
      getTrendDatas={getTrendDatas}
      setDashboardViewRight={fn}
    />
  );
  it('正常显示', () => {
    expect(wrap.find('[data-test="container"]').exists()).toBe(true);
  });
});
