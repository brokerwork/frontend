import Button from "components/Button";
import Table from "components/Table";
import i18n from "utils/i18n";
import CreateConnector from "../../containers/CreateConnector";
import UpdateConnector from "../../containers/UpdateConnector";
import AnimationWrapper from "components/AnimationWrapper";

const status = {
  0: i18n["bridge.connector.status.disabled"],
  1: i18n["bridge.connector.status.enabled"],
  2: i18n["bridge.connector.status.bridge_core"],
  3: i18n["bridge.connector.status.pumping"],
  4: i18n["bridge.connector.status.report_service"]
};

export default class List extends PureComponent {
  state = {
    showCreateModal: false,
    showUpdateModal: false,
    selectedConnector: {}
  };

  componentDidMount() {
    const { getConnectorList } = this.props;

    getConnectorList();
  }

  startConnector = id => {
    const { startConnector, getConnectorList, showTopAlert } = this.props;

    startConnector(id).then(({ result }) => {
      if (result) {
        showTopAlert({
          style: "success",
          content: i18n["bridge.connector.enable_success"]
        });
        getConnectorList();
      }
    });
  };

  stopConnector = id => {
    const { stopConnector, getConnectorList, showTopAlert } = this.props;

    stopConnector(id).then(({ result }) => {
      if (result) {
        showTopAlert({
          style: "success",
          content: i18n["bridge.connector.disabled_success"]
        });
        getConnectorList();
      }
    });
  };

  removeConnector = id => {
    const {
      removeConnector,
      getConnectorList,
      showTipsModal,
      showTopAlert
    } = this.props;

    showTipsModal({
      content: i18n["bridge.connector.remove_confirm"],
      onConfirm: cb => {
        removeConnector(id).then(({ result }) => {
          if (result) {
            showTopAlert({
              style: "success",
              content: i18n["bridge.connector.remove_success"]
            });
            getConnectorList();
          }
        });
        cb();
      }
    });
  };

  showUpdateModal = selectedConnector => {
    this.setState({
      selectedConnector,
      showUpdateModal: true
    });
  };

  refresh = () => {
    const { getConnectorList } = this.props;

    this.setState({
      showCreateModal: false,
      showUpdateModal: false,
      selectedConnector: {}
    });

    getConnectorList();
  };

  render() {
    const { connectorList } = this.props;
    const { showCreateModal, showUpdateModal, selectedConnector } = this.state;

    return (
      <div>
        <div className="actions-bar">
          <div>
            <Button
              style="primary"
              onClick={() => this.setState({ showCreateModal: true })}
            >
              <i className="fa fa-plus" />
              {i18n["bridge.connector.create"]}
            </Button>
          </div>
        </div>
        <div>
          <Table>
            <Table.Header>
              <th>ID</th>
              <th>{i18n["bridge.connector.type"]}</th>
              <th>{i18n["bridge.connector.name"]}</th>
              <th>{i18n["bridge.connector.address"]}</th>
              <th>{i18n["bridge.connector.account"]}</th>
              <th>{i18n["bridge.connector.status"]}</th>
              <th>{i18n["table.header.operation"]}</th>
            </Table.Header>
            <Table.Body>
              {connectorList.map((item, idx) => {
                return (
                  <tr key={idx}>
                    <td>{item.Id}</td>
                    <td>{item.vendorType}</td>
                    <td>{item.name}</td>
                    <td>{item.addr}</td>
                    <td>{item.managerLogin}</td>
                    <td
                      className={
                        item.status === 1
                          ? "text-success"
                          : item.status !== 0 ? "text-danger" : "text-disabled"
                      }
                    >
                      {status[item.status]}
                    </td>
                    <td>
                      <Button
                        icon
                        style="primary"
                        disabled={item.status !== 0}
                        onClick={this.showUpdateModal.bind(this, item)}
                      >
                        <i className="fa fa-pencil" />
                      </Button>
                      {item.status === 0 ? (
                        <Button
                          icon
                          style="primary"
                          onClick={this.startConnector.bind(this, item.Id)}
                        >
                          <i className="fa fa-check-circle" />
                        </Button>
                      ) : (
                        <Button
                          icon
                          onClick={this.stopConnector.bind(this, item.Id)}
                        >
                          <i className="fa fa-ban" />
                        </Button>
                      )}
                      <Button
                        icon
                        disabled={item.status !== 0}
                        onClick={this.removeConnector.bind(this, item.Id)}
                      >
                        <i className="fa fa-times" />
                      </Button>
                    </td>
                  </tr>
                );
              })}
              {connectorList.length === 0 ? (
                <tr>
                  <td colSpan="7">{i18n["bridge.connector.no_data"]}</td>
                </tr>
              ) : (
                undefined
              )}
            </Table.Body>
          </Table>
        </div>
        <AnimationWrapper>
          {showCreateModal ? (
            <CreateConnector
              onCreate={this.refresh}
              onClose={() => this.setState({ showCreateModal: false })}
            />
          ) : (
            undefined
          )}
        </AnimationWrapper>
        <AnimationWrapper>
          {showUpdateModal ? (
            <UpdateConnector
              connector={selectedConnector}
              onUpdate={this.refresh}
              onClose={() => this.setState({ showUpdateModal: false })}
            />
          ) : (
            undefined
          )}
        </AnimationWrapper>
      </div>
    );
  }
}
