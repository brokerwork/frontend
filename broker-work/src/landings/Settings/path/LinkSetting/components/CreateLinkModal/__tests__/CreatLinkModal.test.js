import { shallow } from 'enzyme';
import CreateLinkModal from '../index.js';
import WebForm, { WEB_FORM } from '../WebForm';
import { reduxForm, Field } from 'redux-form';

function fn() {}
describe('推广链接增加内部crm设置', () => {
  const brandInfo = {
    tenantId: 'T000004'
  };
  const wrap = shallow(
    <CreateLinkModal
      brandInfo={brandInfo}
      linkList={[]}
      serverList={[]}
      mtGroupList={[]}
      leverageList={[]}
      userGroupList={[]}
      createLink={fn}
      updateLink={fn}
      getMTGroupList={fn}
      onSave={fn}
      clearMTGroupList={fn}
      getUserGroupList={fn}
      getLeverageList={fn}
      clearUserGroupList={fn}
      clearLeverageList={fn}
    />
  );
  it('有webform', () => {
    expect(wrap.find(WebForm).exists()).toEqual(true);
  });
});
