import { shallow } from 'enzyme';
import VendorList from '../index.js';
import Table from 'components/Table';
function fn() {}
describe('服务器设置部分', () => {

  const wrap = shallow(
    <VendorList 
      vendorInfo={[]}  
      getVendorInfo={fn}
    />
  );
  it('代理保证金报表只有一个Table组件', () => {
    expect(wrap.find('Table').exists()).toBe(true);
  });
});
