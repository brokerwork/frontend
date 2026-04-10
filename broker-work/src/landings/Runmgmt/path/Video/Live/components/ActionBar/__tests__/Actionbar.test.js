import { shallow } from 'enzyme';
import ActionsBar from '../index.js';
import i18n from 'utils/i18n';

describe('直播管理actionbar', () => {
  const tenantRights = {
    liveExpire: false,
    liveFlux: 7168,
    usedLiveFlux: 8467.913999999999,
    usedVideoDisk: 13031.49,
    videoDisk: 13312,
    videoExpire: false
  };
  const listType = {
    label: i18n['video.video_root.video_list'],
    value: 'LIVE'
  };
  const searchParams = {
    page: 1,
    size: 20,
    state: 'NOTFINISHED',
    subject: '',
    pubState: 'PUBBED',
    sortby: 'createTime',
    orderDesc: true
  };
  const wrap = shallow(
    <ActionsBar
      tenantRights={tenantRights}
      selectedLiveIds={[]}
      searchParams={searchParams}
      listType={listType}
    />
  );
  it('新增直播流量展示条', () => {
    expect(wrap.find('[data-test="flux-part"]').exists()).toBe(true);
  });
  it('新增管理员处理按钮', () => {
    expect(wrap.find('[data-test="admin-button"]').exists()).toBe(true);
  });
});
