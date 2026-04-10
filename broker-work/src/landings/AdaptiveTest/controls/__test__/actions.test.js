import { getTestResult } from '../actions';

describe('测试结果 action 测试', () => {
  it('获取测试结果', () => {
    // 数据模拟
    const id = 1235;
    const idType = 'ACCOUNT';
    nock
      .get(
        `/v2/account/owner/${id}/appropriatenessTestInfo/forTask?idType=${idType}`
      )
      .reply(200, {
        result: true,
        data: {}
      });
    const action = getTestResult(id, idType);
    // action 格式检查
    expect(action).toEqual({
      type: expect.any(String),
      payload: expect.any(Promise)
    });
    // payload 回调
    return expect(action.payload).resolves.toEqual({
      result: expect.any(Boolean),
      data: expect.any(Object)
    });
  });
});
