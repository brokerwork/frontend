import i18n from "utils/i18n";
import Table from "components/Table";
import Radio from "components/Radio";
import cs from "./VendorList.less";
import PipsOriginModal from "./PipsOriginModal";

export default class VendorList extends PureComponent {
  state = {
    showPipsOriginModal: false,
    modalData: null
  };
  componentWillMount() {
    const { getVendorInfo } = this.props;
    getVendorInfo();
  }

  saveDefaultOrigin = serveId => {
    const { setVendorOrigin, getVendorInfo, showTopAlert } = this.props;
    Promise.resolve(setVendorOrigin(serveId)).then(res => {
      if (res.result) {
        getVendorInfo();
        showTopAlert({
          style: "success",
          content: i18n["general.save_success"]
        });
      }
    });
  };

  togglePipsOriginModal = (status, data) => {
    this.setState({
      showPipsOriginModal: status,
      modalData: data
    });
  };

  onSubmit = ({ serverId, group }) => {
    const { setPipsOrigin, getVendorInfo } = this.props;
    setPipsOrigin({ serverId, group }).then(r => {
      if (!r.result) return;
      getVendorInfo();
    });
    this.togglePipsOriginModal(false, null);
  };

  render() {
    const { vendorInfo, getServerGroup } = this.props;
    const { showPipsOriginModal, modalData } = this.state;
    return (
      <div>
        <Table>
          <Table.Header>
            <th>{i18n["connector.setting.table.platform"]}</th>
            <th>{i18n["connector.setting.table.srvId"]}</th>
            <th>{i18n["menu.twapp.vendor_setting.server_name"]}</th>
            <th>{i18n["menu.twapp.vendor_setting.server_url"]}</th>
            <th>{i18n["connector.setting.table.account"]}</th>
            <th>{i18n["menu.twapp.vendor_setting.origin"]}</th>
            <th>{i18n["menu.twapp.vendor_setting.group"]}</th>
          </Table.Header>
          <Table.Body>
            {vendorInfo.map((server, idx) => {
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
                  <td>{server.login}</td>
                  <td>
                    <Radio
                      name={origin}
                      checked={server.isDefaultQuoteServer}
                      inline
                      onChange={this.saveDefaultOrigin.bind(
                        this,
                        server.serverId
                      )}
                    />
                  </td>
                  <td>
                    {server.isDefaultQuoteServer ? (
                      <a
                        href="javascript:;"
                        onClick={this.togglePipsOriginModal.bind(
                          this,
                          true,
                          server
                        )}
                      >
                        {server.group || i18n["general.default.select"]}
                      </a>
                    ) : (
                      <span>
                        {server.group || i18n["general.default.select"]}
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </Table.Body>
        </Table>
        {showPipsOriginModal && (
          <PipsOriginModal
            getServerGroup={getServerGroup}
            onSubmit={this.onSubmit}
            onClose={this.togglePipsOriginModal.bind(this, false, null)}
            data={modalData}
          />
        )}
      </div>
    );
  }
}
