import Button from "components/Button";
import UpdateFieldModal from "../../containers/UpdateFieldModal";
import AnimationWrapper from "components/AnimationWrapper";
import i18n from "utils/i18n";

export default class CreateField extends PureComponent {
  state = {
    showModal: false
  };

  showModal = () => {
    const { notEnabledField, showTopAlert } = this.props;

    if (!notEnabledField.length) {
      showTopAlert({
        content: i18n["field.setting.message.tip5"]
      });
      return;
    }

    this.setState({
      showModal: true
    });
  };

  closeModal = () => {
    this.setState({
      showModal: false
    });
  };

  onSave = () => {
    const { onCreate } = this.props;

    this.setState(
      {
        showModal: false
      },
      () => {
        onCreate();
      }
    );
  };

  render() {
    const { showModal } = this.state;
    const { formId } = this.props;

    return (
      <div>
        <Button style="primary" onClick={this.showModal}>
          <i className="fa fa-plus" />
          {i18n["field.setting.field.add.title"]}
        </Button>
        <AnimationWrapper>
          {showModal ? (
            <UpdateFieldModal
              type="create"
              formId={formId}
              onSave={this.onSave}
              onClose={this.closeModal}
            />
          ) : (
            undefined
          )}
        </AnimationWrapper>
      </div>
    );
  }
}
