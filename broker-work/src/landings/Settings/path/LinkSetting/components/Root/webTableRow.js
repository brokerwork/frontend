import { Table, Button, Icon, Popover } from 'lean-ui';
import i18n from 'utils/i18n';
import cs from './index.less';
import CopyToClipboard from 'react-copy-to-clipboard';
import {
  WEB_HEADER,
  AGENT_STATISTIC_HEADER,
  STRAIGHTGUEST_STATISTIC_HEADER,
  XHB_STRAIGHTGUEST_STATISTIC_HEADER,
  BW_USER_SHOWOPTIONS,
  BW_DIRECT_USER_SHOW_OPTIONS
} from '../../constant';

const TTd = Table.Td;
import selectText from 'utils/selectInputValue';

const BW_ALL_TYPE_USER_SHOW_OPTIONS = BW_USER_SHOWOPTIONS.concat(
  BW_DIRECT_USER_SHOW_OPTIONS
);

export default class WebTableRow extends PureComponent {
  constructor() {
    super();
    this.state = {
      rowExpandOptions: {
        expandedKeys: [],
        onChange: this.onExpand,
        expandFieldKey: 'key1'
      },
      qrPopoverShow: {}
    };
  }
  componentDidMount = () => {
    document
      .querySelector('.content-container')
      .addEventListener('scroll', () => {
        this.onTableScroll();
      });
  };

  onExpand = arg => {
    const {
      key,
      expandedKeys,
      item: { data }
    } = arg;
    let keys = [];
    if (expandedKeys.includes(key)) {
      keys.push(key);
    }
    this.toggleLinkStatistic(data.id, data.vendor, data.serverId);
    this.setState({
      rowExpandOptions: {
        ...this.state.rowExpandOptions,
        expandedKeys: keys
      }
    });
  };

  clearExpandKeys = () => {
    this.setState({
      rowExpandOptions: {
        ...this.state.rowExpandOptions,
        expandedKeys: []
      }
    });
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
  toggleLinkStatistic = (id, vendor, serverId) => {
    const { toggleLinkStatistic } = this.props;
    toggleLinkStatistic(id, vendor, serverId);
  };
  qrcodeList = {};
  getQrcode = item => {
    const { getQrcode } = this.props;
    if (!this.qrcodeList[item.id]) {
      this.qrcodeList[item.id] = getQrcode(item.id);
    }
    return this.qrcodeList[item.id];
  };
  onVisibleChange = (item, visible) => {
    this.getQrcode(item);
    const { qrPopoverShow } = this.state;
    let end = {};
    end = Object.assign({}, qrPopoverShow, {
      [item.id]: visible
    });
    this.setState({
      qrPopoverShow: end
    });
  };
  showVisibleUserDetail = item => {
    const { showVisibleUserDetail } = this.props;
    showVisibleUserDetail(item);
  };
  toggleDisabledLink = item => {
    const { toggleDisabledLink } = this.props;
    toggleDisabledLink(item);
  };
  toggleEditLink = id => {
    const { toggleEditLink } = this.props;
    toggleEditLink(id);
  };
  removeLink = id => {
    const { removeRowLink } = this.props;
    removeRowLink(id);
  };
  toggleModal = (type, toggle) => {
    const { toggleModal } = this.props;
    toggleModal(type, toggle);
  };
  _renderWebStatisticHeader = () => {
    const { linkStatistic } = this.props;
    return STRAIGHTGUEST_STATISTIC_HEADER.map((col, idx) => {
      return (
        <th key={idx}>
          {col.value === 'detail'
            ? linkStatistic.bwUserShow !== 'UserNotVisible' ||
              linkStatistic.bwUserShow !== 'DirectNotVisible'
              ? col.label
              : undefined
            : col.label}
        </th>
      );
    });
  };

  _renderXHBWebStatisticHeader = () => {
    const { linkStatistic } = this.props;
    return XHB_STRAIGHTGUEST_STATISTIC_HEADER.map((col, idx) => {
      return (
        <th key={idx}>
          {col.value === 'detail'
            ? linkStatistic.bwUserShow !== 'UserNotVisible' ||
              linkStatistic.bwUserShow !== 'DirectNotVisible'
              ? col.label
              : undefined
            : col.label}
        </th>
      );
    });
  };

  onCopy = () => {
    const { showTopAlert } = this.props;

    showTopAlert({
      bsStyle: 'success',
      content: i18n['general.clip_success']
    });
  };

  _renderWebAgentStatisticHeader = () => {
    const { linkStatistic } = this.props;
    return AGENT_STATISTIC_HEADER.map((col, idx) => {
      return (
        <th key={idx}>
          {col.value === 'detail'
            ? linkStatistic.bwUserShow !== 'UserNotVisible' ||
              linkStatistic.bwUserShow !== 'DirectNotVisible'
              ? col.label
              : undefined
            : col.label}
        </th>
      );
    });
  };
  renderCell = ({ key, data, index }) => {
    return <TTd key={index}>{data}</TTd>;
  };

  renderExpandCell = ({ key, data = '0', index }) => {
    return key === 'detail' ? (
      <TTd key={index}>{data}</TTd>
    ) : (
      <TTd key={index}>{`${i18n[`settings.link_setting.${key}`]}:${data}`}</TTd>
    );
  };

  onTableScroll = () => {
    const { qrPopoverShow } = this.state;
    let map = {};
    const needProcess = Object.values(qrPopoverShow).some(k => k);
    if (needProcess) {
      for (let foo in qrPopoverShow) {
        map[foo] = false;
      }
      this.setState({
        qrPopoverShow: map
      });
    }
  };
  renderExpanedRow = expaned => {
    const {
      linkStatistic,
      brandInfo,
      leverageList,
      userGroupList,
      serverList
    } = this.props;
    const itemData = expaned.data.data;
    const serverName =
      linkStatistic.serverId && linkStatistic.vendor
        ? serverList.find(
            ob =>
              `${ob.serverId}` === `${linkStatistic.serverId}` &&
              `${ob.vendor}` === `${linkStatistic.vendor}`
          ).desc
        : undefined;

    const userShowOption = BW_ALL_TYPE_USER_SHOW_OPTIONS.find(
      object => object.value === itemData.bwUserShow
    );
    let data = [];
    let columns = [];
    if (brandInfo.tenantId === 'T000004') {
      if (linkStatistic.type !== 'Agent') {
        columns = XHB_STRAIGHTGUEST_STATISTIC_HEADER.filter(
          el => el.visible
        ).map(el => ({
          key: el.value,
          name:
            el.value === 'detail'
              ? linkStatistic.bwUserShow !== 'UserNotVisible' ||
                linkStatistic.bwUserShow !== 'DirectNotVisible'
                ? el.label
                : undefined
              : el.label
        }));
        data = [
          {
            hit_count: linkStatistic.hitNumber,
            new_count: linkStatistic.newCustomerNumber,
            win_count: linkStatistic.winCustomerNumber,
            detail:
              linkStatistic.bwUserShow !== 'UserNotVisible' ||
              linkStatistic.bwUserShow !== 'DirectNotVisible' ? (
                <a
                  onClick={this.toggleModal.bind(
                    this,
                    'LinkStatisticDetail',
                    true
                  )}
                >
                  {i18n['settings.link_setting.check']}
                </a>
              ) : (
                undefined
              )
          }
        ];
      } else {
        columns = AGENT_STATISTIC_HEADER.filter(el => el.visible).map(el => ({
          key: el.value,
          name:
            el.value === 'detail'
              ? linkStatistic.bwUserShow !== 'UserNotVisible' ||
                linkStatistic.bwUserShow !== 'DirectNotVisible'
                ? el.label
                : undefined
              : el.label
        }));
        data = [
          {
            hit_count: linkStatistic.hitNumber,
            applyNumber: linkStatistic.applyNumber,
            passNumber: linkStatistic.passNumber,
            notPassNumber: linkStatistic.notPassNumber,
            detail:
              linkStatistic.bwUserShow !== 'UserNotVisible' ||
              linkStatistic.bwUserShow !== 'DirectNotVisible' ? (
                <a
                  onClick={this.toggleModal.bind(
                    this,
                    'LinkStatisticDetail',
                    true
                  )}
                >
                  {i18n['settings.link_setting.checkDetail']}
                </a>
              ) : (
                undefined
              )
          }
        ];
      }
    } else {
      if (linkStatistic.type !== 'Agent') {
        const { bwUserShow } = linkStatistic;
        columns = STRAIGHTGUEST_STATISTIC_HEADER.filter(
          item => item.visible
        ).map(item => ({
          key: item.value,
          name:
            item.value === 'detail'
              ? bwUserShow !== 'UserNotVisible' ||
                bwUserShow !== 'DirectNotVisible'
                ? item.label
                : undefined
              : item.label
        }));
        data = [
          {
            hit_count: linkStatistic.hitNumber,
            new_count: linkStatistic.newCustomerNumber,
            open_count: linkStatistic.openAccountNumber,
            deposite_count: linkStatistic.depositeNumber,
            detail:
              bwUserShow !== 'UserNotVisible' ||
              bwUserShow !== 'DirectNotVisible' ? (
                <a
                  onClick={this.toggleModal.bind(
                    this,
                    'LinkStatisticDetail',
                    true
                  )}
                >
                  {i18n['settings.link_setting.checkDetail']}
                </a>
              ) : (
                undefined
              )
          }
        ];
        // STRAIGHTGUEST_STATISTIC_HEADER.forEach((col, idx) => {
        //   columns.push({
        //     key: `key${idx + 1}`,
        //     name:
        //       col.value === 'detail'
        //         ? linkStatistic.bwUserShow !== 'UserNotVisible' ||
        //           linkStatistic.bwUserShow !== 'DirectNotVisible'
        //           ? col.label
        //           : undefined
        //         : col.label
        //   });
        // });
        // data = [
        //   {
        //     key1: linkStatistic.name,
        //     key2: linkStatistic.url,

        //     key3: userShowOption.showLink ? (
        //       <a
        //         onClick={() => {
        //           this.showVisibleUserDetail(itemData);
        //         }}
        //       >
        //         {userShowOption.label}
        //       </a>
        //     ) : (
        //       userShowOption.label
        //     ),
        //     key4: serverName,
        //     key5: linkStatistic.mtGroup,
        //     key6: linkStatistic.accountGroup
        //       ? (
        //           userGroupList.find(
        //             ob => `${ob.value}` === linkStatistic.accountGroup
        //           ) || {}
        //         ).label
        //       : '',
        //     key7: linkStatistic.leverage
        //       ? (
        //           leverageList.find(
        //             ob => `${ob.value}` === `${linkStatistic.leverage}`
        //           ) || {}
        //         ).label
        //       : '',
        //     key8: linkStatistic.ownerName,
        //     key9: linkStatistic.hitNumber,
        //     key10: linkStatistic.applyNumber,
        //     key11: linkStatistic.passNumber,
        //     key12: linkStatistic.notPassNumber,
        //     key13:
        //       linkStatistic.bwUserShow !== 'UserNotVisible' ||
        //       linkStatistic.bwUserShow !== 'DirectNotVisible' ? (
        //         <a
        //           onClick={this.toggleModal.bind(
        //             this,
        //             'LinkStatisticDetail',
        //             true
        //           )}
        //         >
        //           {i18n['settings.link_setting.check']}
        //         </a>
        //       ) : (
        //         undefined
        //       )
        //   }
        // ];
      } else {
        // AGENT_STATISTIC_HEADER.forEach((col, idx) => {
        //   columns.push({
        //     key: `key${idx + 1}`,
        //     name:
        //       col.value === 'detail'
        //         ? linkStatistic.bwUserShow !== 'UserNotVisible' ||
        //           linkStatistic.bwUserShow !== 'DirectNotVisible'
        //           ? col.label
        //           : undefined
        //         : col.label
        //   });
        // });
        columns = AGENT_STATISTIC_HEADER.filter(el => el.visible).map(el => ({
          key: el.value,
          name:
            el.value === 'detail'
              ? linkStatistic.bwUserShow !== 'UserNotVisible' ||
                linkStatistic.bwUserShow !== 'DirectNotVisible'
                ? el.label
                : undefined
              : el.label
        }));
        data = [
          {
            hit_count: linkStatistic.hitNumber,
            applyNumber: linkStatistic.applyNumber,
            passNumber: linkStatistic.passNumber,
            notPassNumber: linkStatistic.notPassNumber,
            detail:
              linkStatistic.bwUserShow !== 'UserNotVisible' ||
              linkStatistic.bwUserShow !== 'DirectNotVisible' ? (
                <a
                  onClick={this.toggleModal.bind(
                    this,
                    'LinkStatisticDetail',
                    true
                  )}
                >
                  {i18n['settings.link_setting.checkDetail']}
                </a>
              ) : (
                undefined
              )
          }
        ];
        // data = [
        //   {
        //     key1: linkStatistic.name,
        //     key2: linkStatistic.url,
        //     key3: userShowOption.showLink ? (
        //       <a
        //         onClick={() => {
        //           this.showVisibleUserDetail(itemData);
        //         }}
        //       >
        //         {userShowOption.label}
        //       </a>
        //     ) : (
        //       userShowOption.label
        //     ),
        //     key4: linkStatistic.hitNumber,
        //     key5: linkStatistic.applyNumber,
        //     key6: linkStatistic.passNumber,
        //     key7: linkStatistic.notPassNumber,
        //     key8:
        //       linkStatistic.bwUserShow !== 'UserNotVisible' ||
        //       linkStatistic.bwUserShow !== 'DirectNotVisible' ? (
        //         <a
        //           onClick={this.toggleModal.bind(
        //             this,
        //             'LinkStatisticDetail',
        //             true
        //           )}
        //         >
        //           {i18n['settings.link_setting.check']}
        //         </a>
        //       ) : (
        //         undefined
        //       )
        //   }
        // ];
      }
    }
    return (
      <div className={cs.tableWrapper}>
        <Table
          data={data}
          showTableHeader={false}
          columns={columns}
          renderCell={this.renderExpandCell}
        />
      </div>
    );
  };

  renderExpandIcon = (expand, onClick) => {
    return (
      <Icon
        icon={expand ? 'minus-rectangle' : 'add-rectangle'}
        onClick={onClick}
        className={cs.expandIcon}
      />
    );
  };
  selectText = e => {
    const dom = e.target;
    selectText(dom);
  };
  render() {
    const { linkList, currentQrcode } = this.props;
    const { qrPopoverShow } = this.state;
    let data = [];
    linkList &&
      linkList.forEach(item => {
        const popover = (
          <div id={item.id} className={cs['qrcode-box']}>
            <img src={currentQrcode} className={cs['qrcode']} />
            <Button type="primary">
              <a href={currentQrcode} download>
                {i18n['settings.link_setting.download_qrcode']}
              </a>
            </Button>
          </div>
        );
        const userShowOption = BW_ALL_TYPE_USER_SHOW_OPTIONS.find(
          object => object.value === item.bwUserShow
        );
        data.push({
          key1: item.entityNo,
          key2: item.name,
          key3: item.displayUrl ? (
            <div>
              <span className={cs['link-text']}>
                <textarea
                  style={{
                    border: 0,
                    padding: 10,
                    width: '100%',
                    resize: 'vertical'
                  }}
                  onClick={this.selectText}
                  type="text"
                  value={item.displayUrl}
                />
              </span>
              <div className={cs['link-operations']}>
                <Popover
                  visible={qrPopoverShow[item.id]}
                  trigger="click"
                  onVisibleChange={this.onVisibleChange.bind(this, item)}
                  placement="bottom"
                  content={popover}
                >
                  <i className={`fa fa-qrcode main-color ${cs['icon']}`} />
                </Popover>
                <CopyToClipboard text={item.displayUrl} onCopy={this.onCopy}>
                  <i className={`fa fa-copy main-color ${cs['icon']}`} />
                </CopyToClipboard>
              </div>
            </div>
          ) : (
            undefined
          ),
          key4: userShowOption.showLink ? (
            <a onClick={this.showVisibleUserDetail.bind(this, item)}>
              {userShowOption.label}
            </a>
          ) : (
            userShowOption.label
          ),
          key5: item.createTime,
          key6: item.creator,
          key7: (
            <div className={cs['table-btn']}>
              {item.enable ? (
                <Icon
                  className={`${cs['operationIcon']} main-color`}
                  fontType="bw"
                  title={i18n['settings.link_setting.status_disabled_btn']}
                  onClick={this.toggleDisabledLink.bind(this, item)}
                  icon="disabled-outline"
                />
              ) : (
                <Icon
                  className={`main-color ${cs['operationIcon']}`}
                  title={i18n['settings.link_setting.status_actived_btn']}
                  onClick={this.toggleDisabledLink.bind(this, item)}
                  fontType="bw"
                  icon="enable"
                />
              )}
              <Icon
                className={`${cs['operationIcon']} main-color`}
                type="primary"
                title={i18n['general.modify']}
                icon="edit-outline"
                onClick={this.toggleEditLink.bind(this, item.id)}
              />
              <Icon
                className={`${cs['operationIcon']} main-color`}
                onClick={this.removeLink.bind(this, item.id)}
                icon="delete-outline"
              />
            </div>
          ),
          key8: item.id,
          data: item
        });
      });
    let columns = [{ key: 'key1', name: 'ID' }];
    WEB_HEADER.forEach((item, index) => {
      columns.push({
        key: `key${index + 2}`,
        name: item.label
      });
    });
    return (
      <Table
        data={data}
        columns={columns}
        renderCell={this.renderCell}
        customExpanedIcon={this.renderExpandIcon}
        rowExpandOptions={this.state.rowExpandOptions}
        renderExpanedRow={this.renderExpanedRow}
      />
    );
  }
}
