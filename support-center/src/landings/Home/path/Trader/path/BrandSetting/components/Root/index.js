import ContentWrapper from 'components/ContentWrapper';
import Tab from 'components/Tab';
import i18n from 'utils/i18n';
import UpdateBrandInfo from '../../containers/UpdateBrandInfo';
import CustomNav from '../../containers/CustomNav';
import cs from './Root.less';

export default class Root extends PureComponent {
  state = {
    activeKey: 'brand',
    isRenderNav: this.props.versionRights && this.props.versionRights['SC_TW_NAVIGATION']
  };
  componentDidMount() {
    const { getBrandInfo, getThemeList } = this.props;
    getBrandInfo();
    getThemeList();
  }

  render() {
    const { activeKey, isRenderNav } = this.state;
    return (
      <ContentWrapper bodyContentClass={cs.content_height} header={i18n['left.menu.brand.setting']}>
        <div className={cs.mt5Setting}>
          {isRenderNav ? (
            <Tab
              activeKey={activeKey}
              onChange={activeKey => {
                this.setState({ activeKey });
              }}
              className={cs.setting_tab}
            >
              <Tab.Panel className={cs.setting_tabpanel} title={i18n['twapp.brand_setting.header']} eventKey="brand">
                <UpdateBrandInfo />
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
                <UpdateBrandInfo />
              </Tab.Panel>
            </Tab>
          )}
        </div>
      </ContentWrapper>
    );
  }
}
