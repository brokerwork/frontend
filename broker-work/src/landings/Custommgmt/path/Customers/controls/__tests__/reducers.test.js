import { paginationInfo, customerDetailInfo, isAdaptOn } from '../reducers';
import {
  UPDATE_PAGENATION_INFO,
  UPDATE_PAGENATION_TOTAL,
  UPDATE_SEARCH_TYPE,
  UPDATE_STATE_TYPE,
  UPDATE_SEARCH_DATE,
  UPDATE_DATE_RANGE,
  UPDATE_FIELD_CONDITIONS,
  UPDATE_ADVANCED_LOGIC_TYPE,
  UPDATE_CURRENT_SOURCE,
  DO_FUZZY_SEARCH,
  GET_CUSTOMER_DETAIL_BY_ID,
  GET_IS_ADAPT_ON
} from '../actions';

import i18n from 'utils/i18n';

describe('客户管理 reducer 测试', () => {
  describe('分页信息管理', () => {
    const state = {
      currentPage: 1,
      pageSize: 20,
      total: 0
    };
    it('更新分页信息', () => {
      const payload = {
        currentPage: 2,
        pageSize: 10
      };
      const data = paginationInfo(state, {
        payload: payload,
        type: UPDATE_PAGENATION_INFO
      });
      expect(data).toMatchObject({
        ...state,
        ...payload
      });
    });
    it('更新分页总数', () => {
      const total = 100;

      const data = paginationInfo(state, {
        payload: 100,
        type: UPDATE_PAGENATION_TOTAL
      });
      expect(data).toMatchObject({
        ...state,
        total
      });
    });

    it('需要重置分页的actions', () => {
      [
        UPDATE_STATE_TYPE,
        UPDATE_SEARCH_DATE,
        UPDATE_DATE_RANGE,
        UPDATE_FIELD_CONDITIONS,
        UPDATE_ADVANCED_LOGIC_TYPE,
        UPDATE_CURRENT_SOURCE,
        DO_FUZZY_SEARCH
      ].forEach(() => {
        const data = paginationInfo(state, {
          type: UPDATE_SEARCH_TYPE
        });
        expect(data).toMatchObject({
          ...state,
          currentPage: 1
        });
      });
    });
  });
});

describe('客户管理 reducer 测试', () => {
  describe('客户流失状态测试', () => {
    it('流失客户', () => {
      const state = {};

      const data = customerDetailInfo(state, {
        payload: {
          isLost: true,
          customerState: 'Payed'
        },
        type: GET_CUSTOMER_DETAIL_BY_ID
      });
      expect(data).toMatchObject({
        ...state,
        virtualState: 'Lost'
      });
    });
    it('非流失客户', () => {
      const state = {};

      const data = customerDetailInfo(state, {
        payload: {
          isLost: false,
          customerState: 'Payed'
        },
        type: GET_CUSTOMER_DETAIL_BY_ID
      });
      expect(data).toMatchObject({
        ...state,
        virtualState: 'Payed'
      });
    });
  });
  describe('是否显示测试结果reducer测试', () => {
    it('不开启', () => {
      const state = {};
      const data = isAdaptOn(state, {
        payload: false,
        type: GET_IS_ADAPT_ON
      });
      expect(data).toBe(false);
    });
    it('开启', () => {
      const state = {};
      const data = isAdaptOn(state, {
        payload: true,
        type: GET_IS_ADAPT_ON
      });
      expect(data).toBe(true);
    });
  });
});
