import CardPanel from "components/CardPanel";
import Button from "components/Button";
import i18n from "utils/i18n";
import Form, { QUESTION_FORM } from "../Forms/Question";

export default class UpdateQuestionModal extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      questionInfo:
        props.type === "create"
          ? {}
          : { question: props.questionInfo, ...props.questionInfo }
    };
  }

  onSave = () => {
    const { submitForm } = this.props;

    submitForm(QUESTION_FORM);
  };

  onSubmit = values => {
    const { updateQuestion, type, onUpdate, showTopAlert } = this.props;
    const { id, ...otherValues } = values;

    updateQuestion(type === "create" ? otherValues : values).then(
      ({ result }) => {
        if (result) {
          showTopAlert({
            style: "success",
            content: i18n["general.save_success"]
          });
          onUpdate();
        }
      }
    );
  };

  onSelectQuestion = questionInfo => {
    this.setState({
      questionInfo: {
        question: questionInfo,
        ...questionInfo
      }
    });
  };

  render() {
    const { onClose, type, notEnabledQuestionList } = this.props;
    const { questionInfo } = this.state;

    return (
      <CardPanel onClose={onClose}>
        <CardPanel.Header>
          {type === "create"
            ? i18n["broker.question.create"]
            : i18n["broker.question.update"]}
        </CardPanel.Header>
        <CardPanel.Body>
          <Form
            type={type}
            initialValues={questionInfo}
            questionInfo={questionInfo}
            notEnabledQuestionList={notEnabledQuestionList}
            onSelectQuestion={this.onSelectQuestion}
            onSubmit={this.onSubmit}
          />
        </CardPanel.Body>
        <CardPanel.Footer>
          <Button style="primary" onClick={this.onSave}>
            {i18n["general.save"]}
          </Button>
          <Button onClick={onClose}>{i18n["general.cancel"]}</Button>
        </CardPanel.Footer>
      </CardPanel>
    );
  }
}
