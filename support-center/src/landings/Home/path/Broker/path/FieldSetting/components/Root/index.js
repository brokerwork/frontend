import Nav from 'components/Nav';
import ContentWrapper from 'components/ContentWrapper';
import AccountOwnerInfo from '../../containers/AccountOwnerInfo';
import AccountInfo from '../../containers/AccountInfo';
import CustomerInfo from '../../containers/CustomerInfo';
import UserInfo from '../../containers/UserInfo';
import Nation from '../../containers/Nation';
import cs from './Root.less';
import i18n from 'utils/i18n';


export default class Root extends PureComponent {
  state = {
    activeKey: 'accountOwnerInfo'
  }

  componentDidMount() {
    const { getFieldType } = this.props;

    getFieldType();
  }

  onChange = (activeKey) => {
    this.setState({
      activeKey
    });
  }

  render() {
    const { activeKey } = this.state;

    return (
      <ContentWrapper header={i18n['left.menu.field.setting']}>
        <Nav activeKey={activeKey} onChange={this.onChange} className={cs['nav']}>
          <Nav.Item eventKey="accountOwnerInfo">
            {i18n['field.setting.field.form.account1']}
          </Nav.Item>
          <Nav.Item eventKey="accountInfo">
            {i18n['field.setting.field.form.account2']}
          </Nav.Item>
          <Nav.Item eventKey="customerInfo">
            {i18n['field.setting.field.form.customer']}
          </Nav.Item>
          <Nav.Item eventKey="userInfo">
            {i18n['field.setting.field.form.user']}
          </Nav.Item> 
          <Nav.Item eventKey="nationList">
            {i18n['field.setting.field.form.nation']}
          </Nav.Item>
        </Nav>
        {activeKey === 'accountOwnerInfo'
          ? <AccountOwnerInfo></AccountOwnerInfo>
          : undefined}
        {activeKey === 'accountInfo'
          ? <AccountInfo></AccountInfo>
          : undefined}
        {activeKey === 'customerInfo'
          ? <CustomerInfo></CustomerInfo>
          : undefined}
        {activeKey === 'userInfo'
          ? <UserInfo></UserInfo>
          : undefined}
        {activeKey === 'nationList'
          ? <Nation></Nation>
          : undefined}
      </ContentWrapper>
    );
  }
}