import cs from './index.less';
import i18n from 'utils/i18n';
import { guides } from './config';
export default class VersionGuide extends Component {
  componentDidMount() {
    this.injecteVersionGuideKey(this.props);
  }
  componentWillReceiveProps(nextProps) {
    if (!this.props.userInfo.id && nextProps.userInfo.id) {
      this.injecteVersionGuideKey(nextProps);
    }
  }
  injecteVersionGuideKey = props => {
    const { guideKey, userInfo: { id }, injecteVersionGuideKey } = props;
    if (!id || !guideKey) return;
    injecteVersionGuideKey(id, guideKey);
  };
  onComfirm = () => {
    const { guideKey, userInfo: { id }, comfirmVersionGuideKey } = this.props;
    if (!id || !guideKey) return;
    comfirmVersionGuideKey(id, guideKey);
  };
  onClick = (isPrevent, e) => {
    if (isPrevent) {
      e.stopPropagation();
      e.preventDefault();
      return false;
    }
  };
  render() {
    const {
      children,
      guideKey,
      userInfo: { id },
      versionGuideKeys,
      align = 'left',
      vAlign = 'bottom'
    } = this.props;
    const show = id && guideKey && guideKey === versionGuideKeys[0];
    const { icon, content } = guides[guideKey] || {};
    const className = show ? cs['show'] : '';
    return (
      <span
        className={`${cs['root']} ${className}`}
        onClick={this.onClick.bind(this, show)}
      >
        <span className={cs['label']}>{children}</span>
        {show ? (
          <div className={`${cs['tip']} ${cs[align]} ${cs[vAlign]}`}>
            <img width="98" src={icon} />
            <p>{content}</p>
            <div className={cs['button']} onClick={this.onComfirm}>
              {' '}
              {i18n['version.guide.done']}
            </div>
          </div>
        ) : (
          undefined
        )}
        {show ? <div className={cs['mask']} /> : undefined}
      </span>
    );
  }
}
