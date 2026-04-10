import { getCustomerFormFields, getIsAdaptOn } from '../actions';
import { INNER_CUSTOMER_MORE_FIELDS } from '../../constant';
describe('客户 action 测试', () => {
  describe('获取客户表单action', () => {
    it('格式检查', () => {
      nock
        .get(
          '/v1/tenants/metadata/form-field/list?tableName=t_customer_profiles'
        )
        .reply(200, {
          result: true,
          data: []
        });
      const action = getCustomerFormFields('outer');
      expect(action).toEqual({
        type: expect.any(String),
        payload: expect.any(Promise)
      });
      // payload 回调
      return expect(action.payload).resolves.toEqual({
        result: expect.any(Boolean),
        data: expect.any(Array)
      });
    });
    it('外部租户不会得到额外字段', () => {
      nock
        .get(
          '/v1/tenants/metadata/form-field/list?tableName=t_customer_profiles'
        )
        .reply(200, {
          result: true,
          data: []
        });
      const action = getCustomerFormFields('outer');
      return expect(action.payload).resolves.toMatchObject({
        result: true,
        data: []
      });
    });
    it('内部租户会得到额外字段', () => {
      nock
        .get(
          '/v1/tenants/metadata/form-field/list?tableName=t_customer_profiles'
        )
        .reply(200, {
          result: true,
          data: []
        });
      const action = getCustomerFormFields('inner');
      return expect(action.payload).resolves.toMatchObject({
        result: true,
        data: INNER_CUSTOMER_MORE_FIELDS
      });
    });
  });

  describe('获得是否显示测试结果action', () => {
    nock.get('/v1/tenants/metadata/switch/question').reply(200, {
      result: true,
      data: true
    });
    const action = getIsAdaptOn('outer');
    expect(action).toEqual({
      type: expect.any(String),
      payload: expect.any(Promise)
    });
    // payload 回调
    return expect(action.payload).resolves.toEqual({
      result: expect.any(Boolean),
      data: expect.any(Boolean)
    });
  });
});
