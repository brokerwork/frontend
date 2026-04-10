import { shallow } from 'enzyme';
import { RistWarning } from '../Withdraw';
const accountForTask = {
  accounts: [],
  ticket: { tradeList: [] }
};
const identical = [];

const normalAccount = {
  accountId: '1234580209',
  balance: 9759,
  credit: 0,
  equity: 1,
  marginFree: 1,
  profit: 1
};
const normalTicket = {
  ticket: '123'
};
const normalIdentical = {
  jobType: 'JOB_TYPE_AGENCY_WITHDRAW',
  jobNo: '12445',
  currency: 'USD',
  withdrawAmount: 1000
};

describe('出金风险提示', () => {
  const initialValues = {
    externalData: {}
  };
  const wrap = shallow(<RistWarning initialValues={initialValues} />);

  describe('同名账户到提示', () => {
    describe('没有同账户列表时', () => {
      wrap.setProps({
        initialValues: initialValues
      });
      wrap.update();
      it('不显示同名账户提示', () => {
        expect(wrap.find('[data-test="account-item"]').exists()).toBe(false);
      });
    });
    describe('有同名账户时', () => {
      beforeEach(() => {
        wrap.setProps({
          initialValues: {
            externalData: {
              accountForTask: {
                accounts: [
                  {
                    ...normalAccount,
                    balance: -1
                  }
                ]
              }
            }
          }
        });
        wrap.update();
      });
      it('显示同名账户提示', () => {
        expect(wrap.find('[data-test="account-item"]').exists()).toBe(true);
      });
    });

    describe('持仓单提示', () => {
      describe('没有持仓单时', () => {
        beforeEach(() => {
          wrap.setProps({
            initialValues: initialValues
          });
          wrap.update();
        });
        it('不显示同名账户提示', () => {
          expect(wrap.find('[data-test="ticket-item"]').exists()).toBe(false);
        });
      });
      describe('有持仓单时', () => {
        beforeEach(() => {
          wrap.setProps({
            initialValues: {
              externalData: {
                accountForTask: {
                  ticket: { tradeList: [normalTicket] }
                }
              }
            }
          });
          wrap.update();
        });
        it('显示同名账户提示', () => {
          expect(wrap.find('[data-test="ticket-item"]').exists()).toBe(true);
        });
      });
    });

    describe('有同账出金转账任务提示', () => {
      describe('没有相关任务时', () => {
        beforeEach(() => {
          wrap.setProps({
            initialValues: initialValues
          });
          wrap.update();
        });
        it('不显示相关任务提示', () => {
          expect(wrap.find('[data-test="job-item"]').exists()).toBe(false);
        });
      });
      describe('有相关任务时', () => {
        beforeEach(() => {
          wrap.setProps({
            initialValues: {
              externalData: {
                identical: [normalIdentical]
              }
            }
          });
          wrap.update();
        });
        it('显示相关任务提示', () => {
          expect(wrap.find('[data-test="job-item"]').exists()).toBe(true);
        });
      });
    });
  });
});
