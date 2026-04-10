import { shallow } from 'enzyme';
import DepositRoot from '../index.js';
import Form from 'components/Form';
import { Tabs, Tab, Panel } from 'react-bootstrap';
import StatisticalReport from '../../../containers/StatisticalReport';
import ProfitReport from '../../../containers/ProfitReport';
function fn() {}
describe('保证金详情部分', () => {
  const wrap = shallow(<DepositRoot getDepositByUserId={fn} />);
  it('保证金详情上半部分表单', () => {
    expect(wrap.find('Form').exists()).toBe(true);
  });
  it('保证金详情Tab', () => {
    expect(wrap.find('Tab').exists()).toBe(true);
  });
  it('当activeKey等于1的时候是客户持仓表单', () => {
    wrap.setState({ activeKey: 1 });
    expect(wrap.find(StatisticalReport).exists()).toBe(true);
  });
  it('当activeKey等于3的时候是客户持仓表单', () => {
    wrap.setState({ activeKey: 3 });
    expect(wrap.find(ProfitReport).exists()).toBe(true);
  });
  it('保证金详情上半部分表单增加账户总余额字段', () => {
    expect(wrap.find('Form').children()).toHaveLength(7);
  });
});
