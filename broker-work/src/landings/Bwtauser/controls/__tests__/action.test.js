import { updateUserPassword } from '../actions';

describe('用户管理 action 测试', () => {
  it('获取用户下级', () => {
    // 数据模拟
    const id = 1235;
    const newPwd = 123456;
    nock
      .post(`/v1/ta/user/mng/${id}/set`, {
        newPwd: newPwd
      })
      .reply(200, {
        result: true,
        data: {}
      });
    const action = updateUserPassword(id, newPwd);
    // action 格式检查
    expect(action).toEqual({
      type: expect.any(String),
      payload: expect.any(Promise)
    });
    // payload 回调
    expect.assertions(1);
    expect(action.payload).resolves.toEqual({
      result: expect.any(Boolean),
      data: expect.any(Object)
    });
  });
});
