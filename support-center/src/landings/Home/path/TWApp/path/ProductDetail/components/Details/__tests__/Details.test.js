import { shallow } from 'enzyme';
import Details from '../index.js';
import Form from 'components/Form';
function fn() {}
describe('产品详情部分', () => {
  const produceDetail={
    appLogos:[]
  };
  const wrap = shallow(
    <Details 
      produceDetail={produceDetail}  
      monthCharge={{}}
    />
  );
  it('代理保证金报表只有一个form组件', () => {
    expect(wrap.find('Form').exists()).toBe(true);
  });
});
