import { shallow } from 'enzyme';
import AgentDepositActionBar from '../index.js';
import Dropdown, { DropdownForCode } from 'components/Dropdown';
import { AGENT_SEARCH_TYPE } from '../../../../../constant';
function fn() {}
describe('代理保证金报表的actionbar', () => {
  const wrap = shallow(
    <AgentDepositActionBar
      searchType={AGENT_SEARCH_TYPE}
      accountQueryItem={AGENT_SEARCH_TYPE[0]}
      accountQueryValue={''}
      updateAgentDepositColumns={fn}
      getSearchType={fn}
    />
  );
  it('代理保证金报表只有一个搜索框', () => {
    expect(wrap.find('[data-test="search-Input"]').exists()).toBe(true);
  });
});
