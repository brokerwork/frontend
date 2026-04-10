import { shallow } from 'enzyme';
import Chart from '../index.js';

const props = {
  labels: [
    '2017-12-14',
    '2017-12-15',
    '2017-12-16',
    '2017-12-17',
    '2017-12-18',
    '2017-12-19',
    '2017-12-20'
  ],
  data: [
    {
      NEW_NET_DEPOSIT_PAGE: 1822040,
      NEW_WITHDRAWAL_PAGE: 112,
      NEW_DEAL_PAGE: 26,
      NEW_DEPOSIT_PAGE: 1822152
    },
    {
      NEW_NET_DEPOSIT_PAGE: 2060330200,
      NEW_WITHDRAWAL_PAGE: 3950509.6,
      NEW_DEAL_PAGE: 38.04,
      NEW_DEPOSIT_PAGE: 2064280709.6
    },
    {
      NEW_NET_DEPOSIT_PAGE: 1.28,
      NEW_WITHDRAWAL_PAGE: 153.28,
      NEW_DEAL_PAGE: 0,
      NEW_DEPOSIT_PAGE: 152
    },
    {
      NEW_NET_DEPOSIT_PAGE: 0,
      NEW_WITHDRAWAL_PAGE: 0,
      NEW_DEAL_PAGE: 0,
      NEW_DEPOSIT_PAGE: 0
    },
    {
      NEW_NET_DEPOSIT_PAGE: 244064.42,
      NEW_WITHDRAWAL_PAGE: 16148.24,
      NEW_DEAL_PAGE: 26.28,
      NEW_DEPOSIT_PAGE: 260212.66
    },
    {
      NEW_NET_DEPOSIT_PAGE: 560816.44,
      NEW_WITHDRAWAL_PAGE: 16148.24,
      NEW_DEAL_PAGE: 66.06,
      NEW_DEPOSIT_PAGE: 576964.68
    },
    {
      NEW_NET_DEPOSIT_PAGE: 20000,
      NEW_WITHDRAWAL_PAGE: 0,
      NEW_DEAL_PAGE: 2000,
      NEW_DEPOSIT_PAGE: 20000
    }
  ],
  searchParams: {
    timeRange: 'DAY',
    fromTime: '2017-12-13T16:00:00.000Z',
    toTime: '2017-12-20T15:59:59.999Z',
    type: 'TRADE_PANEL'
  },
  rights: {
    commission: true,
    newAccount: true,
    newCustomer: true,
    trade: true,
    deal: true,
    profit: true,
    position: true
  }
};

const modifyParams = () => {};

describe('资金交易趋势图', () => {
  const wrap = shallow(<Chart {...props} modifyParams={modifyParams} />);
  it('显示', () => {
    setTimeout(() => {
      expect(wrap.state('activeDataKey')).toBe(
        'NEW_DEPOSIT_PAGE,NEW_WITHDRAWAL_PAGE,NEW_NET_DEPOSIT_PAGE'
      );
      expect(wrap.find('[data-test="negative-line-bar"]').exists()).toBe(true);
    });
  });
  it('切换 nav', () => {
    wrap
      .find('.nav li')
      .at(1)
      .simulate('click');
    expect(wrap.find('[data-test="line"]').exists()).toBe(true);
  });
});
