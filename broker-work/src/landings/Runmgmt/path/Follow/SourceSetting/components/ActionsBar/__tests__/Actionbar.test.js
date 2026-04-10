import { shallow } from 'enzyme';
import SourceSettingActionBar from '../index';

const searchParams = {
  currPage: 1,
  pageSize: 20,
  state: 3,
  type: 0,
  orderValue: '',
  tradeName: '',
  sort: ''
};
const userRights = {
  OPERATION_COPY_PLATFORM: true
};

function getSourceList() {}

describe('跟单 SourceSettingActionBar', () => {
  const wrap = shallow(
    <SourceSettingActionBar
      userRights={userRights}
      searchParams={searchParams}
      getSourceList={getSourceList}
    />
  );
  it('SourceSettingActionBar 渲染', () => {
    expect(wrap.find('[data-test="action-bar"]').exists()).toBe(true);
  });
});
