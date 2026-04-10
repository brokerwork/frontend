import cs from "./Root.less";
import FormControl from "components/FormControl";
import Radio from "components/Radio";
import Button from "components/Button";
import i18n from "utils/i18n";

export default class Root extends PureComponent {
  componentDidMount() {
    const { getTestDetail } = this.props;

    getTestDetail();
  }

  render() {
    const { testDetail } = this.props;

    return (
      <div className={cs["container"]}>
        <div className={cs["header"]}>
          {i18n["broker.question.test_detail.header"]}
        </div>
        <div className={cs["content"]}>
          <div className={cs["summary"]}>
            <div className={cs["title"]}>
              {i18n["broker.question.test_detail.title"]}
            </div>
            <div className={cs["tips"]}>
              {i18n["broker.question.test_detail.tips"]}
            </div>
          </div>
          <ul className={cs["questions"]}>
            {testDetail.map((item, idx) => {
              return (
                <li key={idx}>
                  <div className={cs["question"]}>
                    {idx + 1}. {item.subject}
                  </div>
                  <div className={cs["answers"]}>
                    {item.options.map((option, _idx) => {
                      return (
                        <Radio key={_idx} disabled name={item.id}>
                          {option.item}
                        </Radio>
                      );
                    })}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    );
  }
}
