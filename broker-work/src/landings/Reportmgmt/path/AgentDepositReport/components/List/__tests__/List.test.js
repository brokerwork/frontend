import { shallow } from 'enzyme';
import List from '../index.js';
import { Button } from 'react-bootstrap';
import Table from 'components/Table';
import { AGENT_DEPOSIT_RRPORT_HEADERS } from '../../../../../constant';
import PaginationBar from 'components/PaginationBar';
import { set as setQuery } from 'utils/cacheQuery';

function fn() {}
describe('代理保证金模块的List', () => {
  const agentdepositReportList = {
    list: [
      {
        accountNum: 1,
        balance: 22106,
        commissionEnable: 0,
        createdTime: 0,
        id: 5,
        login: '123123123',
        marginWarn: 100000000000,
        name: 'SUNNY1',
        positionNum: 1,
        positionProfit: 63050,
        serverId: 428,
        serverName: 'mt4-100',
        swapsEnable: 1,
        tenantId: 'T001117',
        updatedTime: 0,
        userId: 252,
        vendor: 'MT4'
      }
    ]
  };
  const state = {
    showDepositModal: false,
    agentData: {}
  };

  const wrap = shallow(
    <List
      state={state}
      currentNeedRefresh={''}
      agentdepositReportList={agentdepositReportList}
      agentDepositListcolumns={AGENT_DEPOSIT_RRPORT_HEADERS}
      userRights={[]}
      updateNeedRefresh={fn}
      getAgentDepositList={fn}
    />
  );
  it('如果没有入金权限不会出现入金按钮和详情跳转按钮', () => {
    expect(
      wrap
        .find('td')
        .last()
        .find(Button)
        .exists()
    ).toBe(false);
  });
  it('增加了关联账户总余额字段', () => {
    wrap.instance().props.agentDepositListcolumns.forEach(item => {
      if (item.value === 'accountTotalBalance') {
        expect(item.value).toEqual('accountTotalBalance');
      }
    });
  });
});
