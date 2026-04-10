import WebForm, { WEB_FORM } from './WebForm';
import MobileForm, { MOBILE_FORM } from './MobileForm';
import i18n from 'utils/i18n';
import { MOBILE_IDS, CUSTOMER_BELONGS_TYPES } from '../../constant';
import _ from 'lodash';
import { Button, Dialog, Tabs } from 'lean-ui';
import cs from './CreateLinkModal.less';

export default class CreateLinkModal extends PureComponent {
  getInitialValues = () => {
    const { initialValues, type } = this.props;
    if (initialValues) {
      let copyData = _.cloneDeep(initialValues);
      let newVisibleUser = [];
      let newInVisibleUser = [];
      if (initialValues['visibleUser'] && initialValues['visibleUserName']) {
        initialValues['visibleUser'].forEach((item, index) => {
          newVisibleUser.push({
            label: initialValues['visibleUserName'][index],
            value: item
          });
        });
      }
      if (
        initialValues['inVisibleUser'] &&
        initialValues['inVisibleUserName']
      ) {
        initialValues['inVisibleUser'].forEach((item, index) => {
          newInVisibleUser.push({
            label: initialValues['inVisibleUserName'][index],
            value: item
          });
        });
      }
      copyData['inVisibleUser'] = initialValues['inVisibleUser']
        ? newInVisibleUser
        : [];
      copyData['visibleUser'] = initialValues['visibleUser']
        ? newVisibleUser
        : [];
      return copyData;
    }
    return {};
  };

  getSelectedOwener = () => {
    const { initialValues } = this.props;
    if (initialValues['ownerId'] && initialValues['ownerType']) {
      let copySelectedOwner = {
        label: initialValues.ownerName,
        value: initialValues.ownerId,
        isGroup: initialValues.ownerType === 'RoleId',
        color: initialValues.ownerType === 'RoleId',
        type: initialValues.ownerType
      };
      return copySelectedOwner;
    }
  };

  getSelectedOwenerType = () => {
    const { initialValues } = this.props;
    const selectOwner = this.getSelectedOwener() || {};
    if (
      initialValues.type === 'DirectRecommendation' &&
      !CUSTOMER_BELONGS_TYPES.some(item => item.value === selectOwner.type)
    ) {
      return 'OtherOwner';
    }
    return selectOwner.type;
  };

  state = {
    formData: this.getInitialValues(),
    platform: 'Web',
    selectedOwner: this.props.type === 'Edit' ? this.getSelectedOwener() : {},
    selectedOwnerType:
      this.props.type === 'Edit' ? this.getSelectedOwenerType() : null,
    visibleUser: [],
    inVisibleUser: []
  };

  changePlatform = platform => {
    const formData = platform === 'Web' ? {} : { os: 'Android' };
    this.setState({
      platform,
      formData
    });
  };

  formatEditInfo = () => {
    let { formData } = this.state;
    const { getMTGroupList, getUserGroupList, getLeverageList } = this.props;
    if (formData['serverId']) {
      const params = {
        serverId: formData['serverId'],
        vendor: formData['vendor']
      };
      getUserGroupList(params);
      getLeverageList(params);
      getMTGroupList(params);
    }
  };

  componentDidMount() {
    const { type } = this.props;
    if (type === 'Edit') {
      this.formatEditInfo();
      return;
    }
  }

  onWebFormChange = data => {
    const {
      getMTGroupList,
      clearMTGroupList,
      getUserGroupList,
      getLeverageList,
      clearUserGroupList,
      clearLeverageList,
      serverList
    } = this.props;
    const { formData } = this.state;
    const copyData = data;
    if (data.serverId) {
      if (
        !formData.serverId ||
        (formData.serverId && formData.serverId !== data.serverId)
      ) {
        const params = serverList.find(item => item.serverId === data.serverId);
        delete copyData.mtGroup;
        getUserGroupList(params);
        getLeverageList(params);
        Promise.resolve(getMTGroupList(params)).then(res => {
          if (res.result) {
            copyData['mtGroup'] = res.data[0].value;
          }
          this.setState({
            formData: copyData
          });
        });
      }
    }

    if (!data.serverId) {
      delete copyData.mtGroup;
      delete copyData.accountGroup;
      delete copyData.leverage;
      clearMTGroupList();
      clearUserGroupList();
      clearLeverageList();
    }
    this.setState({
      formData: copyData
    });
  };

  onMobileFormChange = data => {
    this.setState({
      formData: data
    });
  };

  onSave = () => {
    const { platform } = this.state;
    const { submitForm } = this.props;

    if (platform === 'Web') {
      submitForm(WEB_FORM);
    } else {
      submitForm(MOBILE_FORM);
    }
  };

  createLink = data => {
    const {
      createLink,
      showTopAlert,
      onSave,
      updateLink,
      type,
      serverList
    } = this.props;
    const {
      platform,
      selectedOwner,
      visibleUser,
      inVisibleUser,
      selectedOwnerType
    } = this.state;
    const copyData = _.cloneDeep(data);
    console.log('cr', copyData);
    if (copyData.cyr && typeof copyData.cyr[0] === 'object') {
      const participants = [];
      const participantNames = [];
      copyData.cyr.forEach(el => {
        participants.push(el.value);
        participantNames.push(el.label);
      });
      copyData.participants = participants;
      copyData.participantNames = participantNames;
      // delete copyData.cyr;
    }
    const visibleUserIds = [];
    const visibleUserName = [];
    const inVisibleUserIds = [];
    const inVisibleUserName = [];
    const visibleUserIdType = [];
    if (copyData.type === 'Agent') {
      delete copyData.serverId;
      delete copyData.mtGroup;
      delete copyData.accountGroup;
      delete copyData.leverage;
    }
    if (copyData.serverId) {
      copyData.vendor = serverList.find(
        item => item.serverId === copyData.serverId
      ).vendor;
    }
    if (type === 'Add') {
      visibleUser.forEach(item => {
        visibleUserIds.push(item.value);
        visibleUserName.push(item.label);
        if (item.idType) {
          visibleUserIdType.push(item.idType);
        }
      });
      inVisibleUser.forEach(item => {
        inVisibleUserIds.push(item.value);
        inVisibleUserName.push(item.label);
      });
    }
    if (
      type === 'Edit' &&
      data.visibleUser &&
      (data.bwUserShow === 'UserPartVisible' ||
        data.bwUserShow === 'DirectPartVisible')
    ) {
      data.visibleUser.forEach(item => {
        visibleUserIds.push(item.value);
        visibleUserName.push(item.label);
        if (item.idType) {
          visibleUserIdType.push(item.idType);
        }
      });
    }
    if (
      type === 'Edit' &&
      data.inVisibleUser &&
      (data.bwUserShow === 'UserInVisible' ||
        data.bwUserShow === 'DirectPartInvisible')
    ) {
      data.inVisibleUser.forEach(item => {
        inVisibleUserIds.push(item.value);
        inVisibleUserName.push(item.label);
      });
    }
    copyData['visibleUser'] = visibleUserIds;
    copyData['visibleUserName'] = visibleUserName;
    copyData['inVisibleUser'] = inVisibleUserIds;
    copyData['inVisibleUserName'] = inVisibleUserName;
    if (visibleUserIdType.length) {
      copyData['visibleUserIdType'] = visibleUserIdType;
    }
    // 仅在selectedOwnerType === 'OtherOwner'的情况下使用selectedOwner选项中的type
    if (
      copyData.type === 'DirectRecommendation' &&
      selectedOwnerType !== 'OtherOwner'
    ) {
      copyData['ownerType'] = selectedOwnerType;
    } else if (!!selectedOwner) {
      copyData['ownerType'] = selectedOwner.type;
      copyData['ownerName'] = selectedOwner.label;
    }
    copyData.platform = platform;
    Promise.resolve(
      type === 'Add' ? createLink(copyData) : updateLink(copyData)
    ).then(({ result }) => {
      if (result) {
        showTopAlert({
          bsStyle: 'success',
          content:
            type === 'Add'
              ? i18n['general.create_success']
              : i18n['general.modify_success']
        });
        this.setState({ selectedOwner: null });
        Promise.resolve(onSave()).then(() => {
          this.setState({
            formData: []
          });
        });
      }
    });
  };

  changeSelectedOwnerType = ownerType => {
    this.setState({
      selectedOwnerType: ownerType
    });
  };

  changeSelectedOwner = owner => {
    this.setState({
      selectedOwner: owner
    });
  };

  changeVisibleUser = (data, type) => {
    if (!type) {
      this.setState({
        inVisibleUser: data
      });
    } else {
      this.setState({
        visibleUser: data
      });
    }
  };

  onHide = () => {
    const { onHide } = this.props;
    this.setState({
      formData: {}
    });
    onHide();
  };

  render() {
    let { formData, platform, selectedOwner, selectedOwnerType } = this.state;
    const {
      serverList,
      mtGroupList,
      typeList,
      brandInfo,
      userGroupList,
      leverageList,
      changeFormField,
      type
    } = this.props;

    return (
      <Dialog
        onCancel={this.onHide}
        width={700}
        className={cs.modalBody}
        title={
          type === 'Add'
            ? i18n['settings.link_setting.add_link_title']
            : i18n['settings.link_setting.edit_link_title']
        }
        visible={true}
        footer={
          <div>
            {formData.type === 'Agent' ? (
              <Button
                type="default"
                onClick={() => {
                  window.open('/agentApply');
                }}
              >
                {i18n['settings.link_setting.junp_apply_button']}
              </Button>
            ) : (
              undefined
            )}
            <Button type="default" onClick={this.onHide}>
              {i18n['general.cancel']}
            </Button>
            <Button type="primary" onClick={this.onSave}>
              {i18n['general.save']}
            </Button>
          </div>
        }
      >
        {/* <Tabs onChange={this.changePlatform} defaultActiveKey={platform}>
          <TabPane key="Web" tab={i18n['settings.link_setting.platform_web']} />
          {MOBILE_IDS.includes(brandInfo.tenantId) && (
            <TabPane
              key="Mobile"
              tab={i18n['settings.link_setting.platform_mobile']}
            />
          )}
        </Tabs> */}
        {platform === 'Web' ? (
          <WebForm
            initialValues={formData}
            onChange={this.onWebFormChange}
            onSubmit={this.createLink}
            typeList={typeList}
            type={type}
            changeFormField={changeFormField}
            serverList={serverList}
            selectedOwner={selectedOwner}
            selectedOwnerType={selectedOwnerType}
            changeSelectedOwner={this.changeSelectedOwner}
            changeVisibleUser={this.changeVisibleUser}
            changeSelectedOwnerType={this.changeSelectedOwnerType}
            mtGroupList={mtGroupList}
            userGroupList={userGroupList}
            leverageList={leverageList}
            brandInfo={brandInfo}
          />
        ) : (
          <MobileForm
            initialValues={formData}
            onChange={this.onMobileFormChange}
            onSubmit={this.createLink}
          />
        )}
      </Dialog>
    );
  }
}
