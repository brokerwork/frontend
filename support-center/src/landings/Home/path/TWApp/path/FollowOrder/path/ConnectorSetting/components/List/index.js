import Table from "components/Table";
import Switch from "components/Switch";
import i18n from "utils/i18n";

const CONFIRM_KEY = "IS_FOLLOW_ORDER_CONFIRMED";

export default class List extends PureComponent {
  onChange = (server, status) => {
    const {
      switchServerFollow,
      showTopAlert,
      showTipsModal,
      getServerList
    } = this.props;
    const isFollowOrderConfirmed = window.localStorage.getItem(CONFIRM_KEY);
    const action = () => {
      switchServerFollow(server.serverId, status).then(({ result }) => {
        if (result) {
          showTopAlert({
            style: "success",
            content: i18n['general.modify_success']
          });
          getServerList();
          window.localStorage.setItem(CONFIRM_KEY, true);
        }
      });
    };

    if (!isFollowOrderConfirmed) {
      showTipsModal({
        content: i18n['followOrder.connectorSetting.confirm'],
        noCancel: true,
        confirmBtnText: i18n['followOrder.connectorSetting.asknown'],
        onConfirm: cb => {
          action();
          cb();
        }
      });
    } else {
      action();
    }
  };

  render() {
    const { serverList } = this.props;
    const showList = serverList.filter(s => {
      if (s.type === "real") {
        return s;
      }
    });
    return (
      <div>
        <Table>
          <Table.Header>
            <th>{i18n["connector.setting.table.platform"]}</th>
            <th>{i18n["connector.setting.table.srvId"]}</th>
            <th>{i18n["menu.twapp.vendor_setting.server_name"]}</th>
            <th>{i18n["menu.twapp.vendor_setting.server_url"]}</th>
            <th>{i18n['followOrder.connectorSetting.canfollow']}</th>
          </Table.Header>
          <Table.Body>
            {showList.map((server, idx) => {
              return (
                <tr key={idx}>
                  <td>
                    {server.vendor}
                    {server.type === "real"
                      ? i18n["menu.twapp.vendor_setting.real"]
                      : i18n["menu.twapp.vendor_setting.simulator"]}
                  </td>
                  <td>{server.serverId}</td>
                  <td>{server.name}</td>
                  <td>{server.host}</td>
                  <td>
                    <Switch
                      inline
                      checked={server.isFollow}
                      onChange={this.onChange.bind(this, server)}
                    />
                  </td>
                </tr>
              );
            })}
          </Table.Body>
        </Table>
      </div>
    );
  }
}
