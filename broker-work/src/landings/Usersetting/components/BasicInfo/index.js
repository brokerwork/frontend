import { Card, Tabs } from 'lean-ui';
import BasicInfoForm from '../../containers/BasicInfoForm';
import OtherInfoForm from '../../containers/OtherInfoForm';
import Points from 'landings/Points';
import i18n from 'utils/i18n';
import cs from './BasicInfo.less';
import { COUNTRY_PROVINCE_CITY_KEY, BASIC_INFO_COLUMNS } from '../../constant';
import setPageTitle from 'utils/setPageTitle';
const TabPane = Tabs.TabPane;
export default class BasicInfo extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      activeKey: '1'
    };
  }
  componentDidMount() {
    const {
      getRoleList,
      getUserList,
      getServerList,
      brandInfo,
      getUserAgentFormColumns
    } = this.props;
    if (brandInfo.siteName) {
      setPageTitle(
        `${brandInfo.siteName} - ${
          i18n['navigation.personal_center.module_name']
        }`
      );
    }
    getRoleList();
    getUserList();
    getServerList();
    getUserAgentFormColumns();
  }

  updateBasicInfo = data => {
    const { updateUserInfo, showTopAlert } = this.props;
    const copyData = {
      ...data,
      ...data[COUNTRY_PROVINCE_CITY_KEY],
      region: data[COUNTRY_PROVINCE_CITY_KEY]
    };

    delete copyData[COUNTRY_PROVINCE_CITY_KEY];
    updateUserInfo(copyData).then(({ result }) => {
      if (result) {
        showTopAlert({
          bsStyle: 'success',
          content: i18n['general.modify_success']
        });
      }
    });
  };

  updateOtherInfo = data => {
    const { updateUserInfo, showTopAlert } = this.props;
    const copyData = {
      ...data,
      ...data[COUNTRY_PROVINCE_CITY_KEY],
      region: data[COUNTRY_PROVINCE_CITY_KEY]
    };

    delete copyData[COUNTRY_PROVINCE_CITY_KEY];
    updateUserInfo(copyData).then(({ result }) => {
      if (result) {
        showTopAlert({
          bsStyle: 'success',
          content: i18n['general.modify_success']
        });
      }
    });
  };

  parseInfo = () => {
    const { userInfo } = this.props;
    const copyData = JSON.parse(JSON.stringify(userInfo));

    copyData[COUNTRY_PROVINCE_CITY_KEY] = {
      country: copyData.country,
      province: copyData.province,
      city: copyData.city
    };

    if (/^data:image/.test(copyData.headImage)) {
      delete copyData.headImage;
    }

    return copyData;
  };
  toggleTab = key => {
    this.setState({
      activeKey: key
    });
  };
  render() {
    const { userRights, userAgentColumns } = this.props;
    const { activeKey } = this.state;
    const info = this.parseInfo();
    const disabled = !userRights['BW_USER_PERSONAL_DATA'];
    let moreFileds = userAgentColumns.filter(item => {
      return !BASIC_INFO_COLUMNS.some(_item => _item.key === item.key);
    });
    moreFileds.forEach(el => {
      if (el.key === 'bankAccount') {
        el.type = 'edit';
      }
    });
    return (
      <Card>
        <div className={cs['head']}>
          {i18n['user_setting.basic_info.basic_info']}
        </div>
        <Points style={{ marginLeft: 12, marginRight: 12 }} id={info.id} />

        <div className={cs['body']}>
          <Tabs
            defaultActiveKey="1"
            activeKey={activeKey}
            onChange={this.toggleTab}
            type="card"
          >
            <TabPane
              className={cs['tab-content']}
              tab={i18n['user_setting.basic_info.basic_info_tab']}
              key="1"
            >
              <BasicInfoForm
                initialValues={info}
                disabled={disabled}
                onSubmit={this.updateBasicInfo}
              />
            </TabPane>
            <TabPane
              className={cs['tab-content']}
              tab={i18n['user_setting.basic_info.other_info_tab']}
              key="2"
            >
              <OtherInfoForm
                {...this.props}
                initialValues={info}
                fields={moreFileds}
                disabled={disabled}
                onSubmit={this.updateOtherInfo}
              />
            </TabPane>
          </Tabs>
        </div>
      </Card>
    );
  }
}
