import i18n from 'utils/i18n';
import PagePanel from 'components/PagePanel';
import ContactsActionBar from '../../containers/ContactsActionBar';
import ContactsList from '../../containers/ContactsList';
import { MENUS } from 'utils/headerMenus';
import setPageTitle from 'utils/setPageTitle';

export default class ContactsRoot extends PureComponent {
  componentDidMount() {
    const { brandInfo } = this.props;

    if (brandInfo.siteName) {
      const moduleName = MENUS.find(item => item.id === 'custommgmt').label;

      setPageTitle(`${brandInfo.siteName} - ${moduleName}`);
    }
  }

  render() {
    const props = this.props;
    return (
      <PagePanel>
        <PagePanel.Header>
          {i18n['navigation.customer.contacts_mgmt']}
        </PagePanel.Header>
        <PagePanel.Body>
          <ContactsActionBar />
          <ContactsList {...props} />
        </PagePanel.Body>
      </PagePanel>
    );
  }
}
