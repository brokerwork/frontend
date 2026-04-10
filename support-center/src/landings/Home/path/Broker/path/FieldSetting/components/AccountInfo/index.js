import Nav from "components/Nav";
import CreateField from "../../containers/CreateField";
import FieldList from "../../containers/FieldList";
import i18n from "utils/i18n";

export default class AccountInfo extends PureComponent {
  state = {
    activeKey: "",
    navList: [
      {
        label: i18n["field.setting.field.form.account2.account"],
        eventKey: "account",
        vendor: ["MT4", "MT5"]
      },
      {
        label: i18n["field.setting.account.cbroker"],
        eventKey: "cbroker",
        vendor: ["CTRADER"]
      },
      { label: i18n["field.setting.account.withdraw"], eventKey: "withdraw" }
    ]
  };

  componentDidMount() {
    this.init(this.props);
  }

  componentWillReceiveProps(props) {
    this.init(props);
  }

  init = props => {
    const { tenantInfo } = props;
    const { activeKey, navList } = this.state;

    if (tenantInfo.vendors && !activeKey) {
      const filteredNavList = navList.filter(
        nav =>
          nav.vendor === undefined ||
          nav.vendor.some(vendor => tenantInfo.vendors.includes(vendor))
      );

      this.setState(
        {
          activeKey: filteredNavList[0].eventKey,
          navList: filteredNavList
        },
        () => {
          this.getFieldList();
        }
      );
    }
  };

  onChange = activeKey => {
    this.setState(
      {
        activeKey
      },
      () => {
        this.getFieldList();
      }
    );
  };

  getFieldList = () => {
    const { activeKey } = this.state;
    const { getFieldList } = this.props;

    getFieldList(`t_account_${activeKey}`);
  };

  onUpdate = () => {
    this.getFieldList();
  };

  render() {
    const { activeKey, navList } = this.state;
    return (
      <div>
        <Nav activeKey={activeKey} sm onChange={this.onChange}>
          {navList.map((nav, idx) => {
            return (
              <Nav.Item eventKey={nav.eventKey} key={idx}>
                {nav.label}
              </Nav.Item>
            );
          })}
          <Nav.Buttons>
            <CreateField
              formId={`t_account_${activeKey}`}
              onCreate={this.onUpdate}
            />
          </Nav.Buttons>
        </Nav>
        <FieldList onUpdate={this.onUpdate} formId={`t_account_${activeKey}`} />
      </div>
    );
  }
}
