import Button from "components/Button";
import UpdateQuestionModal from "../../containers/UpdateQuestionModal";
import AnimationWrapper from "components/AnimationWrapper";
import cs from "./CreateQuestion.less";
import i18n from "utils/i18n";

export default class CreateQuestion extends PureComponent {
  state = {
    show: false
  };

  onUpdate = () => {
    const { onCreate } = this.props;

    this.setState(
      {
        show: false
      },
      () => {
        onCreate();
      }
    );
  };

  render() {
    const { show } = this.state;

    return (
      <div className={cs["btn"]}>
        <Button style="primary" onClick={() => this.setState({ show: true })}>
          {i18n["broker.question.create"]}
        </Button>
        <AnimationWrapper>
          {show ? (
            <UpdateQuestionModal
              type="create"
              onUpdate={this.onUpdate}
              onClose={() => this.setState({ show: false })}
            />
          ) : (
            undefined
          )}
        </AnimationWrapper>
      </div>
    );
  }
}
