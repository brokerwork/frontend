import Switch from "components/Switch";
import Button from "components/Button";
import Table from "components/Table";
import CreateQuestion from "../../containers/CreateQuestion";
import language from "utils/language";
import UpdateQuestionModal from "../../containers/UpdateQuestionModal";
import UpdateTestResult from "../../containers/UpdateTestResult";
import AnimationWrapper from "components/AnimationWrapper";
import i18n from "utils/i18n";
import { FormattedMessage } from "react-intl";
import cs from "./Question.less";
import Tips from "components/Tips";

const currentLang = language.getLang();

export default class Question extends PureComponent {
  state = {
    showUpdateModal: false,
    showUpdateTestResultModal: false,
    questionInfo: {}
  };

  componentDidMount() {
    this.init();
  }

  init = () => {
    const {
      getDefaultQuesionList,
      getTestResult,
      storeResultScore
    } = this.props;

    getTestResult().then(({ result, data }) => {
      if (result) {
        const scores = data.results.reduce((value, currentValue) => {
          return {
            maxScore: value
              ? Math.max(value.maxScore, currentValue.maxScore)
              : value.maxScore,
            minScore: value
              ? Math.min(value.minScore, currentValue.minScore)
              : value.minScore
          };
        });

        storeResultScore(scores);
      }
    });
    getDefaultQuesionList().then(() => {
      this.getQuestionSummary();
    });
  };

  getQuestionSummary = () => {
    const { getQuestionSummary } = this.props;

    return getQuestionSummary();
  };

  toggleQuestionSummaryStatus = (total, status) => {
    const {
      showTipsModal,
      showTopAlert,
      questionSummary,
      testResult,
      resultScore
    } = this.props;
    if (status) {
      let alertContent = "";

      if (!questionSummary.questions.some(item => item.enable)) {
        alertContent = i18n["broker.question.enable_test_no_question_tips"];
      } else if (testResult.results.every(item => !item.result)) {
        alertContent = i18n["broker.question.enable_test_no_result_tips"];
      } else if (
        total.fraction.maxScore !== resultScore.maxScore ||
        total.fraction.minScore !== resultScore.minScore
      ) {
        alertContent = i18n["broker.question.score_changed_error"];
      }

      if (alertContent) {
        showTopAlert({
          style: "danger",
          content: alertContent
        });

        return;
      }
    }
    this.updateStatus(status);
    // if (status) {
    //   showTipsModal({
    //     content: i18n['field.setting.test_confirm'],
    //     onConfirm: (cb) => {
    //       this.updateStatus(status);
    //       cb();
    //     }
    //   });
    // } else {
    //   this.updateStatus(status);
    // }
  };
  updateStatus(status) {
    const { toggleQuestionSummaryStatus, showTopAlert } = this.props;
    toggleQuestionSummaryStatus(status).then(({ result }) => {
      if (result) {
        showTopAlert({
          style: "success",
          content: status
            ? i18n["general.enable_success"]
            : i18n["general.disabled_success"]
        });
        this.getQuestionSummary();
      }
    });
  }

  getTotal = () => {
    const { questionSummary } = this.props;
    const enabledQuestions = questionSummary.questions.filter(
      item => item.enable
    );

    return {
      size: `${enabledQuestions.length}`,
      fraction: enabledQuestions.reduce(
        (value, question) => ({
          maxScore: (value.maxScore += question.maxScore),
          minScore: (value.minScore += question.minScore)
        }),
        { maxScore: 0, minScore: 0 }
      )
    };
  };

  operateQuestion = (question, isDelete, status) => {
    const { operateQuestion, showTopAlert, showTipsModal } = this.props;
    const action = isDelete ? "delete" : status ? "enable" : "disable";
    const operate = () => {
      operateQuestion(question.id, action).then(({ result }) => {
        if (result) {
          showTopAlert({
            style: "success",
            content: i18n["broker.question.operate_tips"]
          });
          this.getQuestionSummary();
        }
      });
    };

    if (isDelete) {
      showTipsModal({
        content: i18n["broker.question.remove_tips"],
        onConfirm: cb => {
          operate();
          cb();
        }
      });
    } else {
      operate();
    }
  };

  showUpdateModal = questionInfo => {
    this.setState({
      showUpdateModal: true,
      questionInfo
    });
  };

  onCreate = () => {
    this.getQuestionSummary();
  };

  onUpdate = () => {
    this.setState(
      {
        showUpdateModal: false
      },
      () => {
        this.getQuestionSummary();
      }
    );
  };

  onSort = evt => {
    const { oldIndex, newIndex } = evt;
    const { questionSummary, setQuestionSequence } = this.props;
    const copyed = JSON.parse(JSON.stringify(questionSummary.questions));
    const targetItem = copyed.splice(oldIndex, 1)[0];

    copyed.splice(newIndex, 0, targetItem);

    setQuestionSequence(copyed.map(item => item.id)).then(({ result }) => {
      if (result) {
        this.getQuestionSummary();
      }
    });
  };

  render() {
    const { questionSummary } = this.props;
    const {
      showUpdateModal,
      questionInfo,
      showUpdateTestResultModal
    } = this.state;
    const total = this.getTotal();

    return (
      <div className={cs["container"]}>
        <div className="actions-bar">
          <div>
            {i18n["broker.question.enable_test"]}
            <Switch
              className={cs["test-switch"]}
              checked={questionSummary.enable}
              onChange={this.toggleQuestionSummaryStatus.bind(this, total)}
              // disabled={!questionSummary.questions.some(item => item.enable)}
            />
            <Tips align="right" className={cs["tips"]}>
              {i18n["broker.question.test_tips"]}
            </Tips>
          </div>
          <div className="more text-right">
            <a
              href="/preview/appropriatenessTest"
              target="_blank"
              className="btn btn-primary"
            >
              {i18n["general.preview"]}
            </a>
            <CreateQuestion onCreate={this.onCreate} />
            <Button
              style="primary"
              disabled={questionSummary.enable}
              onClick={() => this.setState({ showUpdateTestResultModal: true })}
            >
              {i18n["broker.question.set_test_result"]}
            </Button>
          </div>
        </div>
        <Table>
          <Table.Header>
            <th>{i18n["general.sort"]}</th>
            <th>{i18n["general.sort_number"]}</th>
            <th>{i18n["broker.question.question_title"]}</th>
            <th>{i18n["broker.question.max_score"]}</th>
            <th>{i18n["table.header.operation"]}</th>
          </Table.Header>
          <Table.Body sortable onSort={this.onSort}>
            {questionSummary.questions.map((item, idx) => {
              return (
                <tr key={Math.random()}>
                  <td>
                    <i className="fa fa-bars" />
                  </td>
                  <td>{idx + 1}</td>
                  <td>
                    {questionSummary.enable ? (
                      item.subject[currentLang]
                    ) : (
                      <a onClick={this.showUpdateModal.bind(this, item)}>
                        {item.subject[currentLang]}
                      </a>
                    )}
                  </td>
                  <td>{item.maxScore}</td>
                  <td>
                    <Switch
                      inline
                      checked={item.enable}
                      disabled={questionSummary.enable}
                      onChange={this.operateQuestion.bind(this, item, false)}
                    />
                    <Button
                      icon
                      disabled={questionSummary.enable}
                      onClick={this.operateQuestion.bind(this, item, true)}
                    >
                      <i className="fa fa-times" />
                    </Button>
                  </td>
                </tr>
              );
            })}
          </Table.Body>
        </Table>
        <div className={cs["enable-question-tips"]}>
          <FormattedMessage
            id="broker.question.enable_question_tips"
            defaultMessage={i18n["broker.question.enable_question_tips"]}
            values={{
              size: total.size,
              fraction: `${total.fraction.maxScore}`
            }}
          />
        </div>
        <AnimationWrapper>
          {showUpdateModal ? (
            <UpdateQuestionModal
              type="update"
              questionInfo={questionInfo}
              onUpdate={this.onUpdate}
              onClose={() => this.setState({ showUpdateModal: false })}
            />
          ) : (
            undefined
          )}
        </AnimationWrapper>
        <AnimationWrapper>
          {showUpdateTestResultModal ? (
            <UpdateTestResult
              onClose={() =>
                this.setState({ showUpdateTestResultModal: false })
              }
            />
          ) : (
            undefined
          )}
        </AnimationWrapper>
      </div>
    );
  }
}
