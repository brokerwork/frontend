import { shallow } from 'enzyme';
import ActionBar from '../index.js';
import Dropdown, { DropdownForCode } from 'components/Dropdown';

describe('用户模块的actionbar', () => {
  const wrap = shallow(
    <ActionBar
      options={{}}
      selectedUsers={[]}
      params={{}}
      userRights={['USER_ADD', 'USER_ADD_BASIC']}
      commissionShowStatus={[]}
      listColumns={[]}
    />
  );
  it('当有添加权限时必须有一个添加按钮', () => {
    expect(wrap.find('[data-test="addUserButton"]').exists()).toBe(false);
  });
  it('只有一个Dropdown的下拉范围选择增加搜索', () => {
    expect(wrap.find('Dropdown').prop('searchable')).toEqual(true);
  });
});
