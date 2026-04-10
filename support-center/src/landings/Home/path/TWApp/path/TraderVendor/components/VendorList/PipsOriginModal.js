import Modal from "components/Modal";
import Select from "components/Select";
import Button from "components/Button";
import i18n from "utils/i18n";
import cs from "./VendorList.less";

export default class PipsOriginModal extends PureComponent {
  state = {
    options: [{ label: i18n["general.default.select"], value: "null" }],
    selectedGroup: null
  };
  componentDidMount() {
    const { getServerGroup, data = {} } = this.props;
    const { serverId } = data;
    this.serverId = serverId;
    getServerGroup(serverId).then(r => {
      if (!r.result) return;
      const options = [
        { label: i18n["general.default.select"], value: "null" }
      ];
      if (Array.isArray(r.data)) {
        r.data.forEach(item => {
          options.push({ label: item, value: item });
        });
      }
      this.setState({ options });
    });
  }
  selectGroup = v => {
    this.setState({
      selectedGroup: v
    });
  };
  onSubmit = () => {
    const { selectedGroup } = this.state;
    const { onSubmit } = this.props;
    onSubmit({
      serverId: this.serverId,
      group: selectedGroup
    });
  };
  render() {
    const { selectedGroup, options } = this.state;
    const { onClose } = this.props;
    return (
      <Modal onClose={onClose}>
        <Modal.Header>
          {i18n["menu.twapp.vendor_setting.set_group"]}
        </Modal.Header>
        <Modal.Body scrolling={false}>
          <div className={cs["tips"]}>
            <div>{i18n["menu.twapp.vendor_setting.set_group.tips1"]}</div>
            <div>{i18n["menu.twapp.vendor_setting.set_group.tips2"]}</div>
          </div>
          <Select
            options={options}
            onChange={this.selectGroup}
            value={selectedGroup}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button style="primary" onClick={this.onSubmit}>
            {i18n["general.save"]}
          </Button>
          <Button style="default" onClick={onClose}>
            {i18n["general.cancel"]}
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}
