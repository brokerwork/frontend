//import Table from 'components/Table';
import CreateLinkModal from '../../containers/CreateLinkModal';
import LinkStatisticDetailModal from '../LinkStatisticDetailModal';
import VisiableUserModal from './visiableUserModal';
import i18n from 'utils/i18n';
import cs from './index.less';
import WebTableRow from './webTableRow';
import { Button, Card, Select, Table, Icon } from 'lean-ui';
import {
  PLATFORM_LIST,
  MOBILE_IDS,
  STATUS_LIST,
  WEB_HEADER,
  MOBILE_HEADER
} from '../../constant';
import NoDataView from 'components/v2/NoDataView';
import SettingActionBar from 'landings/Settings/components/SettingActionBar';

const { Option } = Select;
const TTd = Table.Td;

export default class LinkSetting extends PureComponent {
  constructor() {
    super();
    this.state = {
      showCreateLinkModal: false,
      showLinkStatisticDetailModal: false,
      showUserVisiableModal: false,
      userVisiableItem: [],
      userShow: '',
      editItem: {},
      type: 'Add',
      rowExpandOptions: {
        expandedKeys: [],
        onChange: this.onExpand,
        expandFieldKey: 'key1'
      }
    };
  }

  componentDidMount() {
    const { getLinkType, getServerList } = this.props;

    getServerList();
    getLinkType();

    this.getLinkList();
  }

  toggleModal = (type, toggle) => {
    if (type === 'CreateLink') {
      this.setState({
        editItem: {},
        type: 'Add',
        [`show${type}Modal`]: toggle
      });
      return;
    }
    this.setState({
      [`show${type}Modal`]: toggle
    });
  };

  onCreateLink = () => {
    this.setState(
      {
        showCreateLinkModal: false
      },
      () => {
        this.getLinkList();
      }
    );
  };

  getLinkList = () => {
    const { getLinkList, currentPlatform, currentStatus } = this.props;

    getLinkList(currentPlatform, currentStatus);
  };

  changePlatform = platform => {
    const { updateCurrentPlatform, clearLinkStatistic } = this.props;

    Promise.all([updateCurrentPlatform(platform), clearLinkStatistic()]).then(
      () => {
        this.getLinkList();
      }
    );
  };

  changeStatus = status => {
    const { updateCurrentStatus, clearLinkStatistic } = this.props;
    const webTableRowRef = this.refs['webTableRow'];
    Promise.all([updateCurrentStatus(status), clearLinkStatistic()]).then(
      () => {
        this.getLinkList();
        console.log('webTableRowRef', webTableRowRef);
        if (webTableRowRef) {
          webTableRowRef.clearExpandKeys();
        }
      }
    );
  };

  removeLink = id => {
    const { showTipsModal, showTopAlert, removeLink } = this.props;

    showTipsModal({
      content: i18n['settings.link_setting.remove_tips'],
      onConfirm: cb => {
        cb();
        removeLink(id).then(({ result }) => {
          if (result) {
            showTopAlert({
              bsStyle: 'success',
              content: i18n['general.remove_success']
            });
            this.getLinkList();
          }
        });
      }
    });
  };

  toggleDisabledLink = item => {
    const { disabledLink, showTopAlert, showTipsModal } = this.props;
    showTipsModal({
      content: item.enable
        ? i18n['settings.link_setting.disabled_content']
        : i18n['settings.link_setting.active_content'],
      onConfirm: cb => {
        cb();
        disabledLink(item.id).then(({ result }) => {
          if (result) {
            showTopAlert({
              bsStyle: 'success',
              content: item.enable
                ? i18n['general.disabled_success']
                : i18n['general.active_success']
            });
            this.getLinkList();
          }
        });
      }
    });
  };

  toggleEditLink = id => {
    const { getEditLinkDetail } = this.props;
    Promise.resolve(getEditLinkDetail(id)).then(({ result }) => {
      if (result) {
        const { currentEditLink } = this.props;
        this.setState({
          editItem: currentEditLink,
          type: 'Edit',
          showCreateLinkModal: true
        });
      }
    });
  };

  toggleLinkStatistic = (id, vendor, serverId) => {
    const {
      clearLinkStatistic,
      getLinkStatistic,
      linkStatistic,
      getUserGroupList,
      getLeverageList,
      serverList
    } = this.props;
    let newVendor = vendor;
    if (!vendor && serverId) {
      newVendor = serverList.find(ob => ob.serverId === serverId).vendor;
    }

    if (linkStatistic.id && linkStatistic.id === id) {
      clearLinkStatistic();
    } else {
      getLinkStatistic(id);

      if (vendor && serverId) {
        getUserGroupList({ vendor, serverId });
        getLeverageList({ vendor, serverId });
      }
    }
  };

  showVisibleUserDetail = item => {
    this.setState({
      userVisiableItem:
        item.bwUserShow === 'UserPartVisible' ||
        item.bwUserShow === 'DirectPartVisible'
          ? item.visibleUserName && item.visibleUserName
          : item.inVisibleUserName && item.inVisibleUserName,
      userShow: item.bwUserShow
    });
    this.toggleModal('UserVisiable', true);
  };

  _renderWebTableHeader = () => {
    return WEB_HEADER.map((col, idx) => {
      return (
        <th key={idx} width={col.width || ''}>
          {col.label}
        </th>
      );
    });
  };

  //  lean-ui table
  renderCell = ({ key, data, index }) => {
    return <TTd key={index}>{data}</TTd>;
  };

  renderExpanedRow = d => {
    const { linkStatistic, brandInfo } = this.props;
    let data = [];
    let columns = [];
    if (brandInfo.tenantId === 'T000004') {
      data = [
        {
          key1: linkStatistic.name,
          key2: linkStatistic.os,
          key3: linkStatistic.softwarePackage,
          key4: linkStatistic.hitNumber,
          key5: linkStatistic.newCustomerNumber,
          key6: linkStatistic.winCustomerNumber
        }
      ];
      columns = [
        {
          key: 'key1',
          name: i18n['settings.link_setting.link_name'],
          key: 'key2',
          name: i18n['settings.link_setting.os'],
          key: 'key3',
          name: i18n['settings.link_setting.software_package'],
          key: 'key4',
          name: i18n['settings.link_setting.hit_count'],
          key: 'key5',
          name: i18n['settings.link_setting.new_count'],
          key: 'key6',
          name: i18n['settings.link_setting.win_count']
        }
      ];
    } else {
      data = [
        {
          key1: linkStatistic.name,
          key2: linkStatistic.os,
          key3: linkStatistic.softwarePackage,
          key4: linkStatistic.hitNumber,
          key5: linkStatistic.newCustomerNumber,
          key6: linkStatistic.openAccountNumber,
          key7: linkStatistic.depositeNumber
        }
      ];
      columns = [
        {
          key: 'key1',
          name: i18n['settings.link_setting.link_name'],
          key: 'key2',
          name: i18n['settings.link_setting.os'],
          key: 'key3',
          name: i18n['settings.link_setting.software_package'],
          key: 'key4',
          name: i18n['settings.link_setting.hit_count'],
          key: 'key5',
          name: i18n['settings.link_setting.new_count'],
          key: 'key6',
          name: i18n['settings.link_setting.open_count'],
          key: 'key7',
          name: i18n['settings.link_setting.deposite_count']
        }
      ];
    }
    if (linkStatistic.id == d.data.key8) {
      return (
        <Table data={data} columns={columns} renderCell={this.renderCell} />
      );
    }
    return null;
  };
  onExpand = arg => {
    const { expandedKeys } = arg;
    this.setState({
      rowExpandOptions: {
        ...this.state.rowExpandOptions,
        expandedKeys
      }
    });
  };

  render() {
    const {
      linkList,
      currentPlatform,
      linkStatistic,
      brandInfo,
      currentStatus
    } = this.props;
    const {
      showCreateLinkModal,
      showLinkStatisticDetailModal,
      showUserVisiableModal,
      userVisiableItem,
      editItem,
      type,
      userShow,
      rowExpandOptions
    } = this.state;
    const platformList = PLATFORM_LIST.filter(platform => {
      return platform.value === 'Mobile'
        ? MOBILE_IDS.includes(brandInfo.tenantId)
        : true;
    });
    //  currentPlatform 不为 web 时
    let data = [];
    linkList &&
      linkList.forEach(item => {
        data.push({
          key1: item.entityNo,
          key2: item.name,
          key3: item.os,
          key4: item.softwarePackage,
          key5: item.createTime,
          key6: item.creator,
          key7: (
            <Button
              onClick={this.removeLink.bind(this, item.id)}
              icon="delete-outline"
            />
          ),
          key8: item.id,
          item
        });
      });
    const columns = [{ key: 'key1', name: 'ID' }];
    MOBILE_HEADER.forEach((item, index) => {
      columns.push({
        key: `key${index + 2}`,
        name: item.label
      });
    });
    return (
      <div className={cs.body}>
        <SettingActionBar
          title={i18n['settings.left_menu.user_setting.sub_menu.link_setting']}
          footer={
            <div className={cs['actions-bar-select']}>
              {/* <Select value={currentPlatform} onSelect={this.changePlatform}>
                {platformList.map((item, index) => {
                  return (
                    <Option key={index} value={item.value}>
                      {item.label}
                    </Option>
                  );
                })}
              </Select> */}
              <Select
                value={currentStatus}
                onSelect={this.changeStatus}
                placeholder={i18n['settings.link_setting.status_all']}
              >
                {STATUS_LIST.map((item, index) => {
                  return (
                    <Option key={index} value={item.value}>
                      {item.label}
                    </Option>
                  );
                })}
              </Select>
            </div>
          }
        >
          <Button
            type="primary"
            onClick={this.toggleModal.bind(this, 'CreateLink', true)}
          >
            <Icon icon="add-outline" />
            {i18n['settings.link_setting.add_link_title']}
          </Button>
        </SettingActionBar>
        <Card>
          {/* table */}
          {currentPlatform === 'Web' ? (
            <WebTableRow
              ref="webTableRow"
              toggleLinkStatistic={this.toggleLinkStatistic}
              showVisibleUserDetail={this.showVisibleUserDetail}
              toggleDisabledLink={this.toggleDisabledLink}
              toggleEditLink={this.toggleEditLink}
              removeRowLink={this.removeLink}
              toggleModal={this.toggleModal}
              {...this.props}
            />
          ) : (
            <Table
              data={data}
              columns={columns}
              renderCell={this.renderCell}
              rowExpandOptions={rowExpandOptions}
              renderExpanedRow={this.renderExpanedRow}
            />
          )}
          {/* 没有数据 */}
          {linkList.length === 0 ? <NoDataView /> : undefined}
          {/* 添加推广链接 */}
          {showCreateLinkModal && (
            <CreateLinkModal
              initialValues={type === 'Edit' ? editItem : undefined}
              type={type}
              onSave={this.onCreateLink}
              onHide={this.toggleModal.bind(this, 'CreateLink', false)}
            />
          )}
          {showLinkStatisticDetailModal && (
            <LinkStatisticDetailModal
              brandInfo={brandInfo}
              data={linkStatistic}
              onHide={this.toggleModal.bind(this, 'LinkStatisticDetail', false)}
            />
          )}
          {showUserVisiableModal && (
            <VisiableUserModal
              data={userVisiableItem}
              show={userShow}
              onHide={this.toggleModal.bind(this, 'UserVisiable', false)}
            />
          )}
        </Card>
      </div>
    );
  }
}
