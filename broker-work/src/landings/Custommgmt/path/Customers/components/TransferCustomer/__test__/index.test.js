import { shallow } from 'enzyme';
import TransferCustomer from '../index';

describe('transfer customer', () => {
  const wrap = shallow(<TransferCustomer />);
  it('渲染成功', () => {
    expect(wrap.find('[data-test="transfer-customer"]').exists()).toBe(true);
  });
});
