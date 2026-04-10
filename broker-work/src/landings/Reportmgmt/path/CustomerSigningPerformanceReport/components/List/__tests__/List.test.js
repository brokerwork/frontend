import { shallow } from 'enzyme';
import List from '../index.js';
import Button from 'components/Button';
import Table from 'components/Table';
import DetailModal from '../../../containers/DetailModal';
import {
  CUSTOMER_SIGNING_PERFORMANCE_REPORT_HEDER,
  PAYMENT_STATUS,
  CUSTOMER_SIGNING_TYPE
} from '../../../constant';
import PaginationBar from 'components/PaginationBar';
import { set as setQuery } from 'utils/cacheQuery';

function fn() {}
function getCustomerSigningDetailList() {
  return Promise.resolve({
    result: true,
    data: {
      list: [
        {
          open_date: '2017-11-15',
          symbol: 'USDJPY',
          close_date: '2017-11-15 06:07:06',
          ticket: 36555202,
          rule_name: '上-4-$-手',
          account_group_id: 0,
          close_volume_pt: 0.0,
          open_volume_pt: 0.0,
          login: 3009,
          balance_unit: '1',
          volume: 1.0,
          close_volume: 1.0,
          parent_id: 6,
          balance_type: '$',
          commission: 7.0,
          detail_value: '7',
          money_1: 7.0,
          open_close_volume: 2.0,
          group: 'ATEST'
        },
        {
          open_date: '2017-11-15',
          symbol: 'EURUSD',
          close_date: '2017-11-15 05:57:33',
          ticket: 36555185,
          rule_name: '上-4-$-手',
          account_group_id: 0,
          close_volume_pt: 0.0,
          open_volume_pt: 0.0,
          login: 3009,
          balance_unit: '1',
          volume: 1.0,
          close_volume: 1.0,
          parent_id: 6,
          balance_type: '$',
          commission: 7.0,
          detail_value: '7',
          money_1: 7.0,
          open_close_volume: 2.0,
          group: 'ATEST'
        },
        {
          open_date: '2017-11-15',
          symbol: 'EURUSD',
          close_date: '2017-11-15 03:18:43',
          ticket: 36555162,
          rule_name: '上-4-$-手',
          account_group_id: 0,
          close_volume_pt: 0.0,
          open_volume_pt: 0.0,
          login: 3009,
          balance_unit: '1',
          volume: 1.0,
          close_volume: 1.0,
          parent_id: 6,
          balance_type: '$',
          commission: 7.0,
          detail_value: '7',
          money_1: 7.0,
          open_close_volume: 2.0,
          group: 'ATEST'
        }
      ],
      offset: 0,
      pager: 1,
      pages: 1,
      size: 20,
      sta: {
        create_time_to: '2017-11-23',
        login: '3009',
        serverId: '454',
        objectType: '6',
        reportType: 'LotsDetailOrder',
        sortDirection: 'asc',
        my_user_id: '6',
        balance_type: '2',
        id: '1',
        exp: '0',
        lang: 'zhCN',
        mt_real: 'mt4',
        accountQueryItem: '',
        mt: 'mt4',
        balance_unit: '1',
        accountQueryValue: '',
        myPubId: '7ecbbb8b-1656-425c-bdab-13b29f494590',
        reporttype_lots_detail_adapter_totalNumberOfEntries: '3',
        create_time_from: '2017-10-25'
      },
      total: 3
    },
    mcode: 'm0000000',
    result: true,
    time: 1511435926225
  });
}
describe('客户业绩签约报表模块的List', () => {
  const customerSigningReportList = {
    list: [
      {
        billReceivable: 102.99,
        billTotal: 112.99,
        customerId: '420a71e4-3b70-4839-870f-2fe5f495f458',
        customerName: '付款测试',
        customerNo: 'CBHH2X',
        customerState: 'Payed',
        firstBillTime: '2018-01-31',
        firstPayTime: '2018-01-31',
        lifeCycle: 3,
        oweId: '1',
        oweName: 'Admin',
        payState: 'unPay',
        refundTotal: 10
      }
    ]
  };
  const state = {
    showDetailModal: false
  };

  const wrap = shallow(
    <List
      state={state}
      currentNeedRefresh={''}
      customerSigningReportList={customerSigningReportList}
      agentDepositListcolumns={CUSTOMER_SIGNING_PERFORMANCE_REPORT_HEDER}
      updateNeedRefresh={fn}
      params={{}}
      innerParams={{}}
      modifyInnerParams={fn}
      getCustomerSigningDetailList={fn}
      getCustomerSigningDetailList={getCustomerSigningDetailList}
    />
  );
  it('如果点击详情按钮出现详情modal', () => {
    wrap.find('[data-test="showDetailModal"]').simulate('click');
    Promise.resolve().then(() => {
      expect(wrap.state().showDetailModal).toEqual(true);
    });
  });
});
