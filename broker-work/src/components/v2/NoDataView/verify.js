import cs from './NoDataView.less';
import noDataIcon from './images/noData.png';
import i18n from 'utils/i18n';

export default class NoDataView extends PureComponent {
  render() {
    const { className, text } = this.props;
    return (
      <div className={`${cs['no-data-view-verify']} ${className}`}>
        <div className={cs['no-data-view-content']}>
          <img width="120" src={noDataIcon} />
          <div className={cs['no-data-view-tips']}>
            {text || i18n['general.no_data']}
          </div>
        </div>
      </div>
    );
  }
}