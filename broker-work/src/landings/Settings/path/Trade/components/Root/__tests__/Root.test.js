import { shallow } from 'enzyme';
import AccountTradeSetting from '../index.js';
import Radio from 'components/Radio';
import UpdateAccountModal from '../../../containers/UpdateAccountModal';
function fn() {}
describe('交易模式设置上半部分', () => {
  const serverGroupList = [
    {
      groups: [
        'ATEST',
        'BTEST',
        'OliTestLMAX15',
        'OliTestLMAX150',
        'OliTestLMAX0',
        'OliTestSaxo1'
      ],
      serverId: '428',
      serverName: 'mt4-100'
    }
  ];
  const tradeSetting = {
    enabled: 0,
    id: 0,
    mt4Groups: [],
    users: []
  };
  const wrap = shallow(
    <AccountTradeSetting
      tradeSetting={tradeSetting}
      serverGroupList={serverGroupList}
      getAccountList={fn}
    />
  );
  it('交易模式设置有与代理结算radio组', () => {
    expect(wrap.find('Radio').exists()).toBe(true);
  });
  it('交易模式设置有提醒邮箱', () => {
    expect(wrap.find('.form-control').exists()).toBe(true);
  });
  it('交易模式设置有代理列表', () => {
    expect(wrap.find('[data-test="agent-table"]').exists()).toBe(true);
  });
  it('模拟点击添加代理按钮', () => {
    wrap.setState({ showUpdateAccountModal: true });
    expect(wrap.state().showUpdateAccountModal).toEqual(true);
  });
});
