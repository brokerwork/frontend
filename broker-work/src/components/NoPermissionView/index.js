import cs from './NoPermissionView.less';
import icon from './no-permission.png';
import i18n from 'utils/i18n';

export default class NoPermissionView extends PureComponent {
  render() {
    const { className = '', text } = this.props;

    return (
      <div className={`${cs['no-permission-view']} ${className}`}>
        <div className={cs['no-permission-view-content']}>
          <img width="120" src={icon} />
          <div className={cs['no-permission-view-tips']}>
            {text || i18n['general.no_permission']}
          </div>
        </div>
      </div>
    );
  }
}
