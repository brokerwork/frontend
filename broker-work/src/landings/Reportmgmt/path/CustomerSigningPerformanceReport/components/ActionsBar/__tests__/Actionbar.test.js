import { shallow } from 'enzyme';
import ActionsBar from '../index.js';
import Dropdown, { DropdownForCode } from 'components/Dropdown';
import {
  CUSTOMER_SIGNING_TYPE,
  PAYMENT_STATUS,
  ACTION_BAR_SEARCH_TYPE,
  PAYMENT_TIME_OPTIONS,
  PAYMENT_SEARCH_OPTIONS
} from '../../../constant';
function fn() {}
describe('客户签约业绩报表的actionbar', () => {
  const wrap = shallow(
    <ActionsBar
      searchTypes={ACTION_BAR_SEARCH_TYPE}
      accountQueryItem={PAYMENT_SEARCH_OPTIONS[0]}
      accountQueryValue={''}
      params={{}}
      getCustomerSigningList={fn}
    />
  );
  it('客户签约业绩报表有5个下拉筛选的条件筛选框', () => {
    expect(wrap.find('Dropdown')).toHaveLength(5);
  });
});
