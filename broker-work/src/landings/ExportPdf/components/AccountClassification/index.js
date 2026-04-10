import cs from './AccountClassification.less';

export default class AccountClassificationInfo extends PureComponent {
  render() {
    const {
      data: { title, baseInfo = [], cassificationInfo = [] }
    } = this.props;

    return (
      <div className={cs['container']} id="exportContent">
        <div className={cs['content']}>
          <h1 className={cs['title']}>{title}</h1>
          {baseInfo.map((item, idx) => {
            return (
              <div key={idx} className={cs['field']}>
                <label className={cs['label']}>{item.label}:</label>
                <div className={cs['value']}>{item.value}</div>
              </div>
            );
          })}
          {cassificationInfo.map((item, idx) => {
            return (
              <div key={idx} className={cs['field']}>
                <label className={cs['label']}>{item.label}:</label>
                <div className={cs['value']}>{item.value}</div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}
