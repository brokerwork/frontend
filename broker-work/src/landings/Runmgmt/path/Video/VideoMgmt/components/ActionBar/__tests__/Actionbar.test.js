import { shallow } from 'enzyme';
import ActionsBar from '../index.js';
import i18n from 'utils/i18n';

describe('点播管理actionbar', () => {
  const tenantRights = {
    liveExpire: false,
    liveFlux: 7168,
    usedLiveFlux: 8467.913999999999,
    usedVideoDisk: 13031.49,
    videoDisk: 13312,
    videoExpire: false
  };
  const wrap = shallow(
    <ActionsBar tenantRights={tenantRights} selectedVideoIds={[]} />
  );
  it('新增点播存储空间展示条', () => {
    expect(wrap.find('[data-test="disk-part"]').exists()).toBe(true);
  });
});
