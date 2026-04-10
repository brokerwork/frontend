import cs from './index.less';
import i18n from 'utils/i18n';
import moment from 'moment';
import queryString from 'utils/queryString';

export default class Result extends PureComponent {
  componentDidMount() {
    const { getTestResult, match: { params }, location } = this.props;
    const { id, idType } = params;
    const query = queryString(location.search);
    const serverId = query.get('serverId');
    const vendor = query.get('vendor');
    getTestResult(id, idType, serverId, vendor);
  }
  renderQuestion = (question, index) => {
    const prefix = `${index + 1}. `;
    return (
      <li key={index}>
        <h3 className={cs['question-title']}>
          {prefix}
          {question.subject}
        </h3>
        <ul className={cs['answer-list']}>
          {question.options &&
            question.options.map(this.renderAnswer.bind(this, question))}
        </ul>
      </li>
    );
  };
  renderAnswer = (question, answer, index) => {
    const isChecked = answer.value === question.selectedValue;
    return (
      <li key={index}>
        <i className={`fa ${isChecked ? 'fa-dot-circle-o' : 'fa-circle-o'}`} />
        <span>{answer.item}</span>
      </li>
    );
  };
  render() {
    const { testResult } = this.props;
    return (
      <div className={cs['container']}>
        <h1 className={cs['header']}>{i18n['adaptive_test.title']}</h1>
        <div className={cs['content']}>
          <ul className={`${cs['box']} ${cs['main-info']}`}>
            <li>
              <h4 className={cs['main-info-title']}>
                {i18n['adaptive_test.item_title.time']}
              </h4>
              <dl>
                <dd>
                  <span className={cs['main-info-sub-title']}>
                    {i18n['adaptive_test.item_sub_title.date']}
                  </span>
                  <span className={cs['main-info-sub-content']}>
                    {testResult.time &&
                      moment(testResult.time).format('YYYY-MM-DD')}
                  </span>
                </dd>
                <dd>
                  <span className={cs['main-info-sub-title']}>
                    {i18n['adaptive_test.item_sub_title.time']}
                  </span>
                  <span className={cs['main-info-sub-content']}>
                    {testResult.time && moment(testResult.time).format('HH:mm')}
                  </span>
                </dd>
              </dl>
            </li>
            <li>
              <h4 className={cs['main-info-title']}>
                {i18n['adaptive_test.item_title.score']}
              </h4>
              <dl>
                <dd>
                  <span className={cs['main-info-sub-title']}>
                    {i18n['adaptive_test.item_sub_title.score']}
                  </span>
                  <span className={cs['main-info-sub-content']}>
                    {testResult.score}
                  </span>
                </dd>
                <dd>
                  <span className={cs['main-info-sub-title']}>
                    {i18n['adaptive_test.item_sub_title.total_score']}
                  </span>
                  <span className={cs['main-info-sub-content']}>
                    {testResult.totalScore}
                  </span>
                </dd>
              </dl>
            </li>
            <li>
              <h4 className={cs['main-info-title']}>
                {i18n['adaptive_test.item_title.result']}
              </h4>
              <dl>
                <dd>
                  <span className={cs['main-info-sub-title']}>
                    {i18n['adaptive_test.item_sub_title.state']}
                  </span>
                  <span className={cs['main-info-sub-content']}>
                    {testResult.result
                      ? i18n[`adaptive_test.item_title.${testResult.result}`]
                      : ''}
                  </span>
                </dd>
                <dd>
                  <span className={cs['main-info-sub-title']}>
                    {i18n['adaptive_test.item_sub_title.leverage']}
                  </span>
                  <span className={cs['main-info-sub-content']}>
                    {testResult.leverage ? `1:${testResult.leverage}` : ''}
                  </span>
                </dd>
              </dl>
            </li>
          </ul>
          <ul className={`${cs['box']} ${cs['test-detail']}`}>
            {testResult.detail && testResult.detail.map(this.renderQuestion)}
          </ul>
        </div>
      </div>
    );
  }
}
