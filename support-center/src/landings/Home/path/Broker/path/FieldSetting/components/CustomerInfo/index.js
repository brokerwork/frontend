import Nav from "components/Nav";
import CreateField from "../../containers/CreateField";
import FieldList from "../../containers/FieldList";
import i18n from "utils/i18n";

export default class CustomerInfo extends PureComponent {
  state = {
    activeKey: "profiles"
  };

  componentDidMount() {
    this.getFieldList();
  }

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

    getFieldList(`t_customer_${activeKey}`);
  };

  onUpdate = () => {
    this.getFieldList();
  };

  render() {
    const { activeKey } = this.state;

    return (
      <div>
        <Nav activeKey={activeKey} sm onChange={this.onChange}>
          <Nav.Item eventKey="profiles">
            {i18n["field.setting.field.form.customer.basic"]}
          </Nav.Item>
          <Nav.Item eventKey="contacts">
            {i18n["field.setting.field.form.customer.contacts"]}
          </Nav.Item>
          <Nav.Item eventKey="follow">
            {i18n["field.setting.field.form.customer.fur"]}
          </Nav.Item>
          <Nav.Item eventKey="sales_opportunities">
            {i18n["field.setting.field.form.customer.so"]}
          </Nav.Item>
          <Nav.Buttons>
            <CreateField
              formId={`t_customer_${activeKey}`}
              onCreate={this.onUpdate}
            />
          </Nav.Buttons>
        </Nav>
        <FieldList
          onUpdate={this.onUpdate}
          formId={`t_customer_${activeKey}`}
        />
      </div>
    );
  }
}
