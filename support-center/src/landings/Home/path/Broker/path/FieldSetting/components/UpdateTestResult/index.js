import CardPanel from "components/CardPanel";
import Button from "components/Button";
import i18n from "utils/i18n";
import cs from "./UpdateTestResult.less";
import TestResultForm, { TEST_RESULT_FORM } from "../Forms/TestResult";
import { FormattedMessage } from "react-intl";

export default class UpdateTestResult extends PureComponent {
  componentDidMount() {
    const { getTestResult } = this.props;

    getTestResult();
  }

  onSave = () => {
    const { submitForm } = this.props;

    submitForm(TEST_RESULT_FORM);
  };

  onSubmit = values => {
    const {
      showTopAlert,
      updateTestResult,
      onClose,
      storeResultScore
    } = this.props;
    const { results, maxScore, minScore } = values;
    const isOverlapping = results.some((item, idx) =>
      results
        .filter((_item, _idx) => _idx !== idx)
        .some(
          (_item, _idx) =>
            Math.max(Number(item.minScore), Number(_item.minScore)) <=
            Math.min(Number(item.maxScore), Number(_item.maxScore))
        )
    );

    if (isOverlapping) {
      showTopAlert({
        style: "danger",
        content: i18n["broker.question.test_result.overlapping_error"]
      });

      return values;
    }

    let isNotCovered = false;
    const minList = results.concat().map(item => Number(item.minScore));
    const maxList = results.concat().map(item => Number(item.maxScore));

    if (!minList.includes(minScore) || !maxList.includes(maxScore)) {
      isNotCovered = true;
    } else if (
      !maxList
        .filter(score => score !== maxScore)
        .every(score => minList.includes(score + 1))
    ) {
      isNotCovered = true;
    }

    if (isNotCovered) {
      showTopAlert({
        style: "danger",
        content: i18n["broker.question.test_result.not_covered_error"]
      });

      return values;
    }

    updateTestResult(values).then(({ result }) => {
      if (result) {
        showTopAlert({
          style: "success",
          content: i18n["broker.question.test_result.success"]
        });
        storeResultScore({ maxScore, minScore });
        onClose();
      }
    });
  };

  render() {
    const { onClose, testResult } = this.props;

    return (
      <CardPanel onClose={onClose}>
        <CardPanel.Header>
          {i18n["broker.question.set_test_result"]}
        </CardPanel.Header>
        <CardPanel.Body>
          <div className={cs["title"]}>
            <FormattedMessage
              id="broker.question.test_result.set_tips"
              defaultMessage={i18n["broker.question.test_result.set_tips"]}
              values={{
                minScore: `${testResult.minScore || 0}`,
                maxScore: `${testResult.maxScore || 0}`
              }}
            />
          </div>
          <TestResultForm
            initialValues={testResult}
            testResult={testResult}
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
