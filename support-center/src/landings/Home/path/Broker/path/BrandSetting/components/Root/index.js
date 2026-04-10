import ContentWrapper from 'components/ContentWrapper';
import i18n from 'utils/i18n';
import UpdateBrandInfo from '../../containers/UpdateBrandInfo';
import CustomNav from '../../containers/CustomNav';
import Tab from 'components/Tab';
import cs from './index.less';

export default class Root extends PureComponent {
  state = {
    activeKey: 'brand'
  };
  componentDidMount() {
    const { getBrandInfo } = this.props;
    getBrandInfo();
  }
  render() {
    const { activeKey } = this.state;
    const { versionRights } = this.props;
    return (
      <ContentWrapper bodyContentClass={cs.content_height} header={i18n['left.menu.brand.setting']}>
        <div className={cs.mt5Setting}>
          {versionRights['SC_BW_NAVIGATION'] ? (
            <Tab
              activeKey={activeKey}
              onChange={activeKey => {
                this.setState({ activeKey });
              }}
              className={cs.setting_tab}
            >
              <Tab.Panel className={cs.setting_tabpanel} title={i18n['twapp.brand_setting.header']} eventKey="brand">
                <UpdateBrandInfo {...this.props} />
              </Tab.Panel>
              <Tab.Panel
                className={cs.setting_tabpanel}
                title={i18n['twapp.brand_setting.tab_nav_header']}
                eventKey="navigation"
              >
                <CustomNav />
              </Tab.Panel>
            </Tab>
          ) : (
            <Tab activeKey={activeKey} className={cs.setting_tab}>
              <Tab.Panel className={cs.setting_tabpanel} title={i18n['left.menu.brand.setting']} eventKey="brand">
                <UpdateBrandInfo {...this.props} />
              </Tab.Panel>
            </Tab>
          )}
        </div>
      </ContentWrapper>
    );
  }
}
