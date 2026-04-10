import { shallow } from 'enzyme';
import Root from '../index.js';

const searchParams = {
  currPage: 1,
  pageSize: 20,
  state: 3,
  type: 0,
  orderValue: '',
  tradeName: '',
  sort: ''
};
const sourceList = {
  list: [
    {
      avgPositionTime: 230388,
      avgTradeDayCount: 1.52,
      balance: 0,
      id: 1,
      tradeId:
        'ea7146b1ecc8418a85b02e9205a5b620mc5bfe82f2194ed096b3df93620e5039l638560a0b1649ba9e864aa937e5c439f9a7c3e6353346b5aca758c7f7b4e2b0', //信号源ID
      login: '2011022837',
      name: 'steven_test_add1',
      profit: 500,
      profitRate: 0.6056,
      serverId: '80',
      state: 0, // 0:普通信号源；2：信号源冻结状态
      tenantId: 'T001273',
      tradeCount: 1, //交易量
      tradeCycle: 0,
      tradeVolume: 879.3, //交易手数
      type: 1 // 信号源类型 1:自营；2：平台
    },
    {
      avgPositionTime: 0,
      avgTradeDayCount: 0,
      balance: 0,
      id: 1,
      tradeId:
        'b698c2bea0824edfbaaa2b9df7030b50o50597feb23e42a5adcefacbe62e6b30',
      login: '2017052700',
      name: 'steven_test_add2',
      profit: 0,
      profitRate: 0,
      serverId: '80',
      state: 0,
      tenantId: 'T001273',
      tradeCount: 0,
      tradeCycle: 0,
      tradeVolume: 0,
      type: 1
    }
  ]
};
const getList = () => Promise.resolve(sourceList);

const modifySearchParams = params => {
  return { ...params };
};
describe('跟单 Root', () => {
  const wrap = shallow(
    <Root
      searchParams={searchParams}
      sourceList={sourceList}
      getList={getList}
      modifySearchParams={modifySearchParams}
    />
  );
  it('root 渲染', () => {
    expect(wrap.find('[data-test="sort"]').exists()).toBe(true);
  });
  it('sort', () => {
    const sortDom = wrap.find('[data-test="sort"]');
    sortDom.simulate('click');
  });
});

function fn() {}
