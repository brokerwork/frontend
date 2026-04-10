import { reduxForm, Field, FieldArray } from "redux-form";
import FormField from "components/FormField";
import { required } from "components/FormField/validate";
import Form from "components/Form";
import {
  FIELD_COLUMN,
  FIELD_OPTIONS,
  OPTIONS_FIELD,
  SENSITIVE_FIELD_TYPE
} from "../../constant";
import { languages } from "utils/config";
import Panel from "components/Panel";
import Table from "components/Table";
import Button from "components/Button";
import i18n from "utils/i18n";
import cs from "./Forms.less";
import language from "utils/language";

const currentLang = language.getLang();

export const TEST_RESULT_FORM = "BROKER_FIELD_SETTING_TEST_RESULT_FORM";

const scoreValidate = (value, allValues) => {
  return value > allValues.maxScore || value < allValues.minScore;
};

const numberNormalize = value => {
  return value ? Number(value) : value;
};

class RenderOptions extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      showMore: {},
      results: this.initResults(props)
    };
  }

  componentWillReceiveProps(props) {
    this.setState({
      results: this.initResults(props)
    });
  }

  initResults = props => {
    const { fields = [] } = props;
    const results = {};

    fields.forEach((item, idx) => {
      results[idx] = fields.get(idx).result;
    });

    return results;
  };

  onToggle = idx => {
    this.setState({
      showMore: {
        ...this.state.showMore,
        [idx]: !this.state.showMore[idx]
      }
    });
  };

  onResultChange = (idx, result) => {
    this.setState({
      results: {
        ...this.state.results,
        [idx]: result
      }
    });
  };

  renderHeader = idx => {
    const { fields } = this.props;

    return (
      <div className={cs["result-header"]}>
        <div className={cs["result-header-name"]}>
          {i18n["broker.question.test_result"]}
        </div>
        {fields.length <= 1 ? (
          undefined
        ) : (
          <a className="close" onClick={() => fields.remove(idx)}>
            <i className="fa fa-times" />
          </a>
        )}
      </div>
    );
  };

  render() {
    const {
      fields,
      testResult,
      meta: { submitFailed, error = {} }
    } = this.props;
    const { results, showMore } = this.state;

    return (
      <div>
        {fields.map((option, idx) => {
          const isScoreRangeError =
            submitFailed && error[idx] && error[idx].scoreRange;
          const isFeedbackError =
            submitFailed &&
            error[idx] &&
            typeof error[idx].feedback === "string";

          return (
            <Panel header={this.renderHeader(idx)} key={idx}>
              <table className={cs["result-container"]}>
                <tbody>
                  <tr>
                    <td>{i18n["broker.question.test_result.score_range"]}</td>
                    <td className={cs["result-summary"]}>
                      <div
                        className={`${cs["group"]} ${
                          isScoreRangeError ? "has-error" : ""
                        }`}
                      >
                        <Field
                          fieldClassName={cs["number-input"]}
                          name={`${option}.minScore`}
                          fieldType="number"
                          decimal="{0,0}"
                          placeholder={testResult.minScore}
                          component={FormField}
                          normalize={numberNormalize}
                        />
                        ~
                        <Field
                          fieldClassName={cs["number-input"]}
                          name={`${option}.maxScore`}
                          fieldType="number"
                          decimal="{0,0}"
                          placeholder={testResult.maxScore}
                          component={FormField}
                          normalize={numberNormalize}
                        />
                        {isScoreRangeError ? (
                          <div className="error-msg">
                            {error[idx].scoreRange}
                          </div>
                        ) : (
                          undefined
                        )}
                        <div />
                      </div>
                      <div className={cs["group"]}>
                        {i18n["broker.question.test_result.result"]}
                        <Field
                          onFieldChange={this.onResultChange.bind(this, idx)}
                          fieldClassName={cs["select-input"]}
                          name={`${option}.result`}
                          options={[
                            {
                              value: "approve",
                              label:
                                i18n[
                                  "broker.question.test_result.result.approve"
                                ]
                            },
                            {
                              value: "refuse",
                              label:
                                i18n[
                                  "broker.question.test_result.result.refuse"
                                ]
                            }
                          ]}
                          fieldType="select"
                          component={FormField}
                        />
                      </div>
                    </td>
                    <td>
                      {results[idx] === "approve" ? (
                        <div className={cs["group"]}>
                          {i18n["broker.question.test_result.leverage"]}1 :<Field
                            fieldClassName={cs["number-input"]}
                            name={`${option}.lever`}
                            fieldType="number"
                            decimal="{0,0}"
                            component={FormField}
                            normalize={numberNormalize}
                          />
                        </div>
                      ) : (
                        undefined
                      )}
                    </td>
                  </tr>
                  {languages
                    .sort((a, b) => (b.value === currentLang ? 1 : 0))
                    .slice(0, showMore[idx] ? languages.length : 1)
                    .map((item, _idx) => {
                      return (
                        <tr
                          key={_idx}
                          className={isFeedbackError ? "has-error" : ""}
                        >
                          <td className={cs["feedback-wrap-title"]}>
                            {i18n["broker.question.test_result.feedback"]}
                            <br />（{item.label}）
                          </td>
                          <td>
                            <Field
                              fieldClassName={cs["feedback-title"]}
                              name={`${option}.feedback.title.${item.value}`}
                              fieldType="text"
                              component={FormField}
                              placeholder={
                                i18n[
                                  "broker.question.test_result.feedback.title"
                                ]
                              }
                            />
                            <Field
                              fieldClassName={cs["feedback-content"]}
                              name={`${option}.feedback.content.${item.value}`}
                              fieldType="textarea"
                              component={FormField}
                              placeholder={
                                i18n[
                                  "broker.question.test_result.feedback.content"
                                ]
                              }
                            />
                          </td>
                          <td>
                            {_idx === 0 ? (
                              <a
                                onClick={this.onToggle.bind(this, idx)}
                                className={`${cs["show-more"]} ${
                                  showMore[idx] ? cs["active"] : ""
                                }`}
                              >
                                {showMore[idx]
                                  ? i18n[
                                      "broker.question.test_result.less_setting"
                                    ]
                                  : i18n[
                                      "broker.question.test_result.more_setting"
                                    ]}
                                <i className="fa fa-angle-up" />
                              </a>
                            ) : (
                              undefined
                            )}
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
              {isFeedbackError ? (
                <div className="error-msg">{error[idx].feedback}</div>
              ) : (
                undefined
              )}
            </Panel>
          );
        })}

        {fields.length >= 10 ? (
          undefined
        ) : (
          <div className={cs["buttons"]}>
            <Button style="primary" onClick={() => fields.push({})}>
              <i className="fa fa-plus" />
              {i18n["broker.question.test_result.add_result"]}
            </Button>
          </div>
        )}
      </div>
    );
  }
}

class TestResultForm extends PureComponent {
  render() {
    const { testResult } = this.props;

    return (
      <div>
        <FieldArray
          name="results"
          testResult={testResult}
          component={RenderOptions}
        />
      </div>
    );
  }
}

export default reduxForm({
  form: TEST_RESULT_FORM,
  enableReinitialize: true,
  validate: values => {
    const errors = {};
    const resultsError = {};

    (values.results || []).forEach((item, idx) => {
      const __errors = {};

      if (
        typeof item.minScore !== "number" ||
        typeof item.maxScore !== "number"
      ) {
        __errors.scoreRange =
          i18n["broker.question.test_result.score_range_error"];
      }

      if (
        (typeof item.minScore === "number" &&
          scoreValidate(item.minScore, values)) ||
        (typeof item.maxScore === "number" &&
          scoreValidate(item.maxScore, values))
      ) {
        __errors.scoreRange =
          i18n["broker.question.test_result.score_range_limit_error"];
      }

      if (!item.result) {
        __errors.result = i18n["broker.question.test_result.result_error"];
      }

      if (!item.feedback) {
        __errors.feedback =
          i18n["broker.question.test_result.feedback_limit_error"];
      } else {
        if (
          languages.every(
            lang =>
              !(item.feedback.title || {})[lang.value] &&
              !(item.feedback.content || {})[lang.value]
          )
        ) {
          __errors.feedback =
            i18n["broker.question.test_result.feedback_limit_error"];
        } else {
          languages.forEach(lang => {
            if (
              (item.feedback.title || {})[lang.value] &&
              !(item.feedback.content || {})[lang.value]
            ) {
              if (!__errors.feedback) {
                __errors.feedback = {
                  title: {},
                  content: {}
                };
              }

              __errors.feedback.content[lang.value] =
                i18n["broker.question.test_result.feedback_content_error"];
            }
            if (
              !(item.feedback.title || {})[lang.value] &&
              (item.feedback.content || {})[lang.value]
            ) {
              if (!__errors.feedback) {
                __errors.feedback = {
                  title: {},
                  content: {}
                };
              }

              __errors.feedback.title[lang.value] =
                i18n["broker.question.test_result.feedback_title_error"];
            }
          });
        }
      }

      if (Object.keys(__errors).length) {
        resultsError[idx] = __errors;
      }
    });

    if (Object.keys(resultsError).length) {
      errors.results = {
        ...resultsError,
        _error: resultsError
      };
    }

    return errors;
  }
})(TestResultForm);
