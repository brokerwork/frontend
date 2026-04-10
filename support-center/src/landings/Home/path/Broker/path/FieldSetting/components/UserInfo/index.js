import Nav from "components/Nav";
import Button from "components/Button";
import CreateField from "../../containers/CreateField";
import FieldList from "../../containers/FieldList";
import UpdateAgentModal from "../../containers/UpdateAgentModal";
import AnimationWrapper from "components/AnimationWrapper";
import i18n from "utils/i18n";

export default class UserInfo extends PureComponent {
  state = {
    activeKey: "profiles",
    showAgentModal: false
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

    getFieldList(`t_user_${activeKey}`);
  };

  onUpdate = () => {
    this.getFieldList();
  };

  showAgentModal = () => {
    this.setState({
      showAgentModal: true
    });
  };

  closeAgentModal = () => {
    this.setState({
      showAgentModal: false
    });
  };

  render() {
    const { activeKey, showAgentModal } = this.state;
    const { tenantInfo } = this.props;
    const bwProduct =
      tenantInfo.products.find(item => item.productId === "BW") || {};
    const domainUrl = bwProduct.customerDomain || bwProduct.productDomain;

    return (
      <div>
        <Nav activeKey={activeKey} sm onChange={this.onChange}>
          <Nav.Item eventKey="profiles">
            {i18n["field.setting.field.form.user.tab.basic"]}
          </Nav.Item>
          <Nav.Item eventKey="agent">
            {i18n["field.setting.field.form.user.tab.agent"]}
          </Nav.Item>
          <Nav.Buttons>
            {activeKey === "agent"
              ? [
                  <div key="preview">
                    <a
                      href={`${domainUrl}/agentApply`}
                      target="_blank"
                      className="btn btn-primary"
                    >
                      {i18n["app.btn.preview"]}
                    </a>
                  </div>,
                  <Button
                    key="edit"
                    style="primary"
                    onClick={this.showAgentModal}
                  >
                    {i18n["field.setting.agent.edit"]}
                  </Button>
                ]
              : undefined}
            <CreateField
              formId={`t_user_${activeKey}`}
              onCreate={this.onUpdate}
            />
          </Nav.Buttons>
        </Nav>
        <FieldList onUpdate={this.onUpdate} formId={`t_user_${activeKey}`} />
        <AnimationWrapper>
          {showAgentModal ? (
            <UpdateAgentModal onClose={this.closeAgentModal} />
          ) : (
            undefined
          )}
        </AnimationWrapper>
      </div>
    );
  }
}
