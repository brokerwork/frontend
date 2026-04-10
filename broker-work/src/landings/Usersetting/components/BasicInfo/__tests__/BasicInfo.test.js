import { shallow } from 'enzyme';
import BasicInfo from '../index.js';
import { Tabs, Tab, Panel } from 'react-bootstrap';
import BasicInfoForm from '../../../containers/BasicInfoForm';
import OtherInfoForm from '../../../containers/OtherInfoForm';

describe('个人资料页', () => {
  const wrap = shallow(
    <BasicInfo userRights={[]} userAgentColumns={[]} userInfo={{}} />
  );
  it('应该包含tab', () => {
    expect(wrap.find('Tab').exists()).toBe(true);
  });
  it('应该包含其他信息的tab', () => {
    expect(wrap.find(OtherInfoForm).exists()).toBe(true);
  });
  it('应该包含基本信息的tab', () => {
    expect(wrap.find(BasicInfoForm).exists()).toBe(true);
  });
});
