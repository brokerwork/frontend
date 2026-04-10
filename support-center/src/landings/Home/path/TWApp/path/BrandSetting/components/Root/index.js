import ContentWrapper from 'components/ContentWrapper';
import i18n from 'utils/i18n';
import Tab from 'components/Tab';
import BrandUpdate from '../../containers/BrandUpdate';
import Disclaimer from '../../containers/Disclaimer';
import Aboutus from '../../containers/Aboutus';


export default class Root extends PureComponent {
  state = { activeKey: "1" }
  onActiveKeyChange = (v) => {
    this.setState({
      activeKey: v
    });
  }
  render() {
    const { activeKey } = this.state;
    return (
      <ContentWrapper header={i18n['twapp.brand_setting.header']}>
        <Tab activeKey={activeKey} onChange={this.onActiveKeyChange}>
          <Tab.Panel title={i18n['twapp.brand_setting.launch_screen']} eventKey="1">
            <BrandUpdate />
          </Tab.Panel>
          <Tab.Panel title={i18n['twapp.brand_setting.disclaimer']} eventKey="2">
            <Disclaimer type="disclaimer" />
          </Tab.Panel>
          <Tab.Panel title={i18n['twapp.brand_setting.aboutus']} eventKey="3">
            <Aboutus type="aboutus" />
          </Tab.Panel>
        </Tab>
      </ContentWrapper>
    );
  }
}