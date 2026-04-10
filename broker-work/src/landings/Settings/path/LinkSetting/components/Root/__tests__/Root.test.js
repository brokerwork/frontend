import { shallow } from 'enzyme';
import LinkSetting from '../index.js';
import Table from 'components/Table';
import {
  PLATFORM_LIST,
  MOBILE_IDS,
  STATUS_LIST,
  WEB_HEADER,
  MOBILE_HEADER,
  STRAIGHTGUEST_STATISTIC_HEADER,
  AGENT_STATISTIC_HEADER
} from '../../../constant';
function fn() {}
describe('推广链接设置', () => {
  const wrap = shallow(<LinkSetting brandInfo={{}} linkList={[]} />);
  it('有推广链接列表', () => {
    expect(wrap.find('Table').exists()).toBe(true);
  });
});
