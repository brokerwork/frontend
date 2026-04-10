import { modifyParams, MODIFY_PARAMS } from '../actions';
import moment from 'moment';
import { formatDateRangeByTimeUnit } from '../../utils';
import { DEFAULT_DATE_RANGE } from '../../contants';

const defaultParams = {
  customerState: '',
  product: '',
  type: 'refund_bill',
  timeUnit: 'month',
  filterType: '',
  fuzzyItem: 'CustomerName',
  pageSize: 20,
  sortBy: '2017-1',
  orderDesc: true,
  currentPage: 13,
  ...formatDateRangeByTimeUnit(DEFAULT_DATE_RANGE, 'month')
};

const initPage = {
  currentPage: 1
};

const initSort = {
  sortBy: undefined,
  orderDesc: undefined
};

const initPageSort = {
  ...initPage,
  ...initSort
};

const mookDispatch = data => {
  return data;
};

describe('修改参数action', () => {
  describe('变更时间范围', () => {
    const newRange = {
      startDate: 1519367530327,
      endDate: 1519367930327
    };
    const action = modifyParams(
      {
        searchDateRange: newRange
      },
      defaultParams
    );
    const result = expect(action.payload(mookDispatch));

    it('自动格式化时间单位', () => {
      //检查actions格式
      expect(action).toEqual({
        type: expect.any(String),
        payload: expect.any(Function)
      });

      result.toMatchObject({
        payload: {
          ...formatDateRangeByTimeUnit(newRange, 'month')
        }
      });
    });
    it('重置分页与排序', () => {
      result.toMatchObject({
        payload: initPageSort
      });
    });
  });

  describe('时间单位变更', () => {
    const action = modifyParams(
      {
        timeUnit: 'year'
      },
      defaultParams
    );
    const result = expect(action.payload(mookDispatch));
    it('自动初始化是将范围', () => {
      result.toMatchObject({
        payload: {
          ...formatDateRangeByTimeUnit(DEFAULT_DATE_RANGE, 'year')
        }
      });
    });
    it('更新时间单位', () => {
      result.toMatchObject({
        payload: {
          timeUnit: 'year'
        }
      });
    });
    it('重置分页与排序', () => {
      result.toMatchObject({
        payload: initPageSort
      });
    });
  });

  it('分页信息变更', () => {
    const action = modifyParams(
      {
        pageInfo: {
          pageNo: 2,
          pageSize: 30
        }
      },
      defaultParams
    );
    const result = expect(action.payload(mookDispatch));
    result.toMatchObject({
      payload: {
        currentPage: 2,
        pageSize: 30
      }
    });
  });

  describe('数据源类型变更', () => {
    const action = modifyParams(
      {
        type: 'refund'
      },
      defaultParams
    );
    const result = expect(action.payload(mookDispatch));

    it('更新数据源类型', () => {
      result.toMatchObject({
        payload: {
          type: 'refund'
        }
      });
    });
    it('重置分页与排序', () => {
      result.toMatchObject({
        payload: initPageSort
      });
    });

    describe('如果类型为income', () => {
      const incomeAction = modifyParams(
        {
          type: 'income'
        },
        defaultParams
      );

      it('重置已选择产品', () => {
        expect(incomeAction.payload(mookDispatch)).toMatchObject({
          payload: {
            product: ''
          }
        });
      });
    });
  });

  describe('更改其他信息', () => {
    it('非triggerFuzzy参数将更新', () => {
      const params = {
        fuzzyItem: '123',
        fuzzyValue: 123,
        customerState: '222',
        sortBy: '2012-1',
        orderDesc: true
      };
      expect(
        modifyParams(params, defaultParams).payload(mookDispatch)
      ).toMatchObject({ payload: params });
    });
    it('triggerFuzzy参数将忽略', () => {
      const action = modifyParams({ triggerFuzzy: true }, defaultParams);
      return expect(action.payload(mookDispatch)).resolves.toBeUndefined();
    });
  });
});
