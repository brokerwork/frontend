import { taskSyncGroup } from '../ObjectSettingActions';

describe('任务设置 action 测试', () => {
  it('更新任务Mt组', () => {
    // 数据模拟
    const itemId = 1235;
    // nock.get(`/v1/job/setting/${itemId}/synRefresh}`).reply(200, {
    //   result: true
    // });
    const action = taskSyncGroup(itemId);
    // action 格式检查
    expect(action).toEqual({
      type: expect.any(String),
      payload: expect.any(Function)
    });
  });
});
