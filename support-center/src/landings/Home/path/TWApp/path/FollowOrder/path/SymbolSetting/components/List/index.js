import Table from "components/Table";
import Select from "components/Select";
import Button from "components/Button";
import UpdateSymbol from "../../containers/UpdateSymbol";
import i18n from "utils/i18n";

export default class List extends PureComponent {
  state = {
    showUpdateSymbol: false,
    selectedSymbol: {}
  };

  onBound = (stdSymbol, selectedTenantSymbol) => {
    const {
      currentServerId,
      group,
      boundTenantSymbol,
      showTopAlert,
      getServerSymbol
    } = this.props;

    boundTenantSymbol(
      currentServerId,
      group,
      stdSymbol,
      selectedTenantSymbol
    ).then(({ result }) => {
      if (result) {
        showTopAlert({
          style: "success",
          content: i18n["general.modify_success"]
        });
        getServerSymbol();
      }
    });
  };

  showUpdateSymbol = selectedSymbol => {
    this.setState({
      selectedSymbol,
      showUpdateSymbol: true
    });
  };
  render() {
    const {
      stdSymbolList,
      tenantSymbolList,
      currentServerId,
      group
    } = this.props;
    const { showUpdateSymbol, selectedSymbol } = this.state;
    return (
      <div>
        <Table>
          <Table.Header>
            <th>{i18n["followOrder.symbolSetting.table.bossSymbolName"]}</th>
            <th>{i18n["followOrder.symbolSetting.table.symbolName"]}</th>
            <th>{i18n["followOrder.symbolSetting.table.minVolume"]}</th>
            <th>{i18n["followOrder.symbolSetting.table.spread"]}</th>
            <th>{i18n["followOrder.symbolSetting.table.tradable"]}</th>
            <th>{i18n["followOrder.symbolSetting.table.option"]}</th>
          </Table.Header>
          <Table.Body>
            {stdSymbolList[currentServerId][group].map((item, idx) => {
              return (
                <tr key={idx}>
                  <td>{item.bossSymbolName}</td>
                  <td style={{ overflow: "visible" }}>
                    <Select
                      value={item.symbolName}
                      options={tenantSymbolList[currentServerId][group]}
                      onChange={this.onBound.bind(this, item.bossSymbolName)}
                    />
                  </td>
                  <td>{item.minVolume}</td>
                  <td>{item.spread}</td>
                  <td>
                    {item.tradable
                      ? i18n["followOrder.symbolSetting.table.tradable.yes"]
                      : i18n["followOrder.symbolSetting.table.tradable.not"]}
                  </td>
                  <td>
                    <Button
                      style="primary"
                      icon
                      disabled={!item.tradable}
                      onClick={this.showUpdateSymbol.bind(this, item)}
                    >
                      <i className="fa fa-pencil" />
                    </Button>
                  </td>
                </tr>
              );
            })}
          </Table.Body>
        </Table>
        {showUpdateSymbol ? (
          <UpdateSymbol
            symbol={selectedSymbol}
            group={group}
            tenantSymbolList={tenantSymbolList[currentServerId][group]}
            onClose={() => this.setState({ showUpdateSymbol: false })}
          />
        ) : (
          undefined
        )}
      </div>
    );
  }
}
