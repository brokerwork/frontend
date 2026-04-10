import Table from "components/Table";
import i18n from "utils/i18n";
import Button from "components/Button";
import UpdateConnector from "../../containers/UpdateConnector";
import AnimationWrapper from "components/AnimationWrapper";
import { FormattedMessage } from "react-intl";
import cs from "./List.less";

export default class List extends PureComponent {
  state = {
    showModal: false,
    connector: {},
    connectDisabledServerId: null
  };

  toggleModal = connector => {
    this.setState({
      showModal: !this.state.showModal,
      connector
    });
  };

  showModal = connector => {
    const { showTopAlert, getServerList } = this.props;
    const isCtrader = connector.vendor === "CTRADER";

    if (connector.status === 1) {
      showTopAlert({
        content: isCtrader
          ? i18n["connector.setting.ctrader.tips"]
          : i18n["connector.setting.message.tip1"]
      });
    } else if (isCtrader) {
      getServerList().then(({ result, data }) => {
        if (result) {
          const currentConnector = data.find(
            item => item.serverId === connector.serverId
          );

          if (currentConnector.status === 1) {
            showTopAlert({
              content: i18n["connector.setting.ctrader.tips"]
            });
          } else {
            this.setState({
              showModal: true,
              connector
            });
          }
        }
      });
    } else {
      this.setState({
        showModal: true,
        connector
      });
    }
  };

  onSaveConnector = () => {
    const { getServerList } = this.props;

    getServerList();
    this.setState({
      showModal: false,
      connector: {}
    });
  };

  disconnect = serverId => {
    const { disconnect, getServerList, showTopAlert } = this.props;

    disconnect(serverId).then(({ result }) => {
      if (result) {
        getServerList();
        showTopAlert({
          content: i18n["connector.setting.message.tip2"],
          style: "success"
        });
        this.setState(
          {
            connectDisabledServerId: serverId
          },
          () => {
            setTimeout(() => {
              this.setState({
                connectDisabledServerId: null
              });
            }, 10000);
          }
        );
      }
    });
  };

  connect = serverId => {
    const { connect, disconnect, getServerList, showTipsModal } = this.props;

    connect(serverId).then(({ result, data }) => {
      if (result) {
        if (data) {
          showTipsModal({
            header: i18n["common.tips.risk"],
            content: (
              <div className={cs["content"]}>
                <FormattedMessage
                  id="connector.setting.risk.tips.info"
                  defaultMessage={i18n["connector.setting.risk.tips.info"]}
                  values={{
                    serverName: data
                  }}
                />
                <div className={cs["tips"]}>
                  {i18n["connector.setting.risk.tips.confirm"]}
                </div>
              </div>
            ),
            onConfirm: cb => {
              getServerList();
              cb();
            },
            onCancel: cb => {
              disconnect(serverId);
              cb();
            }
          });
        } else {
          getServerList();
        }
      }
    });
  };

  arrTans(arr, oldIndex, newIndex) {
    const oldId = arr[oldIndex];
    arr.splice(oldIndex, 1);
    arr.splice(newIndex, 0, oldId);
    return arr;
  }

  onSort = evt => {
    const { serverList, setConnectorOrder, getServerList } = this.props;
    const { oldIndex, newIndex } = evt;
    const copyed = [].concat(serverList).map(item => item.serverId);

    const end = this.arrTans(copyed, oldIndex, newIndex);
    if (oldIndex !== newIndex) {
      setConnectorOrder(
        end.join(",")
      ).then(({ result }) => {
        if (result) {
          getServerList();
        }
      });
    }
  };

  render() {
    const { serverList } = this.props;
    const { showModal, connector, connectDisabledServerId } = this.state;

    return (
      <div>
        <Table>
          <Table.Header>
            <th>{i18n["general.sort"]}</th>
            <th>{i18n["connector.setting.table.platform"]}</th>
            <th>{i18n["connector.setting.table.srvId"]}</th>
            <th>{i18n["connector.setting.table.srvname"]}</th>
            <th>{i18n["connector.setting.table.srvaddress"]}</th>
            <th>{i18n["connector.setting.table.account"]}</th>
            <th>{i18n["connector.setting.table.account.range"]}</th>
            <th>{i18n["connector.setting.table.rebate.range"]}</th>
            <th>{i18n["table.header.status"]}</th>
            <th>{i18n["table.header.operation"]}</th>
          </Table.Header>
          <Table.Body sortable onSort={this.onSort}>
            {serverList.map((server, idx) => {
              return (
                <tr key={Math.random()}>
                  <td>
                    <i className="fa fa-bars" />
                  </td>
                  <td>{server._type}</td>
                  <td>{server.serverId}</td>
                  <td>{server.name}</td>
                  <td>{server.host}</td>
                  <td>{server.login}</td>
                  <td>
                    {server.vendor === "CTRADER"
                      ? i18n["connector.setting.ctrader.unsupport_custom"]
                      : `${
                          server.beginNo === 0
                            ? i18n["connector.setting.account.no.unlimit"]
                            : server.beginNo
                        } ~ ${
                          server.endNo === 0
                            ? i18n["connector.setting.account.no.unlimit"]
                            : server.endNo
                        }`}
                  </td>
                  <td>
                    {server.vendor === "CTRADER"
                      ? i18n["connector.setting.ctrader.unsupport_custom"]
                      : `${
                          server.rebateBeginNo === 0
                            ? i18n["connector.setting.account.no.unlimit"]
                            : server.rebateBeginNo
                        } ~ ${
                          server.rebateEndNo === 0
                            ? i18n["connector.setting.account.no.unlimit"]
                            : server.rebateEndNo
                        }`}
                  </td>
                  <td className={`text-${server._status.color}`}>
                    {server._status.label}
                  </td>
                  <td>
                    <Button
                      style="primary"
                      icon
                      onClick={this.showModal.bind(this, server)}
                    >
                      <i className="fa fa-pencil" />
                    </Button>
                    {server.vendor !== "CTRADER" ? (
                      server.status === 1 ? (
                        <Button
                          icon
                          onClick={this.disconnect.bind(this, server.serverId)}
                        >
                          <i className="fa fa-ban" />
                        </Button>
                      ) : (
                        <Button
                          style="primary"
                          icon
                          onClick={this.connect.bind(this, server.serverId)}
                          disabled={connectDisabledServerId === server.serverId}
                        >
                          <i className="fa fa-check-circle" />
                        </Button>
                      )
                    ) : (
                      undefined
                    )}
                  </td>
                </tr>
              );
            })}
          </Table.Body>
        </Table>
        <AnimationWrapper>
          {showModal ? (
            <UpdateConnector
              connector={connector}
              onSave={this.onSaveConnector}
              onClose={this.toggleModal.bind(this, {})}
            />
          ) : (
            undefined
          )}
        </AnimationWrapper>
      </div>
    );
  }
}
