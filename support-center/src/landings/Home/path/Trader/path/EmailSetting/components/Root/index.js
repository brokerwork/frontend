import ContentWrapper from 'components/ContentWrapper';
import Tab from 'components/Tab';
import List from '../../containers/List';
import Template from '../../containers/Template';
import ViewNewTemplate from '../../containers/ViewNewTemplates';
import i18n from 'utils/i18n';

export default class Root extends PureComponent {
  state = {
    activeKey: 'list',
    showTempViewer: false
  };

  componentDidMount() {
    const { getEmailProvider } = this.props;

    getEmailProvider();
  }

  onChange = activeKey => {
    this.setState({
      activeKey
    });
  };

  toggleTempViewer = () => {
    this.setState({
      showTempViewer: !this.state.showTempViewer
    });
  };

  render() {
    const { activeKey, showTempViewer } = this.state;

    return showTempViewer ? (
      <ViewNewTemplate toggleTempViewer={this.toggleTempViewer} />
    ) : (
      <ContentWrapper header={i18n['left.menu.email.setting']}>
        <Tab activeKey={activeKey} onChange={this.onChange}>
          <Tab.Panel title={i18n['email.setting.smtp.title']} eventKey="list">
            <List />
          </Tab.Panel>
          <Tab.Panel
            title={i18n['email.setting.template.title']}
            eventKey="template"
          >
            <Template toggleTempViewer={this.toggleTempViewer} />
          </Tab.Panel>
        </Tab>
      </ContentWrapper>
    );
  }
}
